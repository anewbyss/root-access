type Result<T> = { ok: true; value: T } | { ok: false; error: string };

type Ev = { kind: "fail"; ip: string } | { kind: "ok"; ip: string };
interface Summary { total: number; fails: number; topIp: string | null; errors: number }

function parse(line: string): Result<Ev> {
  const [ip, status, ...extra] = line.trim().split(/\s+/);
  if (!ip || extra.length || (status !== "OK" && status !== "FAIL")) return { ok: false, error: `bad line: ${line}` };
  return { ok: true, value: { kind: status === "FAIL" ? "fail" : "ok", ip } };
}

async function analyze(src: () => Promise<string[]>): Promise<Summary> {
  const lines = await src();
  const counts = new Map<string, number>();
  let total = 0, fails = 0, errors = 0;
  for (const line of lines) {
    const r = parse(line);
    if (!r.ok) { errors++; continue; }
    total++;
    if (r.value.kind === "fail") { fails++; counts.set(r.value.ip, (counts.get(r.value.ip) ?? 0) + 1); }
  }
  let topIp: string | null = null, best = 0;
  for (const [ip, n] of counts) if (n > best) { best = n; topIp = ip; }
  return { total, fails, topIp, errors };
}
