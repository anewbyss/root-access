// @cp score 95 | score 90 | score 60 | score 59 | score 30 | score 0 | validPin accepts 6 digits | validPin rejects bad input
//@@USER@@
//@@PRELUDE@@
for (s, w) in [(95, "CRITICAL"), (90, "CRITICAL"), (60, "HIGH"), (59, "MEDIUM"), (30, "MEDIUM"), (0, "LOW")] {
    raEq("score \(s)", threatLevel(s), w)
}
raCp(validPin("123456"), "validPin accepts 6 digits")
raCp(!validPin("12345") && !validPin("12a456") && !validPin(""), "validPin rejects bad input")
