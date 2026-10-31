#include <memory>
#include <stdexcept>
#include <utility>
#include <cstddef>
#include <gtest/gtest.h>

class Buffer {
public:
    explicit Buffer(std::size_t n) : data_(std::make_unique<int[]>(n)), size_(n) {}
    Buffer(const Buffer&) = delete;
    Buffer& operator=(const Buffer&) = delete;
    Buffer(Buffer&& other) noexcept : data_(std::move(other.data_)), size_(std::exchange(other.size_, 0)) {}
    Buffer& operator=(Buffer&& other) noexcept {
        data_ = std::move(other.data_);
        size_ = std::exchange(other.size_, 0);
        return *this;
    }
    int& at(std::size_t i) {
        if (i >= size_) throw std::out_of_range("Buffer::at");
        return data_[i];
    }
    std::size_t size() const { return size_; }

private:
    std::unique_ptr<int[]> data_;
    std::size_t size_;
};

TEST(BufferTest, ThrowsOutOfRange) {
    Buffer b(4);
    EXPECT_THROW(b.at(4), std::out_of_range);
}

TEST(BufferTest, MoveTransfersOwnership) {
    Buffer a(3);
    Buffer b(std::move(a));
    EXPECT_EQ(b.size(), 3u);
    EXPECT_EQ(a.size(), 0u);
}
