sealed interface Event
data class Login(val user: String) : Event
data class Breach(val severity: Int) : Event
data object Logout : Event

fun describe(e: Event): String = when (e) {
    is Login -> "${e.user} in"
    is Breach -> "BREACH sev ${e.severity}"
    Logout -> "logout"
}

enum class Faction(val color: String) {
    LOGOS("#c79bff"), SENTINEL("#5ad1ff"), MERIDIAN("#7dff9a")
}
