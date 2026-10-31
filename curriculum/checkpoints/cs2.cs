// @cp score 95 | score 90 | score 60 | score 59 | score 30 | score 0
foreach (var (__s, __w) in new[] { (95, "CRITICAL"), (90, "CRITICAL"), (60, "HIGH"), (59, "MEDIUM"), (30, "MEDIUM"), (0, "LOW") })
    Ra.Try($"score {__s}", () => Ra.Eq($"score {__s}", (string?)Ra.Call("ThreatLevel", __s), __w));
//@@USER@@
//@@PRELUDE@@
