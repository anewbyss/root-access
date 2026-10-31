// @cp Your @Test functions pass | At least two @Test functions
//@@USER@@
//@@PRELUDE@@
fun main() {
    val obj = __TEST_CLASS__()
    val tests = obj.javaClass.declaredMethods.filter { it.isAnnotationPresent(Test::class.java) }
    var failed = 0
    for (m in tests) {
        try { m.isAccessible = true; m.invoke(obj) } catch (e: java.lang.reflect.InvocationTargetException) { failed++; println("test ${m.name} failed: ${e.targetException.message}") }
    }
    raCp(failed == 0 && tests.isNotEmpty(), "Your @Test functions pass", "$failed of ${tests.size} failed")
    raCp(tests.size >= 2, "At least two @Test functions", "found ${tests.size}")
}
