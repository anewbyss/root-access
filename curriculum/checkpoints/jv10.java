// @cp failIps | failIps ignores OK lines | byIp counts per IP
import java.util.*;
public class Main {
    public static void main(String[] args) {
        List<String> logs = List.of("10.0.0.9 FAIL", "10.0.0.4 OK", "10.0.0.9 FAIL", "10.0.0.2 FAIL");
        Ra.tryCp("failIps", () -> Ra.eq("failIps", Streams.failIps(logs), List.of("10.0.0.9", "10.0.0.9", "10.0.0.2")));
        Ra.tryCp("failIps ignores OK lines", () -> Ra.eq("failIps ignores OK lines", Streams.failIps(List.of("1.1.1.1 OK")).size(), 0));
        Ra.tryCp("byIp counts per IP", () -> { var m = Streams.byIp(logs); Ra.cp(m.get("10.0.0.9") == 2L && m.get("10.0.0.4") == 1L, "byIp counts per IP", String.valueOf(m)); });
    }
}
//@@USER@@
//@@PRELUDE@@
