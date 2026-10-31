import SwiftUI
import UIKit
import UniformTypeIdentifiers

// MARK: Intro
struct IntroView: View {
    @EnvironmentObject var store: GameStore
    @State private var shown = 0
    @State private var restoring = false
    private let msg = "Wake up.\n\nThe world runs on code you can't read. Pipelines, hospitals, elections, gods.\nIn 2021 one leaked password shut down a fuel pipeline. In 2024 one bad update grounded flights worldwide.\n\nThree factions want you. Each will teach you to read the code, and to write it.\n\nFollow the white cursor."
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                Text("ROOT//ACCESS").font(.system(size: 34, weight: .heavy, design: .monospaced)).foregroundStyle(Color.matrix)
                Text(String(msg.prefix(shown)) + (shown < msg.count ? "█" : "")).foregroundStyle(Color.matrix)
                    .onTapGesture { shown = msg.count }
                if shown >= msg.count {
                    Text("Choose who you work for").font(.title2.bold())
                    ForEach(["logos", "sentinel", "meridian"], id: \.self) { k in
                        let f = FACTIONS[k]!
                        Button { store.s.faction = k; store.flash("Welcome to \(f.name)") } label: {
                            Panel {
                                Text(f.short).font(.caption).foregroundStyle(f.color)
                                Text(f.name).font(.headline).foregroundStyle(.white)
                                Text("“\(f.creed)”").foregroundStyle(.white)
                                Text(f.pitch).font(.footnote).foregroundStyle(Color.mut)
                                Text("Handler: \(f.handler)").font(.caption).foregroundStyle(Color.mut)
                            }.overlay(Rectangle().stroke(f.color.opacity(0.5)))
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

func importFile(_ r: Result<URL, Error>, _ store: GameStore) {
    guard case .success(let url) = r else { return }
    let ok = url.startAccessingSecurityScopedResource(); defer { if ok { url.stopAccessingSecurityScopedResource() } }
    if let t = try? String(contentsOf: url, encoding: .utf8) { store.restore(json: t, label: "file restore") }
}

// MARK: Missions
struct MissionBoard: View {
    @EnvironmentObject var store: GameStore
    @State private var lang = "python"
    var body: some View {
        let f = store.faction!
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                HUD()
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack { ForEach(LANGS, id: \.id) { l in
                        let tot = MISSIONS.filter { $0.lang == l.id }, d = tot.filter { store.s.done.contains($0.id) }.count
                        Button { lang = l.id } label: { Text("\(l.name) \(d)/\(tot.count)").padding(.horizontal, 10).padding(.vertical, 6)
                            .overlay(Rectangle().stroke(lang == l.id ? store.accent : Color.line)) }
                            .foregroundStyle(lang == l.id ? store.accent : .white)
                    } }
                }
                Panel {
                    Text("\(f.handler) // \(f.name)").font(.caption).foregroundStyle(Color.mut)
                    Text(LANGS.first { $0.id == lang }!.name).font(.title.bold())
                    Text(LANGS.first { $0.id == lang }!.why).foregroundStyle(Color.mut)
                }
                ForEach(MISSIONS.filter { $0.lang == lang }.sorted { $0.tier < $1.tier }) { m in
                    let ok = store.unlocked(m), done = store.s.done.contains(m.id)
                    NavigationLink { MissionScreen(m: m) } label: {
                        Panel {
                            HStack(alignment: .top) {
                                VStack(alignment: .leading, spacing: 4) {
                                    Text("TIER \(m.tier) // \(m.concept)").font(.caption2).foregroundStyle(Color.mut)
                                    Text(m.title).font(.headline).foregroundStyle(.white)
                                    Text(m.brief[store.s.faction!] ?? "").font(.footnote).foregroundStyle(Color.mut).multilineTextAlignment(.leading)
                                }
                                Spacer()
                                Text(done ? "✓ CLEARED" : ok ? "+\(m.xp) XP" : "LOCKED").font(.caption).foregroundStyle(done ? store.accent : Color.mut)
                            }
                        }
                    }.disabled(!ok).opacity(ok ? 1 : 0.4)
                }
            }.padding()
        }.navigationTitle("Missions").toolbarBackground(.black, for: .navigationBar)
    }
}

struct HUD: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        HStack {
            Text(store.faction?.short ?? "").foregroundStyle(store.accent)
            Text("LVL \(store.level)")
            ProgressView(value: store.progress).frame(maxWidth: 140)
            Text("\(store.s.xp) XP").foregroundStyle(store.accent)
        }.font(.caption)
    }
}

struct MissionScreen: View {
    @EnvironmentObject var store: GameStore
    let m: Mission
    @State private var code = ""
    @State private var output: [(Bool?, String)] = [(nil, "> awaiting input_")]
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Panel {
                    Text("\(LANGS.first { $0.id == m.lang }!.name.uppercased()) // TIER \(m.tier) // \(m.concept)").font(.caption).foregroundStyle(Color.mut)
                    Text(m.title).font(.largeTitle.bold())
                    Text("\(store.faction!.handler): ").foregroundStyle(store.accent).bold() + Text(m.brief[store.s.faction!] ?? "")
                }
                Panel {
                    Text("Training").font(.headline)
                    ForEach(Array(m.lesson.enumerated()), id: \.offset) { _, p in
                        if p.code {
                            ScrollView(.horizontal) { Text(p.text).font(.system(.footnote, design: .monospaced)).foregroundStyle(Color(hex: "#aef5c4")).padding(10) }
                                .background(Color.black).overlay(Rectangle().stroke(Color.line))
                        } else { Text(p.text) }
                    }
                    Text("Objective").font(.headline).padding(.top, 6)
                    Text(m.task)
                }
                Panel {
                    HStack { Text("Terminal").font(.headline); Spacer(); Text("pattern-verified").font(.caption).foregroundStyle(Color.mut) }
                    TextEditor(text: $code)
                        .font(.system(.footnote, design: .monospaced)).frame(minHeight: 220)
                        .scrollContentBackground(.hidden).background(Color.black).overlay(Rectangle().stroke(Color.line))
                        .autocorrectionDisabled().textInputAutocapitalization(.never)
                        .onChange(of: code) { _, v in store.s.code[m.id] = v }
                    HStack {
                        Button("Execute ▸", action: run).buttonStyle(.borderedProminent)
                        Button("Hint") { output = [(nil, "HINT // " + (m.checks.first { !$0.passes(code) }?.hint ?? "Structure looks right. Execute it."))] }
                        Button("Reset") { code = m.starter }
                    }
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(Array(output.enumerated()), id: \.offset) { _, l in
                            Text(l.1).font(.system(.caption, design: .monospaced))
                                .foregroundStyle(l.0 == nil ? Color.mut : l.0! ? store.accent : Color(hex: "#ff5d6c"))
                        }
                    }.frame(maxWidth: .infinity, alignment: .leading).padding(10).background(Color.black)
                }
            }.padding()
        }
        .onAppear { code = store.s.code[m.id] ?? m.starter }
        .navigationBarTitleDisplayMode(.inline)
    }
    func run() {
        var lines: [(Bool?, String)] = []; var pass = true
        for c in m.checks { let ok = c.passes(code); pass = pass && ok; lines.append((ok, (ok ? "[✓] " : "[✗] ") + c.hint)) }
        if pass { let first = store.complete(m)
            lines.append((true, first ? "ACCESS GRANTED. +\(m.xp) XP. Your pet absorbed the compiled code." : "ACCESS GRANTED. Already cleared. Nice run."))
        } else { lines.append((false, "ACCESS DENIED. Fix the red lines and run again.")) }
        output = lines
    }
}

// MARK: Intel
struct IntelScreen: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                Panel {
                    Text("Real incidents the missions are based on. \(store.faction!.lore)").foregroundStyle(Color.mut)
                    HStack { Text("Defect to:").foregroundStyle(Color.mut)
                        ForEach(["logos", "sentinel", "meridian"], id: \.self) { k in
                            Button(FACTIONS[k]!.short) { store.snapshot("Before defecting"); store.s.faction = k; store.flash("You now work for \(FACTIONS[k]!.name)") }
                                .disabled(k == store.s.faction).buttonStyle(.bordered)
                        } }
                }
                ForEach(INTEL, id: \.name) { i in
                    Panel { Text(String(i.year)).font(.caption).foregroundStyle(store.accent); Text(i.name).font(.headline); Text(i.note).foregroundStyle(Color.mut) }
                }
            }.padding()
        }.navigationTitle("Intel")
    }
}

// MARK: Backup
struct BackupScreen: View {
    @EnvironmentObject var store: GameStore
    @State private var exporting = false
    @State private var importing = false
    @State private var confirmWipe = false
    var body: some View {
        List {
            Section {
                Text("Your save autosaves to this device. Back it up to Files or iCloud Drive to move it between devices or into the web version. Both versions use the same JSON format.")
                    .font(.footnote).foregroundStyle(Color.mut)
                Button { exporting = true } label: { Label("Export to Files / iCloud Drive", systemImage: "square.and.arrow.down") }
                ShareLink(item: store.json, preview: SharePreview("ROOT//ACCESS backup")) { Label("Share backup", systemImage: "square.and.arrow.up") }
                Button { UIPasteboard.general.string = store.json; store.flash("Backup copied") } label: { Label("Copy backup JSON", systemImage: "doc.on.doc") }
            } header: { Text("Back up") }
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
