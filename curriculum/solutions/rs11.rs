fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
    if a.len() >= b.len() { a } else { b }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn picks_longer() {
        assert_eq!(longest("abc", "a"), "abc");
    }

    #[test]
    fn ties_go_to_first() {
        assert_eq!(longest("ab", "cd"), "ab");
    }
}
