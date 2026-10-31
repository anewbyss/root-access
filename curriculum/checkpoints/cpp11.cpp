// @cp sweep counts every host | sweep of 200 hosts | sweep of none
#include <string>
#include <vector>
//@@PRELUDE@@
//@@USER@@
int main() {
    ra_try("sweep counts every host", [] { ra_eq("sweep counts every host", sweep({"a", "b", "c"}), 3); });
    ra_try("sweep of 200 hosts", [] { std::vector<std::string> hs; for (int i = 0; i < 200; i++) hs.push_back("h" + std::to_string(i)); ra_eq("sweep of 200 hosts", sweep(hs), 200); });
    ra_try("sweep of none", [] { ra_eq("sweep of none", sweep({}), 0); });
}
