import kotlinx.coroutines.*

suspend fun ping(host: String): Boolean {
    delay(50)
    return host.isNotEmpty()
}

suspend fun sweep(hosts: List<String>): Int = coroutineScope {
    hosts.map { h -> async { ping(h) } }.awaitAll().count { it }
}

fun main() = runBlocking {
    launch { println("heartbeat") }
    println("up: ${sweep(listOf("a", "b", ""))}")
}
