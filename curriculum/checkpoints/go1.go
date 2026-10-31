// @cp intro("neo", 3) | intro("trinity", 12) | main prints the intro
package main

import (
	"io"
	"os"
	"strings"
)

//@@USER@@
//@@PRELUDE@@
func main() {
	raTry(`intro("neo", 3)`, func() { raEq(`intro("neo", 3)`, intro("neo", 3), "Agent neo // level 3") })
	raTry(`intro("trinity", 12)`, func() { raEq(`intro("trinity", 12)`, intro("trinity", 12), "Agent trinity // level 12") })
	raTry("main prints the intro", func() {
		r, w, _ := os.Pipe()
		old := os.Stdout
		os.Stdout = w
		raUserMain()
		w.Close()
		os.Stdout = old
		out, _ := io.ReadAll(r)
		raCp(strings.Contains(string(out), "Agent neo // level 3"), "main prints the intro", "stdout was: "+strings.TrimSpace(string(out)))
	})
}
