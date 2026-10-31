fun lookup(name: String, db: Map<String, String>): String = db[name] ?: "unknown"

fun parseKv(s: String): Map<String, String> =
    s.split(";")
        .filter { "=" in it }
        .associate {
            val (k, v) = it.split("=", limit = 2)
            k.trim() to v.trim()
        }
