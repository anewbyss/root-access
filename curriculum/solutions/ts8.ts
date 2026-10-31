type Event =
  | { kind: "login"; user: string }
  | { kind: "breach"; severity: number }
  | { kind: "logout"; user: string };

function describe(e: Event): string {
  switch (e.kind) {
    case "login": return `${e.user} in`;
    case "breach": return `BREACH sev ${e.severity}`;
    case "logout": return `${e.user} out`;
    default: {
      const unreachable: never = e;
      return unreachable;
    }
  }
}
