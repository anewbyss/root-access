// @cp FailIps | FailIps ignores OK lines | ByIp counts per IP
var __logs = new List<string> { "10.0.0.9 FAIL", "10.0.0.4 OK", "10.0.0.9 FAIL", "10.0.0.2 FAIL" };
Ra.Try("FailIps", () => Ra.Eq("FailIps", string.Join(",", ((IEnumerable<string>)Ra.Call("FailIps", __logs)!)), "10.0.0.9,10.0.0.9,10.0.0.2"));
Ra.Try("FailIps ignores OK lines", () => Ra.Eq("FailIps ignores OK lines", ((IEnumerable<string>)Ra.Call("FailIps", new List<string> { "1.1.1.1 OK" })!).Count(), 0));
Ra.Try("ByIp counts per IP", () => { var d = (IDictionary<string, int>)Ra.Call("ByIp", __logs)!; Ra.Cp(d["10.0.0.9"] == 2 && d["10.0.0.4"] == 1, "ByIp counts per IP", string.Join(",", d)); });
//@@USER@@
//@@PRELUDE@@
