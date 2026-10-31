// @cp Node stores name and strength | Node constructor is explicit | a class is non-copyable RAII
#include <type_traits>
#include <tuple>
//@@PRELUDE@@
//@@USER@@
template <class... Ts> struct ra_list {};
template <class T> constexpr bool ra_raii() { return std::is_class_v<T> && !std::is_copy_constructible_v<T> && !std::is_trivially_destructible_v<T>; }
int main() {
    ra_try("Node stores name and strength", [] { const Node n("north", 40); ra_cp(n.name() == "north" && n.strength() == 40, "Node stores name and strength"); });
    ra_cp(!std::is_convertible_v<std::string, Node>, "Node constructor is explicit", "std::string converts to Node implicitly");
    ra_cp(__RAII_CHECK__, "a class is non-copyable RAII", "need a class with a destructor and a deleted copy constructor");
}
