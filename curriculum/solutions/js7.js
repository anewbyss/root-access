class AccessDenied extends Error {
  constructor(msg) { super(msg); this.name = "AccessDenied"; }
}
function unlock(code) {
  if (code === "0451") return "OPEN";
  throw new AccessDenied(`bad code ${code}`);
}
function safeUnlock(code) {
  try { return unlock(code); }
  catch (e) { if (e instanceof AccessDenied) return "DENIED"; throw e; }
}
