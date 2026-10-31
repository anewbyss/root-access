package main

import (
	"encoding/json"
	"net/http"
	"testing"
)

type Status struct {
	Node string `json:"node"`
	Up   bool   `json:"up"`
}

func threatLevel(score int) string {
	switch {
	case score >= 90:
		return "CRITICAL"
	case score >= 60:
		return "HIGH"
	case score >= 30:
		return "MEDIUM"
	}
	return "LOW"
}

func main() {
	http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode([]Status{{"north", true}, {"harbor", false}})
	})
	http.ListenAndServe(":8080", nil)
}

func TestThreatLevel(t *testing.T) {
	cases := []struct {
		score int
		want  string
	}{{95, "CRITICAL"}, {60, "HIGH"}, {30, "MEDIUM"}, {0, "LOW"}}
	for _, c := range cases {
		if got := threatLevel(c.score); got != c.want {
			t.Errorf("threatLevel(%d) = %q, want %q", c.score, got, c.want)
		}
	}
}
