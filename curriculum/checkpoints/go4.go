// @cp counter counts up | counters are independent | minMax | minMax single value
package main

//@@USER@@
//@@PRELUDE@@
func main() {
	raTry("counter counts up", func() {
		c := makeCounter(10)
		a, b := c(), c()
		raCp(b == a+1 && (a == 10 || a == 11), "counter counts up", fmt.Sprintf("calls returned %d, %d", a, b))
	})
	raTry("counters are independent", func() {
		c1, c2 := makeCounter(0), makeCounter(0)
		c1(); c1()
		x, y := c1(), c2()
		raCp(x != y, "counters are independent", "two counters share state")
	})
	raTry("minMax", func() { lo, hi := minMax(4, -2, 9, 3); raEq("minMax", [2]int{lo, hi}, [2]int{-2, 9}) })
	raTry("minMax single value", func() { lo, hi := minMax(7); raEq("minMax single value", [2]int{lo, hi}, [2]int{7, 7}) })
}
