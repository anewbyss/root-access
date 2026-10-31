// @cp tally counts | tally empty
//@@PRELUDE@@
//@@USER@@
int main() {
    ra_try("tally counts", [] { auto t = tally({"a", "b", "a"}); ra_cp(t.size() == 2 && t["a"] == 2 && t["b"] == 1, "tally counts", "size " + std::to_string(t.size())); });
    ra_try("tally empty", [] { ra_eq("tally empty", tally({}).size(), std::size_t(0)); });
}
