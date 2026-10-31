class Vault {
  private secrets = new Map<string, string>();
  constructor(private readonly owner: string) {}
  store(k: string, v: string): void { this.secrets.set(k, v); }
  read(k: string): string | undefined { return this.secrets.get(k); }
  get size(): number { return this.secrets.size; }
  describe(): string { return `${this.owner}: ${this.size} secrets`; }
}
