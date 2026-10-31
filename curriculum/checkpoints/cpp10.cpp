// @cp analyze sorts by count descending | analyze returns the total | analyze of empty
#include <string>
#include <vector>
//@@PRELUDE@@
//@@USER@@
int main() {
    std::vector<Hit> hits = {{"10.0.0.1", 5}, {"8.8.8.8", 40}, {"10.0.0.9", 25}};
    int total = 0;
    ra_try("analyze sorts by count descending", [&] { total = analyze(hits); ra_cp(hits[0].count == 40 && hits[1].count == 25 && hits[2].count == 5, "analyze sorts by count descending", "first is " + hits[0].ip); });
    ra_eq("analyze returns the total", total, 70);
    ra_try("analyze of empty", [] { std::vector<Hit> e; ra_eq("analyze of empty", analyze(e), 0); });
}
