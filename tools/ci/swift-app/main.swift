// macOS smoke test for the Swift Playgrounds app's engine (Engine.swift + Models.swift + Curriculum.swift).
// Exercises the real JavaScriptCore path: curriculum load, structure checks, v1 -> v2 save migration, live Judge0.
import Foundation

let d = CUR
precondition(d.missions.count == 156, "expected 156 missions (12 Boot Camp + 144), got \(d.missions.count)")
precondition(d.languages.count == 12 && d.langs.count == 13 && d.dossiers.count == 12, "langs/dossiers")
precondition(d.orient?.count == 13, "orientation for every language")
print("curriculum: \(d.missions.count) missions, \(d.langs.count) languages, \(d.missions.filter { $0.ciOnly != nil }.count) CI-only")

let sw3 = d.missions.first(where: { $0.id == "sw3" })!
precondition(!Engine.shared.structure(sw3, code: sw3.starter).allSatisfy(\.ok), "starter should fail structure")
precondition(Engine.shared.structure(sw3, code: sw3.solution).allSatisfy(\.ok), "solution should pass structure")
precondition(!Engine.shared.brief(sw3, faction: "sentinel").isEmpty, "brief")
print("structure checks: ok")

// Hint ladder: linked to the mission's own steps and solution.
for m in d.missions {
    precondition((m.steps ?? []).count >= 3, "\(m.id) steps")
    let h1 = Engine.shared.hint(m, code: m.starter, results: [], tier: 1), h2 = Engine.shared.hint(m, code: m.starter, results: [], tier: 2), h3 = Engine.shared.hint(m, code: m.starter, results: [], tier: 3)
    precondition(h1?.tier == 1 && h2?.kind == "parsons" && h3?.code == m.solution, "\(m.id) hint ladder")
    precondition((h2?.lines ?? []).sorted() == (h2?.answer ?? []).sorted(), "\(m.id) parsons permutation")
}
let bc8 = d.missions.first(where: { $0.id == "bc8" })!
precondition(Engine.shared.explain(bc8, CheckResult(status: "FAIL", label: "greet", detail: "got None, want 'Welcome, neo'")).contains("return"), "explain")
print("guide: ok")

let v1 = #"{"format":"rootaccess-save","version":1,"faction":"logos","xp":300,"done":["py1","js9old"],"code":{"js9old":"x","py1":"def intro(h,l): pass"},"pet":{"name":"BIT","energy":80}}"#
let save = try JSONDecoder().decode(SaveData.self, from: Data(v1.utf8)).migrated(known: Set(d.missions.map(\.id)))
precondition(save.version == 2 && save.done == ["py1"] && save.verified["py1"] == "offline", "migration")
precondition(save.legacy["done"] != nil && save.legacy["code"] != nil && save.pet.name == "BIT", "legacy archive")
let round = try JSONDecoder().decode(SaveData.self, from: try GameStore.encode(save))
precondition(round == save, "round trip")
print("save migration: ok")

let sem = DispatchSemaphore(value: 0)
Task.detached {
    for id in ["py1", "sw3", "cs2"] {
        let m = d.missions.first(where: { $0.id == id })!
        do {
            let r = try await Engine.shared.run(m, code: m.solution, settings: EngineSettings())
            print("judge0 \(id): passed=\(r.passed == true) \(r.results.map { "\($0.status[$0.status.startIndex]) \($0.label)" }.joined(separator: " | "))")
            let s = try await Engine.shared.run(m, code: m.starter, settings: EngineSettings())
            print("judge0 \(id) starter: passed=\(s.passed == true)")
        } catch { print("::warning::Judge0 unreachable from CI (\(error.localizedDescription)); skipping live check") }
    }
    sem.signal()
}
sem.wait()
