#include <string>
#include <cstdio>

class Node {
public:
    explicit Node(std::string name, int strength = 0) : name_(std::move(name)), strength_(strength) {}
    int strength() const { return strength_; }
    const std::string& name() const { return name_; }

private:
    std::string name_;
    int strength_;
};

class LogFile {
public:
    explicit LogFile(const char* path) : f_(std::fopen(path, "a")) {}
    ~LogFile() { if (f_) std::fclose(f_); }
    LogFile(const LogFile&) = delete;
    LogFile& operator=(const LogFile&) = delete;
    void write(const char* line) { if (f_) std::fputs(line, f_); }

private:
    std::FILE* f_;
};
