// @cp longest picks the longer | longest with equal lengths | Your #[test] suite
// @opts --test
// @args --nocapture --test-threads=1
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        ra_try("longest picks the longer", || ra_eq("longest picks the longer", longest("ab", "abcd"), "abcd"));
        ra_try("longest with equal lengths", || { let r = longest("ab", "cd"); ra_cp(r == "ab" || r == "cd", "longest with equal lengths", r); });
    }
}
#[test]
fn ra_checks() { ra_h::run(); }
fn main() { ra_h::run(); }
