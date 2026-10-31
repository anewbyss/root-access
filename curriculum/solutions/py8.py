from collections import Counter
import json

def top_words(text, n):
    return Counter(text.lower().split()).most_common(n)

def to_json(text, n):
    return json.dumps(dict(top_words(text, n)))
