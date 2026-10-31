// @cp shift 3 | wraps z to c | keeps case and punctuation | round trip
public class Main {
    public static void main(String[] args) {
        Ra.tryCp("shift 3", () -> Ra.eq("shift 3", Cipher.caesar("abc", 3), "def"));
        Ra.tryCp("wraps z to c", () -> Ra.eq("wraps z to c", Cipher.caesar("xyz", 3), "abc"));
        Ra.tryCp("keeps case and punctuation", () -> Ra.eq("keeps case and punctuation", Cipher.caesar("Hello, World!", 1), "Ifmmp, Xpsme!"));
        Ra.tryCp("round trip", () -> Ra.eq("round trip", Cipher.caesar(Cipher.caesar("Matrix", 7), 19), "Matrix"));
    }
}
//@@USER@@
//@@PRELUDE@@
