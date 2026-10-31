// @cp score 95 | score 90 | score 89 | score 60 | score 59 | score 30 | score 0
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        for (s, w) in [(95u32, "CRITICAL"), (90, "CRITICAL"), (89, "HIGH"), (60, "HIGH"), (59, "MEDIUM"), (30, "MEDIUM"), (0, "LOW")] {
            let l = format!("score {}", s);
            ra_try(&l.clone(), move || ra_eq(&l, threat_level(s), w));
        }
    }
}
fn main() { ra_h::run(); }
