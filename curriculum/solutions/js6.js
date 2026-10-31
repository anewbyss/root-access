class Node {
  constructor(name) { this.name = name; this.strength = 0; }
  boost(n) { this.strength += n; return this.strength; }
  get label() { return `${this.name}(${this.strength})`; }
}
class Relay extends Node {
  boost(n) { return super.boost(n * 2); }
}
