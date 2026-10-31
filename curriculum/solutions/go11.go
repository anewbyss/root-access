package main

import "context"

func ping(h string) string { return h }

func firstReply(ctx context.Context, hosts []string) (string, error) {
	replies := make(chan string, len(hosts))
	for _, h := range hosts {
		go func(host string) { replies <- ping(host) }(h)
	}
	select {
	case r := <-replies:
		return r, nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}
