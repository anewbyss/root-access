// @cp parses a valid port | empty string throws empty | garbage throws badPort
//@@USER@@
//@@PRELUDE@@
raEq("parses a valid port", (try? parsePort("443")) ?? -1, 443)
do { _ = try parsePort(""); raCp(false, "empty string throws empty", "no error thrown") }
catch ScanError.empty { raCp(true, "empty string throws empty") }
catch { raCp(false, "empty string throws empty", "threw \(error)") }
do { _ = try parsePort("http"); raCp(false, "garbage throws badPort", "no error thrown") }
catch ScanError.badPort(_) { raCp(true, "garbage throws badPort") }
catch { raCp(false, "garbage throws badPort", "threw \(error)") }
