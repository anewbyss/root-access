package main

import "strings"

type Detector interface {
	Detect(line string) bool
}

type Keyword struct {
	Word string
}

func (k Keyword) Detect(line string) bool {
	return strings.Contains(line, k.Word)
}

func countHits(d Detector, lines []string) int {
	n := 0
	for _, l := range lines {
		if d.Detect(l) {
			n++
		}
	}
	return n
}
