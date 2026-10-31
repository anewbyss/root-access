// @cp tally counts repeats | tally empty | loud filters then maps
//@@USER@@
//@@PRELUDE@@
let raT = tally(["10.0.0.9", "10.0.0.4", "10.0.0.9"])
raCp(raT["10.0.0.9"] == 2 && raT["10.0.0.4"] == 1 && raT.count == 2, "tally counts repeats", "\(raT)")
raEq("tally empty", tally([]).count, 0)
raEq("loud filters then maps", loud([22, 8080, 443, 3000]), [80800, 30000])
