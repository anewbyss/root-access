// @cp Keyword detects substrings | Keyword is a Rule and a Detector | Detector has a default method
import java.util.*;
public class Main {
    public static void main(String[] args) {
        Ra.tryCp("Keyword detects substrings", () -> { Keyword k = new Keyword("jndi"); Ra.cp(k.detect("${jndi:x}") && !k.detect("hello"), "Keyword detects substrings", ""); });
        Ra.cp(Rule.class.isAssignableFrom(Keyword.class) && Detector.class.isAssignableFrom(Rule.class) && java.lang.reflect.Modifier.isAbstract(Rule.class.getModifiers()), "Keyword is a Rule and a Detector", "");
        boolean def = false;
        for (var m : Detector.class.getDeclaredMethods()) if (m.isDefault()) def = true;
        Ra.cp(def, "Detector has a default method", "");
    }
}
//@@USER@@
//@@PRELUDE@@
