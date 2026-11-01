import SwiftUI
import Network
import UniformTypeIdentifiers

// MARK: - Curriculum (decoded from the shared JS curriculum via Engine.swift)
struct LessonPart: Decodable, Hashable { let code: Bool; let text: String }
struct SourceRef: Decodable, Hashable { let label: String; let url: String }
struct Mission: Decodable, Identifiable, Hashable {
    let id, lang: String
    let rank, xp: Int
    let module, title, concept, task, starter: String
    let lesson: [LessonPart]
    let ciOnly: String?
    let checkpoints: [String]
    let solution: String
    let steps: [String]?
    let keyTerms: [KeyTerm]?
}
struct KeyTerm: Decodable, Hashable { let term, def: String }
struct Orient: Decodable { let run, file, out, comment: String; let gotchas: [String] }
struct Hint: Decodable { let tier: Int; let title, kind, text: String; let step: Int?; let lines, answer: [String]?; let pieces: Bool; let code: String? }
struct Lang: Decodable, Identifiable, Hashable {
    let id, name, tag, why, engine, ci: String
    let track: Bool?
}
struct Faction: Decodable, Identifiable {
    let id, name, short, color, handler, creed, pitch, lore: String
    var tint: Color { Color(hex: color) }
}
struct DossierStat: Decodable, Hashable { let label, value: String; let source: SourceRef }
struct Dossier: Decodable {
    let tagline, relevance, next: String
    let stats: [DossierStat]
    let relSrc, learn: [SourceRef]
    let pros, cons, bestFor, avoid: [String]
}
struct Intel: Decodable, Hashable { let year: Int; let name, note: String }
struct PetStage: Decodable { let lvl: Int; let name, desc: String }
struct PetPart: Decodable { let id, label: String; let lvl: Int; let hex: String? }
struct PraxisStage: Decodable { let id, name, what: String }
struct Evidence: Decodable { let claim: String; let source: SourceRef }
struct Praxis: Decodable { let stages: [PraxisStage]; let selfExplain: [String]; let fadeAfter: Int; let evidence: [Evidence] }
struct CurriculumData: Decodable {
    let missions: [Mission]
    let langs: [Lang]
    let factions: [Faction]
    let dossiers: [String: Dossier]
    let modules: [String]
    let intel: [Intel]
    let petStages: [PetStage]
    let petParts: [String: [PetPart]]
    let praxis: Praxis
    let judge0: [String: String]
    let orient: [String: Orient]?
    /// lang -> on-device runner kind ("js", "python", "ts"). The app runs "js" itself in JavaScriptCore.
    let local: [String: String]?
    /// The 12 real languages (Boot Camp is a track, not a language).
    var languages: [Lang] { langs.filter { $0.track != true } }
}

// MARK: - Checkpoint reports (same shape as RA.buildReport)
struct CheckResult: Decodable, Hashable { let status, label: String; let detail: String? }
struct Report: Decodable {
    var engine: String? = nil
    var results: [CheckResult] = []
    var stdout: String? = nil
    var stderr: String? = nil
    var status: String? = nil
    var time: String? = nil
    var passed: Bool? = nil
    var ciOnly: String? = nil
}
struct StructureLine: Decodable { let ok: Bool; let hint: String }

let EXT: [String: String] = ["basics": "py", "python": "py", "javascript": "js", "typescript": "ts", "sql": "sql", "bash": "sh", "go": "go", "rust": "rs",
                             "swift": "swift", "kotlin": "kt", "java": "java", "csharp": "cs", "cpp": "cpp"]

extension Color {
    init(hex: String) {
        var v: UInt64 = 0; Scanner(string: hex.replacingOccurrences(of: "#", with: "")).scanHexInt64(&v)
        self.init(red: Double((v >> 16) & 255) / 255, green: Double((v >> 8) & 255) / 255, blue: Double(v & 255) / 255)
    }
    static let matrix = Color(hex: "#3dff7a")
    // The adaptive palette (bgDeep, panel, line, mut, ink, bad...) lives in Theme.swift.
}

// MARK: - Save format v2 (identical JSON to the web version; v1 saves migrate on load)
enum JSONValue: Codable, Equatable {
    case string(String), number(Double), bool(Bool), array([JSONValue]), object([String: JSONValue]), null
    init(from d: Decoder) throws {
        let c = try d.singleValueContainer()
        if c.decodeNil() { self = .null }
        else if let v = try? c.decode(Bool.self) { self = .bool(v) }
        else if let v = try? c.decode(Double.self) { self = .number(v) }
        else if let v = try? c.decode(String.self) { self = .string(v) }
        else if let v = try? c.decode([JSONValue].self) { self = .array(v) }
        else { self = .object(try c.decode([String: JSONValue].self)) }
    }
    func encode(to e: Encoder) throws {
        var c = e.singleValueContainer()
        switch self {
        case .string(let v): try c.encode(v)
        case .number(let v): try c.encode(v)
        case .bool(let v): try c.encode(v)
        case .array(let v): try c.encode(v)
        case .object(let v): try c.encode(v)
        case .null: try c.encodeNil()
        }
    }
}

struct PetState: Codable, Equatable {
    var name = "NULL", color = "matrix", eyes = "dot", crown = "none", aura = "none"
    var energy = 70, bond = 10
    init() {}
    init(from d: Decoder) throws {
        let c = try d.container(keyedBy: CodingKeys.self); let z = PetState()
        name = try c.decodeIfPresent(String.self, forKey: .name) ?? z.name
        color = try c.decodeIfPresent(String.self, forKey: .color) ?? z.color
        eyes = try c.decodeIfPresent(String.self, forKey: .eyes) ?? z.eyes
        crown = try c.decodeIfPresent(String.self, forKey: .crown) ?? z.crown
        aura = try c.decodeIfPresent(String.self, forKey: .aura) ?? z.aura
        energy = (try? c.decodeIfPresent(Int.self, forKey: .energy)) ?? z.energy
        bond = (try? c.decodeIfPresent(Int.self, forKey: .bond)) ?? z.bond
    }
}

struct EngineSettings: Codable, Equatable {
    var ce = "https://ce.judge0.com", extra = "https://extra-ce.judge0.com", token = "", tokenHeader = "X-Auth-Token"
    /// auto (on device when possible, else Judge0) | judge0 (Judge0 first) | device (code never leaves this device)
    var mode = "auto"
    var offlineClears = true, autoReverify = true
    var packBase: [String: String] = [:]   // web-only pack mirrors, kept so saves round-trip
    init() {}
    init(from d: Decoder) throws {
        let c = try d.container(keyedBy: CodingKeys.self); let z = EngineSettings()
        ce = try c.decodeIfPresent(String.self, forKey: .ce) ?? z.ce
        extra = try c.decodeIfPresent(String.self, forKey: .extra) ?? z.extra
        token = try c.decodeIfPresent(String.self, forKey: .token) ?? z.token
        tokenHeader = try c.decodeIfPresent(String.self, forKey: .tokenHeader) ?? z.tokenHeader
        mode = (try? c.decodeIfPresent(String.self, forKey: .mode)) ?? z.mode
        offlineClears = (try? c.decodeIfPresent(Bool.self, forKey: .offlineClears)) ?? z.offlineClears
        autoReverify = (try? c.decodeIfPresent(Bool.self, forKey: .autoReverify)) ?? z.autoReverify
        packBase = (try? c.decodeIfPresent([String: String].self, forKey: .packBase)) ?? z.packBase
    }
}

/// Display preferences. Same JSON as the web app's `prefs`; fields only the web uses are kept for round trips.
struct Prefs: Codable, Equatable {
    var scheme = "system", accent = "faction", accentHex = "", customAccent = "#3dff7a", contrast = "system", font = "mono"
    var scale = 100, editorSize = 13
    var density = "normal", layout = "side", width = "normal", rain = "on", motion = "system"
    var typewriter = true
    init() {}
    init(from d: Decoder) throws {
        let c = try d.container(keyedBy: CodingKeys.self); let z = Prefs()
        func str(_ k: CodingKeys, _ def: String) -> String { ((try? c.decodeIfPresent(String.self, forKey: k)) ?? nil) ?? def }
        func num(_ k: CodingKeys, _ def: Int) -> Int {
            if let i = (try? c.decodeIfPresent(Int.self, forKey: k)) ?? nil { return i }
            if let d = (try? c.decodeIfPresent(Double.self, forKey: k)) ?? nil { return Int(d) }
            return def
        }
        scheme = str(.scheme, z.scheme); accent = str(.accent, z.accent); accentHex = str(.accentHex, z.accentHex)
        customAccent = str(.customAccent, z.customAccent); contrast = str(.contrast, z.contrast); font = str(.font, z.font)
        scale = num(.scale, z.scale); editorSize = num(.editorSize, z.editorSize)
        density = str(.density, z.density); layout = str(.layout, z.layout); width = str(.width, z.width)
        rain = str(.rain, z.rain); motion = str(.motion, z.motion)
        typewriter = ((try? c.decodeIfPresent(Bool.self, forKey: .typewriter)) ?? nil) ?? z.typewriter
    }
    struct AccentPreset: Hashable { let id, label, hex: String }
    /// Same presets as ACCENTS in web/app.js.
    static let accents: [AccentPreset] = [
        AccentPreset(id: "matrix", label: "Matrix", hex: "#3dff7a"), AccentPreset(id: "ice", label: "Ice", hex: "#5ad1ff"),
        AccentPreset(id: "violet", label: "Violet", hex: "#c79bff"), AccentPreset(id: "ember", label: "Ember", hex: "#ff8a4c"),
        AccentPreset(id: "gold", label: "Gold", hex: "#ffd84d"), AccentPreset(id: "rose", label: "Rose", hex: "#ff6fae"),
        AccentPreset(id: "white", label: "White", hex: "#f2f2f2")
    ]
}

struct SaveData: Codable, Equatable {
    var format = "rootaccess-save", version = 2
    var faction: String? = nil
    var xp = 0
    var done: [String] = []
    var verified: [String: String] = [:]   // id -> judge0 | ci | local | offline
    var code: [String: String] = [:]
    var fails: [String: Int] = [:]
    var primm: [String: Int] = [:]
    var notes: [String: String] = [:]
    var hints: [String: Int] = [:]      // highest hint tier revealed per mission (1 nudge, 2 unscramble, 3 full answer)
    var legacy: [String: JSONValue] = [:]
    var pet = PetState()
    var settings = EngineSettings()
    var prefs = Prefs()
    var updated: Double = Date().timeIntervalSince1970 * 1000
    init() {}
    init(from d: Decoder) throws {
        let c = try d.container(keyedBy: CodingKeys.self)
        format = try c.decode(String.self, forKey: .format)
        guard format == "rootaccess-save" else { throw CocoaError(.fileReadCorruptFile) }
        version = (try? c.decodeIfPresent(Int.self, forKey: .version)) ?? 1
        faction = try? c.decodeIfPresent(String.self, forKey: .faction)
        xp = (try? c.decodeIfPresent(Int.self, forKey: .xp)) ?? 0
        done = (try? c.decodeIfPresent([String].self, forKey: .done)) ?? []
        verified = (try? c.decodeIfPresent([String: String].self, forKey: .verified)) ?? [:]
        code = (try? c.decodeIfPresent([String: String].self, forKey: .code)) ?? [:]
        fails = (try? c.decodeIfPresent([String: Int].self, forKey: .fails)) ?? [:]
        primm = (try? c.decodeIfPresent([String: Int].self, forKey: .primm)) ?? [:]
        notes = (try? c.decodeIfPresent([String: String].self, forKey: .notes)) ?? [:]
        hints = (try? c.decodeIfPresent([String: Int].self, forKey: .hints)) ?? [:]
        legacy = (try? c.decodeIfPresent([String: JSONValue].self, forKey: .legacy)) ?? [:]
        pet = (try? c.decodeIfPresent(PetState.self, forKey: .pet)) ?? PetState()
        settings = (try? c.decodeIfPresent(EngineSettings.self, forKey: .settings)) ?? EngineSettings()
        prefs = (try? c.decodeIfPresent(Prefs.self, forKey: .prefs)) ?? Prefs()
        updated = (try? c.decodeIfPresent(Double.self, forKey: .updated)) ?? 0
    }

    /// Same rules as migrate() in web/app.js: unknown mission ids are archived under `legacy`, never dropped.
    func migrated(known: Set<String>) -> SaveData {
        var s = self, seen = Set<String>()
        let gone = s.done.filter { !known.contains($0) }
        s.done = s.done.filter { known.contains($0) && seen.insert($0).inserted }
        if !gone.isEmpty {
            var prev: [JSONValue] = []
            if case .array(let a)? = s.legacy["done"] { prev = a }
            s.legacy["done"] = .array(prev + gone.map { .string($0) })
        }
        let lostCode = s.code.filter { !known.contains($0.key) }
        if !lostCode.isEmpty {
            var prev: [String: JSONValue] = [:]
            if case .object(let o)? = s.legacy["code"] { prev = o }
            for (k, v) in lostCode { prev[k] = .string(v) }
            s.legacy["code"] = .object(prev)
            s.code = s.code.filter { known.contains($0.key) }
        }
        s.verified = s.verified.filter { known.contains($0.key) }
        for id in s.done where s.verified[id] == nil { s.verified[id] = "offline" }
        s.version = 2
        return s
    }
}
struct Snapshot: Codable, Identifiable { var id = UUID(); let at: Date; let label: String; let data: SaveData }

struct SaveDocument: FileDocument {
    static var readableContentTypes: [UTType] { [.json] }
    var save: SaveData
    init(save: SaveData) { self.save = save }
    init(configuration: ReadConfiguration) throws {
        guard let d = configuration.file.regularFileContents else { throw CocoaError(.fileReadCorruptFile) }
        save = try JSONDecoder().decode(SaveData.self, from: d)
    }
    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper { FileWrapper(regularFileWithContents: try GameStore.encode(save)) }
}

/// A folder of mission source files, laid out exactly like the repo's submissions/ directory.
struct SubmissionsFolder: FileDocument {
    static var readableContentTypes: [UTType] { [.folder] }
    var files: [String: String]
    init(files: [String: String]) { self.files = files }
    init(configuration: ReadConfiguration) throws { files = [:] }
    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        var kids: [String: FileWrapper] = [:]
        for (name, text) in files { let w = FileWrapper(regularFileWithContents: Data(text.utf8)); w.preferredFilename = name; kids[name] = w }
        return FileWrapper(directoryWithFileWrappers: kids)
    }
}

struct SourceFile: FileDocument {
    static var readableContentTypes: [UTType] { [.plainText] }
    var text: String
    init(text: String) { self.text = text }
    init(configuration: ReadConfiguration) throws { text = String(decoding: configuration.file.regularFileContents ?? Data(), as: UTF8.self) }
    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper { FileWrapper(regularFileWithContents: Data(text.utf8)) }
}

// MARK: - Store with autosave + rolling snapshots on disk
@MainActor final class GameStore: ObservableObject {
    @Published var s = SaveData() { didSet { persist() } }
    @Published var snapshots: [Snapshot] = []
    @Published var toast: String?
    @Published var online = true
    @Published var reverifying = false
    private let monitor = NWPathMonitor()
    private var reverifyFailed = Set<String>()   // this session: don't keep re-sending code that already failed

    private let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    private var saveURL: URL { dir.appendingPathComponent("rootaccess-save.json") }
    private var snapURL: URL { dir.appendingPathComponent("rootaccess-snapshots.json") }
    private var known: Set<String> { Set(CUR.missions.map(\.id)) }

    init() {
        if let d = try? Data(contentsOf: saveURL), let v = try? JSONDecoder().decode(SaveData.self, from: d) { s = v.migrated(known: known) }
        if let d = try? Data(contentsOf: snapURL), let v = try? JSONDecoder().decode([Snapshot].self, from: d) { snapshots = v }
        monitor.pathUpdateHandler = { [weak self] path in
            let up = path.status == .satisfied
            Task { @MainActor in self?.connectivity(up) }
        }
        monitor.start(queue: DispatchQueue(label: "rootaccess.network"))
    }
    private func connectivity(_ up: Bool) {
        let cameBack = up && !online
        online = up
        if cameBack && s.faction != nil && s.settings.autoReverify && !pendingVerify.isEmpty { Task { await reverify(auto: true) } }
    }
    nonisolated static func encode(_ v: SaveData) throws -> Data {
        let e = JSONEncoder(); e.outputFormatting = [.prettyPrinted, .sortedKeys]; return try e.encode(v)
    }
    private func persist() { try? GameStore.encode(s).write(to: saveURL, options: .atomic) }
    func snapshot(_ label: String) {
        snapshots.insert(Snapshot(at: Date(), label: label, data: s), at: 0)
        snapshots = Array(snapshots.prefix(10))
        try? JSONEncoder().encode(snapshots).write(to: snapURL, options: .atomic)
    }
    func restore(_ d: SaveData, label: String) {
        let token = s.settings.token
        snapshot("Before \(label)")
        var next = d.migrated(known: known)
        if next.settings.token.isEmpty { next.settings.token = token }   // backups never carry the token
        s = next; flash("Save restored")
    }
    func restore(json: String, label: String) {
        guard let d = json.data(using: .utf8), let v = try? JSONDecoder().decode(SaveData.self, from: d) else { flash("That isn't a ROOT//ACCESS save"); return }
        restore(v, label: label)
    }
    /// What backups contain: everything except your Judge0 token.
    var exportable: SaveData { var c = s; c.settings.token = ""; return c }
    var json: String { (try? String(data: GameStore.encode(exportable), encoding: .utf8)) ?? "{}" }

    var level: Int { 1 + s.xp / 500 }
    var progress: Double { Double(s.xp % 500) / 500 }
    var faction: Faction? { CUR.factions.first { $0.id == s.faction } }
    var accentHex: String {
        let p = s.prefs
        if p.accent == "custom", p.customAccent.count == 7, p.customAccent.hasPrefix("#") { return p.customAccent }
        if let a = Prefs.accents.first(where: { $0.id == p.accent }) { return a.hex }
        return faction?.color ?? "#3dff7a"
    }
    var stageIndex: Int { CUR.petStages.lastIndex { level >= $0.lvl } ?? 0 }

    func missions(_ lang: String) -> [Mission] { CUR.missions.filter { $0.lang == lang }.sorted { $0.rank < $1.rank } }
    func isDone(_ m: Mission) -> Bool { s.done.contains(m.id) }
    func fluency(_ lang: String) -> Int { missions(lang).filter(isDone).count }
    func unlocked(_ m: Mission) -> Bool {
        guard m.rank > 1, let prev = missions(m.lang).first(where: { $0.rank == m.rank - 1 }) else { return true }; return isDone(prev) }
    func next(after m: Mission) -> Mission? { missions(m.lang).first { $0.rank == m.rank + 1 } }

    func fail(_ m: Mission) { s.fails[m.id, default: 0] += 1 }
    /// how: judge0 | ci | local | offline. Same ordering as the web app.
    @discardableResult func clear(_ m: Mission, how: String) -> Bool {
        let order = ["offline": 0, "ci": 1, "local": 2, "judge0": 3]
        if order[how, default: 0] > order[s.verified[m.id] ?? "", default: -1] { s.verified[m.id] = how }
        guard !isDone(m) else { return false }
        let before = level
        s.done.append(m.id); s.xp += m.xp
        s.pet.energy = min(100, s.pet.energy + 15); s.pet.bond = min(100, s.pet.bond + 6)
        s.updated = Date().timeIntervalSince1970 * 1000
        snapshot("Cleared \(m.id): \(m.title)")
        let name = CUR.langs.first { $0.id == m.lang }?.name ?? m.lang
        flash(fluency(m.lang) == 12 ? "\(name) fluency complete" : level > before ? "LEVEL \(level): your pet is evolving" : "+\(m.xp) XP")
        return true
    }
    var submissions: [String: String] {
        var out: [String: String] = [:]
        for (id, code) in s.code { if let m = CUR.missions.first(where: { $0.id == id }), code != m.starter { out["\(id).\(EXT[m.lang] ?? "txt")"] = code } }
        return out
    }
    // MARK: Where checkpoints run (same rules as the web app)
    enum RunOutcome { case report(Report, how: String), unreachable(String) }
    func hasLocal(_ m: Mission) -> Bool { Engine.shared.canRunLocally(m) }
    /// auto: on device when this app can run it, else Judge0 · judge0: Judge0 first · device: on device only.
    func checkpoints(_ m: Mission, code: String, progress: @escaping (String) -> Void = { _ in }) async -> RunOutcome {
        let mode = s.settings.mode, local = hasLocal(m), settings = s.settings
        var order: [String] = []
        switch mode {
        case "device": if local { order = ["local"] }
        case "judge0": order = (online ? ["judge0"] : []) + (local ? ["local"] : [])
        default: order = (local ? ["local"] : []) + (online ? ["judge0"] : [])
        }
        var errors: [String] = []
        for how in order {
            do {
                if how == "local" { progress("Running on this device…"); return .report(try await Engine.shared.runLocal(m, code: code), how: "local") }
                progress("Running on Judge0…")
                return .report(try await Engine.shared.run(m, code: code, settings: settings), how: "judge0")
            } catch { errors.append((how == "local" ? "on device: " : "Judge0: ") + error.localizedDescription) }
        }
        if !errors.isEmpty { return .unreachable(errors.joined(separator: "; ")) }
        if !online { return .unreachable("you're offline") }
        return .unreachable(mode == "device" ? "on-device only mode, and the app can't run this language itself" : "no engine available")
    }
    /// Ranks cleared on structure checks alone (offline), waiting for a real run.
    var pendingVerify: [Mission] {
        CUR.missions.filter { s.done.contains($0.id) && s.verified[$0.id] == "offline" && $0.ciOnly == nil && s.code[$0.id] != nil }
    }
    @discardableResult func reverify(auto: Bool) async -> (ok: Int, failed: [String], skipped: Int) {
        guard !reverifying else { return (0, [], 0) }
        reverifying = true; defer { reverifying = false }
        var ok = 0, failed: [String] = [], skipped = 0
        let list = pendingVerify.filter { !(auto && reverifyFailed.contains($0.id)) }
        for m in list {
            switch await checkpoints(m, code: s.code[m.id] ?? m.starter) {
            case .unreachable: skipped += 1
            case .report(let rep, let how):
                if rep.passed == true { s.verified[m.id] = how; ok += 1 } else { failed.append(m.id); reverifyFailed.insert(m.id) }
                if how == "judge0" { try? await Task.sleep(for: .milliseconds(1500)) }   // go easy on the public instance
            }
        }
        if ok > 0 || !auto { flash("Re-verified \(ok)/\(list.count)" + (failed.isEmpty ? "" : " · \(failed.count) need fixes") + (skipped > 0 ? " · \(skipped) still offline" : "")) }
        return (ok, failed, skipped)
    }

    func flash(_ t: String) { toast = t; Task { try? await Task.sleep(for: .seconds(2.4)); if toast == t { toast = nil } } }
}

func verLabel(_ v: String?) -> String {
    switch v { case "judge0": return "verified · Judge0"; case "local": return "verified · on device"; case "ci": return "pending · GitHub Actions"; default: return "structure only · re-verify online" }
}
