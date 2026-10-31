public class Scanner {
    static String scan(String host) {
        return scan(host, 443);
    }

    static String scan(String host, int port) {
        return host + ":" + port;
    }

    static int sum(int... xs) {
        int total = 0;
        for (int x : xs) total += x;
        return total;
    }
}
