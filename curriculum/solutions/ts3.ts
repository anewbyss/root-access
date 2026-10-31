function tally(items: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const x of items) out[x] = (out[x] ?? 0) + 1;
  return out;
}
function top(items: string[]): [string, number] | undefined {
  let best: [string, number] | undefined;
  for (const [k, v] of Object.entries(tally(items))) if (!best || v > best[1]) best = [k, v];
  return best;
}
