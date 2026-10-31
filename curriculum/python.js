RA.lang("python", { name: "Python", tag: "PY", runtime: "py", why: "The #1 language for AI, data and automation. Checkpoints run on Python 3.13." });
RA.add("python", "py", [
{ title: "First Contact", concept: "variables, types, f-strings, return",
  lesson: `<p>A variable is a name bound to a value. Python figures out the type: <code>str</code>, <code>int</code>, <code>float</code>, <code>bool</code>, <code>None</code>.</p><pre>handle = "neo"      # str
level = 3           # int
uptime = 99.9       # float
active = True       # bool
print(type(level))  # &lt;class 'int'&gt;</pre><p>Functions are defined with <code>def</code> and indentation (4 spaces). <code>return</code> sends a value back. An f-string puts expressions inside text:</p><pre>def tag(name):
    return f"[{name.upper()}]"</pre>`,
  task: `Write <code>def intro(handle, level)</code> that returns <code>"Agent &lt;handle&gt; // level &lt;level&gt;"</code>. Example: <code>intro("neo", 3)</code> returns <code>"Agent neo // level 3"</code>.`,
  starter: `def intro(handle, level):\n    # your code here\n    pass\n`,
  checks: [[/def\s+intro\s*\(\s*handle\s*,\s*level\s*\)\s*:/, "Keep def intro(handle, level):"], [/return/, "Return the string, don't print it."]],
  test: { py: `check(intro("neo", 3), "Agent neo // level 3", "basic")\ncheck(intro("trinity", 12), "Agent trinity // level 12", "two digits")` } },

{ title: "Triage Protocol", concept: "if/elif/else, comparisons, boolean logic",
  lesson: `<p>Branching uses <code>if</code>, <code>elif</code> and <code>else</code>. Conditions combine with <code>and</code>, <code>or</code> and <code>not</code>. Checks run top to bottom and the first true one wins:</p><pre>def door(clearance, armed):
    if clearance &gt;= 5 and not armed:
        return "open"
    elif clearance &gt;= 3:
        return "escort"
    else:
        return "deny"</pre><p>Loops: <code>for x in items:</code> walks any sequence and <code>while cond:</code> repeats. <code>break</code> exits and <code>continue</code> skips ahead.</p>`,
  task: `Write <code>def threat_level(score)</code>: 90 or above returns <code>"CRITICAL"</code>, 60 or above <code>"HIGH"</code>, 30 or above <code>"MEDIUM"</code>, otherwise <code>"LOW"</code>.`,
  starter: `def threat_level(score):\n    # your code here\n    pass\n`,
  checks: [[/\bif\b/, "Use if"], [/\belif\b/, "Use elif for the middle bands"]],
  test: { py: `for s, w in [(95,"CRITICAL"),(90,"CRITICAL"),(60,"HIGH"),(59,"MEDIUM"),(30,"MEDIUM"),(0,"LOW")]:\n    check(threat_level(s), w, f"score {s}")` } },

{ title: "Signal in the Noise", concept: "lists, dicts, sets, comprehensions",
  lesson: `<p>The core containers:</p><pre>ips = ["10.0.0.4", "10.0.0.9"]      # list: ordered, mutable
seen = {"10.0.0.4"}                  # set: unique, fast lookup
agent = {"name": "neo", "rank": 4}   # dict: key -&gt; value
point = (3, 4)                       # tuple: fixed</pre><p>A comprehension builds a collection in one expression:</p><pre>fails = [line for line in logs if "FAIL" in line]
unique = {line.split()[0] for line in logs}
by_name = {a["name"]: a["rank"] for a in agents}</pre><p><code>sorted()</code> returns a new sorted list. <code>str.split()</code> breaks a line into words.</p>`,
  task: `Each log line looks like <code>"10.0.0.9 FAIL"</code>. Write <code>def unique_fail_ips(logs)</code> returning a <b>sorted list</b> of unique IPs whose action is <code>FAIL</code>. Try a set comprehension.`,
  starter: `def unique_fail_ips(logs):\n    # your code here\n    pass\n`,
  checks: [[/\{[^}]*for\s+\w+\s+in|set\s*\(/, "Use a set (comprehension or set()) to dedupe"], [/sorted\s*\(/, "Return sorted(...)"]],
  test: { py: `logs = ["10.0.0.9 FAIL", "10.0.0.4 OK", "10.0.0.9 FAIL", "10.0.0.2 FAIL"]\ncheck(unique_fail_ips(logs), ["10.0.0.2", "10.0.0.9"], "dedupe + sort")\ncheck(unique_fail_ips([]), [], "empty")` } },

{ title: "The Counter Ritual", concept: "defaults, *args/**kwargs, closures, nonlocal, lambda",
  lesson: `<p>Functions are values: you can pass them, return them and store them.</p><pre>def greet(name, prefix="Agent", *tags, **meta):
    return f"{prefix} {name} {tags} {meta}"

square = lambda x: x * x</pre><p>A <b>closure</b> is an inner function that remembers variables from the function that created it. Use <code>nonlocal</code> to reassign them:</p><pre>def make_multiplier(k):
    def times(x):
        return x * k
    return times</pre>`,
  task: `Write <code>def make_counter(start=0)</code> that returns a function. Each call to that function increments a private count and returns it. <code>c = make_counter()</code>, then <code>c()</code> returns 1 and <code>c()</code> returns 2.`,
  starter: `def make_counter(start=0):\n    # your code here\n    pass\n`,
  checks: [[/def\s+make_counter\s*\(\s*start\s*=\s*0\s*\)/, "def make_counter(start=0):"], [/nonlocal/, "Use nonlocal inside the inner function"]],
  test: { py: `c = make_counter()\ncheck(c(), 1, "first")\ncheck(c(), 2, "second")\nd = make_counter(10)\ncheck(d(), 11, "custom start")\ncheck(c(), 3, "independent state")` } },

{ title: "Cipher Breaker", concept: "string methods, slicing, ord/chr, join",
  lesson: `<p>Strings are immutable sequences. Useful moves:</p><pre>s = "Wake Up"
s.lower(), s.upper(), s.strip(), s.replace("Up", "up")
s[0], s[-1], s[1:4], s[::-1]      # slicing
"-".join(["a", "b"])              # "a-b"
ord("A"), chr(66)                  # 65, "B"
c.isalpha(), c.isupper()</pre><p>Build output in a list and <code>"".join()</code> it. Repeated <code>+=</code> on strings is slower.</p>`,
  task: `Write <code>def caesar(text, shift)</code> that shifts letters by <code>shift</code> (wrapping around z to a), keeps case and leaves non-letters unchanged. <code>caesar("Abc, xyz!", 3)</code> returns <code>"Def, abc!"</code>.`,
  starter: `def caesar(text, shift):\n    out = []\n    # your code here\n    return "".join(out)\n`,
  checks: [[/ord\s*\(/, "Use ord() to get a character code"], [/chr\s*\(/, "Use chr() to turn it back"], [/%\s*26/, "Wrap with % 26"]],
  test: { py: `check(caesar("Abc, xyz!", 3), "Def, abc!", "basic")\ncheck(caesar("Def, abc!", -3), "Abc, xyz!", "decode")\ncheck(caesar("Matrix", 26), "Matrix", "full wrap")` } },

{ title: "Node Registry", concept: "classes, dataclasses, methods, dunder methods",
  lesson: `<p>Classes bundle data with behavior. <code>@dataclass</code> writes <code>__init__</code>, <code>__repr__</code> and <code>__eq__</code> for you:</p><pre>from dataclasses import dataclass, field

@dataclass(order=True)
class Threat:
    severity: int
    name: str = field(compare=False)

    def escalate(self, n=1):
        self.severity += n
        return self.severity</pre><p><code>self</code> is the instance. Dunder methods like <code>__len__</code> and <code>__str__</code> plug your class into Python's built-ins.</p>`,
  task: `Create a <code>@dataclass</code> named <code>Node</code> with <code>name: str</code> and <code>strength: int = 0</code>. Add a method <code>boost(self, n)</code> that adds <code>n</code> to strength and returns the new value, and <code>__str__</code> returning <code>"name(strength)"</code>.`,
  starter: `from dataclasses import dataclass\n\n# your code here\n`,
  checks: [[/@dataclass/, "Decorate with @dataclass"], [/class\s+Node/, "class Node:"], [/def\s+boost\s*\(\s*self\s*,\s*n\s*\)/, "def boost(self, n):"], [/def\s+__str__/, "Define __str__"]],
  test: { py: `n = Node("relay")\ncheck(n.strength, 0, "default")\ncheck(n.boost(5), 5, "boost")\ncheck(str(n), "relay(5)", "__str__")\ncheck(Node("a", 2) == Node("a", 2), True, "dataclass equality")` } },

{ title: "Fail Gracefully", concept: "try/except/else/finally, raise, custom exceptions",
  lesson: `<p>Errors are exceptions. Catch the specific ones you expect:</p><pre>class AccessDenied(Exception):
    pass

try:
    port = int(raw)
except ValueError as e:
    port = None
else:
    print("parsed")      # only if no exception
finally:
    print("always runs")</pre><p><code>raise AccessDenied("bad code")</code> throws your own. Never write a bare <code>except:</code>, because it swallows bugs too.</p>`,
  task: `Define <code>class AccessDenied(Exception)</code>. Write <code>unlock(code)</code> that returns <code>"OPEN"</code> when code is <code>"0451"</code> and otherwise raises <code>AccessDenied</code>. Write <code>safe_unlock(code)</code> that returns <code>unlock(code)</code>, or <code>"DENIED"</code> if AccessDenied was raised.`,
  starter: `# your code here\n`,
  checks: [[/class\s+AccessDenied\s*\(\s*Exception\s*\)/, "class AccessDenied(Exception):"], [/raise\s+AccessDenied/, "raise AccessDenied(...)"], [/except\s+AccessDenied/, "except AccessDenied:"]],
  test: { py: `check(unlock("0451"), "OPEN", "correct code")\ncheck(safe_unlock("1234"), "DENIED", "wrong code")\ntry:\n    unlock("x"); check(False, True, "should raise")\nexcept AccessDenied:\n    check(True, True, "raises AccessDenied")` } },

{ title: "Relic Index", concept: "collections.Counter, json, itertools, pathlib",
  lesson: `<p>Python comes with a large standard library. A few things you'll use every week:</p><pre>from collections import Counter, defaultdict
Counter("hello").most_common(1)    # [('l', 2)]

import json
json.dumps({"a": 1}); json.loads('{"a": 1}')

from itertools import groupby, chain
from pathlib import Path
Path("logs").glob("*.log")</pre><p>Know them before you <code>pip install</code> something. In a real project you'd use a virtual environment: <code>python -m venv .venv</code>.</p>`,
  task: `Write <code>def top_words(text, n)</code> that lowercases the text, splits it on whitespace and returns <code>Counter(...).most_common(n)</code>. Then write <code>def to_json(text, n)</code> that returns <code>json.dumps(dict(top_words(text, n)))</code>.`,
  starter: `from collections import Counter\nimport json\n\n# your code here\n`,
  checks: [[/Counter\s*\(/, "Use Counter(...)"], [/most_common\s*\(\s*n\s*\)/, ".most_common(n)"], [/json\.dumps/, "json.dumps(...)"]],
  test: { py: `t = "Wake up wake UP neo the matrix has you"\ncheck(top_words(t, 2), [("wake", 2), ("up", 2)], "top 2")\ncheck(json.loads(to_json(t, 1)), {"wake": 2}, "json")` } },

{ title: "Stream Engine", concept: "iterators, generators, yield, decorators",
  lesson: `<p>A <b>generator</b> produces values lazily with <code>yield</code>, so it can handle streams too large for memory:</p><pre>def read_forever(sock):
    while True:
        yield sock.recv()</pre><p>A <b>decorator</b> wraps a function to add behavior:</p><pre>import functools
def logged(fn):
    @functools.wraps(fn)
    def wrapper(*a, **kw):
        print("calling", fn.__name__)
        return fn(*a, **kw)
    return wrapper</pre>`,
  task: `Write a generator <code>def chunks(seq, size)</code> that yields lists of up to <code>size</code> items. Then write a decorator <code>def shout(fn)</code> whose wrapper returns <code>fn(...).upper()</code>.`,
  starter: `import functools\n\n# your code here\n`,
  checks: [[/yield/, "Use yield"], [/def\s+shout\s*\(\s*fn\s*\)/, "def shout(fn):"], [/functools\.wraps/, "Use @functools.wraps(fn)"]],
  test: { py: `check(list(chunks([1,2,3,4,5], 2)), [[1,2],[3,4],[5]], "chunks")\ncheck(list(chunks([], 3)), [], "empty")\n@shout\ndef hi(n): return f"hi {n}"\ncheck(hi("neo"), "HI NEO", "decorator")\ncheck(hi.__name__, "hi", "wraps keeps name")` } },

{ title: "Swarm Sweep", concept: "asyncio, async/await, gather",
  lesson: `<p><code>asyncio</code> runs many I/O tasks at once on one thread. <code>async def</code> defines a coroutine and <code>await</code> pauses it while others run:</p><pre>import asyncio

async def ping(host):
    await asyncio.sleep(0.1)    # stand-in for network I/O
    return f"{host}:ok"

async def main():
    results = await asyncio.gather(*(ping(h) for h in hosts))</pre><p><code>gather</code> keeps results in input order. For CPU-heavy work, use <code>multiprocessing</code>, not async.</p>`,
  task: `Write <code>async def ping(host)</code> that awaits <code>asyncio.sleep(0)</code> and returns <code>f"{host}:ok"</code>. Write <code>async def sweep(hosts)</code> that pings them all concurrently with <code>asyncio.gather</code> and returns a list.`,
  starter: `import asyncio\n\n# your code here\n`,
  checks: [[/async\s+def\s+ping/, "async def ping(host):"], [/await\s+asyncio\.sleep/, "await asyncio.sleep(0)"], [/asyncio\.gather/, "asyncio.gather(...)"]],
  test: { py: `check(await sweep(["a", "b", "c"]), ["a:ok", "b:ok", "c:ok"], "gather")\ncheck(await sweep([]), [], "empty")` } },

{ title: "Proof of Work", concept: "type hints, assert, unit tests, edge cases",
  lesson: `<p>Fluent Python is typed and tested. Type hints document intent, and tools like <code>mypy</code> check them:</p><pre>def parse_port(s: str) -&gt; int | None: ...

import unittest
class TestPort(unittest.TestCase):
    def test_valid(self):
        self.assertEqual(parse_port("443"), 443)</pre><p>Most teams use <code>pytest</code>, where a test is just a function with <code>assert</code>. Always test edge cases: empty input, boundaries and bad types.</p>`,
  task: `Write <code>def is_valid_ip(s: str) -&gt; bool</code> for IPv4: four dot-separated parts, each all digits, from 0 to 255, with no leading zeros (except "0" itself). Include the type hints.`,
  starter: `def is_valid_ip(s: str) -> bool:\n    # your code here\n    pass\n`,
  checks: [[/def\s+is_valid_ip\s*\(\s*s\s*:\s*str\s*\)\s*->\s*bool/, "def is_valid_ip(s: str) -> bool:"], [/split\s*\(\s*["']\.["']\s*\)/, "split('.')"]],
  test: { py: `for ip, w in [("10.0.0.1",True),("255.255.255.255",True),("0.0.0.0",True),("256.1.1.1",False),("1.2.3",False),("01.2.3.4",False),("a.b.c.d",False),("1.2.3.4.5",False),("",False)]:\n    check(is_valid_ip(ip), w, repr(ip))` } },

{ title: "Operation: Log Hunter", concept: "capstone: parse, model, aggregate, handle bad data",
  lesson: `<p>Time to put it together. Real ops code reads messy input, skips bad lines without crashing, aggregates the rest and returns structured output.</p><pre>from collections import Counter
from dataclasses import dataclass

@dataclass
class Summary:
    total: int
    fails: int
    top_ip: str | None</pre><p>Use what you've learned: parsing (rank 5), validation (rank 11), exceptions (rank 7), Counter (rank 8) and dataclasses (rank 6).</p>`,
  task: `Each line is <code>"&lt;ip&gt; &lt;STATUS&gt;"</code>. Write <code>def analyze(lines) -&gt; Summary</code> with a <code>@dataclass Summary(total, fails, top_ip)</code>. Skip malformed lines (not exactly 2 parts, or an invalid IP). <code>total</code> counts valid lines, <code>fails</code> counts status <code>FAIL</code>, and <code>top_ip</code> is the IP with the most FAILs (None if there are none). Reuse <code>is_valid_ip</code>.`,
  starter: `from collections import Counter\nfrom dataclasses import dataclass\n\ndef is_valid_ip(s: str) -> bool:\n    parts = s.split(".")\n    return len(parts) == 4 and all(p.isdigit() and str(int(p)) == p and 0 <= int(p) <= 255 for p in parts)\n\n# your code here\n`,
  checks: [[/@dataclass/, "Define Summary as a dataclass"], [/class\s+Summary/, "class Summary"], [/def\s+analyze/, "def analyze(lines)"], [/Counter/, "Count with Counter"]],
  test: { py: `lines = ["10.0.0.9 FAIL","10.0.0.4 OK","garbage","10.0.0.9 FAIL","999.1.1.1 FAIL","10.0.0.4 FAIL",""]\ns = analyze(lines)\ncheck((s.total, s.fails, s.top_ip), (4, 3, "10.0.0.9"), "summary")\ncheck(analyze(["1.1.1.1 OK"]).top_ip, None, "no fails")` } }
]);
