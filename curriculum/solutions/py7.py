class AccessDenied(Exception):
    pass

def unlock(code):
    if code == "0451":
        return "OPEN"
    raise AccessDenied(f"bad code {code!r}")

def safe_unlock(code):
    try:
        return unlock(code)
    except AccessDenied:
        return "DENIED"
