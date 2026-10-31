// @cp counts reachable hosts | empty list | many hosts (race check)
package main

//@@USER@@
//@@PRELUDE@@
func main() {
	raTry("counts reachable hosts", func() { raEq("counts reachable hosts", sweep([]string{"a", "", "c"}), 2) })
	raTry("empty list", func() { raEq("empty list", sweep(nil), 0) })
	raTry("many hosts (race check)", func() {
		hs := make([]string, 500)
		for i := range hs { hs[i] = fmt.Sprint(i) }
		raEq("many hosts (race check)", sweep(hs), 500)
	})
}
