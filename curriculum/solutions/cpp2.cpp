enum class Level { Low, Medium, High, Critical };

Level classify(int score) {
    if (score >= 90) return Level::Critical;
    else if (score >= 60) return Level::High;
    else if (score >= 30) return Level::Medium;
    else return Level::Low;
}

const char* name(Level l) {
    switch (l) {
        case Level::Low: return "LOW";
        case Level::Medium: return "MEDIUM";
        case Level::High: return "HIGH";
        case Level::Critical: return "CRITICAL";
    }
    return "?";
}
