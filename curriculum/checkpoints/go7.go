// @cp a bad code returns an error | the error wraps ErrDenied | safeUnlock returns DENIED | a failed unlock returns an empty string
package main

import "errors"

//@@USER@@
//@@PRELUDE@@
func main() {
	_, err := unlock("wrong-code")
	raCp(err != nil, "a bad code returns an error", "err was nil")
	raCp(errors.Is(err, ErrDenied) && err != ErrDenied, "the error wraps ErrDenied", fmt.Sprintf("err = %v (wrap it with %%w and add context)", err))
	raTry("safeUnlock returns DENIED", func() { raEq("safeUnlock returns DENIED", safeUnlock("wrong-code"), "DENIED") })
	r, _ := unlock("wrong-code")
	raEq("a failed unlock returns an empty string", r, "")
}
