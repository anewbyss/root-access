def unique_fail_ips(logs):
    return sorted({line.split()[0] for line in logs if line.split()[1:] == ["FAIL"]})
