#include <concepts>
#include <vector>
#include <algorithm>

template <std::totally_ordered T>
T strongest(const std::vector<T>& xs) {
    return *std::max_element(xs.begin(), xs.end());
}

template <typename T>
class Box {
public:
    explicit Box(T v) : value_(v) {}
    const T& get() const { return value_; }

private:
    T value_;
};

constexpr int xp_for(int rank) { return 50 + 15 * rank; }
static_assert(xp_for(2) == 80);
