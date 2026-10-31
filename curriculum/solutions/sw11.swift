import Testing

enum ScanError: Error { case bad }

private func parsePort(_ s: String) throws -> Int {
    guard let p = Int(s), (1...65535).contains(p) else { throw ScanError.bad }
    return p
}

@Test func parsesValidPort() throws {
    #expect(try parsePort("443") == 443)
}

@Test("rejects garbage", arguments: ["", "abc", "70000"])
func rejects(_ input: String) {
    #expect(throws: ScanError.self) { try parsePort(input) }
}
