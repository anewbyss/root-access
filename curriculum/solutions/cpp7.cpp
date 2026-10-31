#include <memory>
#include <optional>
#include <string>
#include <string_view>
#include <charconv>
#include <vector>

struct Implant {
    std::string id;
};

std::optional<int> parse_port(std::string_view s) {
    int value = 0;
    auto [ptr, ec] = std::from_chars(s.data(), s.data() + s.size(), value);
    if (ec != std::errc{} || ptr != s.data() + s.size() || value < 1 || value > 65535) {
        return std::nullopt;
    }
    return value;
}

std::vector<std::unique_ptr<Implant>> collect() {
    std::vector<std::unique_ptr<Implant>> found;
    std::unique_ptr<Implant> p = std::make_unique<Implant>(Implant{"x-17"});
    found.push_back(std::move(p));
    return found;
}
