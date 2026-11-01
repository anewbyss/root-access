// Boot Camp: the zero-experience on-ramp. Twelve tiny Python missions that teach what code *is*
// before any language track. Every mission has numbered steps, a test that explains itself, and a
// reference solution in curriculum/solutions/bcN.py. Checkpoints run on Python 3.13 like the Python track.
RA.lang("basics", {
  name: "Boot Camp", tag: "BC", runtime: "py", base: "python", briefName: "Python", track: true,
  why: "Start here if you have never written code. Twelve short missions in Python, the friendliest first language, that teach how programs work. Each one builds on the last."
});
RA.add("basics", "bc", [
{ title: "Hello, Operator", module: "Your First Program", concept: "what a program is, print, text in quotes",
  lesson: `<p>A <b>program</b> is a list of instructions the computer follows from top to bottom, one line at a time. You type the instructions in the editor, and the computer runs them.</p>
<p>The first instruction most people learn is <code>print</code>. It shows text on the screen:</p><pre>print("Wake up")</pre>
<p>Three things matter here:</p><ul><li><code>print</code> is the name of the instruction, and it is all lowercase.</li><li>The round brackets <code>( )</code> hold what you want printed.</li><li>Text goes inside quote marks <code>" "</code>. Code calls a piece of text a <b>string</b>. The quotes tell Python "this is text, not an instruction".</li></ul>
<p>Lines that start with <code>#</code> are <b>comments</b>. They are notes for humans, and Python skips them.</p>`,
  task: `Write one line of code that prints exactly <code>Hello, Operator</code>, with a capital H, a comma, a space and a capital O.`,
  starter: `# Lines starting with # are comments. Python ignores them.\n# Type your print instruction on the line below.\n\n`,
  checks: [[/print\s*\(/, "Use print( ) to show text."], [/["']Hello, Operator["']/, "Put the exact text Hello, Operator inside quote marks."]],
  steps: [
    "Click on the empty line under the comments in the editor.",
    "Type <code>print</code> in lowercase letters.",
    "Right after it, with no space, type an opening bracket <code>(</code>.",
    "Type a quote mark <code>\"</code>, then <code>Hello, Operator</code>, then another quote mark <code>\"</code>.",
    "Close the bracket with <code>)</code>. Your line should read <code>print(\"Hello, Operator\")</code>.",
    "Press <b>Run checkpoints</b>. Your code runs on a real Python 3.13 engine (on this device if the offline pack is downloaded, otherwise Judge0) and the results come back."
  ],
  test: { py: `out = output_of()\ncheck(out.strip(), "Hello, Operator", "prints Hello, Operator")\ncheck(out.count("\\n"), 1, "prints exactly one line")` } },

{ title: "Call Sign", module: "Variables", concept: "variables, = assignment, strings vs numbers",
  lesson: `<p>A <b>variable</b> is a name that holds a value, like a labelled box. You create one with <code>=</code>:</p><pre>codename = "trinity"
missions = 7</pre>
<p>Read <code>=</code> as "store this value in this name", not "equals". The name goes on the left and the value on the right.</p>
<p>Values come in different <b>types</b>. <code>"trinity"</code> is a <b>string</b> (text, always in quotes). <code>7</code> is an <b>integer</b> (a whole number, never in quotes). <code>"7"</code> with quotes is text that happens to look like a number, and Python treats it differently.</p>
<p>To use a variable, write its name without quotes. <code>print(codename)</code> prints <code>trinity</code>, but <code>print("codename")</code> prints the word <code>codename</code>.</p>
<p>Variable names use lowercase letters, numbers and underscores (<code>call_sign</code>), and can't start with a number or contain spaces.</p>`,
  task: `Create a variable <code>handle</code> holding the text <code>"neo"</code> and a variable <code>level</code> holding the number <code>1</code> (no quotes). Then print <code>handle</code>.`,
  starter: `# Create your two variables here\n\n\n# Then print handle\n`,
  checks: [[/^\s*handle\s*=/m, "Create the variable with handle = ..."], [/^\s*level\s*=\s*1\b/m, "Store the number 1 in level, with no quotes."], [/print\s*\(\s*handle\s*\)/, "Print the variable: print(handle), with no quotes around handle."]],
  steps: [
    "On the first empty line, type <code>handle = \"neo\"</code>. That stores the text neo in a box called handle.",
    "On the next line, type <code>level = 1</code>. There are no quotes, because 1 is a number.",
    "On the line under <code># Then print handle</code>, type <code>print(handle)</code>. There are no quotes around <code>handle</code>, because you want the value inside the box, not the word handle.",
    "Run the checkpoints. You should see <code>neo</code> printed."
  ],
  test: { py: `check(handle, "neo", "handle holds \\"neo\\"")\ncheck(level, 1, "level holds the number 1")\ncheck(type(level).__name__, "int", "level is a number, not text")\ncheck(output_of().strip(), "neo", "prints the value of handle")` } },

{ title: "Node Count", module: "Math", concept: "arithmetic, + - * /, using variables in calculations",
  lesson: `<p>Python does maths with the usual symbols: <code>+</code> add, <code>-</code> subtract, <code>*</code> multiply and <code>/</code> divide.</p><pre>hours = 3
minutes = hours * 60     # 180
print(minutes)</pre>
<p>The right side of <code>=</code> is worked out first, and then the answer is stored. Because <code>minutes</code> is calculated from <code>hours</code>, changing <code>hours</code> changes the answer automatically. Programs do this all the time: they work answers out from data instead of having them typed in.</p>
<p><code>/</code> always gives a decimal (<code>7 / 2</code> is <code>3.5</code>). <code>//</code> gives a whole number (<code>7 // 2</code> is <code>3</code>).</p>`,
  task: `Create <code>nodes = 12</code> and <code>offline = 5</code>. Create <code>online</code> by calculating <code>nodes - offline</code> (don't type 7), then print <code>online</code>.`,
  starter: `nodes = 12\noffline = 5\n\n# Calculate online from the two variables above\n\n# Print it\n`,
  checks: [[/^\s*online\s*=\s*nodes\s*-\s*offline\b/m, "Calculate it: online = nodes - offline"], [/print\s*\(\s*online\s*\)/, "Print the result with print(online)"]],
  steps: [
    "Leave the first two lines as they are. They already create <code>nodes</code> and <code>offline</code>.",
    "Under the calculate comment, type <code>online = nodes - offline</code>. Python works out 12 minus 5 and stores 7 in <code>online</code>.",
    "Under the print comment, type <code>print(online)</code>.",
    "Run the checkpoints. They also change <code>nodes</code> and <code>offline</code> to other numbers to make sure you calculated the answer instead of typing 7."
  ],
  test: { py: `check(online, 7, "online is 7")\ncheck(output_of().strip(), "7", "prints 7")\ncheck(output_of(nodes=20, offline=4).strip(), "16", "still right when nodes=20, offline=4 (so it's calculated)")` } },

{ title: "Message Builder", module: "Text", concept: "joining strings with +, f-strings",
  lesson: `<p>You can join strings together with <code>+</code>:</p><pre>first = "Agent "
name = "smith"
print(first + name)        # Agent smith</pre>
<p>Spaces aren't added for you. <code>"Agent" + "smith"</code> gives <code>Agentsmith</code>, so put the space inside the quotes.</p>
<p>An easier way is an <b>f-string</b>. Put the letter <code>f</code> right before the opening quote, then write variable names inside curly braces <code>{ }</code>, and Python swaps in their values:</p><pre>print(f"Agent {name} reporting")   # Agent smith reporting</pre>`,
  task: `<code>name = "neo"</code> is given. Create <code>message</code> using <code>+</code> so it holds <code>"Agent neo"</code>. Create <code>badge</code> using an f-string so it holds <code>"[neo] online"</code>. Print <code>message</code>, then print <code>badge</code>.`,
  starter: `name = "neo"\n\n# message: join "Agent " and name with +\n\n# badge: use an f-string\n\n# print message, then badge\n`,
  checks: [[/^\s*message\s*=.*\+\s*name/m, "Build message with + and the name variable: \"Agent \" + name"], [/^\s*badge\s*=\s*f["']/m, "Start badge with f\" so it's an f-string"], [/\{\s*name\s*\}/, "Put {name} inside the f-string"], [/print\s*\(\s*message\s*\)[\s\S]*print\s*\(\s*badge\s*\)/, "Print message first, then badge"]],
  steps: [
    "Under the message comment, type <code>message = \"Agent \" + name</code>. Note the space after <code>Agent</code> inside the quotes.",
    "Under the badge comment, type <code>badge = f\"[{name}] online\"</code>. The <code>f</code> goes right before the quote with no space.",
    "Under the print comment, type <code>print(message)</code> on one line and <code>print(badge)</code> on the next.",
    "Run the checkpoints. They try another name too, so make sure you used <code>name</code> and didn't type <code>neo</code> into the message yourself."
  ],
  test: { py: `check(message, "Agent neo", "message is \\"Agent neo\\"")\ncheck(badge, "[neo] online", "badge is \\"[neo] online\\"")\ncheck(output_of(name="trinity").split("\\n")[:2], ["Agent trinity", "[trinity] online"], "works for name=\\"trinity\\" too")` } },

{ title: "Clearance Check", module: "Decisions", concept: "if / else, comparisons, indentation",
  lesson: `<p>Programs make decisions with <code>if</code>. If the <b>condition</b> is true, the indented lines underneath run. Otherwise, the lines under <code>else</code> run:</p><pre>battery = 15
if battery &lt; 20:
    print("charge now")
else:
    print("ok")</pre>
<p>The rules:</p><ul><li>The <code>if</code> line and the <code>else</code> line both end with a colon <code>:</code>.</li><li>The lines that belong to them are <b>indented</b> by 4 spaces (press Tab or type 4 spaces). Indentation is how Python knows which lines are inside the <code>if</code>.</li></ul>
<p>Comparisons: <code>&gt;</code> greater than, <code>&lt;</code> less than, <code>&gt;=</code> at least, <code>&lt;=</code> at most, <code>==</code> equal to (two equals signs, because one <code>=</code> stores a value), and <code>!=</code> not equal.</p>`,
  task: `<code>clearance = 4</code> is given. If <code>clearance</code> is 3 or more, print <code>ACCESS GRANTED</code>. Otherwise print <code>ACCESS DENIED</code>.`,
  starter: `clearance = 4\n\n# Write your if / else below\n`,
  checks: [[/^\s*if\s+clearance\s*>=\s*3\s*:/m, "Start with: if clearance >= 3:  (with the colon at the end)"], [/^\s*else\s*:/m, "Add else: on its own line, with a colon"], [/^\s{2,}print\s*\(/m, "Indent the print lines by 4 spaces under if and else"]],
  steps: [
    "Under the comment, type <code>if clearance &gt;= 3:</code>. Don't forget the colon at the end.",
    "Press Enter, then indent with 4 spaces and type <code>print(\"ACCESS GRANTED\")</code>.",
    "On the next line, go back to the left edge (no spaces) and type <code>else:</code>.",
    "Press Enter, indent with 4 spaces again and type <code>print(\"ACCESS DENIED\")</code>.",
    "Run the checkpoints. They rerun your code with clearance set to 4, 3 and 1, so both branches get tested."
  ],
  test: { py: `check(output_of(clearance=4).strip(), "ACCESS GRANTED", "clearance 4 is granted")\ncheck(output_of(clearance=3).strip(), "ACCESS GRANTED", "clearance 3 is granted (3 or more)")\ncheck(output_of(clearance=1).strip(), "ACCESS DENIED", "clearance 1 is denied")` } },

{ title: "Countdown Loop", module: "Loops", concept: "for loops, range, repeating code",
  lesson: `<p>A <b>loop</b> repeats code so you don't have to copy it out. A <code>for</code> loop runs its indented lines once for every item:</p><pre>for n in range(1, 4):
    print("ping", n)</pre><p>That prints <code>ping 1</code>, <code>ping 2</code> and <code>ping 3</code>. Each time round, <code>n</code> holds the next number.</p>
<p><code>range(start, stop)</code> counts from <code>start</code> up to <b>but not including</b> <code>stop</code>. So <code>range(1, 4)</code> gives 1, 2 and 3. This trips up almost everyone at first.</p>
<p>Like <code>if</code>, the <code>for</code> line ends with a colon, and the repeated lines are indented.</p>`,
  task: `Use a <code>for</code> loop with <code>range</code> to print the numbers 1, 2, 3, 4 and 5, one per line.`,
  starter: `# Use a for loop with range to print 1 to 5\n`,
  checks: [[/^\s*for\s+\w+\s+in\s+range\s*\(/m, "Use for ... in range(...):"], [/range\s*\(\s*1\s*,\s*6\s*\)/, "range(1, 6) gives 1 to 5, because the stop number isn't included"], [/^\s{2,}print\s*\(/m, "Indent the print under the for line"]],
  steps: [
    "Type <code>for n in range(1, 6):</code>. Use 6 rather than 5 because range stops just before the second number.",
    "Press Enter, indent 4 spaces and type <code>print(n)</code>.",
    "That's the whole program. Two lines print five numbers.",
    "Run the checkpoints. If you see 1 to 4, raise the stop number by one."
  ],
  test: { py: `check(output_of().split(), ["1", "2", "3", "4", "5"], "prints 1 to 5")` } },

{ title: "Crew Manifest", module: "Lists", concept: "lists, len, indexing from 0, append, looping over a list",
  lesson: `<p>A <b>list</b> holds many values in order, inside square brackets:</p><pre>relays = ["north", "harbor", "hill"]</pre>
<ul><li><code>len(relays)</code> gives how many items there are (3).</li><li><code>relays[0]</code> is the <b>first</b> item, <code>"north"</code>. Positions start at 0, not 1, so <code>relays[2]</code> is the third.</li><li><code>relays.append("tower")</code> adds an item to the end.</li><li><code>for r in relays:</code> loops over every item in order.</li></ul>`,
  task: `Create <code>agents = ["neo", "trinity", "morpheus"]</code>. Print how many agents there are with <code>len</code>, then print the first agent. Append <code>"tank"</code>, then loop over <code>agents</code> and print each name.`,
  starter: `# 1. Create the agents list\n\n# 2. Print how many there are\n\n# 3. Print the first agent\n\n# 4. Append "tank"\n\n# 5. Loop and print each name\n`,
  checks: [[/^\s*agents\s*=\s*\[/m, "Create the list with agents = [ ... ]"], [/len\s*\(\s*agents\s*\)/, "Use len(agents) to count"], [/agents\s*\[\s*0\s*\]/, "The first item is agents[0]"], [/agents\.append\s*\(/, "Use agents.append(\"tank\")"], [/^\s*for\s+\w+\s+in\s+agents\s*:/m, "Loop with for name in agents:"]],
  steps: [
    "Under comment 1, type <code>agents = [\"neo\", \"trinity\", \"morpheus\"]</code>.",
    "Under comment 2, type <code>print(len(agents))</code>. It prints 3.",
    "Under comment 3, type <code>print(agents[0])</code>. Position 0 is the first item, so it prints neo.",
    "Under comment 4, type <code>agents.append(\"tank\")</code>.",
    "Under comment 5, type <code>for name in agents:</code>, then on the next line, indented, <code>print(name)</code>.",
    "Run the checkpoints. The output should be 3, neo, then all four names."
  ],
  test: { py: `check(agents, ["neo", "trinity", "morpheus", "tank"], "agents ends with tank appended")\ncheck(output_of().split(), ["3", "neo", "neo", "trinity", "morpheus", "tank"], "prints the count, the first agent, then every name")` } },

{ title: "Greeting Protocol", module: "Functions", concept: "def, parameters, return vs print",
  lesson: `<p>A <b>function</b> is a named, reusable block of code. You define it once with <code>def</code> and can use it (<b>call</b> it) as often as you like:</p><pre>def shout(word):
    return word.upper() + "!"

print(shout("run"))     # RUN!
print(shout("now"))     # NOW!</pre>
<ul><li><code>word</code> is a <b>parameter</b>, a variable that receives whatever you pass in the brackets.</li><li><code>return</code> sends a value back to whoever called the function. The function stops there.</li></ul>
<p><b>return and print are not the same.</b> <code>print</code> only shows text on screen. <code>return</code> hands the value back so other code can use it. A function with no <code>return</code> gives back <code>None</code>, which means "nothing".</p>`,
  task: `Write a function <code>greet(name)</code> that <b>returns</b> (not prints) <code>"Welcome, "</code> followed by the name. <code>greet("neo")</code> returns <code>"Welcome, neo"</code>.`,
  starter: `def greet(name):\n    # Replace the next line with a return\n    pass\n\nprint(greet("neo"))\n`,
  checks: [[/def\s+greet\s*\(\s*name\s*\)\s*:/, "Keep def greet(name):"], [/^\s+return\s+/m, "Use return inside the function (indented)"], [/["']Welcome, ["']/, "Include the text \"Welcome, \" with the comma and space"]],
  steps: [
    "Leave <code>def greet(name):</code> as it is. It says the function is called greet and takes one input called name.",
    "Delete the line <code>pass</code>. It means \"do nothing\", and that's why the starter returns None.",
    "In its place, indented 4 spaces, type <code>return \"Welcome, \" + name</code>.",
    "Leave the last line alone. <code>print(greet(\"neo\"))</code> calls your function and prints what it returns.",
    "Run the checkpoints. They call <code>greet</code> with different names and check the returned value."
  ],
  test: { py: `check(greet("neo"), "Welcome, neo", "greet(\\"neo\\")")\ncheck(greet("trinity"), "Welcome, trinity", "greet(\\"trinity\\")")` } },

{ title: "Gatekeeper", module: "Functions + Decisions", concept: "if/else inside a function, returning different values",
  lesson: `<p>Functions get useful when they make decisions. You can put an <code>if</code> inside a function and <code>return</code> different answers:</p><pre>def size(n):
    if n &gt; 100:
        return "big"
    else:
        return "small"</pre>
<p>Look at the indentation. The <code>if</code> is indented once because it is inside the function, and the <code>return</code> lines are indented twice because they are inside the <code>if</code>.</p>
<p>As soon as a <code>return</code> runs, the function ends, so only one answer ever comes back.</p>`,
  task: `Write <code>access(clearance)</code> that returns <code>"GRANTED"</code> when clearance is 3 or more, and <code>"DENIED"</code> otherwise.`,
  starter: `def access(clearance):\n    # your if / else with two returns\n    pass\n`,
  checks: [[/def\s+access\s*\(\s*clearance\s*\)\s*:/, "Keep def access(clearance):"], [/\bif\s+clearance\s*>=\s*3\s*:/, "Use if clearance >= 3:"], [/return\s+["']GRANTED["']/, "Return \"GRANTED\""], [/return\s+["']DENIED["']/, "Return \"DENIED\""]],
  steps: [
    "Delete <code>pass</code>.",
    "Indented once (4 spaces), type <code>if clearance &gt;= 3:</code>.",
    "Indented twice (8 spaces), type <code>return \"GRANTED\"</code>.",
    "Indented once, type <code>else:</code>, and on the next line, indented twice, type <code>return \"DENIED\"</code>.",
    "Run the checkpoints. They try 5, 3, 2 and 0."
  ],
  test: { py: `for c, w in [(5, "GRANTED"), (3, "GRANTED"), (2, "DENIED"), (0, "DENIED")]:\n    check(access(c), w, f"access({c})")` } },

{ title: "Running Total", module: "Functions + Loops", concept: "accumulator pattern, += , loops inside functions",
  lesson: `<p>A very common pattern is the <b>accumulator</b>. You start a variable at zero, add to it inside a loop, then use the result:</p><pre>def count_long(words):
    count = 0
    for w in words:
        if len(w) &gt; 5:
            count += 1
    return count</pre>
<p><code>count += 1</code> is short for <code>count = count + 1</code>, meaning "add one to count".</p>
<p>The <code>return</code> is <b>not</b> indented under the <code>for</code>. It runs once, after the loop has finished. If you indent it inside the loop, the function returns after the first item, which is a classic beginner bug.</p>`,
  task: `Write <code>total(numbers)</code> that adds up every number in the list using a <code>for</code> loop (don't use <code>sum()</code> yet) and returns the result. <code>total([1, 2, 3])</code> returns <code>6</code>, and <code>total([])</code> returns <code>0</code>.`,
  starter: `def total(numbers):\n    # start at 0, add each number, return the result\n    pass\n`,
  checks: [[/def\s+total\s*\(\s*numbers\s*\)\s*:/, "Keep def total(numbers):"], [/^\s+\w+\s*=\s*0\s*$/m, "Start an accumulator at 0, for example result = 0"], [/^\s+for\s+\w+\s+in\s+numbers\s*:/m, "Loop with for n in numbers:"], [/\+=|=\s*\w+\s*\+\s*\w+/, "Add each number with result += n"]],
  steps: [
    "Delete <code>pass</code>.",
    "Indented once, type <code>result = 0</code>. This is your running total.",
    "Indented once, type <code>for n in numbers:</code>.",
    "Indented twice, type <code>result += n</code>, which adds the current number.",
    "Indented once (back in line with <code>for</code>, not inside it), type <code>return result</code>.",
    "Run the checkpoints. They include an empty list, which should return 0."
  ],
  test: { py: `check(total([1, 2, 3]), 6, "total([1, 2, 3])")\ncheck(total([]), 0, "total([]) is 0")\ncheck(total([10, -4]), 6, "total([10, -4])")\ncheck(total([5]), 5, "a single number")` } },

{ title: "Read the Error", module: "Reading Errors", concept: "SyntaxError, NameError, debugging with error messages",
  lesson: `<p>Every programmer sees errors constantly. An error message isn't a failure. It's the computer telling you exactly what confused it and where. Learning to read errors is one of the most important skills you'll build.</p>
<p>Two very common kinds:</p><ul><li><b>SyntaxError</b>: the code isn't written in a shape Python understands, such as a missing colon, bracket or quote. Python won't run any of the program. Look at the line it names and the line just above it.</li><li><b>NameError</b>: you used a name Python has never seen, usually a typo (<code>cout</code> instead of <code>count</code>) or a variable used before it was created.</li></ul>
<p>Some bugs give no error at all. The code runs, but the answer is wrong. When that happens, compare what you got with what you wanted and trace the code line by line.</p>`,
  task: `The starter code has two bugs. <code>count_fails(statuses)</code> should return how many items in the list equal <code>"FAIL"</code>. Run it first and read the error, then fix both bugs.`,
  starter: `def count_fails(statuses)\n    count = 0\n    for s in statuses:\n        if s == "FAIL":\n            cout = count + 1\n    return count\n`,
  checks: [[/def\s+count_fails\s*\(\s*statuses\s*\)\s*:/, "Bug 1: the def line needs a colon at the end"], [/^\s+count\s*(\+=\s*1|=\s*count\s*\+\s*1)/m, "Bug 2: the line inside the if should add 1 to count. Check the spelling."]],
  steps: [
    "Press <b>Run checkpoints</b> before changing anything. You'll see <code>SyntaxError: expected ':'</code>. Python is pointing at the first line.",
    "Add the missing colon to the end of the first line: <code>def count_fails(statuses):</code>.",
    "Run again. There's no error this time, but the answer is wrong (0 instead of 2), because the code inside the <code>if</code> stores into <code>cout</code>, a misspelled new variable.",
    "Change <code>cout = count + 1</code> to <code>count = count + 1</code>, or the shorter <code>count += 1</code>.",
    "Run the checkpoints. Both bugs are fixed when they all pass."
  ],
  test: { py: `check(count_fails(["OK", "FAIL", "FAIL"]), 2, "counts two FAILs")\ncheck(count_fails([]), 0, "empty list is 0")\ncheck(count_fails(["OK"]), 0, "no FAILs is 0")` } },

{ title: "Field Report", module: "Capstone", concept: "functions, loops, conditions, strings together",
  lesson: `<p>Your first capstone puts everything together: a function, a loop, a condition and an f-string.</p>
<p>Plan before you type. Write the steps in plain words first. Programmers call this <b>pseudocode</b>:</p><pre># if the list is empty: give back "no data"
# count how many items are "FAIL"
# give back "&lt;fails&gt; of &lt;total&gt; failed"</pre>
<p>Then turn each line into code. Checking for the empty case first is called a <b>guard</b>. It deals with the odd case up front so the rest of the code stays simple.</p>
<p>After this, you're ready for any language track. Python rank 1 is the natural next step.</p>`,
  task: `Write <code>report(statuses)</code>. If the list is empty, return <code>"no data"</code>. Otherwise count the <code>"FAIL"</code> items and return <code>"&lt;fails&gt; of &lt;total&gt; failed"</code>. <code>report(["OK", "FAIL", "FAIL", "OK"])</code> returns <code>"2 of 4 failed"</code>.`,
  starter: `def report(statuses):\n    # 1. if the list is empty, return "no data"\n    # 2. count the FAILs\n    # 3. return the sentence with an f-string\n    pass\n`,
  checks: [[/def\s+report\s*\(\s*statuses\s*\)\s*:/, "Keep def report(statuses):"], [/len\s*\(\s*statuses\s*\)\s*==\s*0|not\s+statuses/, "Check for an empty list: if len(statuses) == 0:"], [/^\s+for\s+\w+\s+in\s+statuses\s*:/m, "Loop over statuses to count the FAILs"], [/return\s+f["']/, "Return the sentence with an f-string"]],
  steps: [
    "Delete <code>pass</code>. Keep the comments as your plan.",
    "Step 1: indented once, type <code>if len(statuses) == 0:</code>, and on the next line, indented twice, <code>return \"no data\"</code>.",
    "Step 2: indented once, <code>fails = 0</code>, then <code>for s in statuses:</code>, then indented twice <code>if s == \"FAIL\":</code>, then indented three times <code>fails += 1</code>.",
    "Step 3: indented once (outside the loop), <code>return f\"{fails} of {len(statuses)} failed\"</code>.",
    "Run the checkpoints. They try an empty list, a list with no FAILs and a mixed list."
  ],
  test: { py: `check(report(["OK", "FAIL", "FAIL", "OK"]), "2 of 4 failed", "mixed list")\ncheck(report([]), "no data", "empty list")\ncheck(report(["OK"]), "0 of 1 failed", "no fails")\ncheck(report(["FAIL"] * 3), "3 of 3 failed", "all fails")` } }
]);
