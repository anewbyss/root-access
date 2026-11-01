# Language dossiers

Generated from `curriculum/_dossiers.js` by `node tools/gen-docs.js`. The same text appears in the app under Intel.

| Language | Judge0 engine | GitHub Actions toolchain | CI-only ranks |
|---|---|---|---|
| Boot Camp | Python 3.13 (Judge0) | Python 3.13 | none |
| Python | Python 3.13 (Judge0) | Python 3.13 | none |
| JavaScript | Node.js 22 (Judge0) | Node.js 22 | none |
| TypeScript | tsc + Node (Judge0) | TypeScript 5.6 --strict | none |
| SQL | SQLite via Python 3.13 (Judge0) | SQLite 3 (Python) | none |
| Bash | Bash 5.0 (Judge0) | Bash 5 + jq on Ubuntu 24.04 | none |
| Go | Go 1.23 (Judge0) | Go (stable) | 12 |
| Rust | Rust 1.85 (Judge0) | Rust (stable) | none |
| Swift | Swift 5.2 (Judge0) | Swift 6 on macOS (Xcode) | 10, 11, 12 |
| Kotlin | Kotlin 2.1 (Judge0) | Kotlin 2.x + kotlinx.coroutines | 10, 12 |
| Java | Java 17 (Judge0) | JDK 25 + JUnit 5 | 11, 12 |
| C# | .NET 8 / C# 12 (Judge0 Extra) | .NET 10 (dotnet run app.cs) | none |
| C++ | GCC 14 C++23 (Judge0) | g++ 14 -std=c++23 | none |

## Python

The lingua franca of AI, data and automation.

- **Used by developers:** 58.0% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired:** 50.6% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **TIOBE rank:** #1 (19.23%) ([TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/))
- **Memory safe (NSA/CISA):** Yes ([NSA/CISA: Memory Safe Languages (June 2025)](https://www.cisa.gov/resources-tools/resources/memory-safe-languages-reducing-vulnerabilities-modern-software-development))

**Relevance.** Python is the top language on TIOBE and among the four most used in the Stack Overflow survey. It is also the language developers most often use with AI tools. Usage jumped 7 points in 2025, driven by AI and data work. Sources: [TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/), [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology), [Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/technology).

**Strengths**

- Readable syntax that's close to pseudocode, so it's the easiest first language
- Huge ecosystem: NumPy, pandas, PyTorch, FastAPI, Django
- Standard for machine learning, data science and scientific computing
- Batteries-included standard library for scripting and automation
- Memory safe by design

**Trade-offs**

- Slow in CPU-bound pure Python. Speed comes from C/Rust extensions
- The GIL has historically limited thread parallelism (free-threaded builds are still maturing)
- Dynamic typing hides bugs until runtime unless you adopt type hints plus a checker
- Packaging and environments (pip, venv, conda, uv) confuse beginners
- Weak for mobile and browser front ends

**Use it for:** AI/ML and LLM tooling; Data analysis, notebooks, ETL; Automation, glue scripts and security tooling; Backend APIs (FastAPI, Django); Teaching programming fundamentals.

**Reach for something else when:** Latency-critical systems and game engines; Native mobile apps; Tiny embedded devices (MicroPython aside).

**Official learning path:** [Python Tutorial (python.org)](https://docs.python.org/3/tutorial/). Pair with SQL for data work, then Rust or C++ to write fast extensions.

**Mission path:** 1. Syntax & Values (First Contact) · 2. Control Flow (Triage Protocol) · 3. Collections (Signal in the Noise) · 4. Functions & Scope (The Counter Ritual) · 5. Strings & Text (Cipher Breaker) · 6. Data Modeling (Node Registry) · 7. Error Handling (Fail Gracefully) · 8. Standard Library & Idioms (Relic Index) · 9. Abstraction & Generics (Stream Engine) · 10. Concurrency & Async (Swarm Sweep) · 11. Testing & Tooling (Proof of Work) · 12. Capstone Operation (Operation: Log Hunter)

## JavaScript

The language every browser runs.

- **Used by developers:** 62.0% (#1) ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired:** 42.0% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **TIOBE rank:** #6 ([TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/))
- **Years at #1 on SO:** 12+ ([Stack Overflow blog: 2026 survey results](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/))

**Relevance.** JavaScript is the most used language in the Stack Overflow survey, a position it has held for over a decade, because it is the only language that runs natively in every web browser. Sources: [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology), [Stack Overflow blog: 2026 survey results](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/).

**Strengths**

- Runs everywhere: browsers, servers (Node, Deno, Bun), desktop (Electron), mobile (React Native)
- Instant feedback, no compile step, so it's great for beginners
- The largest package ecosystem (npm)
- First-class functions and async/await for I/O-heavy work
- Memory safe (garbage collected)

**Trade-offs**

- Loose typing and coercion quirks (== vs ===, this binding)
- Ecosystem churn and dependency sprawl create supply-chain risk
- Single-threaded event loop. CPU-heavy work needs workers
- Large codebases get fragile without TypeScript

**Use it for:** Web front ends and interactive UI; Full-stack apps with Node; Browser extensions and quick prototypes.

**Reach for something else when:** Number-crunching and systems programming; Large long-lived codebases without types (use TypeScript).

**Official learning path:** [MDN: JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide). Move to TypeScript as soon as projects grow past a few files.

**Mission path:** 1. Syntax & Values (Ghost Signal) · 2. Control Flow (Triage Protocol) · 3. Collections (Filter the Swarm) · 4. Functions & Scope (The Counter Ritual) · 5. Strings & Text (Never Trust Input) · 6. Data Modeling (Node Registry) · 7. Error Handling (Fail Gracefully) · 8. Standard Library & Idioms (Relic Index) · 9. Abstraction & Generics (Stream Engine) · 10. Concurrency & Async (Swarm Sweep) · 11. Testing & Tooling (Proof of Work) · 12. Capstone Operation (Operation: Log Hunter)

## TypeScript

JavaScript with a type system. Now #1 on GitHub.

- **Used by developers:** 43.8% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired:** 53.0% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **GitHub rank:** #1 (Aug 2025) ([GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/))
- **Contributor growth:** +66% YoY ([GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/))

**Relevance.** TypeScript became the most used language on GitHub in August 2025, growing 66% year over year. GitHub attributes part of that to AI-assisted coding, since type systems catch mistakes in generated code. Sources: [GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/), [GitHub: why AI is pushing developers toward typed languages](https://github.blog/ai-and-ml/llms/why-ai-is-pushing-developers-toward-typed-languages/), [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology).

**Strengths**

- Catches whole classes of bugs at compile time
- Superb editor tooling: autocomplete, refactors, inline docs
- Gradual adoption, so any JS file is a valid start
- Types act as documentation and as guardrails for AI-generated code
- Default for modern frameworks (Next.js, Angular, NestJS)

**Trade-offs**

- A build step and tsconfig complexity
- Types are erased at runtime, so you still need runtime validation (e.g. zod) for untrusted input
- Advanced type-level programming can get unreadable
- any and type assertions can silently defeat the checker

**Use it for:** Any web app beyond a prototype; Shared front-end/back-end code; Libraries and SDKs; Teams that rely heavily on AI coding assistants.

**Reach for something else when:** Throwaway scripts where a build step is overhead; Non-JS runtimes.

**Official learning path:** [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html). Learn runtime validation and a backend framework, or Rust for WebAssembly.

**Mission path:** 1. Syntax & Values (Typed Signal) · 2. Control Flow (Narrowing the Field) · 3. Collections (Typed Collections) · 4. Functions & Scope (Typed Covenant) · 5. Strings & Text (Function Types) · 6. Data Modeling (The Vault) · 7. Error Handling (Key Extraction) · 8. Standard Library & Idioms (Exhaustive Events) · 9. Abstraction & Generics (Type Alchemy) · 10. Concurrency & Async (Async Uplink) · 11. Testing & Tooling (Result, Not Exceptions) · 12. Capstone Operation (Operation: Typed Pipeline)

## SQL

How every organization talks to its data.

- **Used by developers:** 58.4% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired:** 51.4% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **TIOBE rank:** #9 ([TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/))

**Relevance.** SQL is the second most used language in the Stack Overflow survey. Nearly every application, analytics stack and AI pipeline stores or queries data through a relational database. Sources: [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology), [TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/).

**Strengths**

- Declarative: you describe the result, the engine plans how to get it
- 50-year-old standard, so skills transfer across PostgreSQL, MySQL, SQLite, SQL Server, Snowflake and BigQuery
- Transactions and constraints protect data integrity
- Essential for analytics, data engineering and backend work

**Trade-offs**

- Dialect differences between engines
- SQL injection when queries are built with string concatenation instead of parameters (MOVEit, 2023)
- Set-based thinking is unfamiliar to people who learned loops first
- Performance tuning (indexes, query plans) takes experience

**Use it for:** Application data storage; Reporting, BI and analytics; Data engineering and feature pipelines for ML; Auditing and incident forensics.

**Reach for something else when:** General-purpose logic and UI; Unstructured blobs or deeply nested documents (consider a document store).

**Official learning path:** [SQLite SQL reference](https://www.sqlite.org/lang.html), [PostgreSQL Tutorial](https://www.postgresql.org/docs/current/tutorial.html). Pair with Python for data pipelines or with any backend language.

**Mission path:** 1. Syntax & Values (Query the Archive) · 2. Control Flow (Filter the Feed) · 3. Collections (Sort the Signal) · 4. Functions & Scope (Brute Force Detector) · 5. Strings & Text (Connect the Dots) · 6. Data Modeling (The Silent Ones) · 7. Error Handling (Nested Intel) · 8. Standard Library & Idioms (Build the Safe House) · 9. Abstraction & Generics (Atomic Strike) · 10. Concurrency & Async (Speed of Light) · 11. Testing & Tooling (Ranked Order) · 12. Capstone Operation (Operation: Threat Board)

## Bash

The shell behind every server, container and CI pipeline.

- **Used by developers:** 51.3% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired:** 48% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))

**Relevance.** Bash/Shell is used by about half of developers in the Stack Overflow survey. It's the default glue on Linux servers, containers and CI systems, and the first tool used in incident response. Sources: [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology).

**Strengths**

- Available on virtually every Linux and macOS machine
- Composes small tools (grep, awk, sed, jq) with pipes
- Perfect for automation, deploy scripts and cron jobs
- Fastest path from an idea to an automated command

**Trade-offs**

- Quoting and word-splitting pitfalls cause real bugs
- Error handling is opt-in (set -euo pipefail)
- No real data structures beyond arrays and strings
- Hard to test and maintain beyond a few hundred lines
- Portability differences between bash, zsh and POSIX sh

**Use it for:** Server administration and DevOps; CI/CD steps and Dockerfiles; Log triage and quick forensics; Gluing CLI tools together.

**Reach for something else when:** Anything over ~200 lines or with complex logic (switch to Python or Go); Handling untrusted input without careful quoting.

**Official learning path:** [GNU Bash Reference Manual](https://www.gnu.org/software/bash/manual/bash.html). Move complex scripts to Python or Go. Learn ShellCheck.

**Mission path:** 1. Syntax & Values (Into the Shell) · 2. Control Flow (Read the Logs) · 3. Collections (Variables & Substitution) · 4. Functions & Scope (Decision Gates) · 5. Strings & Text (Loop the Grid) · 6. Data Modeling (Reusable Tools) · 7. Error Handling (Top Offenders) · 8. Standard Library & Idioms (Lockdown) · 9. Abstraction & Generics (Strict Mode) · 10. Concurrency & Async (Wire Tap) · 11. Testing & Tooling (Sleeper Agent) · 12. Capstone Operation (Operation: First Responder)

## Go

Simple, fast, concurrent language for cloud infrastructure.

- **Used by developers:** 16.5% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired:** 49.5% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **TIOBE rank:** #11 ([TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/))
- **Memory safe (NSA/CISA):** Yes ([NSA/CISA: Memory Safe Languages (June 2025)](https://www.cisa.gov/resources-tools/resources/memory-safe-languages-reducing-vulnerabilities-modern-software-development))

**Relevance.** Go powers much of the cloud-native stack (Docker, Kubernetes, Terraform). NSA and CISA list it as a memory-safe language suitable for replacing C/C++ in network services. Sources: [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology), [TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/), [NSA/CISA: Memory Safe Languages (June 2025)](https://www.cisa.gov/resources-tools/resources/memory-safe-languages-reducing-vulnerabilities-modern-software-development).

**Strengths**

- Small language that's quick to learn and easy to read in code review
- Goroutines and channels make concurrency approachable
- Fast compiles and single static binaries simplify deployment
- Strong standard library for HTTP, JSON, crypto and testing
- Memory safe with garbage collection

**Trade-offs**

- Verbose error handling (if err != nil)
- Generics arrived late (1.18) and are deliberately limited
- Garbage collection pauses rule out some hard real-time uses
- Less expressive type system than Rust or Kotlin

**Use it for:** Microservices and APIs; CLI tools; Cloud and DevOps infrastructure; Network services and proxies.

**Reach for something else when:** GUI and mobile apps; Data science; Hard real-time or tiny embedded systems.

**Official learning path:** [A Tour of Go](https://go.dev/tour/). Pair with Bash and SQL for infrastructure, or Rust for lower-level work.

**Mission path:** 1. Syntax & Values (Hello, Grid) · 2. Control Flow (Triage Protocol) · 3. Collections (Slices & Maps) · 4. Functions & Scope (Multi-Return) · 5. Strings & Text (Runes & Builders) · 6. Data Modeling (Struct of Signals) · 7. Error Handling (Errors Are Values) · 8. Standard Library & Idioms (Contracts) · 9. Abstraction & Generics (Generic Ops) · 10. Concurrency & Async (Goroutine Swarm) · 11. Testing & Tooling (Channels of Truth) · 12. Capstone Operation (Operation: Watchtower)

## Rust

Memory safety without a garbage collector.

- **Used by developers:** 18.0% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Most admired:** 67.4% (#1) ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **TIOBE rank:** #10 (up from #16) ([TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/))
- **Memory safe (NSA/CISA):** Yes ([NSA/CISA: Memory Safe Languages (June 2025)](https://www.cisa.gov/resources-tools/resources/memory-safe-languages-reducing-vulnerabilities-modern-software-development))

**Relevance.** Rust is the most admired language in the Stack Overflow survey and entered TIOBE's top 10 in 2026. US government guidance pushes memory-safe languages because memory-safety bugs account for about two-thirds of vulnerabilities in memory-unsafe code. Sources: [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology), [Stack Overflow blog: 2026 survey results](https://stackoverflow.blog/2026/10/06/the-results-of-the-2026-developer-survey-are-here/), [TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/), [CISA: The Case for Memory Safe Roadmaps](https://www.cisa.gov/case-memory-safe-roadmaps), [NSA/CISA: Memory Safe Languages (June 2025)](https://www.cisa.gov/resources-tools/resources/memory-safe-languages-reducing-vulnerabilities-modern-software-development).

**Strengths**

- Borrow checker prevents use-after-free, data races and buffer overflows at compile time
- C/C++-level performance with zero-cost abstractions
- Excellent tooling: cargo, clippy, rustfmt, built-in tests
- Expressive enums, pattern matching and Result-based errors
- Growing use in Linux, Windows, Android, browsers and cloud infrastructure

**Trade-offs**

- Steepest learning curve on this list (ownership, lifetimes)
- Slower compile times
- Smaller hiring market than Java, C# or Python
- Some domains (GUI, game engines) still maturing
- unsafe blocks are needed for some FFI and low-level work

**Use it for:** Systems programming and OS components; Security-critical parsers and network services; WebAssembly; High-performance CLIs and infrastructure; Embedded (no_std).

**Reach for something else when:** Quick prototypes or scripts; Teams that need to ship a CRUD app this week.

**Official learning path:** [The Rust Programming Language (the Book)](https://doc.rust-lang.org/book/). Learn C enough to read FFI, or Go for comparison.

**Mission path:** 1. Syntax & Values (Immutable Oath) · 2. Control Flow (Match the Threat) · 3. Collections (Vectors & Maps) · 4. Functions & Scope (The Borrow Oath) · 5. Strings & Text (Cipher Breaker) · 6. Data Modeling (Structs & Enums) · 7. Error Handling (Option or Oblivion) · 8. Standard Library & Idioms (Shared Behavior) · 9. Abstraction & Generics (Iterator Engine) · 10. Concurrency & Async (Fearless Concurrency) · 11. Testing & Tooling (Lifetimes & Tests) · 12. Capstone Operation (Operation: Ironclad Parser)

## Swift

Apple's safe, fast language, now reaching Android and the web.

- **Used by developers:** 5.9% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired (2025):** 51.9% ([Stack Overflow Developer Survey 2025](https://survey.stackoverflow.co/2025/technology))
- **TIOBE rank:** #14 ([TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/))
- **Memory safe (NSA/CISA):** Yes ([NSA/CISA: Memory Safe Languages (June 2025)](https://www.cisa.gov/resources-tools/resources/memory-safe-languages-reducing-vulnerabilities-modern-software-development))

**Relevance.** Swift is the primary language for iPhone, iPad, Mac, Watch and Vision Pro apps. Swift 6.2 added approachable concurrency and WebAssembly support, and the official Swift SDK for Android shipped with Swift 6.3 in March 2026. Sources: [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology), [TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/), [Swift.org: Swift 6.2 released](https://www.swift.org/blog/swift-6.2-released/), [Swift.org: What's new in Swift, December 2025](https://www.swift.org/blog/whats-new-in-swift-december-2025/).

**Strengths**

- Required for first-class Apple platform apps (SwiftUI)
- Optionals and value types prevent null crashes and shared-state bugs
- Compile-time data-race safety in Swift 6
- Fast native performance
- Swift Playgrounds makes it the easiest way to learn on an iPad

**Trade-offs**

- Ecosystem centered on Apple. Server, Android and Wasm use is still young
- Small share of overall developers
- Compiler and Xcode can be slow on large projects
- Strict concurrency checking is a migration hurdle

**Use it for:** iOS, iPadOS, macOS, watchOS and visionOS apps; Apple-platform games and AR; Server-side Swift (Vapor) for Apple-centric teams.

**Reach for something else when:** Windows-first desktop; Data science; Projects that need the broadest hiring pool.

**Official learning path:** [The Swift Programming Language](https://docs.swift.org/swift-book/). Pair with Kotlin to cover both mobile platforms.

**Mission path:** 1. Syntax & Values (Signal in the Glass) · 2. Control Flow (Gatekeeper) · 3. Collections (Optional Ghosts) · 4. Functions & Scope (Collections Cache) · 5. Strings & Text (Closures in the Dark) · 6. Data Modeling (Structs vs Classes) · 7. Error Handling (Typed Failure) · 8. Standard Library & Idioms (Enums with Payloads) · 9. Abstraction & Generics (Protocol Oriented) · 10. Concurrency & Async (Actors at the Gate) · 11. Testing & Tooling (Proof of Work) · 12. Capstone Operation (Operation: Glass Console)

## Kotlin

Google's preferred language for Android, and a modern JVM language.

- **Used by developers:** 10.8% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired:** 43% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Android:** Kotlin-first since 2019 ([Android Developers: Kotlin-first](https://developer.android.com/kotlin/first))

**Relevance.** Android has been Kotlin-first since 2019. At Google I/O 2026 Android declared UI development Compose-first, with Views in maintenance mode, and Kotlin Multiplatform is officially supported for sharing code with iOS. Sources: [Android Developers: Kotlin-first](https://developer.android.com/kotlin/first), [Android Developers Blog: Compose First (May 2026)](https://android-developers.googleblog.com/2026/05/android-ui-development-is-compose-first.html), [Android Developers: Kotlin Multiplatform](https://developer.android.com/kotlin/multiplatform), [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology).

**Strengths**

- Null safety in the type system
- Concise: data classes, extension functions, lambdas
- Full Java interop, so it runs on the JVM with all Java libraries
- Coroutines for structured concurrency
- Jetpack Compose and Kotlin Multiplatform reach Android, iOS, desktop and web

**Trade-offs**

- Slower compile times than Java in some builds
- Mostly tied to Android and JVM ecosystems
- Many ways to write the same thing, so team style guides matter
- Multiplatform tooling is still maturing

**Use it for:** Android apps (the default); Cross-platform mobile logic via KMP; JVM backends (Ktor, Spring).

**Reach for something else when:** Apple-only apps; Low-level systems work.

**Official learning path:** [Kotlin documentation](https://kotlinlang.org/docs/home.html). Learn Java to read legacy code, or Swift to cover iOS natively.

**Mission path:** 1. Syntax & Values (Boot Sequence) · 2. Control Flow (When the Alarm Sounds) · 3. Collections (Collections Vault) · 4. Functions & Scope (Extension Protocols) · 5. Strings & Text (Null Sector) · 6. Data Modeling (Data Constructs) · 7. Error Handling (Exceptions & runCatching) · 8. Standard Library & Idioms (Sealed Hierarchies) · 9. Abstraction & Generics (Generic Interfaces) · 10. Concurrency & Async (Coroutine Swarm) · 11. Testing & Tooling (Verified Build) · 12. Capstone Operation (Operation: Field Unit)

## Java

Enterprise backbone with a modern LTS cadence.

- **Used by developers:** 27.6% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired:** 39% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **TIOBE rank:** #4 (8.41%) ([TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/))
- **Memory safe (NSA/CISA):** Yes ([NSA/CISA: Memory Safe Languages (June 2025)](https://www.cisa.gov/resources-tools/resources/memory-safe-languages-reducing-vulnerabilities-modern-software-development))

**Relevance.** Java remains a top-4 TIOBE language and runs core systems in banking, government, retail and Android. Java 25 LTS (September 2025) added compact source files and instance main methods that make it far friendlier to beginners. Sources: [TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/), [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology), [InfoQ: Java 25 released](https://www.infoq.com/news/2025/09/java25-released/).

**Strengths**

- Mature, stable JVM with excellent performance and observability
- Massive ecosystem (Spring, Maven, Gradle)
- Strong backward compatibility and long-term support releases
- Virtual threads, records, sealed types and pattern matching modernize the language
- Huge job market

**Trade-offs**

- Historically verbose (improving fast)
- JVM startup and memory overhead, though GraalVM native images help
- Legacy codebases can be heavy on frameworks and XML
- Supply-chain incidents (Log4Shell) show the risk of deep dependency trees

**Use it for:** Large enterprise backends; Financial and transactional systems; Big data (Kafka, Spark, Hadoop); Android legacy code.

**Reach for something else when:** Small scripts (until compact source files are standard); Front-end UI; Low-memory embedded devices.

**Official learning path:** [dev.java: Learn Java](https://dev.java/learn/). Pick up Kotlin for Android or modern JVM work.

**Mission path:** 1. Syntax & Values (Hello, Mainframe) · 2. Control Flow (Switch Expressions) · 3. Collections (Collections Framework) · 4. Functions & Scope (Method Discipline) · 5. Strings & Text (Text Forensics) · 6. Data Modeling (Records & Classes) · 7. Error Handling (Checked Failure) · 8. Standard Library & Idioms (Inheritance & Interfaces) · 9. Abstraction & Generics (Generic Arsenal) · 10. Concurrency & Async (Stream Processing) · 11. Testing & Tooling (Virtual Threads) · 12. Capstone Operation (Operation: Log4Shell Patch)

## C#

Microsoft's versatile language for games, cloud and enterprise.

- **Used by developers:** 27.1% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired:** 50% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **TIOBE rank:** #5 ([TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/))
- **Memory safe (NSA/CISA):** Yes ([NSA/CISA: Memory Safe Languages (June 2025)](https://www.cisa.gov/resources-tools/resources/memory-safe-languages-reducing-vulnerabilities-modern-software-development))

**Relevance.** C# is the scripting language of the Unity engine and the core of .NET. .NET 10 LTS (November 2025, supported to November 2028) shipped C# 14 and file-based apps you can run with dotnet run app.cs. Sources: [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology), [TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/), [Microsoft: Announcing .NET 10](https://devblogs.microsoft.com/dotnet/announcing-dotnet-10/).

**Strengths**

- One language for games (Unity), web (ASP.NET Core), desktop, cloud and mobile (MAUI)
- Rich, fast-moving language: LINQ, async/await, records, pattern matching
- Excellent tooling (Visual Studio, Rider, VS Code)
- High performance runtime
- Cross-platform and open source since .NET Core

**Trade-offs**

- Strongest in the Microsoft ecosystem
- Rapid feature growth means many ways to do one thing
- Unity's C# version can lag behind current .NET
- Less common in startups than JS/TS or Python

**Use it for:** Unity game development; Enterprise and Azure backends; Windows desktop apps; Cross-platform business apps.

**Reach for something else when:** Browser front ends (Blazor aside); Tiny embedded systems.

**Official learning path:** [Microsoft Learn: C#](https://learn.microsoft.com/en-us/dotnet/csharp/). Pair with TypeScript for web front ends, or C++ for engine internals.

**Mission path:** 1. Syntax & Values (Top-Level Uplink) · 2. Control Flow (Switch Expressions) · 3. Collections (Collections Cache) · 4. Functions & Scope (Method Signatures) · 5. Strings & Text (Text Decryption) · 6. Data Modeling (Records & Properties) · 7. Error Handling (Exception Protocol) · 8. Standard Library & Idioms (Interfaces & Inheritance) · 9. Abstraction & Generics (Generic Constraints) · 10. Concurrency & Async (LINQ Interrogation) · 11. Testing & Tooling (Async Swarm) · 12. Capstone Operation (Operation: Construct Arena)

## C++

Maximum performance and control, with real safety costs.

- **Used by developers:** 24.3% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **Admired:** 46% ([Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology))
- **TIOBE rank:** #3 (8.87%) ([TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/))
- **Memory safe (NSA/CISA):** No ([NSA/CISA: Memory Safe Languages (June 2025)](https://www.cisa.gov/resources-tools/resources/memory-safe-languages-reducing-vulnerabilities-modern-software-development))

**Relevance.** C++ runs game engines, browsers, trading systems, robotics and embedded devices. CISA lists writing new C/C++ for critical infrastructure as a dangerous practice when memory-safe options exist. C++26 (March 2026) responds with reflection, contracts, std::execution and a hardened standard library. Sources: [TIOBE Index, October 2026 (TechRepublic)](https://www.techrepublic.com/article/news-tiobe-october-2026-java-closes-cpp-gap/), [Stack Overflow Developer Survey 2026](https://survey.stackoverflow.co/2026/technology), [CISA Product Security Bad Practices](https://www.cisa.gov/resources-tools/resources/product-security-bad-practices), [InfoQ: C++26 reflection, safety, async](https://www.infoq.com/news/2026/04/cpp-26-reflection-safety-async/), [isocpp.org: GCC 16.1](https://isocpp.org/blog/2026/04/gcc-16.1).

**Strengths**

- Top-tier performance and fine-grained control of memory and hardware
- Zero-cost abstractions: templates, RAII, constexpr
- Enormous existing codebase and ecosystem (Unreal, Chromium, LLVM)
- C++26 adds reflection, contracts and bounds-checked standard library modes

**Trade-offs**

- Not memory safe. Heartbleed-style bugs remain possible
- Huge, complex language with decades of legacy features
- Undefined behavior is easy to trigger and hard to debug
- Build systems and package management are fragmented
- Regulators are pressuring vendors to publish memory-safety roadmaps

**Use it for:** Game engines and graphics; High-frequency trading and simulation; Embedded and robotics; Maintaining or extending existing C++ systems.

**Reach for something else when:** New network-facing or security-critical code where Rust, Go or another memory-safe language fits; Quick business apps.

**Official learning path:** [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines). Learn Rust to compare memory models, and follow the C++ Core Guidelines.

**Mission path:** 1. Syntax & Values (Kernel Handshake) · 2. Control Flow (Branch Prediction) · 3. Collections (Container Ops) · 4. Functions & Scope (References & Signatures) · 5. Strings & Text (String Forensics) · 6. Data Modeling (RAII Constructs) · 7. Error Handling (Smart Pointers) · 8. Standard Library & Idioms (Heartbleed Lab) · 9. Abstraction & Generics (Template Forge) · 10. Concurrency & Async (Algorithm Suite) · 11. Testing & Tooling (Thread Pool) · 12. Capstone Operation (Operation: Zero-Copy Core)

## Teaching method

1. **Predict:** Read the lesson code and predict what it does before running anything.
2. **Run:** Run the starter or example and compare the result to your prediction.
3. **Investigate:** Trace it line by line. Answer the self-explanation prompt.
4. **Modify:** Change the example so it does something slightly different.
5. **Make:** Write the mission code from scratch and pass the checks.

- PRIMM (Predict, Run, Investigate, Modify, Make) was tested with 493 students aged 11 to 14 across 13 schools, and the PRIMM group outperformed the control group. ([Sentance, Waite & Kallia (2019): PRIMM study](https://www.tandfonline.com/doi/pdf/10.1080/08993408.2019.1608781))
- Reading and tracing code before writing it is a core recommendation of the Raspberry Pi Foundation's review of programming pedagogy. ([Raspberry Pi Foundation: pedagogy review](https://www.raspberrypi.org/app/uploads/2021/11/Teaching-programming-in-schools-pedagogy-review-Raspberry-Pi-Foundation.pdf))
- Parsons problems offered on demand as scaffolding improved practice performance and efficiency, with similar post-test results. ([NSF PAR: Parsons problems as scaffolding](https://par.nsf.gov/biblio/10510493-parsons-problems-scaffold-code-writing-impact-performance-problem-solving-efficiency))
- Worked examples save learners time, and adding self-explanation prompts adds learning benefit. ([ACM: worked examples and Parsons problems review](https://dl.acm.org/doi/10.1145/3560266))
- Fading worked examples (showing less of the solution as skill grows) supports the transition to independent problem solving. ([arXiv: faded worked examples](https://arxiv.org/pdf/2512.20714))
