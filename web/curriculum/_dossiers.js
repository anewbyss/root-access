// ROOT//ACCESS language dossiers + teaching praxis.
// Every claim here has a public source in `src` (index into RA.SOURCES). Updated October 2026.
(function (g) {
  const RA = g.RA = g.RA || {};

  RA.SOURCES = {
    so26: { label: "Stack Overflow Developer Survey 2026", url: "https://survey.stackoverflow.co/2026/technology" },
    so26blog: { label: "Stack Overflow blog: 2026 survey results", url: "https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/" },
    so25: { label: "Stack Overflow Developer Survey 2025", url: "https://survey.stackoverflow.co/2025/technology" },
    tiobe: { label: "TIOBE Index, October 2026 (TechRepublic)", url: "https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/" },
    octo: { label: "GitHub Octoverse 2025", url: "https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/" },
    typedai: { label: "GitHub: why AI is pushing developers toward typed languages", url: "https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/" },
    nsa: { label: "NSA/CISA: Memory Safe Languages (June 2025)", url: "https://www.cisa.gov/resources-tools/resources/memory-safe-languages-reducing-vulnerabilities-modern-software-development" },
    cisaBad: { label: "CISA Product Security Bad Practices", url: "https://www.cisa.gov/resources-tools/resources/product-security-bad-practices" },
    cisaRoad: { label: "CISA: The Case for Memory Safe Roadmaps", url: "https://www.cisa.gov/case-memory-safe-roadmaps" },
    ktFirst: { label: "Android Developers: Kotlin-first", url: "https://developer.android.com/kotlin/first" },
    compose: { label: "Android Developers Blog: Compose First (May 2026)", url: "https://android-developers.googleblog.com/2026/05/android-ui-development-is-compose-first.html" },
    kmp: { label: "Android Developers: Kotlin Multiplatform", url: "https://developer.android.com/kotlin/multiplatform" },
    swift62: { label: "Swift.org: Swift 6.2 released", url: "https://www.swift.org/blog/swift-6.2-released/" },
    swiftDec: { label: "Swift.org: What's new in Swift, December 2025", url: "https://www.swift.org/blog/whats-new-in-swift-december-2025/" },
    java25: { label: "InfoQ: Java 25 released", url: "https://www.infoq.com/news/2025/09/java25-released/" },
    net10: { label: "Microsoft: Announcing .NET 10", url: "https://devblogs.microsoft.com/dotnet/announcing-dotnet-10/" },
    cpp26: { label: "InfoQ: C++26 reflection, safety, async", url: "https://www.infoq.com/news/2026/04/cpp-26-reflection-safety-async/" },
    gcc16: { label: "isocpp.org: GCC 16.1", url: "https://isocpp.org/blog/2026/04/gcc-16.1" },
    primm: { label: "Sentance, Waite & Kallia (2019): PRIMM study", url: "https://www.tandfonline.com/doi/pdf/10.1080/08993408.2019.1608781" },
    rpf: { label: "Raspberry Pi Foundation: pedagogy review", url: "https://www.raspberrypi.org/app/uploads/2021/11/Teaching-programming-in-schools-pedagogy-review-Raspberry-Pi-Foundation.pdf" },
    parsons: { label: "NSF PAR: Parsons problems as scaffolding", url: "https://par.nsf.gov/biblio/10510493-parsons-problems-scaffold-code-writing-impact-performance-problem-solving-efficiency" },
    worked: { label: "ACM: worked examples and Parsons problems review", url: "https://dl.acm.org/doi/10.1145/3560266" },
    fading: { label: "arXiv: faded worked examples", url: "https://arxiv.org/pdf/2512.20714" },
    // Official learning paths
    pyTut: { label: "Python Tutorial (python.org)", url: "https://docs.python.org/3/tutorial/" },
    mdnJs: { label: "MDN: JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
    tsHb: { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
    sqlite: { label: "SQLite SQL reference", url: "https://www.sqlite.org/lang.html" },
    pgTut: { label: "PostgreSQL Tutorial", url: "https://www.postgresql.org/docs/current/tutorial.html" },
    bashMan: { label: "GNU Bash Reference Manual", url: "https://www.gnu.org/software/bash/manual/bash.html" },
    goTour: { label: "A Tour of Go", url: "https://go.dev/tour/" },
    rustBook: { label: "The Rust Programming Language (the Book)", url: "https://doc.rust-lang.org/book/" },
    swiftBook: { label: "The Swift Programming Language", url: "https://docs.swift.org/swift-book/" },
    ktDocs: { label: "Kotlin documentation", url: "https://kotlinlang.org/docs/home.html" },
    devJava: { label: "dev.java: Learn Java", url: "https://dev.java/learn/" },
    csLearn: { label: "Microsoft Learn: C#", url: "https://learn.microsoft.com/en-us/dotnet/csharp/" },
    cppCore: { label: "C++ Core Guidelines", url: "https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines" }
  };

  // Teaching praxis. Every mission is staged with PRIMM; scaffolding fades after repeated failure.
  RA.PRAXIS = {
    stages: [
      { id: "predict", name: "Predict", what: "Read the lesson code and predict what it does before running anything." },
      { id: "run", name: "Run", what: "Run the starter or example and compare the result to your prediction." },
      { id: "investigate", name: "Investigate", what: "Trace it line by line. Answer the self-explanation prompt." },
      { id: "modify", name: "Modify", what: "Change the example so it does something slightly different." },
      { id: "make", name: "Make", what: "Write the mission code from scratch and pass the checks." }
    ],
    selfExplain: [
      "In one sentence, what does each line of the example do?",
      "Which value changes, and when?",
      "What input would break this code?",
      "Why is this the idiomatic way to do it in this language?"
    ],
    fadeAfter: 3, // failed runs before the worked example (reference solution) unlocks
    evidence: [
      { claim: "PRIMM (Predict, Run, Investigate, Modify, Make) was tested with 493 students aged 11 to 14 across 13 schools, and the PRIMM group outperformed the control group.", src: "primm" },
      { claim: "Reading and tracing code before writing it is a core recommendation of the Raspberry Pi Foundation's review of programming pedagogy.", src: "rpf" },
      { claim: "Parsons problems offered on demand as scaffolding improved practice performance and efficiency, with similar post-test results.", src: "parsons" },
      { claim: "Worked examples save learners time, and adding self-explanation prompts adds learning benefit.", src: "worked" },
      { claim: "Fading worked examples (showing less of the solution as skill grows) supports the transition to independent problem solving.", src: "fading" }
    ]
  };

  // Per-language dossiers. stats: [label, value, srcKey].
  RA.DOSSIERS = {
    python: {
      tagline: "The lingua franca of AI, data and automation.",
      stats: [["Used by developers", "58.0%", "so26"], ["Admired", "50.6%", "so26"], ["TIOBE rank", "#1 (19.23%)", "tiobe"], ["Memory safe (NSA/CISA)", "Yes", "nsa"]],
      relevance: "Python is the top language on TIOBE and among the four most used in the Stack Overflow survey. It is also the language developers most often use with AI tools. Usage jumped 7 points in 2025, driven by AI and data work.",
      relSrc: ["tiobe", "so26", "so25"],
      pros: ["Readable syntax that's close to pseudocode, so it's the easiest first language", "Huge ecosystem: NumPy, pandas, PyTorch, FastAPI, Django", "Standard for machine learning, data science and scientific computing", "Batteries-included standard library for scripting and automation", "Memory safe by design"],
      cons: ["Slow in CPU-bound pure Python. Speed comes from C/Rust extensions", "The GIL has historically limited thread parallelism (free-threaded builds are still maturing)", "Dynamic typing hides bugs until runtime unless you adopt type hints plus a checker", "Packaging and environments (pip, venv, conda, uv) confuse beginners", "Weak for mobile and browser front ends"],
      bestFor: ["AI/ML and LLM tooling", "Data analysis, notebooks, ETL", "Automation, glue scripts and security tooling", "Backend APIs (FastAPI, Django)", "Teaching programming fundamentals"],
      avoid: ["Latency-critical systems and game engines", "Native mobile apps", "Tiny embedded devices (MicroPython aside)"],
      learn: ["pyTut"],
      next: "Pair with SQL for data work, then Rust or C++ to write fast extensions."
    },
    javascript: {
      tagline: "The language every browser runs.",
      stats: [["Used by developers", "62.0% (#1)", "so26"], ["Admired", "42.0%", "so26"], ["TIOBE rank", "#6", "tiobe"], ["Years at #1 on SO", "12+", "so26blog"]],
      relevance: "JavaScript is the most used language in the Stack Overflow survey, a position it has held for over a decade, because it is the only language that runs natively in every web browser.",
      relSrc: ["so26", "so26blog"],
      pros: ["Runs everywhere: browsers, servers (Node, Deno, Bun), desktop (Electron), mobile (React Native)", "Instant feedback, no compile step, so it's great for beginners", "The largest package ecosystem (npm)", "First-class functions and async/await for I/O-heavy work", "Memory safe (garbage collected)"],
      cons: ["Loose typing and coercion quirks (== vs ===, this binding)", "Ecosystem churn and dependency sprawl create supply-chain risk", "Single-threaded event loop. CPU-heavy work needs workers", "Large codebases get fragile without TypeScript"],
      bestFor: ["Web front ends and interactive UI", "Full-stack apps with Node", "Browser extensions and quick prototypes"],
      avoid: ["Number-crunching and systems programming", "Large long-lived codebases without types (use TypeScript)"],
      learn: ["mdnJs"],
      next: "Move to TypeScript as soon as projects grow past a few files."
    },
    typescript: {
      tagline: "JavaScript with a type system. Now #1 on GitHub.",
      stats: [["Used by developers", "43.8%", "so26"], ["Admired", "53.0%", "so26"], ["GitHub rank", "#1 (Aug 2025)", "octo"], ["Contributor growth", "+66% YoY", "octo"]],
      relevance: "TypeScript became the most used language on GitHub in August 2025, growing 66% year over year. GitHub attributes part of that to AI-assisted coding, since type systems catch mistakes in generated code.",
      relSrc: ["octo", "typedai", "so26"],
      pros: ["Catches whole classes of bugs at compile time", "Superb editor tooling: autocomplete, refactors, inline docs", "Gradual adoption, so any JS file is a valid start", "Types act as documentation and as guardrails for AI-generated code", "Default for modern frameworks (Next.js, Angular, NestJS)"],
      cons: ["A build step and tsconfig complexity", "Types are erased at runtime, so you still need runtime validation (e.g. zod) for untrusted input", "Advanced type-level programming can get unreadable", "any and type assertions can silently defeat the checker"],
      bestFor: ["Any web app beyond a prototype", "Shared front-end/back-end code", "Libraries and SDKs", "Teams that rely heavily on AI coding assistants"],
      avoid: ["Throwaway scripts where a build step is overhead", "Non-JS runtimes"],
      learn: ["tsHb"],
      next: "Learn runtime validation and a backend framework, or Rust for WebAssembly."
    },
    sql: {
      tagline: "How every organization talks to its data.",
      stats: [["Used by developers", "58.4%", "so26"], ["Admired", "51.4%", "so26"], ["TIOBE rank", "#9", "tiobe"]],
      relevance: "SQL is the second most used language in the Stack Overflow survey. Nearly every application, analytics stack and AI pipeline stores or queries data through a relational database.",
      relSrc: ["so26", "tiobe"],
      pros: ["Declarative: you describe the result, the engine plans how to get it", "50-year-old standard, so skills transfer across PostgreSQL, MySQL, SQLite, SQL Server, Snowflake and BigQuery", "Transactions and constraints protect data integrity", "Essential for analytics, data engineering and backend work"],
      cons: ["Dialect differences between engines", "SQL injection when queries are built with string concatenation instead of parameters (MOVEit, 2023)", "Set-based thinking is unfamiliar to people who learned loops first", "Performance tuning (indexes, query plans) takes experience"],
      bestFor: ["Application data storage", "Reporting, BI and analytics", "Data engineering and feature pipelines for ML", "Auditing and incident forensics"],
      avoid: ["General-purpose logic and UI", "Unstructured blobs or deeply nested documents (consider a document store)"],
      learn: ["sqlite", "pgTut"],
      next: "Pair with Python for data pipelines or with any backend language."
    },
    bash: {
      tagline: "The shell behind every server, container and CI pipeline.",
      stats: [["Used by developers", "51.3%", "so26"], ["Admired", "48%", "so26"]],
      relevance: "Bash/Shell is used by about half of developers in the Stack Overflow survey. It's the default glue on Linux servers, containers and CI systems, and the first tool used in incident response.",
      relSrc: ["so26"],
      pros: ["Available on virtually every Linux and macOS machine", "Composes small tools (grep, awk, sed, jq) with pipes", "Perfect for automation, deploy scripts and cron jobs", "Fastest path from an idea to an automated command"],
      cons: ["Quoting and word-splitting pitfalls cause real bugs", "Error handling is opt-in (set -euo pipefail)", "No real data structures beyond arrays and strings", "Hard to test and maintain beyond a few hundred lines", "Portability differences between bash, zsh and POSIX sh"],
      bestFor: ["Server administration and DevOps", "CI/CD steps and Dockerfiles", "Log triage and quick forensics", "Gluing CLI tools together"],
      avoid: ["Anything over ~200 lines or with complex logic (switch to Python or Go)", "Handling untrusted input without careful quoting"],
      learn: ["bashMan"],
      next: "Move complex scripts to Python or Go. Learn ShellCheck."
    },
    go: {
      tagline: "Simple, fast, concurrent language for cloud infrastructure.",
      stats: [["Used by developers", "16.5%", "so26"], ["Admired", "49.5%", "so26"], ["TIOBE rank", "#11", "tiobe"], ["Memory safe (NSA/CISA)", "Yes", "nsa"]],
      relevance: "Go powers much of the cloud-native stack (Docker, Kubernetes, Terraform). NSA and CISA list it as a memory-safe language suitable for replacing C/C++ in network services.",
      relSrc: ["so26", "tiobe", "nsa"],
      pros: ["Small language that's quick to learn and easy to read in code review", "Goroutines and channels make concurrency approachable", "Fast compiles and single static binaries simplify deployment", "Strong standard library for HTTP, JSON, crypto and testing", "Memory safe with garbage collection"],
      cons: ["Verbose error handling (if err != nil)", "Generics arrived late (1.18) and are deliberately limited", "Garbage collection pauses rule out some hard real-time uses", "Less expressive type system than Rust or Kotlin"],
      bestFor: ["Microservices and APIs", "CLI tools", "Cloud and DevOps infrastructure", "Network services and proxies"],
      avoid: ["GUI and mobile apps", "Data science", "Hard real-time or tiny embedded systems"],
      learn: ["goTour"],
      next: "Pair with Bash and SQL for infrastructure, or Rust for lower-level work."
    },
    rust: {
      tagline: "Memory safety without a garbage collector.",
      stats: [["Used by developers", "18.0%", "so26"], ["Most admired", "67.4% (#1)", "so26"], ["TIOBE rank", "#10 (up from #16)", "tiobe"], ["Memory safe (NSA/CISA)", "Yes", "nsa"]],
      relevance: "Rust is the most admired language in the Stack Overflow survey and entered TIOBE's top 10 in 2026. US government guidance pushes memory-safe languages because memory-safety bugs account for about two-thirds of vulnerabilities in memory-unsafe code.",
      relSrc: ["so26", "so26blog", "tiobe", "cisaRoad", "nsa"],
      pros: ["Borrow checker prevents use-after-free, data races and buffer overflows at compile time", "C/C++-level performance with zero-cost abstractions", "Excellent tooling: cargo, clippy, rustfmt, built-in tests", "Expressive enums, pattern matching and Result-based errors", "Growing use in Linux, Windows, Android, browsers and cloud infrastructure"],
      cons: ["Steepest learning curve on this list (ownership, lifetimes)", "Slower compile times", "Smaller hiring market than Java, C# or Python", "Some domains (GUI, game engines) still maturing", "unsafe blocks are needed for some FFI and low-level work"],
      bestFor: ["Systems programming and OS components", "Security-critical parsers and network services", "WebAssembly", "High-performance CLIs and infrastructure", "Embedded (no_std)"],
      avoid: ["Quick prototypes or scripts", "Teams that need to ship a CRUD app this week"],
      learn: ["rustBook"],
      next: "Learn C enough to read FFI, or Go for comparison."
    },
    swift: {
      tagline: "Apple's safe, fast language, now reaching Android and the web.",
      stats: [["Used by developers", "5.9%", "so26"], ["Admired (2025)", "51.9%", "so25"], ["TIOBE rank", "#14", "tiobe"], ["Memory safe (NSA/CISA)", "Yes", "nsa"]],
      relevance: "Swift is the primary language for iPhone, iPad, Mac, Watch and Vision Pro apps. Swift 6.2 added approachable concurrency and WebAssembly support, and the official Swift SDK for Android shipped with Swift 6.3 in March 2026.",
      relSrc: ["so26", "tiobe", "swift62", "swiftDec"],
      pros: ["Required for first-class Apple platform apps (SwiftUI)", "Optionals and value types prevent null crashes and shared-state bugs", "Compile-time data-race safety in Swift 6", "Fast native performance", "Swift Playgrounds makes it the easiest way to learn on an iPad"],
      cons: ["Ecosystem centered on Apple. Server, Android and Wasm use is still young", "Small share of overall developers", "Compiler and Xcode can be slow on large projects", "Strict concurrency checking is a migration hurdle"],
      bestFor: ["iOS, iPadOS, macOS, watchOS and visionOS apps", "Apple-platform games and AR", "Server-side Swift (Vapor) for Apple-centric teams"],
      avoid: ["Windows-first desktop", "Data science", "Projects that need the broadest hiring pool"],
      learn: ["swiftBook"],
      next: "Pair with Kotlin to cover both mobile platforms."
    },
    kotlin: {
      tagline: "Google's preferred language for Android, and a modern JVM language.",
      stats: [["Used by developers", "10.8%", "so26"], ["Admired", "43%", "so26"], ["Android", "Kotlin-first since 2019", "ktFirst"]],
      relevance: "Android has been Kotlin-first since 2019. At Google I/O 2026 Android declared UI development Compose-first, with Views in maintenance mode, and Kotlin Multiplatform is officially supported for sharing code with iOS.",
      relSrc: ["ktFirst", "compose", "kmp", "so26"],
      pros: ["Null safety in the type system", "Concise: data classes, extension functions, lambdas", "Full Java interop, so it runs on the JVM with all Java libraries", "Coroutines for structured concurrency", "Jetpack Compose and Kotlin Multiplatform reach Android, iOS, desktop and web"],
      cons: ["Slower compile times than Java in some builds", "Mostly tied to Android and JVM ecosystems", "Many ways to write the same thing, so team style guides matter", "Multiplatform tooling is still maturing"],
      bestFor: ["Android apps (the default)", "Cross-platform mobile logic via KMP", "JVM backends (Ktor, Spring)"],
      avoid: ["Apple-only apps", "Low-level systems work"],
      learn: ["ktDocs"],
      next: "Learn Java to read legacy code, or Swift to cover iOS natively."
    },
    java: {
      tagline: "Enterprise backbone with a modern LTS cadence.",
      stats: [["Used by developers", "27.6%", "so26"], ["Admired", "39%", "so26"], ["TIOBE rank", "#4 (8.41%)", "tiobe"], ["Memory safe (NSA/CISA)", "Yes", "nsa"]],
      relevance: "Java remains a top-4 TIOBE language and runs core systems in banking, government, retail and Android. Java 25 LTS (September 2025) added compact source files and instance main methods that make it far friendlier to beginners.",
      relSrc: ["tiobe", "so26", "java25"],
      pros: ["Mature, stable JVM with excellent performance and observability", "Massive ecosystem (Spring, Maven, Gradle)", "Strong backward compatibility and long-term support releases", "Virtual threads, records, sealed types and pattern matching modernize the language", "Huge job market"],
      cons: ["Historically verbose (improving fast)", "JVM startup and memory overhead, though GraalVM native images help", "Legacy codebases can be heavy on frameworks and XML", "Supply-chain incidents (Log4Shell) show the risk of deep dependency trees"],
      bestFor: ["Large enterprise backends", "Financial and transactional systems", "Big data (Kafka, Spark, Hadoop)", "Android legacy code"],
      avoid: ["Small scripts (until compact source files are standard)", "Front-end UI", "Low-memory embedded devices"],
      learn: ["devJava"],
      next: "Pick up Kotlin for Android or modern JVM work."
    },
    csharp: {
      tagline: "Microsoft's versatile language for games, cloud and enterprise.",
      stats: [["Used by developers", "27.1%", "so26"], ["Admired", "50%", "so26"], ["TIOBE rank", "#5", "tiobe"], ["Memory safe (NSA/CISA)", "Yes", "nsa"]],
      relevance: "C# is the scripting language of the Unity engine and the core of .NET. .NET 10 LTS (November 2025, supported to November 2028) shipped C# 14 and file-based apps you can run with dotnet run app.cs.",
      relSrc: ["so26", "tiobe", "net10"],
      pros: ["One language for games (Unity), web (ASP.NET Core), desktop, cloud and mobile (MAUI)", "Rich, fast-moving language: LINQ, async/await, records, pattern matching", "Excellent tooling (Visual Studio, Rider, VS Code)", "High performance runtime", "Cross-platform and open source since .NET Core"],
      cons: ["Strongest in the Microsoft ecosystem", "Rapid feature growth means many ways to do one thing", "Unity's C# version can lag behind current .NET", "Less common in startups than JS/TS or Python"],
      bestFor: ["Unity game development", "Enterprise and Azure backends", "Windows desktop apps", "Cross-platform business apps"],
      avoid: ["Browser front ends (Blazor aside)", "Tiny embedded systems"],
      learn: ["csLearn"],
      next: "Pair with TypeScript for web front ends, or C++ for engine internals."
    },
    cpp: {
      tagline: "Maximum performance and control, with real safety costs.",
      stats: [["Used by developers", "24.3%", "so26"], ["Admired", "46%", "so26"], ["TIOBE rank", "#3 (8.87%)", "tiobe"], ["Memory safe (NSA/CISA)", "No", "nsa"]],
      relevance: "C++ runs game engines, browsers, trading systems, robotics and embedded devices. CISA lists writing new C/C++ for critical infrastructure as a dangerous practice when memory-safe options exist. C++26 (March 2026) responds with reflection, contracts, std::execution and a hardened standard library.",
      relSrc: ["tiobe", "so26", "cisaBad", "cpp26", "gcc16"],
      pros: ["Top-tier performance and fine-grained control of memory and hardware", "Zero-cost abstractions: templates, RAII, constexpr", "Enormous existing codebase and ecosystem (Unreal, Chromium, LLVM)", "C++26 adds reflection, contracts and bounds-checked standard library modes"],
      cons: ["Not memory safe. Heartbleed-style bugs remain possible", "Huge, complex language with decades of legacy features", "Undefined behavior is easy to trigger and hard to debug", "Build systems and package management are fragmented", "Regulators are pressuring vendors to publish memory-safety roadmaps"],
      bestFor: ["Game engines and graphics", "High-frequency trading and simulation", "Embedded and robotics", "Maintaining or extending existing C++ systems"],
      avoid: ["New network-facing or security-critical code where Rust, Go or another memory-safe language fits", "Quick business apps"],
      learn: ["cppCore"],
      next: "Learn Rust to compare memory models, and follow the C++ Core Guidelines."
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
