#include <string>
#include <sstream>

std::size_t count_words(const std::string& text) {
    std::istringstream in(text);
    std::string word;
    std::size_t n = 0;
    while (in >> word) ++n;
    return n;
}

void redact(std::string& msg) {
    msg = "[REDACTED]";
}

std::string scan(const std::string& host, int port = 443) {
    return host + ":" + std::to_string(port);
}

int demo() {
    int threshold = 3;
    auto noisy = [threshold](std::size_t words) { return words > static_cast<std::size_t>(threshold); };
    return noisy(count_words("a b c d")) ? 1 : 0;
}
