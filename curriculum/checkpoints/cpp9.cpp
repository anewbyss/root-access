// @cp strongest of ints | strongest of strings | strongest is concept-constrained | Box<T> get()
#include <string>
#include <vector>
//@@PRELUDE@@
//@@USER@@
struct RaNoOrder {};
template <class T> concept ra_callable = requires(std::vector<T> v) { strongest(v); };
int main() {
    ra_try("strongest of ints", [] { ra_eq("strongest of ints", strongest(std::vector<int>{3, 9, 2}), 9); });
    ra_try("strongest of strings", [] { ra_eq("strongest of strings", strongest(std::vector<std::string>{"alpha", "omega", "beta"}), std::string("omega")); });
    ra_cp(!ra_callable<RaNoOrder>, "strongest is concept-constrained", "strongest accepted a type with no ordering");
    ra_try("Box<T> get()", [] { Box<int> b(7); ra_eq("Box<T> get()", b.get(), 7); });
}
