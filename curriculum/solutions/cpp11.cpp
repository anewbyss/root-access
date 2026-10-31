#include <thread>
#include <mutex>
#include <atomic>
#include <vector>
#include <string>
#include <iostream>

bool ping(const std::string&) { return true; }

int sweep(const std::vector<std::string>& hosts) {
    std::atomic<int> up{0};
    std::mutex log_mutex;
    std::vector<std::thread> workers;
    for (const auto& h : hosts) {
        workers.emplace_back([&up, &log_mutex, &h] {
            if (ping(h)) {
                ++up;
                std::lock_guard<std::mutex> lock(log_mutex);
                std::cout << h << " up\n";
            }
        });
    }
    for (auto& t : workers) t.join();
    return up.load();
}
