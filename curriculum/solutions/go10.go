package main

import "sync"

func ping(h string) bool { return len(h) > 0 }

func sweep(hosts []string) int {
	var wg sync.WaitGroup
	var mu sync.Mutex
	up := 0
	for _, h := range hosts {
		wg.Add(1)
		go func(host string) {
			defer wg.Done()
			if ping(host) {
				mu.Lock()
				up++
				mu.Unlock()
			}
		}(h)
	}
	wg.Wait()
	return up
}
