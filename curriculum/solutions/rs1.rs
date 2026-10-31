fn intro(handle: &str, level: u32) -> String {
    format!("Agent {} // level {}", handle, level)
}

fn main() {
    let mut counter = 0;
    counter += 1;
    println!("{} (run {})", intro("neo", 3), counter);
}
