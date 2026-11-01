def count_fails(statuses):
    count = 0
    for s in statuses:
        if s == "FAIL":
            count += 1
    return count
