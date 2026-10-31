from dataclasses import dataclass

@dataclass
class Node:
    name: str
    strength: int = 0

    def boost(self, n):
        self.strength += n
        return self.strength

    def __str__(self):
        return f"{self.name}({self.strength})"
