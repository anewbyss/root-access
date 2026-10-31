// @cp counts reachable hosts | empty list | 200 threads
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        ra_try("counts reachable hosts", || ra_eq("counts reachable hosts", sweep(vec!["a".into(), "".into(), "c".into()]), 2));
        ra_try("empty list", || ra_eq("empty list", sweep(vec![]), 0));
        ra_try("200 threads", || ra_eq("200 threads", sweep((0..200).map(|i| i.to_string()).collect()), 200));
    }
}
fn main() { ra_h::run(); }
