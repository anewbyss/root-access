func threatLevel(_ score: Int) -> String {
    switch score {
    case 90...: return "CRITICAL"
    case 60..<90: return "HIGH"
    case 30..<60: return "MEDIUM"
    default: return "LOW"
    }
}

func validPin(_ pin: String) -> Bool {
    guard pin.count == 6, pin.allSatisfy(\.isNumber) else { return false }
    return true
}
