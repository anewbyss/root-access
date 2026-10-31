package main

func threatLevel(score int) string {
	switch {
	case score >= 90:
		return "CRITICAL"
	case score >= 60:
		return "HIGH"
	case score >= 30:
		return "MEDIUM"
	default:
		return "LOW"
	}
}
