func ping(_ host: String) async -> Bool {
    try? await Task.sleep(for: .milliseconds(10))
    return !host.isEmpty
}

actor Ledger {
    private var hits = 0
    func record() { hits += 1 }
    func total() -> Int { hits }
}

func sweep(_ hosts: [String]) async -> Int {
    await withTaskGroup(of: Bool.self) { group in
        for h in hosts { group.addTask { await ping(h) } }
        var up = 0
        for await ok in group where ok { up += 1 }
        return up
    }
}
