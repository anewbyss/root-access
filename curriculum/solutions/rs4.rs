fn count_words(text: &str) -> usize {
    text.split_whitespace().count()
}

fn redact(msg: &mut String) {
    *msg = String::from("[REDACTED]");
}
