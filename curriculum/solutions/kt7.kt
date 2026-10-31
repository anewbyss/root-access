class BadPort(val input: String) : Exception("bad port: $input")

fun parsePort(s: String): Int {
    val p = s.toIntOrNull() ?: throw BadPort(s)
    require(p in 1..65535) { "port out of range: $p" }
    return p
}

fun main() {
    val first = try {
        parsePort("443")
    } catch (e: BadPort) {
        -1
    }
    val second = runCatching { parsePort("abc") }.getOrDefault(-1)
    println("$first $second")
}
