fn fail_ips(lines: &[&str]) -> Vec<String> {
    lines
        .iter()
        .filter(|l| l.ends_with("FAIL"))
        .map(|l| l.split_whitespace().next().unwrap_or("").to_string())
        .collect()
}
