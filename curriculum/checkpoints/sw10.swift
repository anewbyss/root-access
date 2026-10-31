// @cp ping returns a Bool | Ledger records hits | sweep counts reachable hosts
// @ci-only Needs Swift 5.5+ concurrency (async/await, actors, task groups). Judge0 has Swift 5.2, so this runs on Swift 6 in GitHub Actions.
//@@USER@@
//@@PRELUDE@@
let raP = await ping("north")
raCp(raP == true, "ping returns a Bool", "ping(\"north\") = \(raP)")
let raL = Ledger()
await raL.record(); await raL.record()
raEq("Ledger records hits", await raL.total(), 2)
raEq("sweep counts reachable hosts", await sweep(["a", "", "c"]), 2)
