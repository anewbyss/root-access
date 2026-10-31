// @cp shift 3 | wraps z to c | keeps case and punctuation | round trip
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        ra_try("shift 3", || ra_eq("shift 3", caesar("abc", 3), "def".to_string()));
        ra_try("wraps z to c", || ra_eq("wraps z to c", caesar("xyz", 3), "abc".to_string()));
        ra_try("keeps case and punctuation", || ra_eq("keeps case and punctuation", caesar("Hello, World!", 1), "Ifmmp, Xpsme!".to_string()));
        ra_try("round trip", || ra_eq("round trip", caesar(&caesar("Matrix", 7), 19), "Matrix".to_string()));
    }
}
fn main() { ra_h::run(); }
