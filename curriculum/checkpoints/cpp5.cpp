// @cp shift 3 | wraps z to c | keeps case and punctuation | is_private
//@@PRELUDE@@
//@@USER@@
int main() {
    ra_try("shift 3", [] { ra_eq("shift 3", caesar("abc", 3), std::string("def")); });
    ra_try("wraps z to c", [] { ra_eq("wraps z to c", caesar("xyz", 3), std::string("abc")); });
    ra_try("keeps case and punctuation", [] { ra_eq("keeps case and punctuation", caesar("Hello, World!", 1), std::string("Ifmmp, Xpsme!")); });
    ra_try("is_private", [] { ra_cp(is_private("10.0.0.4") && is_private("192.168.1.1") && !is_private("8.8.8.8"), "is_private"); });
}
