// @cp Keyword satisfies Detector | Detect matches substrings | countHits
package main

//@@USER@@
//@@PRELUDE@@
func main() {
	var d Detector = Keyword{Word: "jndi"}
	raCp(d != nil, "Keyword satisfies Detector", "")
	raTry("Detect matches substrings", func() {
		raCp(d.Detect("x ${jndi:ldap} y") && !d.Detect("hello"), "Detect matches substrings", "")
	})
	raTry("countHits", func() {
		raEq("countHits", countHits(d, []string{"jndi a", "b", "c jndi", ""}), 2)
	})
}
