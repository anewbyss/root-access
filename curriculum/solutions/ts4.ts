interface Report {
  readonly id: number;
  source: string;
  verified?: boolean;
}
function summarize(r: Report): string {
  return `#${r.id} from ${r.source} [${r.verified === true ? "verified" : "unverified"}]`;
}
