// @cp tally counts | tally empty
//@@USER@@
//@@PRELUDE@@
fun main() {
    raTry("tally counts") { raEq("tally counts", tally(listOf("a", "b", "a")), mapOf("a" to 2, "b" to 1)) }
    raTry("tally empty") { raEq("tally empty", tally(emptyList()), emptyMap<String, Int>()) }
}
