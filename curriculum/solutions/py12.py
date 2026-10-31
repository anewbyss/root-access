from collections import Counter
from dataclasses import dataclass

def is_valid_ip(s: str) -> bool:
    parts = s.split(".")
    return len(parts) == 4 and all(p.isdigit() and str(int(p)) == p and 0 <= int(p) <= 255 for p in parts)

@dataclass
class Summary:
    total: int
    fails: int
    top_ip: str | None

def analyze(lines) -> Summary:
    total = 0
    fail_counts = Counter()
    for line in lines:
        parts = line.split()
        if len(parts) != 2 or not is_valid_ip(parts[0]):
            continue
        total += 1
        if parts[1] == "FAIL":
            fail_counts[parts[0]] += 1
    top = fail_counts.most_common(1)
    return Summary(total, sum(fail_counts.values()), top[0][0] if top else None)
