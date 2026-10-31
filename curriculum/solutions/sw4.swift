func tally(_ ips: [String]) -> [String: Int] {
    var counts: [String: Int] = [:]
    for ip in ips { counts[ip, default: 0] += 1 }
    return counts
}

func loud(_ ports: [Int]) -> [Int] {
    ports.filter { $0 > 1024 }.map { $0 * 10 }
}
