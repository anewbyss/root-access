// @cp Node has a default strength | copy changes one field | data class equality | destructuring
//@@USER@@
//@@PRELUDE@@
fun main() {
    raTry("Node has a default strength") { raEq("Node has a default strength", Node("north").strength, 0) }
    raTry("copy changes one field") { val b = Node("north", 40).copy(strength = 90); raCp(b.name == "north" && b.strength == 90, "copy changes one field", "$b") }
    raTry("data class equality") { raEq("data class equality", Node("a", 1), Node("a", 1)) }
    raTry("destructuring") { val (n, s) = Node("hill", 7); raEq("destructuring", "$n:$s", "hill:7") }
}
