// @cp score 95 | score 90 | score 60 | score 59 | score 30 | score 0 | portFor known services | portFor default
public class Main {
    public static void main(String[] args) {
        int[] s = {95, 90, 60, 59, 30, 0};
        String[] w = {"CRITICAL", "CRITICAL", "HIGH", "MEDIUM", "MEDIUM", "LOW"};
        for (int i = 0; i < s.length; i++) { final int k = i; Ra.tryCp("score " + s[k], () -> Ra.eq("score " + s[k], Triage.threatLevel(s[k]), w[k])); }
        Ra.tryCp("portFor known services", () -> Ra.cp(Triage.portFor("ssh") == 22 && Triage.portFor("https") == 443, "portFor known services", "ssh=" + Triage.portFor("ssh") + " https=" + Triage.portFor("https")));
        Ra.tryCp("portFor default", () -> { int a = Triage.portFor("zzz-unknown"), b = Triage.portFor("qqq-unknown"); Ra.cp(a == b && a != 22 && a != 443, "portFor default", "unknown -> " + a); });
    }
}
//@@USER@@
//@@PRELUDE@@
