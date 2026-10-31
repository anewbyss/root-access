package main

import "sort"

func tally(ips []string) map[string]int {
	counts := make(map[string]int)
	for _, ip := range ips {
		counts[ip]++
	}
	return counts
}

func uniqueSorted(ips []string) []string {
	out := []string{}
	for ip := range tally(ips) {
		out = append(out, ip)
	}
	sort.Strings(out)
	return out
}
