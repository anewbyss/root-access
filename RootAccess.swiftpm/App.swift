import SwiftUI

@main struct RootAccessApp: App {
    @StateObject private var store = GameStore()
    var body: some Scene {
        WindowGroup {
            RootView().environmentObject(store).preferredColorScheme(.dark).tint(store.accent)
        }
    }
}

struct RootView: View {
    @EnvironmentObject var store: GameStore
    var body: some View {
        ZStack(alignment: .bottom) {
            Color.bgDeep.ignoresSafeArea()
            CodeRain(color: store.accent).opacity(0.18).ignoresSafeArea().allowsHitTesting(false)
            if store.s.faction == nil { IntroView() } else {
                TabView {
                    NavigationStack { MissionBoard() }.tabItem { Label("Missions", systemImage: "terminal") }
                    NavigationStack { PetScreen() }.tabItem { Label("Code Pet", systemImage: "cpu") }
                    NavigationStack { IntelScreen() }.tabItem { Label("Intel", systemImage: "doc.text.magnifyingglass") }
                    NavigationStack { BackupScreen() }.tabItem { Label("Backup", systemImage: "externaldrive.badge.icloud") }
                }
            }
            if let t = store.toast {
                Text(t).font(.system(.callout, design: .monospaced)).padding(12)
                    .background(.black.opacity(0.9)).overlay(Rectangle().stroke(store.accent)).foregroundStyle(store.accent)
                    .padding(.bottom, 70).transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .animation(.easeOut, value: store.toast)
        .fontDesign(.monospaced)
    }
}

struct CodeRain: View {
    let color: Color
    private let glyphs = Array("アイウエオカキクケコ01{}<>/=;$#λ")
    var body: some View {
        TimelineView(.animation(minimumInterval: 0.08)) { tl in
            Canvas { ctx, size in
                let t = tl.date.timeIntervalSinceReferenceDate
                let cols = Int(size.width / 16)
                for c in 0..<max(cols, 1) {
                    let speed = 40.0 + Double((c * 37) % 60)
                    let head = (t * speed + Double(c * 97)).truncatingRemainder(dividingBy: Double(size.height) + 200)
                    for k in 0..<12 {
                        let y = head - Double(k * 16)
                        let g = glyphs[(c * 7 + k + Int(t * 4)) % glyphs.count]
                        ctx.draw(Text(String(g)).font(.system(size: 13, design: .monospaced)).foregroundStyle(color.opacity(1 - Double(k) / 12)),
                                 at: CGPoint(x: Double(c * 16), y: y))
                    }
                }
            }
        }
    }
}

struct Panel<C: View>: View {
    @ViewBuilder var content: C
    var body: some View {
        VStack(alignment: .leading, spacing: 10) { content }
            .frame(maxWidth: .infinity, alignment: .leading).padding(16)
            .background(Color.panel.opacity(0.9)).overlay(Rectangle().stroke(Color.line))
    }
}
