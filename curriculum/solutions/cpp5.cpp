#include <string>
#include <string_view>
#include <cctype>

std::string caesar(std::string_view text, int shift) {
    std::string out;
    out.reserve(text.size());
    int s = ((shift % 26) + 26) % 26;
    for (char c : text) {
        unsigned char u = static_cast<unsigned char>(c);
        if (std::isalpha(u)) {
            char base = std::isupper(u) ? 'A' : 'a';
            out.push_back(static_cast<char>(base + (c - base + s) % 26));
        } else {
            out.push_back(c);
        }
    }
    return out;
}

bool is_private(std::string_view ip) {
    return ip.starts_with("10.") || ip.starts_with("192.168.");
}
