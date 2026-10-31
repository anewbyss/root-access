// @cp Keyword detects | count(in:) default implementation | strongest of ints | strongest of empty
//@@USER@@
//@@PRELUDE@@
let raK = Keyword(word: "jndi")
raCp(raK.detect("${jndi:x}") && !raK.detect("hello"), "Keyword detects")
raEq("count(in:) default implementation", raK.count(in: ["jndi a", "b", "c jndi"]), 2)
raEq("strongest of ints", strongest([3, 9, 2]), 9)
raCp(strongest([Int]()) == nil, "strongest of empty")
