import SwiftUI
import UIKit
import UniformTypeIdentifiers

// MARK: Intro
@MainActor struct IntroView: View {
    @EnvironmentObject var store: GameStore
    @State private var shown = 0
    @State private var restoring = false
    @Environment(\.accessibilityReduceMotion) private var systemReduceMotion
    private let msg = "Wake up.\n\nThe world runs on code you can't read. Pipelines, hospitals, elections, gods.\nIn 2021 one leaked password shut down a fuel pipeline. In 2024 one bad update grounded flights worldwide.\n\nThree factions want you. Each will teach you to read the code, and to write it. 12 languages, 12 ranks each, every checkpoint run on a real compiler. Never coded before? You start in Boot Camp.\n\nFollow the white cursor."
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                Text("ROOT//ACCESS").font(.system(size: 34, weight: .heavy, design: .monospaced)).foregroundStyle(store.accent)
                Text(String(msg.prefix(shown)) + (shown < msg.count ? "█" : "")).foregroundStyle(store.accent)
                    .onTapGesture { shown = msg.count }
                if shown >= msg.count {
                    Text("Choose who you work for").font(.title2.bold())
                    ForEach(CUR.factions) { f in
                        Button { store.s.faction = f.id; store.flash("Welcome to \(f.name)") } label: {
                            Panel {
                                Text(f.short).font(.caption).foregroundStyle(f.tint)
                                Text(f.name).font(.headline).foregroundStyle(Color.ink)
                                Text("“\(f.creed)”").foregroundStyle(Color.ink)
                                Text(f.pitch).font(.footnote).foregroundStyle(Color.mut)
                                Text("Handler: \(f.handler)").font(.caption).foregroundStyle(Color.mut)
                            }.overlay(Rectangle().stroke(f.tint.opacity(0.5)))
                        }.buttonStyle(.plain)
                    }
                    Button("Restore a backup") { restoring = true }
                }
            }.padding(20).frame(maxWidth: 760)
        }
        .task {
            if !store.s.prefs.typewriter || store.reduceMotion(system: systemReduceMotion) { shown = msg.count; return }
            while shown < msg.count { try? await Task.sleep(for: .milliseconds(18)); shown += 1 }
        }
        .fileImporter(isPresented: $restoring, allowedContentTypes: [.json]) { r in importFile(r, store) }
    }
}

@MainActor func importFile(_ r: Result<URL, Error>, _ store: GameStore) {
    guard case .success(let url) = r else { return }
    let ok = url.startAccessingSecurityScopedResource(); defer { if ok { url.stopAccessingSecurityScopedResource() } }
    if let t = try? String(contentsOf: url, encoding: .utf8) { store.restore(json: t, label: "file restore") }
}

let BOOT_INTRO = """
You don't need any coding experience. Each mission has the same parts:
1. Training explains one idea in plain words, with a tiny example.
2. Objective says exactly what your code must do.
3. Step by step tells you what to type, one line at a time.
4. The Terminal is where you type. Lines starting with # are notes for you; the computer skips them.
5. Requirements tick green as you type the right pieces. When they're all green, tap Run checkpoints: your code is tested by a real Python engine (Judge0).
6. If a checkpoint fails, it tells you what it means. If you're stuck, the hint ladder goes from a nudge, to the answer's lines shuffled, to the full answer.
Boot Camp uses Python because it reads closest to plain English. What you learn here carries over to every other language.
"""

// MARK: Missions
@MainActor struct MissionBoard: View {
    @EnvironmentObject var store: GameStore
    @State private var lang = "basics"
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
                            }.foregroundStyle(lang == l.id ? store.accent : Color.ink)
                        }
                    }
                }
                if lang != "basics" && store.fluency("basics") < 12 {
                    Panel {
                        Text("New to coding?").bold()
                        Text("Start with Boot Camp: 12 short missions that assume no experience and teach the ideas every language shares.").font(.footnote)
                        Button("Open Boot Camp") { lang = "basics" }
                    }.overlay(Rectangle().stroke(store.accent))
                }
                Panel {
                    HStack(alignment: .top, spacing: 16) {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("\(f.handler) // \(f.name)").font(.caption).foregroundStyle(Color.mut)
                            Text(L.name).font(.title.bold())
                            if let d = CUR.dossiers[lang] { Text(d.tagline) }
                            Text(L.why).font(.footnote).foregroundStyle(Color.mut)
                            if CUR.dossiers[lang] != nil { NavigationLink("Read the \(L.name) dossier") { DossierView(lang: lang) } }
                            Text("Engine: \(L.engine)  ·  CI: \(L.ci)").font(.caption2).foregroundStyle(Color.mut)
                            Text(CUR.local?[lang] == "js" ? "Offline: runs on this device" : "Offline: structure checks, re-verified when you're back online").font(.caption2).foregroundStyle(Color.mut)
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
                                    Text(m.title).font(.headline).foregroundStyle(Color.ink)
                                    Text(Engine.shared.brief(m, faction: f.id)).font(.footnote).foregroundStyle(Color.mut).multilineTextAlignment(.leading)
                                }
                                Spacer()
                                VStack(alignment: .trailing, spacing: 4) {
                                    Text(done ? verLabel(store.s.verified[m.id]) : ok ? "+\(m.xp) XP" : "LOCKED").font(.caption).foregroundStyle(done ? store.accent : Color.mut)
                                    Text(m.ciOnly != nil ? "GitHub Actions" : store.hasLocal(m) ? "Judge0 · on device" : "Judge0").font(.caption2).foregroundStyle(m.ciOnly == nil ? Color.mut : Color.ciTag)
                                }
                            }
                        }
                    }.disabled(!ok).opacity(ok ? 1 : 0.4)
                }
            }.padding()
        }.navigationTitle("Missions").toolbarBackground(Color.bgDeep, for: .navigationBar)
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
            let pend = store.pendingVerify.count
            Label(store.online ? (pend > 0 ? "\(pend)↻" : "online") : "offline", systemImage: store.online ? "wifi" : "wifi.slash")
                .foregroundStyle(store.online ? Color.mut : Color.bad)
                .accessibilityLabel(store.online ? "Online" + (pend > 0 ? ", \(pend) ranks waiting to re-verify" : "") : "Offline")
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
    @State private var runLabel = "Running…"
    @State private var exporting = false
    @State private var hint: Hint? = nil
    @State private var pool: [Piece] = []
    @State private var picked: [Piece] = []
    @State private var pzMsg = ""
    @State private var orientOpen = true
    struct Piece: Identifiable, Hashable { let id: Int; let text: String }
    private var P: Praxis { CUR.praxis }
    private var seen: Int { store.s.hints[m.id] ?? 0 }
    private var canFull: Bool { seen >= 2 || (store.s.fails[m.id] ?? 0) >= P.fadeAfter || store.isDone(m) }
    private var stage: Int { store.s.primm[m.id] ?? 0 }
    private var langName: String { CUR.langs.first(where: { $0.id == m.lang })?.name ?? m.lang }

    var body: some View {
        let steps = m.steps ?? [], terms = m.keyTerms ?? [], reqs = Engine.shared.structure(m, code: code)
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Panel {
                    Text("\(langName.uppercased()) // RANK \(m.rank) OF 12 // \(m.module)").font(.caption).foregroundStyle(Color.mut)
                    Text(m.title).font(.largeTitle.bold())
                    Text("\(store.faction!.handler): ").foregroundStyle(store.accent).bold() + Text(Engine.shared.brief(m, faction: store.s.faction!))
                }
                if store.s.prefs.layout == "editor-first" {
                    terminalPanel(reqs: reqs)
                    lessonPanel(steps: steps, terms: terms)
                } else {
                    lessonPanel(steps: steps, terms: terms)
                    terminalPanel(reqs: reqs)
                }
            }.padding()
        }
        .onAppear { code = store.s.code[m.id] ?? m.starter }
        .navigationBarTitleDisplayMode(.inline)
        .fileExporter(isPresented: $exporting, document: SourceFile(text: code), contentType: .plainText, defaultFilename: "\(m.id).\(EXT[m.lang] ?? "txt")") { r in
            if case .success = r { store.flash("Commit it to submissions/ in your repo") }
        }
    }

    @ViewBuilder private func lessonPanel(steps: [String], terms: [KeyTerm]) -> some View {
    Panel {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                ForEach(Array(P.stages.enumerated()), id: \.offset) { i, st in
                    Button(st.name) { store.s.primm[m.id] = i }.font(.caption).padding(.horizontal, 8).padding(.vertical, 5)
                        .background(i == stage ? store.accent : .clear).foregroundStyle(i == stage ? Color.bgDeep : i < stage ? store.accent : Color.ink)
                        .overlay(Rectangle().stroke(i <= stage ? store.accent : Color.line))
                }
            }
        }
        Text("\(P.stages[stage].name). ").bold().foregroundStyle(store.accent) + Text(P.stages[stage].what).foregroundStyle(Color.mut)
        if m.rank == 1, let o = CUR.orient?[m.lang] {
            DisclosureGroup(isExpanded: $orientOpen) {
                VStack(alignment: .leading, spacing: 6) {
                    if m.lang == "basics" { Text(BOOT_INTRO).font(.callout) }
                    Text("How it runs: ").bold() + Text(o.run)
                    Text("What to write: ").bold() + Text(o.file)
                    Text("Printing: ").bold() + Text(o.out)
                    Text("Comments: ").bold() + Text(o.comment)
                    Text("Common gotchas:").bold()
                    ForEach(o.gotchas, id: \.self) { Text("• " + $0) }
                }.font(.callout).padding(.top, 4)
            } label: { Text(m.lang == "basics" ? "Before you start: how this works" : "First time in \(langName)? Read this").foregroundStyle(store.accent) }
            .padding(10).overlay(Rectangle().stroke(Color.line))
        }
        Text("Training: \(m.concept)").font(.headline).padding(.top, 4)
        ForEach(Array(m.lesson.enumerated()), id: \.offset) { _, p in
            if p.code { CodeBlock(text: p.text) } else { Text(p.text) }
        }
        VStack(alignment: .leading, spacing: 6) {
            Text("Self-explain: ").bold() + Text(P.selfExplain[(m.rank - 1) % P.selfExplain.count])
            TextField("Write it in your own words. Saved with your backup.", text: Binding(get: { store.s.notes[m.id] ?? "" }, set: { store.s.notes[m.id] = $0; if stage < 2 { store.s.primm[m.id] = 2 } }), axis: .vertical)
                .lineLimit(2...5).textFieldStyle(.roundedBorder)
        }.padding(10).overlay(alignment: .leading) { Rectangle().fill(store.accent).frame(width: 2) }
        if !terms.isEmpty {
            DisclosureGroup("Key terms in this mission") {
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(terms, id: \.self) { t in Text(t.term + ": ").bold().foregroundStyle(store.accent) + Text(t.def) }
                }.font(.callout).padding(.top, 4)
            }.tint(store.accent)
        }
        Text("Objective").font(.headline).padding(.top, 6)
        Text(m.task)
        if !steps.isEmpty {
            Text("Step by step").font(.headline).padding(.top, 6)
            ForEach(Array(steps.enumerated()), id: \.offset) { i, st in
                HStack(alignment: .top, spacing: 8) {
                    Text("\(i + 1).").bold().foregroundStyle(store.accent)
                    Text(st)
                }.padding(4).background(hint?.step == i ? store.accent.opacity(0.15) : .clear)
            }
        }
        Text("Stuck? Use the hint ladder under the editor: 1 points at your next move, 2 gives you the answer's lines to put in order, 3 shows the full answer for this mission.").font(.footnote).foregroundStyle(Color.mut)
    }
    }

    @ViewBuilder private func terminalPanel(reqs: [StructureLine]) -> some View {
    Panel {
        HStack { Text("Terminal").font(.headline); Spacer(); Text(m.ciOnly == nil ? CUR.langs.first(where: { $0.id == m.lang })!.engine : "GitHub Actions").font(.caption).foregroundStyle(Color.mut) }
        TextEditor(text: $code)
            .font(store.editorFont).frame(minHeight: 240)
            .scrollContentBackground(.hidden).background(Color.codeBg).overlay(Rectangle().stroke(Color.line))
            .autocorrectionDisabled().textInputAutocapitalization(.never)
            .onChange(of: code) { _, v in store.s.code[m.id] = v; if stage < 3 { store.s.primm[m.id] = 3 } }
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                Button(running ? runLabel : m.ciOnly == nil ? "Run checkpoints" : "Check and queue for CI", action: run)
                    .buttonStyle(.borderedProminent).disabled(running)
                Button("Check structure") { output = structureLines().1 }
                Button("Reset") { code = m.starter }
                if m.ciOnly != nil { Button("Export \(m.id).\(EXT[m.lang] ?? "txt")") { exporting = true } }
            }.buttonStyle(.bordered)
        }
        VStack(alignment: .leading, spacing: 3) {
            Text("REQUIREMENTS // update as you type").font(.caption2).foregroundStyle(Color.mut)
            ForEach(Array(reqs.enumerated()), id: \.offset) { _, r in
                Text((r.ok ? "✓ " : "○ ") + r.hint).font(.caption).foregroundStyle(r.ok ? store.accent : Color.mut)
            }
            let n = reqs.filter(\.ok).count
            Text("\(n)/\(reqs.count) in place" + (n == reqs.count ? ". Run the checkpoints." : "")).font(.caption2).foregroundStyle(Color.mut)
        }
        ScrollView(.horizontal, showsIndicators: false) {
            HStack {
                Text("HINTS").font(.caption2).foregroundStyle(Color.mut)
                Button("1 · Next move") { show(1) }
                Button("2 · Unscramble") { show(2) }.disabled(seen < 1)
                Button("3 · Full answer") { show(3) }.disabled(!canFull)
            }.buttonStyle(.bordered).font(.caption)
        }
        if let h = hint { hintPanel(h) }
        CheckpointList(m: m, results: results, accent: store.accent)
        VStack(alignment: .leading, spacing: 4) {
            ForEach(Array(output.enumerated()), id: \.offset) { _, l in
                Text(l.1).font(.system(.caption, design: .monospaced)).foregroundStyle(l.0).textSelection(.enabled)
            }
        }.frame(maxWidth: .infinity, alignment: .leading).padding(10).background(Color.codeBg)
        if store.isDone(m), let n = store.next(after: m) {
            NavigationLink("Next: rank \(n.rank) →") { MissionScreen(m: n) }
        }
    }
    }

    private func show(_ t: Int) {
        guard let h = Engine.shared.hint(m, code: code, results: results, tier: t) else { return }
        if t > seen { store.s.hints[m.id] = t }
        hint = h; pzMsg = ""
        if h.kind == "parsons" { pool = (h.lines ?? []).enumerated().map { Piece(id: $0.offset, text: $0.element) }; picked = [] }
    }

    @ViewBuilder private func hintPanel(_ h: Hint) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("HINT \(h.tier)/3 // \(h.title)").font(.caption.bold()).foregroundStyle(store.accent)
            Text(h.text).font(.callout)
            if h.kind == "parsons" {
                Text("Tap \(h.pieces ? "pieces" : "lines") in the order they belong. Tap a placed one to send it back.").font(.caption).foregroundStyle(Color.mut)
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(Array(picked.enumerated()), id: \.element.id) { i, p in
                        Button { picked.remove(at: i); pool.append(p) } label: {
                            Text("\(i + 1). " + p.text).font(.system(.caption, design: .monospaced)).frame(maxWidth: .infinity, alignment: .leading)
                        }.buttonStyle(.bordered)
                    }
                    if picked.isEmpty { Text("Your answer goes here").font(.caption).foregroundStyle(Color.mut) }
                }.padding(6).overlay(Rectangle().stroke(Color.line, style: StrokeStyle(lineWidth: 1, dash: [4])))
                ForEach(pool) { p in
                    Button { pool.removeAll { $0.id == p.id }; picked.append(p) } label: {
                        Text(p.text).font(.system(.caption, design: .monospaced)).frame(maxWidth: .infinity, alignment: .leading)
                    }.buttonStyle(.bordered)
                }
                HStack {
                    Button("Check order") {
                        let got = picked.map(\.text), ans = h.answer ?? []
                        if got == ans { pzMsg = "Correct order. Now type it into the editor yourself, or use the button." }
                        else if let bad = ans.indices.first(where: { $0 >= got.count || got[$0] != ans[$0] }) {
                            pzMsg = bad >= got.count ? "So far so good: the first \(got.count) are right. Keep going." : "Not yet. The first \(bad) \(bad == 1 ? "is" : "are") right; number \(bad + 1) is out of place."
                        }
                    }.buttonStyle(.borderedProminent)
                    Button("Start over") { pool += picked; picked = []; pzMsg = "" }.buttonStyle(.bordered)
                    if picked.map(\.text) == (h.answer ?? []) && !picked.isEmpty {
                        Button("Put it in the editor") { code = h.pieces ? Engine.shared.joinPieces(picked.map(\.text)) : picked.map(\.text).joined(separator: "\n") }.buttonStyle(.bordered)
                    }
                }
                if !pzMsg.isEmpty { Text(pzMsg).font(.caption).foregroundStyle(pzMsg.hasPrefix("Not") ? Color.bad : store.accent) }
            }
            if h.kind == "solution", let c = h.code {
                CodeBlock(text: c)
                Text("Studying a worked example and then explaining it is one of the best-supported ways to learn to code. Close this, then write it yourself.").font(.footnote).foregroundStyle(Color.mut)
                Button("Close and type it myself") { hint = nil }.buttonStyle(.bordered)
            }
        }.padding(10).frame(maxWidth: .infinity, alignment: .leading).overlay(Rectangle().stroke(store.accent))
    }

    private func structureLines() -> (Bool, [(Color, String)]) {
        let s = Engine.shared.structure(m, code: code)
        return (s.allSatisfy(\.ok), [(Color.mut, "STRUCTURE // pattern checks, offline")] + s.map { ($0.ok ? store.accent : .bad, ($0.ok ? "[✓] " : "[✗] ") + $0.hint) })
    }

    private func run() {
        if stage < 4 { store.s.primm[m.id] = 4 }
        let (pass, lines) = structureLines()
        guard pass else { store.fail(m); output = lines + [(Color.bad, "Fix the red lines first. Checkpoints only run once the required pieces are present. The Requirements list shows what's missing, and hint 1 points at the step that covers it.")]; return }
        if let ci = m.ciOnly {
            store.clear(m, how: "ci")
            output = lines + [(store.accent, "QUEUED FOR GITHUB ACTIONS. \(ci)"), (Color.mut, "Export this file (or all submissions from Backup), commit it to submissions/, and the checkpoints workflow grades it on \(CUR.langs.first(where: { $0.id == m.lang })!.ci).")]
            return
        }
        running = true; runLabel = "Running…"
        output = [(Color.mut, "> running checkpoints…")]
        let src = code
        Task {
            defer { running = false }
            switch await store.checkpoints(m, code: src, progress: { runLabel = $0; output = [(Color.mut, "> " + $0)] }) {
            case .unreachable(let reason):
                if store.s.settings.offlineClears {
                    let first = store.clear(m, how: "offline")
                    output = lines + [(store.accent, "NO ENGINE REACHABLE (\(reason))."),
                                      (Color.ink, "The required pieces are all present, so this rank clears as structure only" + (first ? " and the next one unlocks" : "") + ". It re-runs on real checkpoints when you're back online (Settings → Offline).")]
                } else {
                    output = [(Color.bad, "No engine reachable (\(reason)). The public Judge0 is rate-limited: wait a minute, or add your own host or API key under Settings."),
                              (Color.mut, "Structure checks passed, so you can export this file and verify it in GitHub Actions instead.")]
                }
            case .report(let rep, let how):
                results = rep.results
                var out: [(Color, String)] = [(Color.mut, "\(how == "local" ? "ON DEVICE" : "ENGINE") // \(rep.engine ?? "Judge0")\(rep.time.map { " · \($0)s" } ?? "")")]
                for r in rep.results {
                    let c: Color = r.status == "PASS" ? store.accent : r.status == "SKIP" ? .mut : .bad
                    let mark = r.status == "PASS" ? "[✓]" : r.status == "SKIP" ? "[~]" : "[✗]"
                    out.append((c, "\(mark) \(r.label)" + (r.status != "PASS" && !(r.detail ?? "").isEmpty ? " — \(r.detail!)" : "")))
                }
                let userOut = (rep.stdout ?? "").split(separator: "\n").filter { !$0.contains("::cp::") }.prefix(12).joined(separator: "\n")
                if !userOut.isEmpty { out.append((Color.mut, "stdout\n" + userOut)) }
                if rep.passed == true {
                    let first = store.clear(m, how: how)
                    out.append((store.accent, first ? "ACCESS GRANTED. +\(m.xp) XP. " + (m.rank < 12 ? "Rank \(m.rank + 1) unlocked." : "Rank 12 complete: certificate issued.") : "ACCESS GRANTED. Already cleared."))
                } else {
                    store.fail(m)
                    if let e = rep.stderr, !e.isEmpty { out.append((Color.mut, "stderr\n" + String(e.prefix(600)))) }
                    out.append((Color.bad, "ACCESS DENIED. Each failing checkpoint has a plain-English explanation below the list. Fix the first one and run again."))
                    if (store.s.fails[m.id] ?? 0) == P.fadeAfter { store.flash("Hint 3, the full answer, is now unlocked") }
                }
                output = out
            }
        }
    }
}

struct CodeBlock: View {
    let text: String
    var body: some View {
        ScrollView(.horizontal) { Text(text).font(.system(.footnote, design: .monospaced)).foregroundStyle(Color.codeText).padding(10).textSelection(.enabled) }
            .background(Color.codeBg).overlay(Rectangle().stroke(Color.line))
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
                    if r.status == "FAIL" {
                        (Text("What this means: ").bold() + Text(Engine.shared.explain(m, r))).font(.caption).foregroundStyle(Color.ink).padding(.leading, 14)
                    }
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
                        HStack { ForEach(CUR.languages) { l in
                            Button(l.name) { lang = l.id }.font(.caption).padding(.horizontal, 8).padding(.vertical, 5)
                                .overlay(Rectangle().stroke(lang == l.id ? store.accent : Color.line)).foregroundStyle(lang == l.id ? store.accent : Color.ink)
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
                BulletPanel(title: "Strengths", items: d.pros, color: store.accent)
                BulletPanel(title: "Trade-offs", items: d.cons, color: .bad)
                BulletPanel(title: "Use it for", items: d.bestFor, color: Color.ink)
                BulletPanel(title: "Reach for something else when", items: d.avoid, color: Color.ink)
                Panel {
                    Text("Official learning path").font(.headline)
                    ForEach(d.learn, id: \.self) { SourceLink($0) }
                    if !d.next.isEmpty { Text(d.next).font(.footnote).foregroundStyle(Color.mut) }
                    Text("Your \(L.name) path").font(.headline).padding(.top, 6)
                    ForEach(store.missions(lang)) { m in
                        Text("\(m.rank). \(m.module): \(m.title)").font(.caption).foregroundStyle(store.isDone(m) ? store.accent : Color.ink)
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
                Text("Every mission follows PRIMM. Each of the 12 ranks per language is a module (\(CUR.modules.joined(separator: ", "))), so finishing rank 12 means you've used the language end to end.")
                Text("Starting from zero").font(.headline)
                Text("Boot Camp comes first: 12 Python missions for people who have never coded, ending with a small capstone and a Read the Error mission. Every language's rank 1 opens with a primer on how it runs, prints, comments and trips people up.").font(.callout)
                Text("Help that's linked to the mission").font(.headline)
                Text("Every mission has numbered steps, a live requirements list, and plain-English explanations for failing checkpoints. The hint ladder goes 1: your next move (the missing requirement and its step, or the first failing checkpoint), 2: the answer's lines shuffled to put in order (a Parsons problem), 3: the full reference answer for that exact mission, which also unlocks after \(P.fadeAfter) failed runs.").font(.callout)
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

// MARK: Settings (display, engines, offline)
@MainActor struct SettingsScreen: View {
    @EnvironmentObject var store: GameStore
    @State private var status = ""
    @State private var testing = false
    @State private var reverifyNote = ""
    @Environment(\.colorScheme) private var scheme
    private var custom: Binding<Color> {
        Binding(get: { Color(hex: store.s.prefs.customAccent) },
                set: { c in
                    let u = UIColor(c); var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
                    u.getRed(&r, green: &g, blue: &b, alpha: &a)
                    store.s.prefs.customAccent = String(format: "#%02x%02x%02x", Int(max(0, min(1, r)) * 255), Int(max(0, min(1, g)) * 255), Int(max(0, min(1, b)) * 255))
                    store.s.prefs.accent = "custom"
                })
    }
    var body: some View {
        Form {
            Section {
                Picker("Theme", selection: $store.s.prefs.scheme) {
                    Text("System").tag("system"); Text("Dark terminal").tag("dark"); Text("Light paper").tag("light")
                }
                Picker("Accent", selection: $store.s.prefs.accent) {
                    Text("Faction").tag("faction")
                    ForEach(Prefs.accents, id: \.id) { a in Text(a.label).tag(a.id) }
                    Text("Custom").tag("custom")
                }
                ColorPicker("Custom accent", selection: custom, supportsOpacity: false)
                VStack(alignment: .leading) {
                    Text("Interface size: \(store.s.prefs.scale == 100 ? "system" : "\(store.s.prefs.scale)%")")
                    Slider(value: Binding(get: { Double(store.s.prefs.scale) }, set: { store.s.prefs.scale = Int($0) }), in: 80...150, step: 10)
                }
                Stepper("Editor font: \(store.s.prefs.editorSize) pt", value: $store.s.prefs.editorSize, in: 10...28)
                Picker("Reading font", selection: $store.s.prefs.font) {
                    Text("Monospaced").tag("mono"); Text("Sans-serif").tag("sans"); Text("Serif").tag("serif")
                }
                Picker("Mission layout", selection: $store.s.prefs.layout) {
                    Text("Lesson, then editor").tag("side"); Text("Editor on top").tag("editor-first")
                }
                Picker("Code rain", selection: $store.s.prefs.rain) {
                    Text("On").tag("on"); Text("Subtle").tag("low"); Text("Off").tag("off")
                }
                Picker("Animations", selection: $store.s.prefs.motion) {
                    Text("System").tag("system"); Text("Reduced").tag("reduce"); Text("Full").tag("full")
                }
                Toggle("Typewriter intro", isOn: $store.s.prefs.typewriter)
                Button("Reset display settings") { store.s.prefs = Prefs() }
            } header: { Text("Display") } footer: {
                Text("Interface size at 100% follows your Dynamic Type setting. High contrast follows Settings → Accessibility → Increase Contrast. On the light theme, accent text is darkened so it stays readable.")
            }
            Section {
                Picker("Run checkpoints", selection: $store.s.settings.mode) {
                    Text("Auto").tag("auto"); Text("Judge0 first").tag("judge0"); Text("On device only").tag("device")
                }
                TextField("Judge0 host", text: $store.s.settings.ce).textInputAutocapitalization(.never).autocorrectionDisabled()
                TextField("Judge0 extra host (C#)", text: $store.s.settings.extra).textInputAutocapitalization(.never).autocorrectionDisabled()
                SecureField("API token (optional)", text: $store.s.settings.token)
                TextField("Token header", text: $store.s.settings.tokenHeader).textInputAutocapitalization(.never).autocorrectionDisabled()
                Button(testing ? "Testing…" : "Test connection") { test() }.disabled(testing || !store.online)
                if !status.isEmpty { Text(status).font(.caption) }
                Button("Reset to public instances") {
                    let d = EngineSettings()
                    store.s.settings.ce = d.ce; store.s.settings.extra = d.extra; store.s.settings.token = ""; store.s.settings.tokenHeader = d.tokenHeader
                }
            } header: { Text("Engines") } footer: {
                Text("Auto runs JavaScript missions on this device and everything else on Judge0. On device only never sends your code anywhere. The public Judge0 instances are rate-limited; Judge0 is open source, so you can self-host it. Your token stays on this device and is left out of backups.")
            }
            Section {
                Label(store.online ? "Online: Judge0 available" : "Offline: on-device runs and structure checks", systemImage: store.online ? "wifi" : "wifi.slash")
                Toggle("Clear ranks on structure checks while offline", isOn: $store.s.settings.offlineClears)
                Toggle("Re-verify them when the connection returns", isOn: $store.s.settings.autoReverify)
                let pend = store.pendingVerify
                Text(pend.isEmpty ? "Nothing waiting to re-verify." : "Waiting to re-verify: " + pend.map(\.id).joined(separator: ", ")).font(.caption)
                Button(store.reverifying ? "Re-verifying…" : "Re-verify now") {
                    Task {
                        let r = await store.reverify(auto: false)
                        reverifyNote = "\(r.ok) verified" + (r.failed.isEmpty ? "" : "; failing now: \(r.failed.joined(separator: ", "))") + (r.skipped > 0 ? "; \(r.skipped) couldn't reach an engine" : "")
                    }
                }.disabled(pend.isEmpty || store.reverifying)
                if !reverifyNote.isEmpty { Text(reverifyNote).font(.caption) }
            } header: { Text("Offline") } footer: {
                Text("The app, every lesson, hint and structure check work with no network, and progress saves on this device. JavaScript missions run their real checkpoints on device. Other languages clear as \"structure only\" while offline and re-run on Judge0 later. For Python, SQL and TypeScript offline, use the web version with its offline packs.")
            }
            Section {
                Text("GitHub Actions re-runs every checkpoint on current toolchains. Export your submissions from Backup, put them in submissions/ in the repo, and push. Locally: node tools/checkpoints.js --dir submissions").font(.footnote)
            } header: { Text("GitHub Actions") }
        }
        .scrollContentBackground(.hidden)
        .navigationTitle("Settings")
    }
    private func test() {
        guard let m = CUR.missions.first(where: { $0.id == "py1" }) else { return }
        testing = true; status = ""
        let st = store.s.settings
        Task {
            defer { testing = false }
            do {
                let rep = try await Engine.shared.run(m, code: m.solution, settings: st)
                status = rep.passed == true ? "✓ Connected. \(rep.engine ?? "Judge0") ran \(rep.results.count) checkpoints in \(rep.time ?? "?")s." : "✗ Reached Judge0 but the run failed: \(rep.status ?? "unknown")"
            } catch { status = "✗ Couldn't reach Judge0: \(error.localizedDescription)" }
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
                Text("Your save autosaves to this device and works offline. Back it up to Files or iCloud Drive to move it between devices or into the web version. Both versions use the same JSON format (v2), v1 saves upgrade automatically, and your Judge0 token is never included.")
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
        .fileExporter(isPresented: $exporting, document: SaveDocument(save: store.exportable), contentType: .json,
                      defaultFilename: "rootaccess-backup-\(Date().formatted(.iso8601.year().month().day()))") { r in
            if case .success = r { store.flash("Backup saved") }
        }
        .fileImporter(isPresented: $importing, allowedContentTypes: [.json]) { r in importFile(r, store) }
        .confirmationDialog("Erase all progress? A snapshot is kept.", isPresented: $confirmWipe, titleVisibility: .visible) {
            Button("Erase and start over", role: .destructive) {
                store.snapshot("Before wipe")
                var fresh = SaveData(); fresh.prefs = store.s.prefs; fresh.settings = store.s.settings   // keep display + engine settings
                store.s = fresh
            }
        }
    }
}
