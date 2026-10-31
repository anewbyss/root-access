// @cp parse_port ok | empty input is ParseError Empty | garbage is ParseError BadPort | ports() stops at the first error | ports() collects
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        ra_try("parse_port ok", || ra_cp(matches!(parse_port("443"), Ok(443)), "parse_port ok", ""));
        ra_try("empty input is ParseError Empty", || ra_cp(matches!(parse_port(""), Err(ParseError::Empty)), "empty input is ParseError Empty", ""));
        ra_try("garbage is ParseError BadPort", || ra_cp(matches!(parse_port("http"), Err(ParseError::BadPort(_))), "garbage is ParseError BadPort", ""));
        ra_try("ports() stops at the first error", || ra_cp(ports(&["22", "nope", "80"]).is_err(), "ports() stops at the first error", ""));
        ra_try("ports() collects", || ra_cp(matches!(ports(&["22", "80"]).as_deref(), Ok([22, 80])), "ports() collects", ""));
    }
}
fn main() { ra_h::run(); }
