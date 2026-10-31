async function sweep(hosts: string[], ping: (h: string) => Promise<number>): Promise<Record<string, number>> {
  const times = await Promise.all(hosts.map(h => ping(h)));
  const out: Record<string, number> = {};
  hosts.forEach((h, i) => { out[h] = times[i]; });
  return out;
}
