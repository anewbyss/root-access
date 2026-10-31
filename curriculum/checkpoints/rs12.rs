// @cp parse a good line | parse rejects junk | analyze counts | Summary implements Display | Your #[test] suite
// @opts --test
// @args --nocapture --test-threads=1
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        ra_try("parse a good line", || { let r = parse("1.1.1.1 FAIL"); ra_cp(matches!(&r, Ok(rec) if rec.ip == "1.1.1.1" && matches!(rec.status, Status::Fail)), "parse a good line", ""); });
        ra_try("parse rejects junk", || ra_cp(parse("junk").is_err(), "parse rejects junk", ""));
        ra_try("analyze counts", || { let s = analyze(&["1.1.1.1 FAIL", "2.2.2.2 OK", "junk", "3.3.3.3 FAIL"]); ra_eq("analyze counts", (s.total, s.fails), (3, 2)); });
        ra_try("Summary implements Display", || { let s = format!("{}", analyze(&["1.1.1.1 FAIL"])); ra_cp(s.contains('1'), "Summary implements Display", &s); });
    }
}
#[test]
fn ra_checks() { ra_h::run(); }
fn main() { ra_h::run(); }
