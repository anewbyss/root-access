// @cp returns the first reply | honors a cancelled context
package main

import (
	"context"
	"errors"
)

//@@USER@@
//@@PRELUDE@@
func main() {
	raTry("returns the first reply", func() {
		r, err := firstReply(context.Background(), []string{"north", "harbor"})
		raCp(err == nil && (r == "north" || r == "harbor"), "returns the first reply", fmt.Sprintf("got %q, %v", r, err))
	})
	raTry("honors a cancelled context", func() {
		ctx, cancel := context.WithCancel(context.Background())
		cancel()
		_, err := firstReply(ctx, []string{})
		raCp(errors.Is(err, context.Canceled), "honors a cancelled context", fmt.Sprintf("err = %v", err))
	})
}
