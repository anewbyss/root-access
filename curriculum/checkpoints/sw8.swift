// @cp login mentions the user | breach mentions severity | high severity uses the where case | logout | Faction is CaseIterable with raw values
//@@USER@@
//@@PRELUDE@@
let raA = describe(.login(user: "neo"))
raCp(raA.contains("neo"), "login mentions the user", raA)
let raB = describe(.breach(severity: 3))
raCp(raB.contains("3"), "breach mentions severity", raB)
let raC = describe(.breach(severity: 10))
let raD = describe(.breach(severity: 1))
raCp(raC.filter { !$0.isNumber } != raD.filter { !$0.isNumber }, "high severity uses the where case", "severity 10: \(raC) / severity 1: \(raD)")
raCp(!describe(.logout).isEmpty, "logout")
raCp(Faction.allCases.count >= 2 && !Faction.allCases[0].rawValue.isEmpty, "Faction is CaseIterable with raw values")
