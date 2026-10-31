package main

import "strings"

func caesar(text string, shift int) string {
	var b strings.Builder
	s := rune(((shift % 26) + 26) % 26)
	for _, r := range text {
		switch {
		case r >= 'a' && r <= 'z':
			b.WriteRune('a' + (r-'a'+s)%26)
		case r >= 'A' && r <= 'Z':
			b.WriteRune('A' + (r-'A'+s)%26)
		default:
			b.WriteRune(r)
		}
	}
	return b.String()
}
