// @cp strongest of ints | strongest of strings | Box holds a value
import java.util.*;
public class Main {
    public static void main(String[] args) {
        Ra.tryCp("strongest of ints", () -> Ra.eq("strongest of ints", __CLASS_OF:strongest__.strongest(List.of(3, 9, 2)), 9));
        Ra.tryCp("strongest of strings", () -> Ra.eq("strongest of strings", __CLASS_OF:strongest__.strongest(List.of("alpha", "omega", "beta")), "omega"));
        Ra.tryCp("Box holds a value", () -> Ra.cp(Box.class.getTypeParameters().length == 1, "Box holds a value", "Box should declare one type parameter"));
    }
}
//@@USER@@
//@@PRELUDE@@
