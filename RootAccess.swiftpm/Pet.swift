import SwiftUI
import UIKit
import UniformTypeIdentifiers

@MainActor struct PetScreen: View {
    @EnvironmentObject var store: GameStore
    @Environment(\.accessibilityReduceMotion) private var systemReduceMotion
    @State private var tab = 0
    var body: some View {
        let lv = store.level, st = CUR.petStages[store.stageIndex], next = CUR.petStages.first { $0.lvl > lv }
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Panel {
                    PetCanvas(pet: store.s.pet, stage: store.stageIndex, animated: !store.reduceMotion(system: systemReduceMotion))
                        .frame(height: 300).frame(maxWidth: .infinity)
                        .background(RadialGradient(colors: [Color.hiBg, Color.codeBg], center: .center, startRadius: 0, endRadius: 200))
                    TextField("Name", text: $store.s.pet.name).textFieldStyle(.roundedBorder)
                    Button("Feed a commit") {
                        if store.s.pet.energy >= 100 { store.flash("\(store.s.pet.name) is full. Go clear a mission.") }
                        else { store.s.pet.energy = min(100, store.s.pet.energy + 5); store.s.pet.bond = min(100, store.s.pet.bond + 1); store.flash("\(store.s.pet.name) ate a commit") }
                    }.buttonStyle(.bordered)
                    HStack { Text("Energy").frame(width: 70, alignment: .leading); ProgressView(value: Double(store.s.pet.energy), total: 100) }
                    HStack { Text("Bond").frame(width: 70, alignment: .leading); ProgressView(value: Double(store.s.pet.bond), total: 100) }
                }
                Picker("Pet", selection: $tab) { Text("Look").tag(0); Text("Personality").tag(1) }.pickerStyle(.segmented)
                if tab == 0 {
                    Panel {
                        Text("FORM \(store.stageIndex + 1)/\(CUR.petStages.count)").font(.caption).foregroundStyle(Color.mut)
                        Text(st.name).font(.title.bold()); Text(st.desc)
                        Text(next.map { "Next evolution: \($0.name) at level \($0.lvl). Parts unlock with your level, fluent languages and faction." } ?? "Final form reached. It knows what you know.")
                            .font(.footnote).foregroundStyle(Color.mut)
                        HStack {
                            Button("Randomize") { randomize() }.buttonStyle(.bordered)
                            Button("Reset look") { let d = PetState(); for p in PetState.parts { store.s.pet[keyPath: p.path] = d[keyPath: p.path] } }.buttonStyle(.bordered)
                        }
                        ForEach(PetState.parts.indices, id: \.self) { i in picker(PetState.parts[i].key, PetState.parts[i].title, PetState.parts[i].path) }
                    }
                } else {
                    PersonaPanel()
                }
            }.padding()
        }.navigationTitle("Code Pet")
    }
    private func randomize() {
        for p in PetState.parts {
            let open = (CUR.petParts[p.key] ?? []).filter { store.lockReason($0) == nil }
            if let pick = open.randomElement() { store.s.pet[keyPath: p.path] = pick.id }
        }
        store.flash("\(store.s.pet.name) has a new look")
    }
    func picker(_ key: String, _ title: String, _ path: WritableKeyPath<PetState, String>) -> some View {
        VStack(alignment: .leading) {
            Text(title).font(.headline)
            ScrollView(.horizontal, showsIndicators: false) { HStack { ForEach(CUR.petParts[key] ?? [], id: \.id) { p in
                let lock = store.lockReason(p), on = store.s.pet[keyPath: path] == p.id
                Button { store.s.pet[keyPath: path] = p.id } label: {
                    HStack(spacing: 4) {
                        if let h = p.hex { Rectangle().fill(Color(hex: h)).frame(width: 10, height: 10) }
                        Text((on ? "✓ " : "") + p.label + (lock.map { " · \($0)" } ?? ""))
                    }.font(.caption).padding(8).overlay(Rectangle().stroke(on ? store.accent : Color.line))
                }.disabled(lock != nil).foregroundStyle(on ? store.accent : Color.ink).opacity(lock != nil ? 0.4 : 1)
                .accessibilityLabel(p.label + (lock.map { ", locked: \($0)" } ?? "") + (on ? ", selected" : ""))
            } } }
        }
    }
}

// MARK: - Personality
@MainActor struct PersonaPanel: View {
    @EnvironmentObject var store: GameStore
    @State private var exportingJSON = false
    @State private var exportingCard = false
    var body: some View {
        let save = store.exportable
        if let p = Engine.shared.persona(save) {
            Panel {
                Text("PERSONALITY // rootaccess-persona v1").font(.caption).foregroundStyle(store.accent)
                Text(p.archetype).font(.title2.bold())
                Text(p.summary).font(.callout)
                Text("Generated from how you play: bond, energy, languages started, real-engine verifications, hint use and the parts you picked. Drag a trait to override it; Auto lets it follow your progress again.")
                    .font(.caption).foregroundStyle(Color.mut)
                ForEach(p.traitScale.labels, id: \.id) { t in
                    let over = store.traitOverride(t.id)
                    VStack(alignment: .leading, spacing: 2) {
                        HStack {
                            Text("\(t.label): \(Int(p.traits[t.id] ?? 50))").font(.callout.bold())
                            if over != nil { Button("Auto") { store.setTrait(t.id, nil) }.font(.caption).buttonStyle(.bordered) } else { Text("auto").font(.caption2).foregroundStyle(Color.mut) }
                            Spacer()
                            Text("\(t.low) ↔ \(t.high)").font(.caption2).foregroundStyle(Color.mut)
                        }
                        Slider(value: Binding(get: { Double(over ?? Int(p.traits[t.id] ?? 50)) }, set: { store.setTrait(t.id, Int($0)) }), in: 0...100, step: 1)
                            .accessibilityLabel(t.label)
                    }
                }
            }
            Panel {
                Text("Voice").font(.headline)
                TextField("Archetype: \(p.archetype)", text: Binding(get: { store.personaText("archetype") }, set: { store.setPersonaText("archetype", $0) })).textFieldStyle(.roundedBorder)
                TextField("Greeting: \(p.voice.greeting)", text: Binding(get: { store.personaText("greeting") }, set: { store.setPersonaText("greeting", $0) })).textFieldStyle(.roundedBorder)
                TextField("Pronouns: it/its", text: Binding(get: { store.personaText("pronouns") }, set: { store.setPersonaText("pronouns", $0) })).textFieldStyle(.roundedBorder)
                Text("Tone: ").bold() + Text(p.voice.tone.joined(separator: ", "))
                Text("Sign-off: ").bold() + Text("“\(p.voice.signoff)”")
                ForEach(p.voice.catchphrases, id: \.self) { Text("• “\($0)”").font(.callout) }
                ForEach(p.voice.quirks, id: \.self) { Text("• \($0)").font(.callout).foregroundStyle(Color.mut) }
                HStack {
                    Button("Reroll") { store.rerollPersona(); store.flash("New personality mix") }.buttonStyle(.bordered)
                    Button("Reset to generated") { store.s.pet.persona = [:] }.buttonStyle(.bordered)
                }
            }
            Panel {
                Text("Take it with you").font(.headline)
                Text("The .persona.json file is an open format for assistants: personality, voice, knowledge, avatar and a ready system prompt, with empty capabilities, connectors and extensions that future programs can fill in. The card is the same as Markdown for chat tools.")
                    .font(.footnote).foregroundStyle(Color.mut)
                HStack {
                    Button("Export .persona.json") { exportingJSON = true }.buttonStyle(.borderedProminent)
                    Button("Export card") { exportingCard = true }.buttonStyle(.bordered)
                }
                HStack {
                    ShareLink(item: Engine.shared.personaJSON(save), preview: SharePreview("\(p.name) persona")) { Label("Share persona", systemImage: "square.and.arrow.up") }
                    Button { UIPasteboard.general.string = p.prompt.system; store.flash("System prompt copied") } label: { Label("Copy prompt", systemImage: "doc.on.doc") }
                }.buttonStyle(.bordered)
                DisclosureGroup("System prompt preview") { Text(p.prompt.system).font(.system(.caption, design: .monospaced)).textSelection(.enabled) }.tint(store.accent)
            }
            .fileExporter(isPresented: $exportingJSON, document: SourceFile(text: Engine.shared.personaJSON(save)), contentType: .json, defaultFilename: "\(slug(p.name)).persona.json") { r in
                if case .success = r { store.flash("Personality exported") }
            }
            .fileExporter(isPresented: $exportingCard, document: SourceFile(text: Engine.shared.personaCard(save)), contentType: .plainText, defaultFilename: "\(slug(p.name)).persona.md") { r in
                if case .success = r { store.flash("Card exported") }
            }
        } else {
            Panel { Text("Couldn't build a personality from this save.").foregroundStyle(Color.bad) }
        }
    }
    private func slug(_ s: String) -> String {
        let out = s.lowercased().map { $0.isLetter || $0.isNumber ? String($0) : "-" }.joined()
        return out.isEmpty ? "pet" : out
    }
}

// MARK: - Renderer for RA.petArt's display list (the web draws the same list as SVG)
struct PetCanvas: View {
    let pet: PetState; let stage: Int
    var animated = true
    var body: some View {
        let art = Engine.shared.petArt(pet, stage: stage)
        let glow = Color(hex: CUR.petParts["color"]?.first { $0.id == pet.color }?.hex ?? "#3dff7a")
        TimelineView(.animation(minimumInterval: nil, paused: !animated)) { tl in
            let t = animated ? tl.date.timeIntervalSinceReferenceDate : 0
            Canvas { ctx, size in
                let s = min(size.width, size.height) / 200
                ctx.translateBy(x: size.width / 2 - 100 * s, y: size.height / 2 - 100 * s); ctx.scaleBy(x: s, y: s)
                var spin = ctx; spin.translateBy(x: 100, y: 100); spin.rotate(by: .radians(t / 2)); spin.translateBy(x: -100, y: -100)
                for o in art where o.layer == "spin" { PetCanvas.draw(o, in: &spin) }
                for (i, o) in art.enumerated() where o.layer == "rain" {
                    var m = o; m.y = (t * 200 / (o.dur ?? 3) + Double(i * 37)).truncatingRemainder(dividingBy: 200)
                    PetCanvas.draw(m, in: &ctx)
                }
                var b = ctx
                b.translateBy(x: pet.aura == "glitch" && Int(t * 3) % 7 == 0 ? 3 : 0, y: sin(t * 2) * 5)
                b.addFilter(.shadow(color: glow, radius: 8))
                for o in art where o.layer == "back" || o.layer == "body" { PetCanvas.draw(o, in: &b) }
                if Int(t * 2) % 2 == 0 || !animated { for o in art where o.layer == "blink" { PetCanvas.draw(o, in: &b) } }
            }
        }
        .accessibilityLabel("\(pet.name), \(CUR.petStages[min(stage, CUR.petStages.count - 1)].name)")
    }

    static func draw(_ o: ArtItem, in ctx: inout GraphicsContext) {
        let op = o.op ?? 1
        if o.k == "text" {
            let size = o.s ?? 12
            ctx.draw(Text(o.t ?? "").font(.system(size: size, design: .monospaced)).foregroundStyle(Color(hex: o.fill ?? "#3dff7a").opacity(op)),
                     at: CGPoint(x: o.x ?? 0, y: (o.y ?? 0) - size * 0.35))
            return
        }
        var p = Path()
        switch o.k {
        case "ellipse":
            let rx = o.rx ?? 0, ry = o.ry ?? 0
            p = Path(ellipseIn: CGRect(x: (o.cx ?? 0) - rx, y: (o.cy ?? 0) - ry, width: rx * 2, height: ry * 2))
        case "rect":
            p = Path(roundedRect: CGRect(x: o.x ?? 0, y: o.y ?? 0, width: o.w2 ?? 0, height: o.h ?? 0), cornerRadius: o.r ?? 0)
        case "poly":
            for (i, pt) in (o.pts ?? []).enumerated() where pt.count == 2 {
                i == 0 ? p.move(to: CGPoint(x: pt[0], y: pt[1])) : p.addLine(to: CGPoint(x: pt[0], y: pt[1]))
            }
            p.closeSubpath()
        case "path":
            for seg in o.segs ?? [] {
                guard case .string(let cmd)? = seg.first else { continue }
                let n: [Double] = seg.dropFirst().compactMap { if case .number(let v) = $0 { return v }; return nil }
                switch cmd {
                case "M" where n.count >= 2: p.move(to: CGPoint(x: n[0], y: n[1]))
                case "L" where n.count >= 2: p.addLine(to: CGPoint(x: n[0], y: n[1]))
                case "Q" where n.count >= 4: p.addQuadCurve(to: CGPoint(x: n[2], y: n[3]), control: CGPoint(x: n[0], y: n[1]))
                case "Z": p.closeSubpath()
                default: break
                }
            }
        default: return
        }
        if let f = o.fill { ctx.fill(p, with: .color(Color(hex: f).opacity((o.fo ?? 1) * op))) }
        if let st = o.stroke { ctx.stroke(p, with: .color(Color(hex: st).opacity(op)), style: StrokeStyle(lineWidth: o.w ?? 1, lineCap: .round, lineJoin: .round)) }
    }
}
