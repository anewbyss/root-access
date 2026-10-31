// @cp sweep counts reachable hosts | sweep handles 1000 hosts | sweep empty
// @ci-only Virtual threads need Java 21+. Judge0 has Java 17, so this runs on JDK 25 in GitHub Actions.
import java.util.*;
public class Main {
    public static void main(String[] args) {
        Ra.tryCp("sweep counts reachable hosts", () -> Ra.eq("sweep counts reachable hosts", Sweep.sweep(List.of("a", "", "c")), 2));
        Ra.tryCp("sweep handles 1000 hosts", () -> { var hs = new ArrayList<String>(); for (int i = 0; i < 1000; i++) hs.add("h" + i); Ra.eq("sweep handles 1000 hosts", Sweep.sweep(hs), 1000); });
        Ra.tryCp("sweep empty", () -> Ra.eq("sweep empty", Sweep.sweep(List.of()), 0));
    }
}
//@@USER@@
//@@PRELUDE@@
