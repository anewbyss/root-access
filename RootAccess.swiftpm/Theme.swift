import SwiftUI
import UIKit

// MARK: - Adaptive palette (dark terminal / light paper, and iOS "Increase Contrast")
// Same tokens as web/style.css. Kept out of Models.swift so the macOS engine smoke test never needs UIKit.
extension Color {
    private static func adaptive(_ dark: String, _ light: String, highContrast: String? = nil) -> Color {
        Color(UIColor { t in
            if t.accessibilityContrast == .high, let hc = highContrast { return UIColor(Color(hex: hc)) }
            return UIColor(Color(hex: t.userInterfaceStyle == .light ? light : dark))
        })
    }
    static let bgDeep = adaptive("#030806", "#f3f6f1")
    static let panel = adaptive("#06120c", "#ffffff")
    static let line = Color(UIColor { t in
        if t.accessibilityContrast == .high { return t.userInterfaceStyle == .light ? .black : .white }
        return UIColor(Color(hex: t.userInterfaceStyle == .light ? "#a9bfae" : "#1d4a36"))
    })
    static let mut = Color(UIColor { t in
        if t.accessibilityContrast == .high { return t.userInterfaceStyle == .light ? .black : .white }
        return UIColor(Color(hex: t.userInterfaceStyle == .light ? "#4a6352" : "#7fab90"))
    })
    static let ink = adaptive("#eafff0", "#06140c")
    static let bad = adaptive("#ff6b78", "#b3122a")
    static let codeBg = adaptive("#000000", "#eaf0ea")
    static let codeText = adaptive("#aef5c4", "#0d3a20")
    static let hiBg = adaptive("#0b2a1a", "#d6ecdc")
    static let ciTag = adaptive("#ffd84d", "#7a5a00")

    /// Accent for text, strokes and tint: the raw (bright) accent on dark, darkened on light so it stays readable.
    static func accentInk(_ hex: String) -> Color {
        Color(UIColor { t in
            let c = UIColor(Color(hex: hex))
            guard t.userInterfaceStyle == .light else { return c }
            var r: CGFloat = 0, g: CGFloat = 0, b: CGFloat = 0, a: CGFloat = 0
            c.getRed(&r, green: &g, blue: &b, alpha: &a)
            return UIColor(red: r * 0.48, green: g * 0.48, blue: b * 0.48, alpha: a)
        })
    }
}

extension GameStore {
    var accent: Color { Color.accentInk(accentHex) }
    var colorScheme: ColorScheme? { s.prefs.scheme == "light" ? .light : s.prefs.scheme == "dark" ? .dark : nil }
    var fontDesign: Font.Design { s.prefs.font == "sans" ? .default : s.prefs.font == "serif" ? .serif : .monospaced }
    var editorFont: Font { .system(size: CGFloat(min(max(s.prefs.editorSize, 10), 28)), design: .monospaced) }
    /// Interface size: 100% follows the system Dynamic Type setting; anything else pins a size.
    var typeSize: DynamicTypeSize? {
        switch s.prefs.scale {
        case ..<88: return .small
        case 88..<98: return .medium
        case 98...102: return nil
        case 103..<113: return .xLarge
        case 113..<123: return .xxLarge
        case 123..<135: return .xxxLarge
        default: return .accessibility1
        }
    }
    func reduceMotion(system: Bool) -> Bool { s.prefs.motion == "reduce" || (s.prefs.motion != "full" && system) }
}

/// Applies Display settings to the whole app.
struct DisplayPrefs: ViewModifier {
    @ObservedObject var store: GameStore
    func body(content: Content) -> some View {
        let sized = Group {
            if let t = store.typeSize { content.dynamicTypeSize(t) } else { content }
        }
        return sized.preferredColorScheme(store.colorScheme).tint(store.accent).fontDesign(store.fontDesign)
    }
}
