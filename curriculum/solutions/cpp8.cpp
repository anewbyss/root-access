#include <span>
#include <optional>
#include <vector>
#include <cstddef>

std::optional<std::vector<std::byte>> heartbeat_reply(std::span<const std::byte> payload, std::size_t claimed) {
    if (claimed > payload.size()) {
        return std::nullopt;
    }
    auto echo = payload.first(claimed);
    return std::vector<std::byte>(echo.begin(), echo.end());
}
