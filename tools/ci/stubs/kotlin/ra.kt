package ra.compose
object RaCompose {
    val calls = mutableListOf<String>()
    val onClicks = mutableListOf<() -> Unit>()
    fun reset() { calls.clear(); onClicks.clear() }
}
