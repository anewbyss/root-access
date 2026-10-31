fun threatLevel(score: Int): String = when (score) {
    in 90..100 -> "CRITICAL"
    in 60..89 -> "HIGH"
    in 30..59 -> "MEDIUM"
    else -> "LOW"
}

fun countdown() {
    for (i in 10 downTo 0 step 2) println("T-$i")
}
