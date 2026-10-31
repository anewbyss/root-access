// @cp counts repeats | counts singles | empty input
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        let ips: Vec<String> = ["10.0.0.9", "10.0.0.4", "10.0.0.9"].iter().map(|s| s.to_string()).collect();
        ra_try("counts repeats", || ra_eq("counts repeats", tally(&ips).get("10.0.0.9").copied(), Some(2)));
        ra_try("counts singles", || ra_eq("counts singles", tally(&ips).get("10.0.0.4").copied(), Some(1)));
        ra_try("empty input", || ra_eq("empty input", tally(&[]).len(), 0));
    }
}
fn main() { ra_h::run(); }
