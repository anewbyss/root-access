trait Detector {
    fn detect(&self, line: &str) -> bool;
}

struct Keyword(String);

impl Detector for Keyword {
    fn detect(&self, line: &str) -> bool {
        line.contains(&self.0)
    }
}

fn count_hits<D: Detector>(d: &D, lines: &[&str]) -> usize {
    lines.iter().filter(|l| d.detect(l)).count()
}
