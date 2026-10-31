// @cp intro("neo", 3) | intro("trinity", 12) | main runs
//@@USER@@
//@@PRELUDE@@
fun main() {
    raTry("intro(\"neo\", 3)") { raEq("intro(\"neo\", 3)", intro("neo", 3), "Agent neo // level 3") }
    raTry("intro(\"trinity\", 12)") { raEq("intro(\"trinity\", 12)", intro("trinity", 12), "Agent trinity // level 12") }
    raTry("main runs") { raUserMain(); raCp(true, "main runs") }
}
