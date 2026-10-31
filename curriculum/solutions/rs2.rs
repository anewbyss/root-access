fn threat_level(score: u32) -> &'static str {
    match score {
        90..=u32::MAX => "CRITICAL",
        60..=89 => "HIGH",
        30..=59 => "MEDIUM",
        _ => "LOW",
    }
}
