// @cp sanitize blocks ${jndi: | sanitize passes clean input | Your @Test methods pass
// @ci-only Pattern-matching switch with when guards needs Java 21+, and JUnit 5 isn't on Judge0. Runs on JDK 25 + JUnit in GitHub Actions.
import java.lang.reflect.*;
public class Main {
    public static void main(String[] args) throws Exception {
        Method san = null;
        for (Class<?> c : new Class<?>[] { __CLASS_OF:sanitize__.class }) for (Method m : c.getDeclaredMethods()) if (m.getName().equals("sanitize")) san = m;
        final Method s = san;
        s.setAccessible(true);
        Ra.tryCp("sanitize blocks ${jndi:", () -> { String out = String.valueOf(s.invoke(null, "${jndi:ldap://evil/a}")); Ra.cp(!out.contains("${jndi:"), "sanitize blocks ${jndi:", "returned " + out); });
        Ra.tryCp("sanitize passes clean input", () -> Ra.eq("sanitize passes clean input", String.valueOf(s.invoke(null, "hello operator")), "hello operator"));
        Object t = __TEST_CLASS__.class.getDeclaredConstructor().newInstance();
        int n = 0, failed = 0;
        for (Method m : t.getClass().getDeclaredMethods()) if (m.isAnnotationPresent(org.junit.jupiter.api.Test.class)) { n++; try { m.setAccessible(true); m.invoke(t); } catch (InvocationTargetException e) { failed++; System.out.println("test " + m.getName() + " failed: " + e.getTargetException()); } }
        Ra.cp(n >= 1 && failed == 0, "Your @Test methods pass", failed + " of " + n + " failed");
    }
}
//@@USER@@
//@@PRELUDE@@
