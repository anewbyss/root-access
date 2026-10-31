// @cp Status encodes with json tags | GET /status returns JSON | TestThreatLevel passes
// @ci-only Go's net/http + testing packages exceed Judge0's compile time limit, so this capstone runs in GitHub Actions.
package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
)

//@@USER@@
//@@PRELUDE@@
func main() {
	raTry("Status encodes with json tags", func() {
		var st Status
		b, _ := json.Marshal(st)
		s := string(b)
		raCp(strings.Contains(s, `"node"`) && strings.Contains(s, `"up"`), "Status encodes with json tags", s)
	})
	raTry("GET /status returns JSON", func() {
		go raUserMain()
		time.Sleep(300 * time.Millisecond)
		rec := httptest.NewRecorder()
		http.DefaultServeMux.ServeHTTP(rec, httptest.NewRequest("GET", "/status", nil))
		var out []map[string]interface{}
		err := json.Unmarshal(rec.Body.Bytes(), &out)
		raCp(rec.Code == 200 && err == nil, "GET /status returns JSON", fmt.Sprintf("code %d, body %q", rec.Code, rec.Body.String()))
	})
	raTry("TestThreatLevel passes", func() {
		testing.Init()
		ok := testing.RunTests(func(pat, str string) (bool, error) { return true, nil }, []testing.InternalTest{{Name: "TestThreatLevel", F: TestThreatLevel}})
		raCp(ok, "TestThreatLevel passes", "your table-driven test reported failures")
	})
}
