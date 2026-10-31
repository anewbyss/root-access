// @cp score 95 | score 90 | score 60 | score 59 | score 30 | score 0
package main

//@@USER@@
//@@PRELUDE@@
func main() {
	cases := []struct {
		s int
		w string
	}{{95, "CRITICAL"}, {90, "CRITICAL"}, {60, "HIGH"}, {59, "MEDIUM"}, {30, "MEDIUM"}, {0, "LOW"}}
	for _, c := range cases {
		l := fmt.Sprintf("score %d", c.s)
		raTry(l, func() { raEq(l, threatLevel(c.s), c.w) })
	}
}
