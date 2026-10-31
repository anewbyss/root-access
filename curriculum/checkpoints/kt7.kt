// @cp parsePort ok | garbage throws | out of range throws | BadPort is an Exception
//@@USER@@
//@@PRELUDE@@
fun main() {
    raTry("parsePort ok") { raEq("parsePort ok", parsePort("443"), 443) }
    raTry("garbage throws") { raCp(runCatching { parsePort("http") }.isFailure, "garbage throws") }
    raTry("out of range throws") { raCp(runCatching { parsePort("70000") }.isFailure && runCatching { parsePort("0") }.isFailure, "out of range throws") }
    raCp(Exception::class.java.isAssignableFrom(BadPort::class.java), "BadPort is an Exception")
}
