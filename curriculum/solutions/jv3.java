import java.util.*;

public class Tally {
    static Map<String, Integer> tally(List<String> ips) {
        Map<String, Integer> counts = new HashMap<>();
        for (String ip : ips) {
            counts.merge(ip, 1, Integer::sum);
        }
        return counts;
    }
}
