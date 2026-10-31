// @cp record accessors | records compare by value | compact constructor rejects bad input | Session field is private final
public class Main {
    public static void main(String[] args) {
        Ra.tryCp("record accessors", () -> { Node n = new Node("north", 40); Ra.cp(n.name().equals("north") && n.strength() == 40, "record accessors", n.toString()); });
        Ra.tryCp("records compare by value", () -> Ra.eq("records compare by value", new Node("a", 1), new Node("a", 1)));
        boolean threw = false;
        try { new Node(null, -1); } catch (RuntimeException e) { threw = true; }
        try { if (!threw) new Node("", -5); } catch (RuntimeException e) { threw = true; }
        Ra.cp(threw, "compact constructor rejects bad input", "new Node(null, -1) and new Node(\"\", -5) were both accepted");
        boolean pf = false;
        for (var f : Session.class.getDeclaredFields()) { int m = f.getModifiers(); if (java.lang.reflect.Modifier.isPrivate(m) && java.lang.reflect.Modifier.isFinal(m)) pf = true; }
        Ra.cp(pf, "Session field is private final", "");
    }
}
//@@USER@@
//@@PRELUDE@@
