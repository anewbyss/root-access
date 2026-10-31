// @cp intro("neo", 3) | intro("trinity", 12) | main runs
//@@USER@@
mod ra_h {
    #![allow(unused)]
    use super::*;
//@@PRELUDE@@
    pub fn run() {
        ra_try("intro(\"neo\", 3)", || ra_eq("intro(\"neo\", 3)", intro("neo", 3), "Agent neo // level 3".to_string()));
        ra_try("intro(\"trinity\", 12)", || ra_eq("intro(\"trinity\", 12)", intro("trinity", 12), "Agent trinity // level 12".to_string()));
        ra_try("main runs", || { ra_user_main(); ra_cp(true, "main runs", ""); });
    }
}
fn main() { ra_h::run(); }
