type Level = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
function threatLevel(score: number): Level {
  if (score >= 90) return "CRITICAL";
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}
