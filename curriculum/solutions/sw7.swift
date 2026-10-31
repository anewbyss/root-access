enum ScanError: Error {
    case empty
    case badPort(String)
}

func parsePort(_ s: String) throws -> Int {
    guard !s.isEmpty else { throw ScanError.empty }
    guard let p = Int(s), (1...65535).contains(p) else { throw ScanError.badPort(s) }
    return p
}

do {
    let p = try parsePort("443")
    print(p)
} catch {
    print("failed: \(error)")
}
