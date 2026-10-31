use std::fmt;

#[derive(Debug, PartialEq)]
enum Status {
    Ok,
    Fail,
}

#[derive(Debug)]
struct Record {
    ip: String,
    status: Status,
}

fn parse(line: &str) -> Result<Record, String> {
    let mut parts = line.split_whitespace();
    let ip = parts.next().ok_or("missing ip")?;
    let status = match parts.next() {
        Some("OK") => Status::Ok,
        Some("FAIL") => Status::Fail,
        other => return Err(format!("bad status: {:?}", other)),
    };
    if parts.next().is_some() {
        return Err("too many fields".into());
    }
    Ok(Record { ip: ip.to_string(), status })
}

struct Summary {
    total: usize,
    fails: usize,
}

impl fmt::Display for Summary {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} total / {} fails", self.total, self.fails)
    }
}

fn analyze(lines: &[&str]) -> Summary {
    let records: Vec<Record> = lines.iter().filter_map(|l| parse(l).ok()).collect();
    let fails = records.iter().filter(|r| r.status == Status::Fail).count();
    Summary { total: records.len(), fails }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn counts_fails() {
        let s = analyze(&["1.1.1.1 FAIL", "2.2.2.2 OK", "junk"]);
        assert_eq!((s.total, s.fails), (2, 1));
    }

    #[test]
    fn rejects_bad_lines() {
        assert!(parse("x").is_err());
    }
}
