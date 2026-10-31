def make_counter(start=0):
    count = start
    def tick():
        nonlocal count
        count += 1
        return count
    return tick
