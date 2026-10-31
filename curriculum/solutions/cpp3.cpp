#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>

std::unordered_map<std::string, int> tally(const std::vector<std::string>& ips) {
    std::unordered_map<std::string, int> counts;
    for (const auto& ip : ips) {
        ++counts[ip];
    }
    return counts;
}

void report(const std::vector<std::string>& ips) {
    for (const auto& [ip, n] : tally(ips)) {
        std::cout << ip << ": " << n << '\n';
    }
}
