#include <iostream>
#include <string>

std::string intro(const std::string& handle, int level) {
    return "Agent " + handle + " // level " + std::to_string(level);
}

int main() {
    const std::string handle = "neo";
    auto line = intro(handle, 3);
    std::cout << line << '\n';
}
