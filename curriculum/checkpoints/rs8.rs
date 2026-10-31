// @cp Keyword detects substrings | count_hits | works through a generic bound
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    struct RaAll;
    impl Detector for RaAll { fn detect(&self, _l: &str) -> bool { true } }
    pub fn run() {
        let k = Keyword("jndi".to_string());
        ra_try("Keyword detects substrings", || ra_cp(k.detect("${jndi:x}") && !k.detect("hello"), "Keyword detects substrings", ""));
        ra_try("count_hits", || ra_eq("count_hits", count_hits(&Keyword("jndi".to_string()), &["jndi a", "b", "c jndi"]), 2));
        ra_try("works through a generic bound", || ra_eq("works through a generic bound", count_hits(&RaAll, &["a", "b"]), 2));
    }
}
fn main() { ra_h::run(); }
