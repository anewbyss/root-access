import SwiftUI
import UniformTypeIdentifiers

struct LessonPart { let code: Bool; let text: String }
struct Check {
    let pattern: String; let ci: Bool; let hint: String
    func passes(_ src: String) -> Bool {
        guard let re = try? NSRegularExpression(pattern: pattern, options: ci ? [.caseInsensitive] : []) else { return false }
        return re.firstMatch(in: src, range: NSRange(src.startIndex..., in: src)) != nil
    }
}
struct Mission: Identifiable {
    let id, lang: String; let tier, xp: Int; let title, concept: String
    let brief: [String: String]; let lesson: [LessonPart]; let task, starter: String; let checks: [Check]
}
struct Faction { let id, name, short, hex, handler, creed, pitch, lore: String; var color: Color { Color(hex: hex) } }
struct PetPart { let id, label: String; let lvl: Int; var hex: String? = nil }

extension Color {
    init(hex: String) {
        var v: UInt64 = 0; Scanner(string: hex.replacingOccurrences(of: "#", with: "")).scanHexInt64(&v)
        self.init(red: Double((v >> 16) & 255) / 255, green: Double((v >> 8) & 255) / 255, blue: Double(v & 255) / 255)
    }
    static let matrix = Color(hex: "#3dff7a")
    static let bgDeep = Color(hex: "#030806")
    static let panel = Color(hex: "#06120c")
    static let line = Color(hex: "#14382a")
    static let mut = Color(hex: "#6f9c80")
}

// MARK: - Save format (identical JSON to the web version)
struct PetState: Codable, Equatable {
    var name = "NULL", color = "matrix", eyes = "dot", crown = "none", aura = "none"
    var energy = 70, bond = 10, fed = 0
    init() {}
    init(from d: Decoder) throws {
        let c = try d.container(keyedBy: CodingKeys.self); let z = PetState()
        name = try c.decodeIfPresent(String.self, forKey: .name) ?? z.name
        color = try c.decodeIfPresent(String.self, forKey: .color) ?? z.color
        eyes = try c.decodeIfPresent(String.self, forKey: .eyes) ?? z.eyes
        crown = try c.decodeIfPresent(String.self, forKey: .crown) ?? z.crown
        aura = try c.decodeIfPresent(String.self, forKey: .aura) ?? z.aura
        energy = try c.decodeIfPresent(Int.self, forKey: .energy) ?? z.energy
        bond = try c.decodeIfPresent(Int.self, forKey: .bond) ?? z.bond
        fed = try c.decodeIfPresent(Int.self, forKey: .fed) ?? z.fed
    }
}
struct SaveData: Codable, Equatable {
    var format = "rootaccess-save", version = 1
    var faction: String? = nil
    var xp = 0
    var done: [String] = []
    var code: [String: String] = [:]
    var pet = PetState()
    var updated: Double = Date().timeIntervalSince1970 * 1000
    init() {}
    init(from d: Decoder) throws {
        let c = try d.container(keyedBy: CodingKeys.self)
        format = try c.decode(String.self, forKey: .format)
        guard format == "rootaccess-save" else { throw CocoaError(.fileReadCorruptFile) }
        version = try c.decodeIfPresent(Int.self, forKey: .version) ?? 1
        faction = try c.decodeIfPresent(String.self, forKey: .faction)
        xp = try c.decodeIfPresent(Int.self, forKey: .xp) ?? 0
        done = try c.decodeIfPresent([String].self, forKey: .done) ?? []
        code = try c.decodeIfPresent([String: String].self, forKey: .code) ?? [:]
        pet = try c.decodeIfPresent(PetState.self, forKey: .pet) ?? PetState()
        updated = try c.decodeIfPresent(Double.self, forKey: .updated) ?? 0
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

// MARK: - Store with autosave + rolling snapshots on disk
@MainActor final class GameStore: ObservableObject {
    @Published var s = SaveData() { didSet { persist() } }
    @Published var snapshots: [Snapshot] = []
    @Published var toast: String?

    private let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    private var saveURL: URL { dir.appendingPathComponent("rootaccess-save.json") }
    private var snapURL: URL { dir.appendingPathComponent("rootaccess-snapshots.json") }

    init() {
        if let d = try? Data(contentsOf: saveURL), let v = try? JSONDecoder().decode(SaveData.self, from: d) { s = v }
        if let d = try? Data(contentsOf: snapURL), let v = try? JSONDecoder().decode([Snapshot].self, from: d) { snapshots = v }
    }
    static func encode(_ v: SaveData) throws -> Data {
        let e = JSONEncoder(); e.outputFormatting = [.prettyPrinted, .sortedKeys]; return try e.encode(v)
    }
    private func persist() { try? GameStore.encode(s).write(to: saveURL, options: .atomic) }
    func snapshot(_ label: String) {
        snapshots.insert(Snapshot(at: Date(), label: label, data: s), at: 0)
        snapshots = Array(snapshots.prefix(8))
        try? JSONEncoder().encode(snapshots).write(to: snapURL, options: .atomic)
    }
    func restore(_ d: SaveData, label: String) { snapshot("Before \(label)"); s = d; flash("Save restored") }
    func restore(json: String, label: String) {
        guard let d = json.data(using: .utf8), let v = try? JSONDecoder().decode(SaveData.self, from: d) else { flash("That isn't a ROOT//ACCESS save"); return }
        restore(v, label: label)
    }
    var json: String { (try? String(data: GameStore.encode(s), encoding: .utf8)) ?? "{}" }

    var level: Int { 1 + s.xp / 220 }
    var progress: Double { Double(s.xp % 220) / 220 }
    var faction: Faction? { s.faction.flatMap { FACTIONS[$0] } }
    var accent: Color { faction?.color ?? .matrix }
    var stageIndex: Int { PET_STAGES.lastIndex { level >= $0.lvl } ?? 0 }

    func complete(_ m: Mission) -> Bool {
        guard !s.done.contains(m.id) else { return false }
        let before = level
        s.done.append(m.id); s.xp += m.xp
        s.pet.energy = min(100, s.pet.energy + 20); s.pet.bond = min(100, s.pet.bond + 8)
        s.updated = Date().timeIntervalSince1970 * 1000
        snapshot("Cleared \(m.title)")
        flash(level > before ? "LEVEL \(level) — your pet is evolving" : "+\(m.xp) XP")
        return true
    }
    func unlocked(_ m: Mission) -> Bool {
        m.tier == 1 || MISSIONS.contains { $0.lang == m.lang && $0.tier < m.tier && s.done.contains($0.id) } || level >= m.tier * 2
    }
    func flash(_ t: String) { toast = t; Task { try? await Task.sleep(for: .seconds(2.4)); if toast == t { toast = nil } } }
}
