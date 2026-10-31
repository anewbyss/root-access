// @cp score 95 | score 90 | score 60 | score 59 | score 30 | score 0
//@@USER@@
//@@PRELUDE@@
fun main() {
    for ((s, w) in listOf(95 to "CRITICAL", 90 to "CRITICAL", 60 to "HIGH", 59 to "MEDIUM", 30 to "MEDIUM", 0 to "LOW"))
        raTry("score $s") { raEq("score $s", threatLevel(s), w) }
}
