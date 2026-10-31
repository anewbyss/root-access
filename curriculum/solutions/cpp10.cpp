#include <algorithm>
#include <numeric>
#include <ranges>
#include <string>
#include <vector>
#include <cstdio>

struct Hit {
    std::string ip;
    int count;
};

int analyze(std::vector<Hit>& hits) {
    std::ranges::sort(hits, std::greater{}, &Hit::count);
    auto it = std::find_if(hits.begin(), hits.end(), [](const Hit& h) { return h.ip.starts_with("10."); });
    int total = std::accumulate(hits.begin(), hits.end(), 0, [](int acc, const Hit& h) { return acc + h.count; });
    int noisy = 0;
    for (const auto& h : hits | std::views::filter([](const Hit& h) { return h.count > 20; })) {
        noisy += h.count;
    }
    if (it != hits.end() && noisy > 0) std::printf("first internal: %s, noisy total %d\n", it->ip.c_str(), noisy);
    return total;
}
