fun intro(handle: String, level: Int): String = "Agent $handle // level $level"

fun main() {
    val handle = "neo"
    var runs = 0
    runs += 1
    println("${intro(handle, 3)} (run $runs)")
}
