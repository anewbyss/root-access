// @cp score 95 | score 90 | score 60 | score 59 | score 30 | score 0 | Level is a scoped enum
#include <type_traits>
//@@PRELUDE@@
//@@USER@@
int main() {
    int s[] = {95, 90, 60, 59, 30, 0};
    const char* w[] = {"CRITICAL", "CRITICAL", "HIGH", "MEDIUM", "MEDIUM", "LOW"};
    for (int i = 0; i < 6; i++) { std::string l = "score " + std::to_string(s[i]); ra_try(l, [&] { ra_eq(l, std::string(name(classify(s[i]))), std::string(w[i])); }); }
    ra_cp(std::is_enum_v<Level> && !std::is_convertible_v<Level, int>, "Level is a scoped enum", "use enum class");
}
