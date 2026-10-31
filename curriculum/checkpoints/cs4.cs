// @cp Scan default port is 443 | Scan with a named port | TryParsePort accepts 8443 | TryParsePort rejects 70000 and junk | Count returns an (up, down) tuple
Ra.Try("Scan default port is 443", () => { var m = Ra.Find("Scan"); var p = m.GetParameters(); Ra.Cp(p.Length == 2 && p[1].HasDefaultValue && Equals(p[1].DefaultValue, 443), "Scan default port is 443", "second parameter should default to 443"); });
Ra.Try("Scan with a named port", () => Ra.Cp(((string?)Ra.Call("Scan", "relay", 8443) ?? "").Contains("8443"), "Scan with a named port", ""));
Ra.Try("TryParsePort accepts 8443", () => { var a = new object?[] { "8443", 0 }; var ok = (bool)Ra.Find("TryParsePort").Invoke(null, a)!; Ra.Cp(ok && (int)a[1]! == 8443, "TryParsePort accepts 8443", $"returned {ok}, port {a[1]}"); });
Ra.Try("TryParsePort rejects 70000 and junk", () => { var m = Ra.Find("TryParsePort"); Ra.Cp(!(bool)m.Invoke(null, new object?[] { "70000", 0 })! && !(bool)m.Invoke(null, new object?[] { "http", 0 })!, "TryParsePort rejects 70000 and junk", ""); });
Ra.Try("Count returns an (up, down) tuple", () => { var r = Ra.Call("Count", (object)new[] { true, false, true }); Ra.Eq("Count returns an (up, down) tuple", r?.ToString(), "(2, 1)"); });
//@@USER@@
//@@PRELUDE@@
