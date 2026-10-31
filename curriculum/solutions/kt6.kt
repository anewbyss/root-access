data class Node(val name: String, val strength: Int = 0)

object Registry {
    val nodes = mutableListOf<Node>()
}

class Session private constructor(val id: String) {
    companion object {
        fun create(): Session = Session("s-" + System.nanoTime())
    }
}

fun main() {
    val a = Node("north", 40)
    val b = a.copy(strength = 90)
    val (name, strength) = b
    Registry.nodes += b
    println("$name $strength ${Session.create().id}")
}
