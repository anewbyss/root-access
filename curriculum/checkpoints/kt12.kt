// @cp ViewModel exposes a StateFlow | UI state is a sealed type | Screen composes a Button | Clicking the Button updates the StateFlow | Screen composes a LazyColumn
// @ci-only Needs kotlinx.coroutines plus Compose/AndroidX API stubs (tools/ci/stubs/kotlin). Runs in GitHub Actions.
import ra.compose.RaCompose
import kotlinx.coroutines.flow.StateFlow
//@@USER@@
//@@PRELUDE@@
fun main() {
    val vm = __VM_CLASS__()
    val getter = vm.javaClass.methods.firstOrNull { StateFlow::class.java.isAssignableFrom(it.returnType) && it.parameterCount == 0 }
    raCp(getter != null, "ViewModel exposes a StateFlow", "no public StateFlow property on __VM_CLASS__")
    if (getter == null) return
    val flow = getter.invoke(vm) as StateFlow<*>
    val first = flow.value
    val sealedTypes = __SEALED__.mapNotNull { runCatching { Class.forName(it) }.getOrNull() }
    raCp(first != null && sealedTypes.any { it.isInstance(first) }, "UI state is a sealed type", "state value ${first} isn't an instance of a sealed class/interface you declared")
    val screen = Class.forName("MainKt").methods.first { it.name == "__SCREEN__" }
    fun render() { RaCompose.reset(); if (screen.parameterCount == 0) screen.invoke(null) else screen.invoke(null, vm) }
    render()
    val firstCalls = RaCompose.calls.toList()
    raCp("Button" in firstCalls, "Screen composes a Button", "composed: $firstCalls")
    val click = RaCompose.onClicks.firstOrNull()
    val seen = mutableSetOf<Any?>(first)
    if (click != null) {
        click()
        val end = System.currentTimeMillis() + 3000
        while (System.currentTimeMillis() < end && seen.size < 2) { seen.add(flow.value); Thread.sleep(5) }
        Thread.sleep(300); seen.add(flow.value)
    }
    raCp(seen.size >= 2, "Clicking the Button updates the StateFlow", "state stayed $first for 3s after onClick")
    render()
    raCp("LazyColumn" in firstCalls || "LazyColumn" in RaCompose.calls, "Screen composes a LazyColumn", "composed: ${RaCompose.calls}")
}
