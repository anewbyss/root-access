import kotlin.test.*

fun parsePort(s: String): Int {
    val p = s.toIntOrNull() ?: throw IllegalArgumentException("bad port")
    require(p in 1..65535)
    return p
}

class PortParserTest {
    @Test
    fun parsesValidPort() {
        assertEquals(443, parsePort("443"))
    }

    @Test
    fun rejectsGarbage() {
        assertFailsWith<IllegalArgumentException> { parsePort("abc") }
    }
}
