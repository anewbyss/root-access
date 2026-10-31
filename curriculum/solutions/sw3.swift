func lookup(_ name: String, in db: [String: String]) -> String {
    guard let ip = db[name] else { return db["default"] ?? "unknown" }
    return ip
}
