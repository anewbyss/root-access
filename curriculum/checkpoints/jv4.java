// @cp scan(host) delegates with 443 | scan(host, port) | sum varargs | sum of nothing
public class Main {
    public static void main(String[] args) {
        Ra.tryCp("scan(host) delegates with 443", () -> Ra.eq("scan(host) delegates with 443", Scanner.scan("relay"), Scanner.scan("relay", 443)));
        Ra.tryCp("scan(host, port)", () -> Ra.cp(Scanner.scan("relay", 22).contains("22"), "scan(host, port)", Scanner.scan("relay", 22)));
        Ra.tryCp("sum varargs", () -> Ra.eq("sum varargs", Scanner.sum(1, 2, 3, 4), 10));
        Ra.tryCp("sum of nothing", () -> Ra.eq("sum of nothing", Scanner.sum(), 0));
    }
}
//@@USER@@
//@@PRELUDE@@
