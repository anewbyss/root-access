type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function parsePort(s: string): Result<number> {
  if (!/^\d+$/.test(s)) return { ok: false, error: "invalid port" };
  const n = Number(s);
  return n >= 1 && n <= 65535 ? { ok: true, value: n } : { ok: false, error: "invalid port" };
}
function isOk<T>(r: Result<T>): r is { ok: true; value: T } {
  return r.ok;
}
