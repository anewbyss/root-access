function tally(items) {
  const m = new Map();
  for (const x of items) m.set(x, (m.get(x) ?? 0) + 1);
  return Object.fromEntries(m);
}
function topN(items, n) {
  return Object.entries(tally(items)).sort((a, b) => b[1] - a[1]).slice(0, n);
}
