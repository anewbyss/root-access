package main

import "fmt"

type Node struct {
	Name     string
	Strength int
}

func (n *Node) Boost(by int) int {
	n.Strength += by
	return n.Strength
}

func (n Node) Label() string {
	return fmt.Sprintf("%s(%d)", n.Name, n.Strength)
}

type Relay struct {
	Node
	Hops int
}
