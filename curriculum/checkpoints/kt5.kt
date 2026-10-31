// @cp lookup finds a name | lookup falls back to unknown | parseKv
//@@USER@@
//@@PRELUDE@@
fun main() {
    raTry("lookup finds a name") { raEq("lookup finds a name", lookup("relay", mapOf("relay" to "10.0.0.4")), "10.0.0.4") }
    raTry("lookup falls back to unknown") { raEq("lookup falls back to unknown", lookup("ghost", mapOf("relay" to "10.0.0.4")), "unknown") }
    raTry("parseKv") {
        val seps = listOf("host=relay;port=22", "host=relay,port=22", "host=relay&port=22", "host=relay port=22")
        val ok = seps.any { s -> runCatching { parseKv(s) }.getOrNull().let { it?.get("host") == "relay" && it["port"] == "22" } }
        raCp(ok, "parseKv", "parseKv(\"host=relay;port=22\") = ${runCatching { parseKv("host=relay;port=22") }.getOrNull()}")
    }
}
