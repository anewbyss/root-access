// @cp at() throws out_of_range | move leaves source empty | Buffer is move-only and noexcept | Your TESTs pass
#include <type_traits>
#include <stdexcept>
//@@PRELUDE@@
//@@USER@@
int main() {
    ra_try("at() throws out_of_range", [] { Buffer b(2); bool t = false; try { b.at(2); } catch (const std::out_of_range&) { t = true; } ra_cp(t, "at() throws out_of_range"); });
    ra_try("move leaves source empty", [] { Buffer a(3); a.at(0) = 7; Buffer b(std::move(a)); ra_cp(b.size() == 3 && a.size() == 0 && b.at(0) == 7, "move leaves source empty"); });
    ra_cp(!std::is_copy_constructible_v<Buffer> && std::is_nothrow_move_constructible_v<Buffer> && std::is_nothrow_move_assignable_v<Buffer>, "Buffer is move-only and noexcept");
#ifdef TEST
    int before = ra_gtest::failures(); std::size_t n = ra_gtest::cases().size();
    for (auto& c : ra_gtest::cases()) c.fn();
    ra_cp(n > 0 && ra_gtest::failures() == before, "Your TESTs pass", std::to_string(ra_gtest::failures() - before) + " failures in " + std::to_string(n) + " tests");
#else
    ra_cp(false, "Your TESTs pass", "add #include <gtest/gtest.h> and a TEST(...)");
#endif
}
