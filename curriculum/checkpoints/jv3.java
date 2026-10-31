// @cp tally counts | tally empty
import java.util.*;
public class Main {
    public static void main(String[] args) {
        Ra.tryCp("tally counts", () -> Ra.eq("tally counts", Tally.tally(List.of("a", "b", "a")), Map.of("a", 2, "b", 1)));
        Ra.tryCp("tally empty", () -> Ra.eq("tally empty", Tally.tally(List.of()).size(), 0));
    }
}
//@@USER@@
//@@PRELUDE@@
