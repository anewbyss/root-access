interface Detector {
    fun detect(line: String): Boolean
}

open class Rule(val name: String) {
    open fun label(): String = "rule:$name"
}

class Keyword(private val word: String) : Rule("keyword"), Detector {
    override fun detect(line: String): Boolean = word in line
    override fun label(): String = "keyword:$word"
}

fun <T : Comparable<T>> strongest(xs: List<T>): T? = xs.maxOrNull()
