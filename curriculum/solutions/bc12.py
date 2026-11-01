def report(statuses):
    if len(statuses) == 0:
        return "no data"
    fails = 0
    for s in statuses:
        if s == "FAIL":
            fails += 1
    return f"{fails} of {len(statuses)} failed"
