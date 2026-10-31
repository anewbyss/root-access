var handlers: [() -> Void] = []

func scan(host: String, port: Int = 443) -> String {
    "\(host):\(port)"
}

func retry(times: Int, _ op: () -> Bool) -> Bool {
    for _ in 0..<times where op() { return true }
    return false
}

let ok = retry(times: 3) { Bool.random() }

func onAlert(_ h: @escaping () -> Void) {
    handlers.append(h)
}
