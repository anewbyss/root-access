struct Node {
    var name: String
    var strength = 0
    var isHot: Bool { strength > 80 }
    mutating func boost(_ by: Int) { strength += by }
}

final class Session {
    let id: String
    init(id: String) { self.id = id }
}
