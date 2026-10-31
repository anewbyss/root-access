// @cp intro("neo", 3) | intro("trinity", 12)
//@@PRELUDE@@
//@@USER@@
int main() {
    ra_try("intro(\"neo\", 3)", [] { ra_eq("intro(\"neo\", 3)", intro("neo", 3), std::string("Agent neo // level 3")); });
    ra_try("intro(\"trinity\", 12)", [] { ra_eq("intro(\"trinity\", 12)", intro("trinity", 12), std::string("Agent trinity // level 12")); });
}
