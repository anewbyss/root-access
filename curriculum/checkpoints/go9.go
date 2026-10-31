// @cp Filter ints | Filter strings | Sum ints | Sum floats | Sum custom ~int type
package main

//@@USER@@
//@@PRELUDE@@
type raPort int

func main() {
	raTry("Filter ints", func() { raEq("Filter ints", Filter([]int{1, 2, 3, 4}, func(x int) bool { return x%2 == 0 }), []int{2, 4}) })
	raTry("Filter strings", func() { raEq("Filter strings", len(Filter([]string{"a", "bb", "ccc"}, func(s string) bool { return len(s) > 1 })), 2) })
	raTry("Sum ints", func() { raEq("Sum ints", Sum([]int{1, 2, 3}), 6) })
	raTry("Sum floats", func() { raEq("Sum floats", Sum([]float64{1.5, 2.5}), 4.0) })
	raTry("Sum custom ~int type", func() { raEq("Sum custom ~int type", int(Sum([]raPort{80, 443})), 523) })
}
