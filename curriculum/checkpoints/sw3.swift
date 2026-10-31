// @cp finds a known name | falls back to default | unknown with no default
//@@USER@@
//@@PRELUDE@@
raEq("finds a known name", lookup("relay", in: ["relay": "10.0.0.4", "default": "0.0.0.0"]), "10.0.0.4")
raEq("falls back to default", lookup("ghost", in: ["relay": "10.0.0.4", "default": "0.0.0.0"]), "0.0.0.0")
let raR = lookup("ghost", in: ["relay": "10.0.0.4"])
raCp(!raR.isEmpty && raR != "10.0.0.4", "unknown with no default", "got \(raR)")
