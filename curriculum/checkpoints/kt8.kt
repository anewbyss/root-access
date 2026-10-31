// @cp Login and Breach are Events | Logout is a singleton Event | data object prints its name
//@@USER@@
//@@PRELUDE@@
fun main() {
    raCp(Event::class.java.isAssignableFrom(Login::class.java) && Event::class.java.isAssignableFrom(Breach::class.java), "Login and Breach are Events")
    raCp((Logout as Any) is Event, "Logout is a singleton Event")
    raEq("data object prints its name", Logout.toString(), "Logout")
}
