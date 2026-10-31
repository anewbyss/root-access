protocol Detector {
    func detect(_ line: String) -> Bool
}

extension Detector {
    func count(in lines: [String]) -> Int { lines.filter(detect).count }
}

struct Keyword: Detector {
    let word: String
    func detect(_ line: String) -> Bool { line.contains(word) }
}

func strongest<T: Comparable>(_ xs: [T]) -> T? { xs.max() }
