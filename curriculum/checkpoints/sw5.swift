// @cp scan uses the default port | scan with an explicit port | retry stops on success | retry gives up | onAlert stores handlers
//@@USER@@
//@@PRELUDE@@
raCp(scan(host: "relay").contains("443"), "scan uses the default port", scan(host: "relay"))
raCp(scan(host: "relay", port: 22).contains("22"), "scan with an explicit port", scan(host: "relay", port: 22))
var raCalls = 0
let raOk = retry(times: 5) { raCalls += 1; return raCalls == 2 }
raCp(raOk && raCalls == 2, "retry stops on success", "returned \(raOk) after \(raCalls) calls")
raCalls = 0
let raNo = retry(times: 3) { raCalls += 1; return false }
raCp(!raNo && raCalls == 3, "retry gives up", "returned \(raNo) after \(raCalls) calls")
let raBefore = handlers.count
var raFired = false
onAlert { raFired = true }
handlers.last?()
raCp(handlers.count == raBefore + 1 && raFired, "onAlert stores handlers", "handlers.count \(handlers.count)")
