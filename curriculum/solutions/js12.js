const validIp = ip => /^(\d{1,3})(\.\d{1,3}){3}$/.test(ip) && ip.split(".").every(p => +p <= 255 && String(+p) === p);

async function analyze(source) {
  const lines = await source();
  const fails = new Map();
  let total = 0, skipped = 0, failCount = 0;
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length !== 2 || !validIp(parts[0])) { skipped++; continue; }
    total++;
    if (parts[1] === "FAIL") { failCount++; fails.set(parts[0], (fails.get(parts[0]) ?? 0) + 1); }
  }
  let topIp = null, best = 0;
  for (const [ip, n] of fails) if (n > best) { best = n; topIp = ip; }
  return { total, fails: failCount, topIp, skipped };
}
