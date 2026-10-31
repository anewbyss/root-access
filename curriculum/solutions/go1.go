package main

import "fmt"

func intro(handle string, level int) string {
	return fmt.Sprintf("Agent %s // level %d", handle, level)
}

func main() {
	fmt.Println(intro("neo", 3))
}
