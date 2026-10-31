// @cp count_words | count_words of blank text | redact edits in place | scan default port is 443
//@@PRELUDE@@
//@@USER@@
int main() {
    ra_try("count_words", [] { ra_eq("count_words", count_words("knock  knock\tneo"), std::size_t(3)); });
    ra_try("count_words of blank text", [] { ra_eq("count_words of blank text", count_words("   "), std::size_t(0)); });
    ra_try("redact edits in place", [] { std::string m = "launch codes"; redact(m); ra_cp(m != "launch codes", "redact edits in place", "string unchanged; take it by reference"); });
    ra_try("scan default port is 443", [] { ra_eq("scan default port is 443", scan("relay"), scan("relay", 443)); });
}
