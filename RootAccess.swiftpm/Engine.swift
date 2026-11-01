import Foundation
import JavaScriptCore

/// Runs the shared curriculum (Curriculum.swift) in JavaScriptCore. Mission data, faction briefs, structure checks
/// and checkpoint harness composition all come from the same JS the web app and GitHub Actions use; Swift only
/// does the HTTP call to Judge0, and runs JavaScript missions on device (offline) in a separate, time-limited context.
final class Engine: @unchecked Sendable {
    static let shared = Engine()
    let data: CurriculumData
    private let ctx: JSContext
    private let lock = NSLock()

    private init() {
        ctx = JSContext()!
        ctx.exceptionHandler = { _, e in print("ROOT//ACCESS JS error:", e?.toString() ?? "unknown") }
        for s in CURRICULUM_SCRIPTS { ctx.evaluateScript(s) }
        let json = ctx.evaluateScript("RAX.data()")?.toString() ?? "{}"
        do { data = try JSONDecoder().decode(CurriculumData.self, from: Data(json.utf8)) }
        catch { fatalError("Curriculum failed to load: \(error)") }
    }

    private func call(_ fn: String, _ args: [Any]) -> String {
        lock.lock(); defer { lock.unlock() }
        guard let rax = ctx.objectForKeyedSubscript("RAX"), let f = rax.objectForKeyedSubscript(fn) else { return "" }
        return f.call(withArguments: args)?.toString() ?? ""
    }

    func brief(_ m: Mission, faction: String) -> String { call("brief", [m.id, faction]) }

    func structure(_ m: Mission, code: String) -> [StructureLine] {
        (try? JSONDecoder().decode([StructureLine].self, from: Data(call("structure", [m.id, code]).utf8))) ?? []
    }

    func hint(_ m: Mission, code: String, results: [CheckResult], tier: Int) -> Hint? {
        let rep: String
        if results.isEmpty { rep = "" } else {
            let rs = results.map { ["status": $0.status, "label": $0.label, "detail": $0.detail ?? ""] }
            rep = String(decoding: (try? JSONSerialization.data(withJSONObject: ["results": rs])) ?? Data(), as: UTF8.self)
        }
        return try? JSONDecoder().decode(Hint.self, from: Data(call("hint", [m.id, code, rep, tier]).utf8))
    }
    func explain(_ m: Mission, _ r: CheckResult) -> String {
        let j = String(decoding: (try? JSONSerialization.data(withJSONObject: ["status": r.status, "label": r.label, "detail": r.detail ?? ""])) ?? Data(), as: UTF8.self)
        return call("explain", [m.id, j])
    }
    func joinPieces(_ parts: [String]) -> String {
        call("joinPieces", [String(decoding: (try? JSONSerialization.data(withJSONObject: parts)) ?? Data(), as: UTF8.self)])
    }

    struct EngineError: LocalizedError { let message: String; var errorDescription: String? { message } }
    private struct Request: Decodable { let engine: String; let ciOnly: String?; let error: String?; let url: String?; let headers: [String: String]?; let body: String? }

    /// Compose mission code with its checkpoint harness, run it on Judge0, and parse the ::cp:: lines.
    func run(_ m: Mission, code: String, settings: EngineSettings) async throws -> Report {
        var headers: [String: String] = [:]
        if !settings.token.isEmpty { headers[settings.tokenHeader.isEmpty ? "X-Auth-Token" : settings.tokenHeader] = settings.token }
        let cfg: [String: Any] = ["hosts": ["ce": settings.ce, "extra": settings.extra], "headers": headers]
        let cfgJSON = String(decoding: try JSONSerialization.data(withJSONObject: cfg), as: UTF8.self)
        let reqJSON = call("request", [m.id, code, cfgJSON])
        let req = try JSONDecoder().decode(Request.self, from: Data(reqJSON.utf8))
        if let ci = req.ciOnly { return Report(engine: req.engine, ciOnly: ci) }
        if let e = req.error { throw EngineError(message: e) }
        guard let u = req.url, let url = URL(string: u), let body = req.body else { throw EngineError(message: "Bad Judge0 request") }
        var r = URLRequest(url: url, timeoutInterval: 60)
        r.httpMethod = "POST"; r.httpBody = Data(body.utf8)
        for (k, v) in req.headers ?? [:] { r.setValue(v, forHTTPHeaderField: k) }
        r.setValue("RootAccess-Swift/2.0", forHTTPHeaderField: "User-Agent")
        let (d, resp) = try await URLSession.shared.data(for: r)
        let codeHTTP = (resp as? HTTPURLResponse)?.statusCode ?? 0
        guard (200..<300).contains(codeHTTP) else { throw EngineError(message: "Judge0 HTTP \(codeHTTP)") }
        let out = call("finish", [m.id, reqJSON, String(decoding: d, as: UTF8.self), code])
        return try JSONDecoder().decode(Report.self, from: Data(out.utf8))
    }
}

// MARK: - On-device runner (JavaScript missions, no network needed)
extension Engine {
    func canRunLocally(_ m: Mission) -> Bool { m.ciOnly == nil && data.local?[m.lang] == "js" }

    /// Composes the same harness Judge0 uses (env "local"), runs it in a fresh JSContext with the virtual-timer shim
    /// from curriculum/_local.js, and parses the ::cp:: lines into the usual report.
    func runLocal(_ m: Mission, code: String, limit: Double = 10) async throws -> Report {
        struct Plan: Decodable { let kind: String; let src: String }
        guard canRunLocally(m), let plan = try? JSONDecoder().decode(Plan.self, from: Data(call("localPlan", [m.id, code]).utf8)), plan.kind == "js" else {
            throw EngineError(message: "This language can't run on device in the app")
        }
        let shim = call("jsShim", [])
        let result: LocalResult = await withCheckedContinuation { cont in
            let once = Once(cont)
            let worker = Thread { once.resume(Engine.evaluate(shim: shim, src: plan.src, limit: limit)) }
            worker.stackSize = 8 << 20
            worker.start()
            // Backstop in case the time limit can't interrupt the script; the report comes back either way.
            DispatchQueue.global().asyncAfter(deadline: .now() + limit + 2) { once.resume(LocalResult.timedOut(limit)) }
        }
        let out = call("localFinish", [m.id, result.stdout, result.status, result.stderr])
        return try JSONDecoder().decode(Report.self, from: Data(out.utf8))
    }

    struct LocalResult: Sendable {
        let stdout, status, stderr: String
        static func timedOut(_ limit: Double, _ out: String = "") -> LocalResult {
            LocalResult(stdout: out, status: "Time Limit Exceeded", stderr: "Stopped after \(Int(limit)) s. Look for a loop that never ends, or an await that never resolves.")
        }
    }

    private static func evaluate(shim: String, src: String, limit: Double) -> LocalResult {
        guard let ctx = JSContext() else { return LocalResult(stdout: "", status: "Runtime Error", stderr: "JavaScriptCore unavailable") }
        var error: String? = nil
        ctx.exceptionHandler = { _, e in if error == nil { error = e?.toString() ?? "error" } }
        setTimeLimit(ctx, seconds: limit)
        let start = Date()
        ctx.evaluateScript(shim)
        ctx.evaluateScript(src)
        // Promise jobs run as each evaluateScript returns; __raTick fires the next virtual timer.
        var ticks = 0
        while error == nil, ticks < 200_000, Date().timeIntervalSince(start) < limit, ctx.evaluateScript("__raTick()")?.toBool() == true { ticks += 1 }
        let out = ctx.evaluateScript("__raOutput()")?.toString() ?? ""
        if Date().timeIntervalSince(start) >= limit { return .timedOut(limit, out) }
        if let e = error { return LocalResult(stdout: out, status: "Runtime Error", stderr: e) }
        return LocalResult(stdout: out, status: "Accepted", stderr: "")
    }

    /// JavaScriptCore can stop a runaway script via JSContextGroupSetExecutionTimeLimit. It isn't in the public headers,
    /// so it's looked up at runtime; if it's missing, the backstop timer in runLocal still returns a report.
    private static func setTimeLimit(_ ctx: JSContext, seconds: Double) {
        typealias SetLimit = @convention(c) (JSContextGroupRef?, Double, OpaquePointer?, UnsafeMutableRawPointer?) -> Void
        guard let sym = dlsym(UnsafeMutableRawPointer(bitPattern: -2), "JSContextGroupSetExecutionTimeLimit") else { return }
        unsafeBitCast(sym, to: SetLimit.self)(JSContextGetGroup(ctx.jsGlobalContextRef), seconds, nil, nil)
    }
}

/// Resumes a continuation exactly once (whichever of the runner or the backstop timer finishes first).
private final class Once<T>: @unchecked Sendable {
    private var cont: CheckedContinuation<T, Never>?
    private let lock = NSLock()
    init(_ c: CheckedContinuation<T, Never>) { cont = c }
    func resume(_ v: T) {
        lock.lock(); let c = cont; cont = nil; lock.unlock()
        c?.resume(returning: v)
    }
}

let CUR = Engine.shared.data
