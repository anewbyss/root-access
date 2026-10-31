# Checkpoints

Every mission ends in checkpoints: real test programs that run your code on an external engine. Nothing is passed by pattern matching alone. Structure checks (regex hints) only gate the run so you get fast feedback before spending an engine call.

## How a checkpoint run works

1. `RA.compose(mission, yourCode, env)` merges your code with the mission's harness (`curriculum/checkpoints/<id>.*`, or a generated harness for Python, JavaScript, TypeScript and SQL), plus a small per-language prelude.
2. The composed program runs on an engine:
   - **Judge0** (`env = "judge0"`): the web app and the Swift app POST to `https://ce.judge0.com` (C# goes to `https://extra-ce.judge0.com`). Judge0 is open source and self-hostable; set your own host and token under Engines.
   - **GitHub Actions** (`env = "ci"`): `.github/workflows/checkpoints.yml` installs current toolchains and runs `tools/checkpoints.js`.
3. The harness prints one line per checkpoint and `RA.buildReport` parses them, identically in every host:

```
::cp::PASS::label
::cp::FAIL::label::detail
::cp::SKIP::label::detail
```

Labels must not contain `::`. A mission is cleared when no checkpoint fails (SKIP doesn't fail). Missing labels declared in the harness header count as `FAIL ... not reached`. Native runners count too: `cargo test`/`rustc --test` summaries and Swift Testing's `Test run with N tests passed` become checkpoints.

## Harness headers

```
// @cp label one | label two          checkpoints the harness promises to print
// @ci-only reason                      Judge0 can't run it; graded in GitHub Actions
// @opts -O2                            extra compiler options
// @args foo bar                        command-line arguments
```

## Where each mission runs

Judge0 runs 136 of 144 missions live. Eight need toolchains or libraries Judge0's images don't have and are graded in GitHub Actions only: `go12`, `sw10`, `sw11`, `sw12`, `kt10`, `kt12`, `jv11`, `jv12` (virtual threads/structured concurrency, Swift 6 concurrency, Swift Testing, SwiftUI, coroutines, Compose, JUnit). In the app, those missions run their structure checks and are marked "pending · GitHub Actions" until you commit them.

GitHub Actions also re-runs every Judge0 mission on current toolchains (JDK 25, .NET 10, Kotlin 2.2 + kotlinx.coroutines, g++ 14, Swift 6 on macOS) and checks that every starter fails, so no mission can be passed by submitting the starter.

## Grading your own code

- From the web app: Backup, then Download submissions.zip. From the Swift app: Backup, then Export submissions folder.
- Put the files in `submissions/` (named `<id>.<ext>`, for example `kt12.kt`) and push. The workflow grades them and writes a summary to the run page.
- Locally:

```
node tools/checkpoints.js --lang python            # reference solutions
node tools/checkpoints.js --lang go --starter      # starters must fail
node tools/checkpoints.js --dir submissions        # grade your files
node tools/judge0-check.js py7                     # one mission on Judge0
node tools/judge0-check.js all                     # every Judge0 mission
```

Env: `CXX` picks the C++ compiler; `RA_LIB` points at the Kotlin/Java jars (coroutines, JUnit console).

## Engine notes

- Judge0's public toolchains are older than CI's (Swift 5.2, Java 17, Kotlin 2.1, an older `tsc`). Harnesses are written to work on both; anything that can't is CI-only.
- The public Judge0 instances are rate-limited. The web app falls back to an in-browser runner for JavaScript and TypeScript if Judge0 is unreachable, and marks those clears "verified · in browser".
- The Swift app runs the exact same JavaScript (curriculum, harnesses, report parser) inside JavaScriptCore and only uses Swift for the HTTP call. The `swift playgrounds app` CI job type-checks the app against the iOS 17 SDK and runs that engine on macOS.
