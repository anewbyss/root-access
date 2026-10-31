async function sweep(hosts, ping) {
  const results = await Promise.allSettled(hosts.map(h => ping(h)));
  const up = [], down = [];
  results.forEach((r, i) => (r.status === "fulfilled" ? up : down).push(hosts[i]));
  return { up, down };
}
