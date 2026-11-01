// ROOT//ACCESS learner guidance. Shared by the web app and the Swift app (through tools/swift-bridge.js).
//   RA.stepsFor(m)          numbered steps (mission.steps or RA.STEPS[id])
//   RA.requirements(m,code) live structure checklist
//   RA.ORIENT[lang]         "first time in this language" primer shown on rank 1
//   RA.keyTerms(m)          glossary entries that appear in the lesson/task
//   RA.explain(m, result)   plain-English meaning of a failing checkpoint
//   RA.parsons(m, sol)      the reference solution's lines, shuffled (hint tier 2)
//   RA.hint(m, code, report, tier)  the hint ladder: 1 nudge -> 2 shuffled lines -> 3 full answer
(function (g) {
  const RA = g.RA = g.RA || {};
  const strip = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  RA.stepsFor = (m) => (m && (m.steps || (RA.STEPS && RA.STEPS[m.id]))) || [];
  RA.requirements = (m, code) => (m.checks || []).map((c) => { c.re.lastIndex = 0; return { ok: c.re.test(code || ""), hint: c.hint }; });

  // ---------------- glossary ----------------
  RA.GLOSSARY = {
    "program": "A list of instructions the computer runs from top to bottom.",
    "variable": "A name that holds a value, like a labelled box. You create one with =.",
    "value": "A piece of data, such as the number 3 or the text \"neo\".",
    "string": "Text. It is written inside quote marks, as in \"hello\".",
    "integer": "A whole number with no decimal point, like 7 or -2.",
    "boolean": "A value that is either true or false.",
    "type": "The kind of value something is: text, number, true/false, list, and so on.",
    "function": "A named, reusable block of code. You define it once and call it as many times as you like.",
    "parameter": "A variable in a function's definition that receives whatever you pass in.",
    "argument": "The actual value you pass into a function when you call it.",
    "return": "Sends a value back from a function to the code that called it, and ends the function.",
    "call": "To run a function by writing its name followed by brackets, such as greet(\"neo\").",
    "condition": "Something that is either true or false, like score >= 90. It decides which code runs.",
    "if": "Runs a block of code only when a condition is true.",
    "loop": "Code that repeats, once per item or until a condition changes.",
    "for loop": "A loop that runs once for each item in a list or range.",
    "range": "A sequence of numbers. range(1, 6) gives 1 to 5, because the end isn't included.",
    "list": "An ordered collection of values in square brackets. The first position is 0.",
    "array": "An ordered collection of values. Most languages count positions from 0.",
    "index": "A position in a list. Counting starts at 0, so [0] is the first item.",
    "dictionary": "A collection that maps keys to values, like a phone book from name to number.",
    "map": "A collection that maps keys to values. Also the name of the operation that transforms every item in a list.",
    "set": "A collection with no duplicates and no fixed order.",
    "tuple": "A small fixed group of values bundled together, like (2, 1).",
    "indentation": "Spaces at the start of a line. Python uses them to decide which lines belong inside an if, loop or function.",
    "comment": "A note for humans that the computer ignores. It starts with # or //.",
    "syntax": "The grammar of a language: where colons, brackets and quotes go.",
    "error": "A message telling you what went wrong and on which line. Read it, because it is a clue.",
    "exception": "An error raised while a program runs, which can be caught and handled.",
    "compile": "To translate source code into a program the computer can run. Compiled languages check your code before it runs.",
    "class": "A blueprint for objects. It bundles data (fields) with behaviour (methods).",
    "object": "One thing made from a class, with its own data.",
    "method": "A function that belongs to an object or class, called with a dot: name.upper().",
    "field": "A variable stored inside an object.",
    "property": "A named value on an object. Some properties are computed every time you read them.",
    "struct": "A type that groups related fields together. In Swift, structs are copied when assigned.",
    "enum": "A type with a fixed set of named options, like LOW, MEDIUM and HIGH.",
    "interface": "A list of methods a type promises to provide, without saying how.",
    "protocol": "Swift's word for an interface: a set of requirements a type promises to meet.",
    "trait": "Rust's word for an interface: shared behaviour that types can implement.",
    "generic": "Code written once that works for many types, written with a placeholder like T.",
    "closure": "A function that remembers the variables around where it was created.",
    "lambda": "A short function with no name, often passed straight into another function.",
    "callback": "A function you hand to other code so it can call it later.",
    "async": "Code that can pause while it waits for something, such as the network, without freezing everything else.",
    "await": "Pauses the current async function until a result is ready.",
    "thread": "A separate line of execution, so the program can do several things at once.",
    "concurrency": "Doing several tasks at overlapping times, such as checking 500 servers at once.",
    "mutex": "A lock that lets only one thread touch shared data at a time.",
    "optional": "A value that may be missing. You have to check it before you use it.",
    "null": "A special value meaning \"nothing here\". It is also called nil or None.",
    "pointer": "A value that holds the memory address of another value.",
    "reference": "Another name for an existing value, so changes through it affect the original.",
    "test": "Code that runs your code and checks the answer automatically.",
    "assert": "A line in a test that fails loudly if something isn't what you expected.",
    "regex": "A regular expression, a mini language for matching patterns in text.",
    "query": "A question you ask a database, written in SQL.",
    "table": "Rows and columns of data in a database, like a spreadsheet.",
    "pipe": "In the shell, | sends one command's output into the next command.",
    "immutable": "Can't be changed after it is created.",
    "recursion": "A function that calls itself on a smaller piece of the problem."
  };
  const COMMON = { list: 1, type: 1, call: 1, value: 1, return: 1, table: 1, pipe: 1, class: 1, object: 1, test: 1, loop: 1, program: 0, map: 1, set: 1, key: 1, index: 1, block: 1, error: 1 };
  const termRe = {};
  Object.keys(RA.GLOSSARY).forEach((t) => { termRe[t] = new RegExp("\\b" + t.replace(/ /g, "\\s+") + "(e?s)?\\b", "i"); });
  RA.keyTerms = (m, max) => {
    const text = strip([m.concept, m.lesson, m.task].join(" "));
    // Everyday words only count when the mission actually teaches them (in the concept, bold or code).
    const marked = strip([m.concept].concat(((m.lesson || "") + (m.task || "")).match(/<(b|strong|code)>[\s\S]*?<\/\1>/g) || []).join(" | "));
    const hits = [];
    Object.keys(RA.GLOSSARY).forEach((t) => {
      const x = text.search(termRe[t]);
      if (x >= 0 && (!COMMON[t] || termRe[t].test(marked))) hits.push([x, t]);
    });
    hits.sort((a, b) => a[0] - b[0]);
    return hits.slice(0, max || 8).map(([, t]) => ({ term: t, def: RA.GLOSSARY[t] }));
  };

  // ---------------- first-time orientation per language ----------------
  const O = (run, file, out, comment, gotchas) => ({ run, file, out, comment, gotchas });
  RA.ORIENT = {
    basics: O("Python reads your file from top to bottom and runs each line. No compile step is needed.",
      "Everything goes in one file. Some missions use functions (def) and some are plain lines of code.",
      "<code>print(\"text\")</code> shows text on the screen.",
      "<code># like this</code>",
      ["Indentation (4 spaces) is part of the grammar.", "Text needs quotes, but numbers and variable names don't.", "<code>=</code> stores a value and <code>==</code> compares two values."]),
    python: O("Python runs your file top to bottom. The checkpoints then call your functions with test inputs.",
      "Write <code>def</code> functions with exactly the names in the task. Extra helper functions are fine.",
      "<code>print(x)</code>. Functions should usually <code>return</code> rather than print.",
      "<code># like this</code>",
      ["Blocks are indented 4 spaces and the line before ends with <code>:</code>.", "A function without <code>return</code> gives back <code>None</code>.", "<code>pass</code> in a starter means \"do nothing\", so replace it."]),
    javascript: O("JavaScript runs your file, then the checkpoints call your functions. No compile step is needed.",
      "Write <code>function name(...) { }</code> with the names from the task.",
      "<code>console.log(x)</code>",
      "<code>// like this</code>",
      ["Use <code>===</code> to compare, not <code>==</code>.", "Use <code>const</code> by default and <code>let</code> when a value changes.", "Strings with <code>${...}</code> inside need backticks <code>`</code>."]),
    typescript: O("TypeScript is JavaScript with types. It is compiled with strict checks, then run on Node.",
      "Write functions and types with the exact names in the task, and add type annotations like <code>(x: number): string</code>.",
      "<code>console.log(x)</code>",
      "<code>// like this</code>",
      ["Type errors stop the build, so read the first one.", "<code>name: Type</code> goes after the name.", "<code>undefined</code> and <code>null</code> must be handled when a type allows them."]),
    sql: O("Your SQL runs against a small training database (agents, events, nodes). The checkpoint compares your result rows with the expected rows.",
      "Write one statement, or several separated by <code>;</code>.",
      "A <code>SELECT</code> statement's result is your output.",
      "<code>-- like this</code>",
      ["Text values go in single quotes: <code>'failed'</code>.", "Column order and row order matter, so use <code>ORDER BY</code> when the task asks.", "Clause order is SELECT, FROM, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT."]),
    bash: O("Your script runs in a fresh temporary folder with test files already created. The checkpoints look at what it prints and the files it leaves behind.",
      "Write commands one per line, top to bottom, as you would type them in a terminal.",
      "<code>echo \"text\"</code>",
      "<code># like this</code>",
      ["Don't put spaces around <code>=</code>: write <code>NAME=value</code>.", "Wrap variables in double quotes: <code>\"$file\"</code>.", "<code>$1</code> is the first argument passed to the script."]),
    go: O("Go is compiled. If the build fails, nothing runs, so fix the first compiler error first.",
      "<code>package main</code> and imports go at the top. Then write your functions (and <code>func main()</code> if asked).",
      "<code>fmt.Println(x)</code> (needs <code>import \"fmt\"</code>)",
      "<code>// like this</code>",
      ["An unused variable or import is a compile error.", "<code>:=</code> declares a new variable and <code>=</code> assigns to an existing one.", "Opening braces go on the same line as <code>func</code>/<code>if</code>/<code>for</code>."]),
    rust: O("Rust is compiled with strict safety checks. Compiler errors explain the fix. Read the <code>help:</code> line.",
      "Write <code>fn</code> functions with the names in the task. <code>fn main()</code> is the entry point when asked for.",
      "<code>println!(\"{}\", x)</code>",
      "<code>// like this</code>",
      ["Variables can't be changed unless declared with <code>let mut</code>.", "The last expression in a function, with no <code>;</code>, is returned.", "<code>&amp;str</code> is borrowed text and <code>String</code> is owned text."]),
    swift: O("Swift is compiled. Checkpoints run on a real Swift compiler and call your functions.",
      "Write <code>func</code> declarations with the exact names and labels from the task.",
      "<code>print(x)</code>",
      "<code>// like this</code>",
      ["<code>let</code> can't change and <code>var</code> can.", "Argument labels are part of the name: <code>intro(handle:level:)</code>.", "Optionals (<code>String?</code>) must be unwrapped. Avoid <code>!</code>."]),
    kotlin: O("Kotlin is compiled for the JVM. Checkpoints call your functions directly.",
      "Write top-level <code>fun</code> declarations. Add <code>fun main()</code> when the task asks for it.",
      "<code>println(x)</code>",
      "<code>// like this</code>",
      ["<code>val</code> can't change and <code>var</code> can.", "Types come after names: <code>score: Int</code>.", "<code>String?</code> may be null, so use <code>?:</code> for a fallback."]),
    java: O("Java is compiled. Every method lives inside a class, so keep the class from the starter.",
      "Put your methods inside the starter's class braces. Use <code>static</code> methods unless the task says otherwise.",
      "<code>System.out.println(x)</code>",
      "<code>// like this</code>",
      ["Every statement ends with <code>;</code>.", "Compare strings with <code>.equals()</code>, not <code>==</code>.", "Types come before names: <code>int score</code>."]),
    csharp: O("C# is compiled on .NET. This file uses top-level statements, so you can write code with no class around it.",
      "Write <code>static</code> methods at the top level, plus any classes or records the task asks for.",
      "<code>Console.WriteLine(x)</code>",
      "<code>// like this</code>",
      ["Every statement ends with <code>;</code>.", "Method names use PascalCase: <code>ThreatLevel</code>.", "Interpolated strings start with <code>$</code>: <code>$\"{x}\"</code>."]),
    cpp: O("C++ is compiled with g++ (C++23). One compiler error can cause many more, so fix the first one.",
      "Keep the <code>#include</code> lines and write functions with the names in the task. Add <code>int main()</code> when asked.",
      "<code>std::cout &lt;&lt; x &lt;&lt; '\\n';</code>",
      "<code>// like this</code>",
      ["Every statement ends with <code>;</code>, and so does every class or struct, after its <code>}</code>.", "Standard library names start with <code>std::</code>.", "Pass big values by <code>const&amp;</code> to avoid copies."])
  };
  RA.orientHTML = (L) => {
    const o = RA.ORIENT[L]; if (!o) return "";
    return `<ul class="orient"><li><b>How it runs:</b> ${o.run}</li><li><b>What to write:</b> ${o.file}</li><li><b>Printing:</b> ${o.out}</li><li><b>Comments:</b> ${o.comment}</li><li><b>Common gotchas:</b><ul>${o.gotchas.map((x) => `<li>${x}</li>`).join("")}</ul></li></ul>`;
  };

  // ---------------- plain-English failure explanations ----------------
  const ERR = [
    [/IndentationError|unexpected indent|expected an indented block|unindent does not match/i, "Python is confused by the spaces at the start of a line. Lines inside an if, for or def must be indented the same amount (4 spaces), and the line before them must end with a colon."],
    [/SyntaxError.*expected ':'|expected ':'/i, "A line that starts a block (if, else, for, def, while) is missing the colon : at the end."],
    [/unterminated string|EOL while scanning|unterminated string literal/i, "A piece of text is missing its closing quote mark."],
    [/SyntaxError|invalid syntax/i, "The code isn't written in a shape the language understands. Check the line named in the error and the one above it for a missing bracket, quote, colon or comma."],
    [/NameError: name '(\w+)' is not defined/i, (m) => `You used the name <code>${esc(m[1])}</code>, but nothing with that name exists yet. Check the spelling, and make sure it is created (or the function is defined) with exactly that name.`],
    [/ReferenceError: (\w+) is not defined/i, (m) => `<code>${esc(m[1])}</code> doesn't exist. Check that your function or variable has exactly that name, including capital letters.`],
    [/TypeError:.*NoneType/i, "Something was None, meaning nothing. Usually a function didn't return a value. Check that every path through it ends with a return."],
    [/TypeError: can only concatenate str|must be str, not int|unsupported operand type/i, "You tried to join text with a number. Turn the number into text first with str(n), or use an f-string."],
    [/TypeError: (\w+)\(\) (missing|takes)/i, (m) => `<code>${esc(m[1])}</code> was called with a different number of inputs than it accepts. Match the parameters in the task exactly.`],
    [/is not a function/i, "Something was called like a function but isn't one. Check the function's name and that you defined it with function or =>."],
    [/IndexError|index out of range|ArrayIndexOutOfBounds|out_of_range/i, "The code asked for a position past the end of a list. Remember that positions start at 0, so the last item is at length − 1."],
    [/KeyError: (.+)/i, (m) => `The dictionary has no key ${esc(m[1])}. Check for the key first, or use .get() with a default.`],
    [/ZeroDivisionError|divide by zero/i, "The code divided by zero. Handle the empty or zero case first."],
    [/RecursionError|StackOverflow|stack overflow/i, "A function kept calling itself forever. Make sure there is a case that stops."],
    [/AttributeError: '(\w+)' object has no attribute '(\w+)'/i, (m) => `A ${esc(m[1])} doesn't have <code>${esc(m[2])}</code>. Check the spelling, or whether the value is the type you expected.`],
    [/undefined: (\w+)/i, (m) => `Go can't find <code>${esc(m[1])}</code>. Define it with exactly that name, or import the package it comes from.`],
    [/declared and not used|imported and not used/i, "Go refuses to compile unused variables or imports. Use them or delete them."],
    [/E0425|cannot find (value|function) `?(\w+)`?/i, (m) => `Rust can't find <code>${esc(m[2] || "that name")}</code>. Check the spelling and that it is defined in this file.`],
    [/E0308|mismatched types/i, "The value's type doesn't match what was declared, for example returning a String where &str was expected. Read the compiler's expected/found lines."],
    [/E0384|cannot assign twice to immutable/i, "Rust variables can't be changed by default. Declare it with let mut."],
    [/E0382|borrow of moved value|use of moved value/i, "The value was moved somewhere else and can't be used again. Borrow it with & or clone it."],
    [/cannot find '(\w+)' in scope/i, (m) => `Swift can't find <code>${esc(m[1])}</code>. Check the spelling and that it is declared with that exact name.`],
    [/Unresolved reference:? '?(\w+)'?/i, (m) => `Kotlin can't find <code>${esc(m[1])}</code>. Check the spelling and imports.`],
    [/cannot find symbol/i, "Java can't find a name you used. Check the spelling and capitals, and that it is declared or imported."],
    [/error CS0103: The name '(\w+)'/i, (m) => `C# can't find <code>${esc(m[1])}</code>. Check the spelling (C# method names usually start with a capital letter).`],
    [/error CS1002|; expected|expected ';'/i, "A statement is missing its semicolon ; at the end."],
    [/was not declared in this scope|use of undeclared identifier/i, "C++ can't find a name you used. Check the spelling, add std:: for library names, or add the right #include."],
    [/no matching function for call/i, "A function was called with the wrong argument types or number of arguments. Compare with its declaration."],
    [/Time Limit Exceeded|timed out/i, "The program ran too long, which almost always means a loop that never ends. Check that the loop's condition eventually becomes false."],
    [/command not found/i, "The shell couldn't find that command. Check the spelling, or whether you meant a variable ($NAME)."]
  ];
  const parseGotWant = (d) => { const x = String(d || "").match(/got (.*), want (.*)$/s); return x ? { got: x[1].trim(), want: x[2].trim() } : null; };
  RA.explain = (m, r) => {
    if (!r || r.status !== "FAIL") return "";
    const d = String(r.detail || "");
    if (d === "not reached") return "This check never ran, because the program stopped earlier, usually at an error above. Fix the first failing checkpoint, then run again.";
    for (const [re, msg] of ERR) { const x = d.match(re); if (x) return typeof msg === "function" ? msg(x) : msg; }
    const gw = parseGotWant(d);
    if (gw) {
      const { got, want } = gw;
      let s = `Your code produced <code>${esc(got.slice(0, 120))}</code>, but the checkpoint expected <code>${esc(want.slice(0, 120))}</code>.`;
      if (/^(None|undefined|null|nil)$/.test(got)) s += " Getting nothing back usually means the function doesn't return a value. Use return instead of print, and remove any leftover pass.";
      else if (got.replace(/\s+/g, "") === want.replace(/\s+/g, "")) s += " The only difference is spacing, so check spaces and line breaks.";
      else if (got.toLowerCase() === want.toLowerCase()) s += " The only difference is capital letters.";
      else if (got.replace(/['"]/g, "") === want.replace(/['"]/g, "")) s += " One is text and the other is a number (look at the quotes). Convert with int(...) or str(...).";
      else if (/^\[.*\]$/.test(got) && /^\[.*\]$/.test(want) && got.length !== want.length) s += " The lists have different contents. Check that you include every matching item and nothing extra.";
      return s;
    }
    if (r.label === "Compiles") return "The compiler rejected the code, so none of the checkpoints could run. Fix the first error shown. Later errors are often side effects of it.";
    if (r.label === "Your code runs") return "Your program crashed while it was loading, before any checks ran. The message above names the problem and the line.";
    if (r.label === "Runs to completion") return "The program crashed or was stopped partway through. Read the message for the first error.";
    return "This checkpoint ran your code and the result wasn't what it expected. Re-read the task's example, then compare it with what your code does for that input.";
  };

  // ---------------- Parsons lines (hint tier 2) ----------------
  const hash = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  RA.parsonsLines = (m, sol) => {
    sol = String(sol || "").replace(/\r/g, "");
    let lines = sol.split("\n").filter((l) => l.trim() && !/^\s*(#|\/\/|--)(?!!)/.test(l) && !/^\s*#include/.test(l));
    if (lines.length < 2 || (m.lang === "sql" && lines.length < 3)) {
      // One-liners (SQL, short Python): split before clause keywords and after semicolons.
      lines = [];
      sol.replace(/\s+/g, " ").trim().replace(/;\s*/g, ";\n").split("\n").forEach((stmt) =>
        stmt.split(/(?=\b(?:FROM|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|LEFT JOIN|JOIN|SELECT|UPDATE|INSERT|DELETE|COMMIT|CREATE|WITH)\b)/)
          .forEach((x) => { if (x.trim()) lines.push(x.trim()); }));
    }
    if (lines.length < 2 && lines[0]) {
      // A single line: arrange its pieces instead (quoted text stays whole).
      lines = lines[0].trim().split(/(\b[fbr]?"[^"]*"|\b[fbr]?'[^']*'|"[^"]*"|'[^']*'|\s+|[()|,;])/).filter((x) => x && x.trim());
      lines.pieces = true;
    }
    return lines;
  };
  // Rebuild a one-line answer from its pieces with natural spacing: print("x"), range(1, 6).
  RA.joinPieces = (parts) => parts.reduce((acc, p, i) => {
    if (!i) return p;
    const prev = parts[i - 1], tight = /[(\[]$/.test(prev) || /^[),:;\]]/.test(p) || (p === "(" && /[\w>\]]$/.test(prev));
    return acc + (tight ? "" : " ") + p;
  }, "");
  RA.parsons = (m, sol) => {
    const lines = RA.parsonsLines(m, sol);
    const order = lines.map((_, i) => i);
    let seed = hash(m.id);
    for (let i = order.length - 1; i > 0; i--) { seed = (Math.imul(seed, 1103515245) + 12345) >>> 0; const j = seed % (i + 1); [order[i], order[j]] = [order[j], order[i]]; }
    if (order.length > 1 && order.every((v, i) => v === i)) order.push(order.shift());
    return { lines, shuffled: order.map((i) => lines[i]), order, pieces: !!lines.pieces };
  };

  // ---------------- the hint ladder ----------------
  const words = (s) => strip(s).toLowerCase().match(/[a-z_][a-z0-9_]{2,}/g) || [];
  const relatedStep = (steps, hint) => {
    const hw = new Set(words(hint)); let best = -1, score = 0;
    steps.forEach((s, i) => { const n = words(s).filter((w) => hw.has(w)).length; if (n > score) { score = n; best = i; } });
    return best;
  };
  RA.hint = (m, code, report, tier, sol) => {
    tier = Math.max(1, Math.min(3, tier || 1));
    const steps = RA.stepsFor(m);
    if (tier === 3) return { tier, title: "Full answer", kind: "solution", code: sol || "", html: "This is the reference solution for this exact mission. Read it line by line, then retype it yourself rather than pasting. Typing it is how it sticks." };
    if (tier === 2) {
      const p = RA.parsons(m, sol);
      return { tier, title: p.pieces ? "Put the pieces in order" : "Put the lines in order", kind: "parsons", pieces: p.pieces, lines: p.shuffled, answer: p.lines,
        html: p.pieces ? "The answer is a single line. Here are its pieces, shuffled. Put them in order to rebuild it." : "These are the lines of a working answer, shuffled. Put them in the right order. Indentation is kept as a clue." };
    }
    const fresh = !code || code.trim() === String(m.starter || "").trim();
    if (fresh && steps.length) return { tier, title: "Where to start", kind: "nudge", step: 0, html: `Start with step 1: ${steps[0]}` };
    const unmet = RA.requirements(m, code).filter((r) => !r.ok);
    if (unmet.length) {
      const k = relatedStep(steps, unmet[0].hint);
      return { tier, title: "Next requirement", kind: "nudge", step: k, html: `${esc(unmet[0].hint)}${k >= 0 ? `<br><span class="tiny">Step ${k + 1} covers this: ${steps[k]}</span>` : ""}` };
    }
    const fail = report && report.results && report.results.find((r) => r.status === "FAIL");
    if (fail) return { tier, title: `Checkpoint: ${fail.label}`, kind: "nudge", html: RA.explain(m, fail) };
    if (report && RA.allPassed(report)) return { tier, title: "All clear", kind: "nudge", html: "Every checkpoint passes. Explain your solution in one sentence to lock it in." };
    return { tier, title: "Structure looks right", kind: "nudge", html: "Every requirement is in place. Now run the checkpoints to test how it behaves. If one fails, it will be explained here." };
  };
})(typeof window !== "undefined" ? window : globalThis);
