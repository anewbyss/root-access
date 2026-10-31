package main

import (
	"errors"
	"fmt"
)

var ErrDenied = errors.New("access denied")

func unlock(code string) (string, error) {
	if code == "0451" {
		return "OPEN", nil
	}
	return "", fmt.Errorf("unlock %q: %w", code, ErrDenied)
}

func safeUnlock(code string) string {
	res, err := unlock(code)
	if errors.Is(err, ErrDenied) {
		return "DENIED"
	}
	return res
}
