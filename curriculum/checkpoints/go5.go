// @cp shift 3 | wraps z to c | keeps case and punctuation | round trip
package main

//@@USER@@
//@@PRELUDE@@
func main() {
	raTry("shift 3", func() { raEq("shift 3", caesar("abc", 3), "def") })
	raTry("wraps z to c", func() { raEq("wraps z to c", caesar("xyz", 3), "abc") })
	raTry("keeps case and punctuation", func() { raEq("keeps case and punctuation", caesar("Hello, World!", 1), "Ifmmp, Xpsme!") })
	raTry("round trip", func() { raEq("round trip", caesar(caesar("Matrix", 7), 19), "Matrix") })
}
