function exposed(hosts) {
  return hosts.filter(h => !h.patched).map(h => h.name).sort();
}
