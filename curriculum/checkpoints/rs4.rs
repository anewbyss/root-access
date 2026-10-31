// @cp count_words | count_words with extra spaces | redact mutates in place
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        ra_try("count_words", || ra_eq("count_words", count_words("the relay is down"), 4));
        ra_try("count_words with extra spaces", || ra_eq("count_words with extra spaces", count_words("  a   b \n c "), 3));
        ra_try("redact mutates in place", || { let mut m = String::from("secret plan"); redact(&mut m); ra_eq("redact mutates in place", m, "[REDACTED]".to_string()); });
    }
}
fn main() { ra_h::run(); }
