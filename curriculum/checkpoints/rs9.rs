// @cp first word of FAIL lines | ignores other lines | empty input
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        ra_try("first word of FAIL lines", || ra_eq("first word of FAIL lines", fail_ips(&["10.0.0.9 FAIL", "10.0.0.4 OK", "10.0.0.2 FAIL"]), vec!["10.0.0.9".to_string(), "10.0.0.2".to_string()]));
        ra_try("ignores other lines", || ra_eq("ignores other lines", fail_ips(&["FAILOVER ok", "x OK"]).len(), 0));
        ra_try("empty input", || ra_eq("empty input", fail_ips(&[]).len(), 0));
    }
}
fn main() { ra_h::run(); }
