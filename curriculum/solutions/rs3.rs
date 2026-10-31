use std::collections::HashMap;

fn tally(ips: &[String]) -> HashMap<String, u32> {
    let mut counts = HashMap::new();
    for ip in ips {
        *counts.entry(ip.clone()).or_insert(0) += 1;
    }
    counts
}
