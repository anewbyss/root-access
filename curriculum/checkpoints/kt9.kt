// @cp strongest of ints | strongest of strings | strongest of empty | Detector is an interface
//@@USER@@
//@@PRELUDE@@
fun main() {
    raTry("strongest of ints") { raEq("strongest of ints", strongest(listOf(3, 9, 2)), 9) }
    raTry("strongest of strings") { raEq("strongest of strings", strongest(listOf("alpha", "omega", "beta")), "omega") }
    raTry("strongest of empty") { raEq("strongest of empty", strongest(emptyList<Int>()), null) }
    raCp(Detector::class.java.isInterface, "Detector is an interface")
}
