// @cp tally counts | tally empty | uniqueSorted | uniqueSorted empty
package main

//@@USER@@
//@@PRELUDE@@
func main() {
	ips := []string{"10.0.0.9", "10.0.0.4", "10.0.0.9", "10.0.0.2"}
	raTry("tally counts", func() {
		t := tally(ips)
		raCp(t["10.0.0.9"] == 2 && t["10.0.0.4"] == 1 && len(t) == 3, "tally counts", fmt.Sprintf("got %v", t))
	})
	raTry("tally empty", func() { raEq("tally empty", len(tally(nil)), 0) })
	raTry("uniqueSorted", func() { raEq("uniqueSorted", uniqueSorted(ips), []string{"10.0.0.2", "10.0.0.4", "10.0.0.9"}) })
	raTry("uniqueSorted empty", func() { raEq("uniqueSorted empty", len(uniqueSorted([]string{})), 0) })
}
