public class Triage {
    static String threatLevel(int score) {
        if (score >= 90) return "CRITICAL";
        else if (score >= 60) return "HIGH";
        else if (score >= 30) return "MEDIUM";
        else return "LOW";
    }

    static int portFor(String service) {
        return switch (service) {
            case "ssh" -> 22;
            case "http" -> 80;
            case "https", "tls" -> 443;
            default -> -1;
        };
    }
}
