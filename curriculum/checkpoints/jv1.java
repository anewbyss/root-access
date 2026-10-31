// @cp intro("neo", 3) | intro("trinity", 12)
public class Main {
    public static void main(String[] args) {
        Ra.tryCp("intro(\"neo\", 3)", () -> Ra.eq("intro(\"neo\", 3)", Intro.intro("neo", 3), "Agent neo // level 3"));
        Ra.tryCp("intro(\"trinity\", 12)", () -> Ra.eq("intro(\"trinity\", 12)", Intro.intro("trinity", 12), "Agent trinity // level 12"));
    }
}
//@@USER@@
//@@PRELUDE@@
