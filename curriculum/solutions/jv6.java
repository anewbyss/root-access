record Node(String name, int strength) {
    public Node {
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name required");
        if (strength < 0) throw new IllegalArgumentException("strength must be >= 0");
    }
}

class Session {
    private final String id;

    Session(String id) {
        this.id = id;
    }

    String id() { return id; }
}

enum Faction { LOGOS, SENTINEL, MERIDIAN, LANTERN }
