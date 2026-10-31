// @cp Boost mutates through the pointer | Label reads fields | Relay embeds Node
package main

import "strings"

//@@USER@@
//@@PRELUDE@@
func main() {
	raTry("Boost mutates through the pointer", func() {
		n := Node{Name: "north", Strength: 10}
		r := n.Boost(5)
		raCp(r == 15 && n.Strength == 15, "Boost mutates through the pointer", fmt.Sprintf("returned %d, Strength now %d", r, n.Strength))
	})
	raTry("Label reads fields", func() {
		l := Node{Name: "harbor", Strength: 3}.Label()
		raCp(strings.Contains(l, "harbor"), "Label reads fields", "label was "+l)
	})
	raTry("Relay embeds Node", func() {
		r := Relay{Node: Node{Name: "hill", Strength: 1}, Hops: 2}
		r.Boost(1)
		raCp(r.Name == "hill" && r.Strength == 2 && r.Hops == 2, "Relay embeds Node", fmt.Sprintf("%+v", r))
	})
}
