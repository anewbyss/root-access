// @cp parsePort ok | garbage throws BadPortException | BadPortException is checked
public class Main {
    public static void main(String[] args) {
        Ra.tryCp("parsePort ok", () -> Ra.eq("parsePort ok", Ports.parsePort("443"), 443));
        try { Ports.parsePort("http"); Ra.cp(false, "garbage throws BadPortException", "no exception"); }
        catch (BadPortException e) { Ra.cp(true, "garbage throws BadPortException", ""); }
        catch (Throwable t) { Ra.cp(false, "garbage throws BadPortException", "threw " + t); }
        Ra.cp(Exception.class.isAssignableFrom(BadPortException.class) && !RuntimeException.class.isAssignableFrom(BadPortException.class), "BadPortException is checked", "");
    }
}
//@@USER@@
//@@PRELUDE@@
