// @cp echoes the claimed bytes | refuses claimed > size (Heartbleed) | zero-length reply
#include <cstddef>
#include <vector>
//@@PRELUDE@@
//@@USER@@
int main() {
    std::vector<std::byte> buf = {std::byte{'p'}, std::byte{'i'}, std::byte{'n'}, std::byte{'g'}};
    ra_try("echoes the claimed bytes", [&] { auto r = heartbeat_reply(buf, 2); ra_cp(r && r->size() == 2 && (*r)[0] == std::byte{'p'} && (*r)[1] == std::byte{'i'}, "echoes the claimed bytes"); });
    ra_try("refuses claimed > size (Heartbleed)", [&] { ra_cp(!heartbeat_reply(buf, 64000), "refuses claimed > size (Heartbleed)", "returned data for a 64000-byte claim on a 4-byte payload"); });
    ra_try("zero-length reply", [&] { auto r = heartbeat_reply(buf, 0); ra_cp(r && r->empty(), "zero-length reply"); });
}
