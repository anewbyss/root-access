import functools

def chunks(seq, size):
    for i in range(0, len(seq), size):
        yield list(seq[i:i + size])

def shout(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs).upper()
    return wrapper
