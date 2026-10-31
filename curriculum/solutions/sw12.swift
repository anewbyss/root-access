import SwiftUI

@Observable final class Monitor {
    var alerts: [String] = []
    func refresh() async {
        try? await Task.sleep(for: .milliseconds(200))
        alerts.append("ping \(Date.now.formatted(date: .omitted, time: .standard))")
    }
}

struct ConsoleView: View {
    @State private var monitor = Monitor()
    @State private var filter = ""

    var body: some View {
        NavigationStack {
            List(monitor.alerts.filter { filter.isEmpty || $0.contains(filter) }, id: \.self) { alert in
                Text(alert).font(.system(.body, design: .monospaced))
            }
            .searchable(text: $filter)
            .toolbar {
                Button("Refresh") {
                    Task { await monitor.refresh() }
                }
            }
            .navigationTitle("Console")
        }
    }
}
