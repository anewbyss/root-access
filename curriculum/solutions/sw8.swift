enum Event {
    case login(user: String)
    case breach(severity: Int)
    case logout
}

func describe(_ e: Event) -> String {
    switch e {
    case .login(let user): return "login \(user)"
    case .breach(let s) where s >= 8: return "CRITICAL breach"
    case .breach(let s): return "breach \(s)"
    case .logout: return "logout"
    }
}

enum Faction: String, CaseIterable { case logos, sentinel, meridian }
