// @cp shift 3 | wraps z to c | keeps case and punctuation | round trip
Ra.Try("shift 3", () => Ra.Eq("shift 3", (string?)Ra.Call("Caesar", "abc", 3), "def"));
Ra.Try("wraps z to c", () => Ra.Eq("wraps z to c", (string?)Ra.Call("Caesar", "xyz", 3), "abc"));
Ra.Try("keeps case and punctuation", () => Ra.Eq("keeps case and punctuation", (string?)Ra.Call("Caesar", "Hello, World!", 1), "Ifmmp, Xpsme!"));
Ra.Try("round trip", () => Ra.Eq("round trip", (string?)Ra.Call("Caesar", (string?)Ra.Call("Caesar", "Matrix", 7), -7), "Matrix"));
//@@USER@@
//@@PRELUDE@@
