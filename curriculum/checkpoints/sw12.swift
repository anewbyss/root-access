// @cp ConsoleView builds | body renders
// @ci-only SwiftUI and @Observable need Apple's SDK (macOS 14+). Runs in GitHub Actions on a macOS runner.
import SwiftUI
//@@USER@@
//@@PRELUDE@@
let raView = ConsoleView()
raCp(true, "ConsoleView builds")
let raBody = raView.body
raCp(String(describing: type(of: raBody)).count > 0, "body renders")
