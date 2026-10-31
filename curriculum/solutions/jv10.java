import java.util.*;
import java.util.stream.*;

public class Streams {
    static List<String> failIps(List<String> lines) {
        return lines.stream()
            .filter(l -> l.endsWith("FAIL"))
            .map(l -> l.split("\\s+")[0])
            .collect(Collectors.toList());
    }

    static Map<String, Long> byIp(List<String> lines) {
        return lines.stream()
            .map(l -> l.split("\\s+")[0])
            .collect(Collectors.groupingBy(ip -> ip, Collectors.counting()));
    }
}
