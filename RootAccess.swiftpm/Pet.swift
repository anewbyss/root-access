import SwiftUI

@MainActor struct PetScreen: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        let lv = store.level, st = CUR.petStages[store.stageIndex], next = CUR.petStages.first { $0.lvl > lv }
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Panel {
                    PetCanvas(pet: store.s.pet, stage: store.stageIndex).frame(height: 300).frame(maxWidth: .infinity)
                        .background(RadialGradient(colors: [Color(hex: "#0b2a1a"), .black], center: .center, startRadius: 0, endRadius: 200))
                    TextField("Name", text: $store.s.pet.name).textFieldStyle(.roundedBorder)
                    Button("Feed a commit") {
                        if store.s.pet.energy >= 100 { store.flash("\(store.s.pet.name) is full. Go clear a mission.") }
                        else { store.s.pet.energy = min(100, store.s.pet.energy + 5); store.s.pet.bond = min(100, store.s.pet.bond + 1); store.flash("\(store.s.pet.name) ate a commit") }
                    }.buttonStyle(.bordered)
                    HStack { Text("Energy").frame(width: 70, alignment: .leading); ProgressView(value: Double(store.s.pet.energy), total: 100) }
                    HStack { Text("Bond").frame(width: 70, alignment: .leading); ProgressView(value: Double(store.s.pet.bond), total: 100) }
                }
                Panel {
                    Text("FORM \(store.stageIndex + 1)/\(CUR.petStages.count)").font(.caption).foregroundStyle(Color.mut)
                    Text(st.name).font(.title.bold()); Text(st.desc)
                    Text(next.map { "Next evolution: \($0.name) at level \($0.lvl). Your pet only evolves as far as your skills do." } ?? "Final form reached. It knows what you know.")
                        .font(.footnote).foregroundStyle(Color.mut)
                    picker("color", "Core color", \.color); picker("eyes", "Optics", \.eyes)
                    picker("crown", "Crown", \.crown); picker("aura", "Aura", \.aura)
                }
            }.padding()
        }.navigationTitle("Code Pet")
    }
    func picker(_ key: String, _ title: String, _ path: WritableKeyPath<PetState, String>) -> some View {
        VStack(alignment: .leading) {
            Text(title).font(.headline)
            ScrollView(.horizontal, showsIndicators: false) { HStack { ForEach(CUR.petParts[key] ?? [], id: \.id) { p in
                let locked = store.level < p.lvl, on = store.s.pet[keyPath: path] == p.id
                Button { store.s.pet[keyPath: path] = p.id } label: {
                    Text(locked ? "\(p.label) · LVL \(p.lvl)" : p.label).font(.caption).padding(8)
                        .overlay(Rectangle().stroke(on ? store.accent : Color.line))
                }.disabled(locked).foregroundStyle(on ? store.accent : .white).opacity(locked ? 0.4 : 1)
            } } }
        }
    }
}

struct PetCanvas: View {
    let pet: PetState; let stage: Int
    var body: some View {
        let col = Color(hex: CUR.petParts["color"]?.first { $0.id == pet.color }?.hex ?? "#3dff7a")
        TimelineView(.animation) { tl in
            let t = tl.date.timeIntervalSinceReferenceDate
            Canvas { ctx, size in
                let s = min(size.width, size.height) / 200
                ctx.translateBy(x: size.width / 2 - 100 * s, y: size.height / 2 - 100 * s); ctx.scaleBy(x: s, y: s)
                if pet.aura == "rings" {
                    var g = ctx; g.translateBy(x: 100, y: 100); g.rotate(by: .radians(t / 2))
                    g.stroke(Path(ellipseIn: CGRect(x: -90, y: -30, width: 180, height: 60)), with: .color(col.opacity(0.4)))
                }
                if pet.aura == "rain" { for i in 0..<9 { let y = (t * Double(40 + i * 9)).truncatingRemainder(dividingBy: 200)
                    ctx.draw(Text(i % 2 == 0 ? "0" : "1").font(.system(size: 11, design: .monospaced)).foregroundStyle(col.opacity(0.5)), at: CGPoint(x: 20 + i * 20, y: Int(y))) } }
                var b = ctx
                b.translateBy(x: pet.aura == "glitch" && Int(t * 3) % 7 == 0 ? 3 : 0, y: sin(t * 2) * 5)
                b.addFilter(.shadow(color: col, radius: 8))
                let r = 34.0 + Double(min(stage, 4)) * 8, cy = 112.0, line = StrokeStyle(lineWidth: 3)
                switch stage {
                case 0:
                    b.stroke(Path(roundedRect: CGRect(x: 100 - r, y: cy - r, width: r * 2, height: r * 2), cornerRadius: 6), with: .color(col), style: line)
                    if Int(t * 2) % 2 == 0 { b.fill(Path(CGRect(x: 92, y: 96, width: 16, height: 26)), with: .color(col)) }
                case 1:
                    let p = Path(ellipseIn: CGRect(x: 100 - r, y: cy - r * 0.85, width: r * 2, height: r * 1.7))
                    b.fill(p, with: .color(col.opacity(0.13))); b.stroke(p, with: .color(col), style: line)
                case 2:
                    var p = Path(); p.move(to: CGPoint(x: 100 - r, y: 130)); p.addQuadCurve(to: CGPoint(x: 100 + r, y: 130), control: CGPoint(x: 100, y: 52))
                    p.addQuadCurve(to: CGPoint(x: 100 - r, y: 130), control: CGPoint(x: 100, y: 150 + r * 0.4))
                    b.fill(p, with: .color(col.opacity(0.13))); b.stroke(p, with: .color(col), style: line)
                default:
                    let hex = { (rr: Double, off: Double) -> Path in var p = Path()
                        for i in 0..<6 { let a = Double.pi / 3 * Double(i) + off; let pt = CGPoint(x: 100 + cos(a) * rr, y: cy + sin(a) * rr)
                            i == 0 ? p.move(to: pt) : p.addLine(to: pt) }; p.closeSubpath(); return p }
                    b.fill(hex(r, -.pi / 2), with: .color(col.opacity(0.13))); b.stroke(hex(r, -.pi / 2), with: .color(col), style: line)
                    if stage == 4 { b.stroke(hex(r * 0.6, 0), with: .color(col), lineWidth: 1.5) }
                }
                if stage > 0 {
                    let ey = 106.0
                    switch pet.eyes {
                    case "visor": b.fill(Path(roundedRect: CGRect(x: 74, y: ey - 6, width: 52, height: 12), cornerRadius: 6), with: .color(col))
                    case "cyclops": b.stroke(Path(ellipseIn: CGRect(x: 89, y: ey - 11, width: 22, height: 22)), with: .color(col), style: line)
                        b.fill(Path(ellipseIn: CGRect(x: 96, y: ey - 4, width: 8, height: 8)), with: .color(col))
                    case "glyph": b.draw(Text("</>").font(.system(size: 18, design: .monospaced)).foregroundStyle(col), at: CGPoint(x: 100, y: ey))
                    case "trinary": for (x, y) in [(82.0, ey), (100.0, ey - 8), (118.0, ey)] { b.fill(Path(ellipseIn: CGRect(x: x - 4, y: y - 4, width: 8, height: 8)), with: .color(col)) }
                    default: for x in [86.0, 114.0] { b.fill(Path(ellipseIn: CGRect(x: x - 5, y: ey - 5, width: 10, height: 10)), with: .color(col)) }
                    }
                }
                let top = cy - r
                switch pet.crown {
                case "antenna": var p = Path(); p.move(to: CGPoint(x: 100, y: top)); p.addLine(to: CGPoint(x: 100, y: top - 22))
                    b.stroke(p, with: .color(col), lineWidth: 2); b.fill(Path(ellipseIn: CGRect(x: 96, y: top - 28, width: 8, height: 8)), with: .color(col))
                case "horns": var p = Path()
                    p.move(to: CGPoint(x: 80, y: top + 8)); p.addLine(to: CGPoint(x: 70, y: top - 14)); p.addLine(to: CGPoint(x: 88, y: top))
                    p.move(to: CGPoint(x: 120, y: top + 8)); p.addLine(to: CGPoint(x: 130, y: top - 14)); p.addLine(to: CGPoint(x: 112, y: top))
                    b.fill(p, with: .color(col))
                case "halo": b.stroke(Path(ellipseIn: CGRect(x: 74, y: top - 20, width: 52, height: 12)), with: .color(col), style: line)
                case "crown": var p = Path(); let pts: [(Double, Double)] = [(74, -2), (80, -24), (90, -12), (100, -30), (110, -12), (120, -24), (126, -2)]
                    p.move(to: CGPoint(x: pts[0].0, y: top + pts[0].1)); pts.dropFirst().forEach { p.addLine(to: CGPoint(x: $0.0, y: top + $0.1)) }; p.closeSubpath()
                    b.fill(p, with: .color(col))
                default: break
                }
            }
        }
        .accessibilityLabel("\(pet.name), \(CUR.petStages[stage].name)")
    }
}
