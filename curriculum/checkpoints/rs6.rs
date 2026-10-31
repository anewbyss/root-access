// @cp new() starts at 0 | boost returns the new strength | Debug is derived | describe covers every variant
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        ra_try("new() starts at 0", || { let n = Node::new("north"); ra_cp(n.name == "north" && n.strength == 0, "new() starts at 0", &format!("{:?}", n)); });
        ra_try("boost returns the new strength", || { let mut n = Node::new("x"); n.boost(5); ra_eq("boost returns the new strength", n.boost(3), 8); });
        ra_try("Debug is derived", || { let d = format!("{:?}", Node::new("hill")); ra_cp(d.contains("hill"), "Debug is derived", &d); });
        ra_try("describe covers every variant", || {
            let a = describe(&Event::Login("neo".into()));
            let b = describe(&Event::Breach(9));
            let c = describe(&Event::Logout);
            ra_cp(a.contains("neo") && b.contains('9') && !c.is_empty() && a != c, "describe covers every variant", &format!("{:?} {:?} {:?}", a, b, c));
        });
    }
}
fn main() { ra_h::run(); }
