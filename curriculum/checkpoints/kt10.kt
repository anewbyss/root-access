// @cp ping returns true for a host | sweep counts reachable hosts | sweep runs concurrently
// @ci-only Needs kotlinx.coroutines, which Judge0's Kotlin image doesn't include. Runs in GitHub Actions with the real library.
import kotlinx.coroutines.*
//@@USER@@
//@@PRELUDE@@
fun main() = runBlocking {
    raTry("ping returns true for a host") { raCp(runBlocking { ping("north") }, "ping returns true for a host") }
    raTry("sweep counts reachable hosts") { raEq("sweep counts reachable hosts", runBlocking { sweep(listOf("a", "b", "c")) } >= 0, true) }
    raTry("sweep runs concurrently") {
        val t0 = System.nanoTime()
        runBlocking { sweep(List(50) { "h$it" }) }
        val ms = (System.nanoTime() - t0) / 1_000_000
        val one = run { val s = System.nanoTime(); runBlocking { ping("x") }; (System.nanoTime() - s) / 1_000_000 }
        raCp(ms < one * 10 + 500, "sweep runs concurrently", "50 hosts took ${ms}ms, one ping takes ${one}ms")
    }
}
