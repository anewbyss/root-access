#[derive(Debug)]
enum ParseError {
    Empty,
    BadPort(String),
}

fn parse_port(s: &str) -> Result<u16, ParseError> {
    if s.is_empty() {
        return Err(ParseError::Empty);
    }
    s.parse::<u16>().map_err(|_| ParseError::BadPort(s.to_string()))
}

fn ports(list: &[&str]) -> Result<Vec<u16>, ParseError> {
    let mut out = Vec::new();
    for s in list {
        out.push(parse_port(s)?);
    }
    Ok(out)
}
