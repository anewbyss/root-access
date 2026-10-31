import SwiftUI
import UIKit
import UniformTypeIdentifiers

// MARK: Intro
@MainActor struct IntroView: View {
    @EnvironmentObject var store: GameStore
    @State private var shown = 0
    @State private var restoring = false
    private let msg = "Wake up.\n\nThe world runs on code you can't read. Pipelines, hospitals, elections, gods.\nIn 2021 one leaked password shut down a fuel pipeline. In 2024 one bad update grounded flights worldwide.\n\nThree factions want you. Each will teach you to read the code, and to write it. 12 languages, 12 ranks each, every checkpoint run on a real compiler.\n\nFollow the white cursor."
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                Text("ROOT//ACCESS").font(.system(size: 34, weight: .heavy, design: .monospaced)).foregroundStyle(Color.matrix)
                Text(String(msg.prefix(shown)) + (shown < msg.count ? "█" : "")).foregroundStyle(Color.matrix)
                    .onTapGesture { shown = msg.count }
                if shown >= msg.count {
                    Text("Choose who you work for").font(.title2.bold())
                    ForEach(CUR.factions) { f in
                        Button { store.s.faction = f.id; store.flash("Welcome to \(f.name)") } label: {
                            Panel {
                                Text(f.short).font(.caption).foregroundStyle(f.tint)
                                Text(f.name).font(.headline).foregroundStyle(.white)
                                Text("“\(f.creed)”").foregroundStyle(.white)
                                Text(f.pitch).font(.footnote).foregroundStyle(Color.mut)
                                Text("Handler: \(f.handler)").font(.caption).foregroundStyle(Color.mut)
                            }.overlay(Rectangle().stroke(f.tint.opacity(0.5)))
                        }.buttonStyle(.plain)
                    }
                    Button("Restore a backup") { restoring = true }
                }
            }.padding(20).frame(maxWidth: 760)
        }
        .task { while shown < msg.count { try? await Task.sleep(for: .milliseconds(18)); shown += 1 } }
        .fileImporter(isPresented: $restoring, allowedContentTypes: [.json]) { r in importFile(r, store) }
    }
}

@MainActor func importFile(_ r: Result<URL, Error>, _ store: GameStore) {
    guard case .success(let url) = r else { return }
    let ok = url.startAccessingSecurityScopedResource(); defer { if ok { url.stopAccessingSecurityScopedResource() } }
    if let t = try? String(contentsOf: url, encoding: .utf8) { store.restore(json: t, label: "file restore") }
}

// MARK: Missions
@MainActor struct MissionBoard: View {
    @EnvironmentObject var store: GameStore
    @State private var lang = "python"
    var body: some View {
        let f = store.faction!, L = CUR.langs.first(where: { $0.id == lang })!, flu = store.fluency(lang)
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                HUD()
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack {
                        ForEach(CUR.langs) { l in
                            Button { lang = l.id } label: {
                                Text("\(l.name) \(store.fluency(l.id))/12").padding(.horizontal, 10).padding(.vertical, 6)
                                    .overlay(Rectangle().stroke(lang == l.id ? store.accent : Color.line))
                            }.foregroundStyle(lang == l.id ? store.accent : .white)
                        }
                    }
                }
                Panel {
                    HStack(alignment: .top, spacing: 16) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("\(f.handler) // \(f.name)").font(.caption).foregroundStyle(Color.mut)
                            Text(L.name).font(.title.bold())
                            if let d = CUR.dossiers[lang] { Text(d.tagline) }
                            Text(L.why).font(.footnote).foregroundStyle(Color.mut)
                            NavigationLink("Read the \(L.name) dossier") { DossierView(lang: lang) }
                            Text("Engine: \(L.engine)  ·  CI: \(L.ci)").font(.caption2).foregroundStyle(Color.mut)
                        }
                        Spacer()
                        FluencyRing(value: flu, color: store.accent)
                    }
                }
                if flu == 12 {
                    Panel {
                        Text("CERTIFICATE // \(L.name.uppercased()) FLUENCY").font(.caption).foregroundStyle(store.accent)
                        Text("All 12 ranks cleared, from syntax to a capstone. Checkpoints verified on \(L.engine) or queued for GitHub Actions on \(L.ci).")
                    }.overlay(Rectangle().stroke(store.accent))
                }
                ForEach(store.missions(lang)) { m in
                    let ok = store.unlocked(m), done = store.isDone(m)
                    NavigationLink { MissionScreen(m: m) } label: {
                        Panel {
                            HStack(alignment: .top) {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("RANK \(m.rank) // \(m.module)").font(.caption2).foregroundStyle(Color.mut)
                                    Text(m.title).font(.headline).foregroundStyle(.white)
                                    Text(Engine.shared.brief(m, faction: f.id)).font(.footnote).foregroundStyle(Color.mut).multilineTextAlignment(.leading)
                                }
                                Spacer()
                                VStack(alignment: .trailing, spacing: 4) {
                                    Text(done ? verLabel(store.s.verified[m.id]) : ok ? "+\(m.xp) XP" : "LOCKED").font(.caption).foregroundStyle(done ? store.accent : Color.mut)
                                    Text(m.ciOnly == nil ? "Judge0" : "GitHub Actions").font(.caption2).foregroundStyle(m.ciOnly == nil ? Color.mut : Color(hex: "#ffd84d"))
                                }
                            }
                        }
                    }.disabled(!ok).opacity(ok ? 1 : 0.4)
                }
            }.padding()
        }.navigationTitle("Missions").toolbarBackground(.black, for: .navigationBar)
    }
}

struct FluencyRing: View {
    let value: Int; let color: Color
    var body: some View {
        VStack(spacing: 4) {
            ZStack {
                Circle().stroke(Color.line, lineWidth: 8)
                Circle().trim(from: 0, to: Double(value) / 12).stroke(color, style: StrokeStyle(lineWidth: 8, lineCap: .butt)).rotationEffect(.degrees(-90))
                Text("\(value)/12").font(.title3.bold())
            }.frame(width: 92, height: 92)
            Text("fluency").font(.caption2).foregroundStyle(Color.mut)
        }.animation(.easeOut, value: value)
    }
}

@MainActor struct HUD: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        HStack {
            Text(store.faction?.short ?? "").foregroundStyle(store.accent)
            Text("LVL \(store.level)")
            ProgressView(value: store.progress).frame(maxWidth: 140)
            Text("\(store.s.xp) XP").foregroundStyle(store.accent)
            Text("\(store.s.done.count)/\(CUR.missions.count)").foregroundStyle(Color.mut)
        }.font(.caption)
    }
}

@MainActor struct MissionScreen: View {
    @EnvironmentObject var store: GameStore
    let m: Mission
    @State private var code = ""
    @State private var output: [(Color, String)] = [(Color.mut, "> awaiting input_")]
    @State private var results: [CheckResult] = []
    @State private var running = false
    @State private var exporting = false
    private var P: Praxis { CUR.praxis }
    private var stage: Int { store.s.primm[m.id] ?? 0 }
    private var langName: String { CUR.langs.first(where: { $0.id == m.lang })?.name ?? m.lang }

    var body: some View {
        let fails = store.s.fails[m.id] ?? 0, worked = fails >= P.fadeAfter || store.isDone(m)
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Panel {
                    Text("\(langName.uppercased()) // RANK \(m.rank) OF 12 // \(m.module)").font(.caption).foregroundStyle(Color.mut)
                    Text(m.title).font(.largeTitle.bold())
                    Text("\(store.faction!.handler): ").foregroundStyle(store.accent).bold() + Text(Engine.shared.brief(m, faction: store.s.faction!))
                }
                Panel {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ForEach(Array(P.stages.enumerated()), id: \.offset) { i, st in
                                Button(st.name) { store.s.primm[m.id] = i }.font(.caption).padding(.horizontal, 8).padding(.vertical, 5)
                                    .background(i == stage ? store.accent : .clear).foregroundStyle(i == stage ? .black : i < stage ? store.accent : .white)
                                    .overlay(Rectangle().stroke(i <= stage ? store.accent : Color.line))
                            }
                        }
                    }
                    Text("\(P.stages[stage].name). ").bold().foregroundStyle(store.accent) + Text(P.stages[stage].what).foregroundStyle(Color.mut)
                    Text("Training: \(m.concept)").font(.headline).padding(.top, 4)
                    ForEach(Array(m.lesson.enumerated()), id: \.offset) { _, p in
                        if p.code { CodeBlock(text: p.text) } else { Text(p.text) }
                    }
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Self-explain: ").bold() + Text(P.selfExplain[(m.rank - 1) % P.selfExplain.count])
                        TextField("Write it in your own words. Saved with your backup.", text: Binding(get: { store.s.notes[m.id] ?? "" }, set: { store.s.notes[m.id] = $0; if stage < 2 { store.s.primm[m.id] = 2 } }), axis: .vertical)
                            .lineLimit(2...5).textFieldStyle(.roundedBorder)
                    }.padding(10).overlay(alignment: .leading) { Rectangle().fill(store.accent).frame(width: 2) }
                    Text("Objective").font(.headline).padding(.top, 6)
                    Text(m.task)
                    if worked {
                        DisclosureGroup("Worked example (reference solution)") {
                            CodeBlock(text: m.solution)
                            Text("Read it, close it, then write yours from memory.").font(.footnote).foregroundStyle(Color.mut)
                        }.tint(store.accent)
                    } else {
                        Text("Worked example unlocks after \(P.fadeAfter - fails) more failed run\(P.fadeAfter - fails == 1 ? "" : "s")").font(.footnote).foregroundStyle(Color.mut)
                    }
                }
                Panel {
                    HStack { Text("Terminal").font(.headline); Spacer(); Text(m.ciOnly == nil ? CUR.langs.first(where: { $0.id == m.lang })!.engine : "GitHub Actions").font(.caption).foregroundStyle(Color.mut) }
                    TextEditor(text: $code)
                        .font(.system(.footnote, design: .monospaced)).frame(minHeight: 240)
                        .scrollContentBackground(.hidden).background(Color.black).overlay(Rectangle().stroke(Color.line))
                        .autocorrectionDisabled().textInputAutocapitalization(.never)
                        .onChange(of: code) { _, v in store.s.code[m.id] = v; if stage < 3 { store.s.primm[m.id] = 3 } }
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack {
                            Button(running ? "Running…" : m.ciOnly == nil ? "Run external checkpoints" : "Check and queue for CI", action: run)
                                .buttonStyle(.borderedProminent).disabled(running)
                            Button("Check structure") { output = structureLines().1 }
                            Button("Hint") { output = [(Color.mut, "HINT // " + (Engine.shared.structure(m, code: code).first(where: { !$0.ok })?.hint ?? "Structure looks right. Run the checkpoints."))] }
                            Button("Reset") { code = m.starter }
                            if m.ciOnly != nil { Button("Export \(m.id).\(EXT[m.lang] ?? "txt")") { exporting = true } }
                        }.buttonStyle(.bordered)
                    }
                    CheckpointList(m: m, results: results, accent: store.accent)
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(Array(output.enumerated()), id: \.offset) { _, l in
                            Text(l.1).font(.system(.caption, design: .monospaced)).foregroundStyle(l.0).textSelection(.enabled)
                        }
                    }.frame(maxWidth: .infinity, alignment: .leading).padding(10).background(Color.black)
                    if store.isDone(m), let n = store.next(after: m) {
                        NavigationLink("Next: rank \(n.rank) →") { MissionScreen(m: n) }
                    }
                }
            }.padding()
        }
        .onAppear { code = store.s.code[m.id] ?? m.starter }
        .navigationBarTitleDisplayMode(.inline)
        .fileExporter(isPresented: $exporting, document: SourceFile(text: code), contentType: .plainText, defaultFilename: "\(m.id).\(EXT[m.lang] ?? "txt")") { r in
            if case .success = r { store.flash("Commit it to submissions/ in your repo") }
        }
    }

    private func structureLines() -> (Bool, [(Color, String)]) {
        let s = Engine.shared.structure(m, code: code)
        return (s.allSatisfy(\.ok), [(Color.mut, "STRUCTURE // pattern checks, offline")] + s.map { ($0.ok ? store.accent : .bad, ($0.ok ? "[✓] " : "[✗] ") + $0.hint) })
    }

    private func run() {
        if stage < 4 { store.s.primm[m.id] = 4 }
        let (pass, lines) = structureLines()
        guard pass else { store.fail(m); output = lines + [(Color.bad, "Fix the red lines first. Checkpoints only run once the required pieces are present.")]; return }
        if let ci = m.ciOnly {
            store.clear(m, how: "ci")
            output = lines + [(store.accent, "QUEUED FOR GITHUB ACTIONS. \(ci)"), (Color.mut, "Export this file (or all submissions from Backup), commit it to submissions/, and the checkpoints workflow grades it on \(CUR.langs.first(where: { $0.id == m.lang })!.ci).")]
            return
        }
        running = true
        output = [(Color.mut, "> submitting to \(CUR.langs.first(where: { $0.id == m.lang })!.engine)…")]
        let src = code, settings = store.s.settings
        Task {
            defer { running = false }
            do {
                let rep = try await Engine.shared.run(m, code: src, settings: settings)
                results = rep.results
                var out: [(Color, String)] = [(Color.mut, "ENGINE // \(rep.engine ?? "Judge0")\(rep.time.map { " · \($0)s" } ?? "")")]
                for r in rep.results {
                    let c: Color = r.status == "PASS" ? store.accent : r.status == "SKIP" ? .mut : .bad
                    let mark = r.status == "PASS" ? "[✓]" : r.status == "SKIP" ? "[~]" : "[✗]"
                    out.append((c, "\(mark) \(r.label)" + (r.status != "PASS" && !(r.detail ?? "").isEmpty ? " — \(r.detail!)" : "")))
                }
                let userOut = (rep.stdout ?? "").split(separator: "\n").filter { !$0.contains("::cp::") }.prefix(12).joined(separator: "\n")
                if !userOut.isEmpty { out.append((Color.mut, "stdout\n" + userOut)) }
                if rep.passed == true {
                    let first = store.clear(m, how: "judge0")
                    out.append((store.accent, first ? "ACCESS GRANTED. +\(m.xp) XP. " + (m.rank < 12 ? "Rank \(m.rank + 1) unlocked." : "Rank 12 complete: certificate issued.") : "ACCESS GRANTED. Already cleared."))
                } else {
                    store.fail(m)
                    if let e = rep.stderr, !e.isEmpty { out.append((Color.mut, "stderr\n" + String(e.prefix(600)))) }
                    out.append((Color.bad, "ACCESS DENIED. Fix the failing checkpoints and run again."))
                    if (store.s.fails[m.id] ?? 0) == P.fadeAfter { store.flash("Worked example unlocked") }
                }
                output = out
            } catch {
                output = [(Color.bad, "Couldn't reach Judge0 (\(error.localizedDescription)). The public instance is rate-limited. Wait a minute, or add your own Judge0 host or API key under Engines."),
                          (Color.mut, "Structure checks passed, so you can export this file and verify it in GitHub Actions instead.")]
            }
        }
    }
}

struct CodeBlock: View {
    let text: String
    var body: some View {
        ScrollView(.horizontal) { Text(text).font(.system(.footnote, design: .monospaced)).foregroundStyle(Color(hex: "#aef5c4")).padding(10).textSelection(.enabled) }
            .background(Color.black).overlay(Rectangle().stroke(Color.line))
    }
}

struct CheckpointList: View {
    let m: Mission; let results: [CheckResult]; let accent: Color
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(m.ciOnly == nil ? "Checkpoints · \(CUR.langs.first(where: { $0.id == m.lang })!.engine)" : "Checkpoints · GitHub Actions").font(.caption.bold())
            if results.isEmpty {
                if m.checkpoints.isEmpty { Text("Checkpoints are the mission's test cases. They appear after the first run.").font(.caption).foregroundStyle(Color.mut) }
                ForEach(m.checkpoints, id: \.self) { Text("○ \($0)").font(.caption).foregroundStyle(Color.mut) }
            } else {
                ForEach(results, id: \.self) { r in
                    Text("\(r.status == "PASS" ? "✓" : r.status == "SKIP" ? "~" : "✗") \(r.label)").font(.caption)
                        .foregroundStyle(r.status == "PASS" ? accent : r.status == "SKIP" ? Color.mut : Color.bad)
                }
            }
        }.frame(maxWidth: .infinity, alignment: .leading).padding(10).overlay(Rectangle().stroke(Color.line))
    }
}

// MARK: Intel
@MainActor struct IntelScreen: View {
    @EnvironmentObject var store: GameStore
    @State private var tab = 0
    @State private var lang = "python"
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Picker("Intel", selection: $tab) {
                    Text("Dossiers").tag(0); Text("Method").tag(1); Text("Engines").tag(2); Text("Incidents").tag(3)
                }.pickerStyle(.segmented)
                switch tab {
                case 0:
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack { ForEach(CUR.langs) { l in
                            Button(l.name) { lang = l.id }.font(.caption).padding(.horizontal, 8).padding(.vertical, 5)
                                .overlay(Rectangle().stroke(lang == l.id ? store.accent : Color.line)).foregroundStyle(lang == l.id ? store.accent : .white)
                        } }
                    }
                    DossierBody(lang: lang)
                case 1: MethodView()
                case 2: EnginesTable()
                default:
                    Panel {
                        Text("Real incidents the missions are based on. \(store.faction!.lore)").foregroundStyle(Color.mut)
                        HStack {
                            Text("Defect to:").foregroundStyle(Color.mut)
                            ForEach(CUR.factions) { f in
                                Button(f.short) { store.snapshot("Before defecting"); store.s.faction = f.id; store.flash("You now work for \(f.name)") }
                                    .disabled(f.id == store.s.faction).buttonStyle(.bordered)
                            }
                        }
                    }
                    ForEach(CUR.intel, id: \.self) { i in
                        Panel { Text(String(i.year)).font(.caption).foregroundStyle(store.accent); Text(i.name).font(.headline); Text(i.note).foregroundStyle(Color.mut) }
                    }
                }
            }.padding()
        }.navigationTitle("Intel")
    }
}

struct DossierView: View {
    let lang: String
    var body: some View { ScrollView { DossierBody(lang: lang).padding() }.navigationTitle("Dossier") }
}

@MainActor struct DossierBody: View {
    @EnvironmentObject var store: GameStore
    let lang: String
    var body: some View {
        let L = CUR.langs.first(where: { $0.id == lang })!
        if let d = CUR.dossiers[lang] {
            VStack(alignment: .leading, spacing: 12) {
                Panel {
                    Text("DOSSIER // \(L.tag)").font(.caption).foregroundStyle(store.accent)
                    Text(L.name).font(.title.bold())
                    Text(d.tagline).font(.headline)
                    LazyVGrid(columns: [GridItem(.adaptive(minimum: 150), alignment: .topLeading)], alignment: .leading, spacing: 10) {
                        ForEach(d.stats, id: \.self) { s in
                            VStack(alignment: .leading, spacing: 2) {
                                Text(s.value).font(.title2.bold()).foregroundStyle(store.accent)
                                Text(s.label).font(.caption)
                                SourceLink(s.source).font(.caption2)
                            }.frame(maxWidth: .infinity, alignment: .leading).padding(10).overlay(Rectangle().stroke(Color.line))
                        }
                    }
                    Text("Relevance").font(.headline)
                    Text(d.relevance)
                    ForEach(d.relSrc, id: \.self) { SourceLink($0).font(.caption) }
                }
                BulletPanel(title: "Strengths", items: d.pros, color: .matrix)
                BulletPanel(title: "Trade-offs", items: d.cons, color: .bad)
                BulletPanel(title: "Use it for", items: d.bestFor, color: .white)
                BulletPanel(title: "Reach for something else when", items: d.avoid, color: .white)
                Panel {
                    Text("Official learning path").font(.headline)
                    ForEach(d.learn, id: \.self) { SourceLink($0) }
                    if !d.next.isEmpty { Text(d.next).font(.footnote).foregroundStyle(Color.mut) }
                    Text("Your \(L.name) path").font(.headline).padding(.top, 6)
                    ForEach(store.missions(lang)) { m in
                        Text("\(m.rank). \(m.module): \(m.title)").font(.caption).foregroundStyle(store.isDone(m) ? store.accent : .white)
                    }
                }
            }
        }
    }
}

struct SourceLink: View {
    let s: SourceRef
    init(_ s: SourceRef) { self.s = s }
    var body: some View {
        if let u = URL(string: s.url), !s.url.isEmpty { Link(s.label, destination: u).underline() } else { Text(s.label).foregroundStyle(Color.mut) }
    }
}

struct BulletPanel: View {
    let title: String; let items: [String]; let color: Color
    var body: some View {
        Panel {
            Text(title).font(.headline).foregroundStyle(color)
            ForEach(items, id: \.self) { Text("• \($0)").font(.callout) }
        }
    }
}

struct MethodView: View {
    var body: some View {
        let P = CUR.praxis
        VStack(alignment: .leading, spacing: 12) {
            Panel {
                Text("How you learn here").font(.title2.bold())
                Text("Every mission follows PRIMM. Each of the 12 ranks per language is a module (\(CUR.modules.joined(separator: ", "))), so finishing rank 12 means you've used the language end to end. Worked examples unlock after \(P.fadeAfter) failed runs.")
                ForEach(Array(P.stages.enumerated()), id: \.offset) { i, st in Text("\(i + 1). ").bold() + Text("\(st.name): ").bold() + Text(st.what) }
            }
            Panel {
                Text("The evidence").font(.headline)
                ForEach(Array(P.evidence.enumerated()), id: \.offset) { _, e in
                    VStack(alignment: .leading, spacing: 2) { Text(e.claim); SourceLink(e.source).font(.caption) }
                }
            }
        }
    }
}

struct EnginesTable: View {
    var body: some View {
        Panel {
            Text("Where your code runs").font(.title2.bold())
            Text("Checkpoints are real programs: your code is compiled with a test harness and run on an external engine. Each harness prints one line per checkpoint and the app reads those lines. Judge0 runs live from this app; the repo's GitHub Actions workflow re-runs every harness on current toolchains and grades anything in submissions/.").font(.callout)
            ForEach(CUR.langs) { l in
                let ci = CUR.missions.filter { $0.lang == l.id && $0.ciOnly != nil }.map { String($0.rank) }
                VStack(alignment: .leading, spacing: 2) {
                    Text(l.name).bold()
                    Text("Judge0: \(l.engine)").font(.caption)
                    Text("GitHub Actions: \(l.ci)").font(.caption)
                    Text(ci.isEmpty ? "CI-only ranks: none" : "CI-only \(ci.count > 1 ? "ranks" : "rank"): \(ci.joined(separator: ", "))").font(.caption).foregroundStyle(Color.mut)
                }.padding(.vertical, 4)
                Divider().background(Color.line)
            }
        }
    }
}

// MARK: Engines settings
@MainActor struct EnginesScreen: View {
    @EnvironmentObject var store: GameStore
    @State private var status = ""
    @State private var testing = false
    var body: some View {
        Form {
            Section {
                TextField("Judge0 host", text: $store.s.settings.ce).textInputAutocapitalization(.never).autocorrectionDisabled()
                TextField("Judge0 extra host (C#)", text: $store.s.settings.extra).textInputAutocapitalization(.never).autocorrectionDisabled()
                SecureField("API token (optional)", text: $store.s.settings.token)
                TextField("Token header", text: $store.s.settings.tokenHeader).textInputAutocapitalization(.never).autocorrectionDisabled()
            } header: { Text("Judge0") } footer: {
                Text("The free public instances are rate-limited. Judge0 is open source, so you can self-host it and point the app at your server. Your token is stored in your save file, so strip it before sharing a backup.")
            }
            Section {
                Button(testing ? "Testing…" : "Test connection") { test() }.disabled(testing)
                if !status.isEmpty { Text(status).font(.caption) }
                Button("Reset to public instances") { store.s.settings = EngineSettings() }
            }
            Section {
                Text("GitHub Actions re-runs every checkpoint on \(CUR.langs.map(\.ci).prefix(4).joined(separator: ", ")) and more. Export your submissions from Backup, put them in submissions/ in the repo, and push. Locally: node tools/checkpoints.js --dir submissions").font(.footnote)
            } header: { Text("GitHub Actions") }
        }
        .scrollContentBackground(.hidden)
        .navigationTitle("Engines")
    }
    private func test() {
        guard let m = CUR.missions.first(where: { $0.id == "py1" }) else { return }
        testing = true; status = ""
        let st = store.s.settings
        Task {
            defer { testing = false }
            do {
                let rep = try await Engine.shared.run(m, code: m.solution, settings: st)
                status = rep.passed == true ? "Connected. \(rep.engine ?? "Judge0") ran \(rep.results.count) checkpoints in \(rep.time ?? "?")s." : "Reached Judge0 but the run failed: \(rep.status ?? "unknown")"
            } catch { status = "Couldn't reach Judge0: \(error.localizedDescription)" }
        }
    }
}

// MARK: Backup
@MainActor struct BackupScreen: View {
    @EnvironmentObject var store: GameStore
    @State private var exporting = false
    @State private var exportingSubs = false
    @State private var importing = false
    @State private var confirmWipe = false
    var body: some View {
        List {
            Section {
                Text("Your save autosaves to this device. Back it up to Files or iCloud Drive to move it between devices or into the web version. Both versions use the same JSON format (v2), and v1 saves upgrade automatically.")
                    .font(.footnote).foregroundStyle(Color.mut)
                Button { exporting = true } label: { Label("Export to Files / iCloud Drive", systemImage: "square.and.arrow.down") }
                ShareLink(item: store.json, preview: SharePreview("ROOT//ACCESS backup")) { Label("Share backup", systemImage: "square.and.arrow.up") }
                Button { UIPasteboard.general.string = store.json; store.flash("Backup copied") } label: { Label("Copy backup JSON", systemImage: "doc.on.doc") }
            } header: { Text("Back up") }
            Section {
                Button { exportingSubs = true } label: { Label("Export submissions folder (\(store.submissions.count) files)", systemImage: "folder.badge.plus") }
                    .disabled(store.submissions.isEmpty)
                    .fileExporter(isPresented: $exportingSubs, document: SubmissionsFolder(files: store.submissions), contentType: .folder, defaultFilename: "submissions") { r in
                        if case .success = r { store.flash("Submissions exported") }
                    }
            } header: { Text("Submissions for GitHub Actions") } footer: {
                Text("Copy the folder's files into submissions/ in your repo and push. The checkpoints workflow grades each one on current toolchains, including the ranks Judge0 can't run.")
            }
            Section {
                Button { importing = true } label: { Label("Restore from file", systemImage: "folder") }
                Button { store.restore(json: UIPasteboard.general.string ?? "", label: "paste restore") } label: { Label("Restore from clipboard", systemImage: "doc.on.clipboard") }
                Button(role: .destructive) { confirmWipe = true } label: { Label("Start over", systemImage: "trash") }
            } header: { Text("Restore") } footer: { Text("Current progress is snapshotted before any restore, so you can undo it below.") }
            Section {
                if store.snapshots.isEmpty { Text("No snapshots yet. Clear a mission.").foregroundStyle(Color.mut) }
                ForEach(store.snapshots) { sn in
                    HStack {
                        VStack(alignment: .leading) { Text(sn.label); Text("\(sn.at.formatted()) · \(sn.data.xp) XP").font(.caption).foregroundStyle(Color.mut) }
                        Spacer(); Button("Restore") { store.restore(sn.data, label: "snapshot restore") }.buttonStyle(.bordered)
                    }
                }
            } header: { Text("Auto snapshots") }
        }
        .scrollContentBackground(.hidden)
        .navigationTitle("Backup")
        .fileExporter(isPresented: $exporting, document: SaveDocument(save: store.s), contentType: .json,
                      defaultFilename: "rootaccess-backup-\(Date().formatted(.iso8601.year().month().day()))") { r in
            if case .success = r { store.flash("Backup saved") }
        }
        .fileImporter(isPresented: $importing, allowedContentTypes: [.json]) { r in importFile(r, store) }
        .confirmationDialog("Erase all progress? A snapshot is kept.", isPresented: $confirmWipe, titleVisibility: .visible) {
            Button("Erase and start over", role: .destructive) { store.snapshot("Before wipe"); store.s = SaveData() }
        }
    }
}
