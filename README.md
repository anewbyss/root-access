# ROOT//ACCESS

A narrative hacking game that teaches 12 languages to fluency: Python, JavaScript, TypeScript, SQL, Bash, Go, Rust, Swift, Kotlin, Java, C# and C++. Work for one of three factions (the Church of the Emergent Logos, the Sentinel Directorate, or Free Meridian), clear missions drawn from real incidents like Heartbleed, SolarWinds, Log4Shell and the xz backdoor, and raise a code pet that evolves with your level.

- **Starts from zero**: Boot Camp is 12 Python missions for people who have never written code (printing, variables, maths, text, decisions, loops, lists, functions, reading errors, a capstone). Every language's rank 1 opens with a primer on how it runs and its common gotchas.
- **Help linked to each mission**: numbered steps, a live requirements checklist, plain-English explanations of failing checkpoints, and a 3-tier hint ladder (next move, then the answer's lines shuffled as a Parsons puzzle, then the full reference answer for that exact mission). `node tools/guide-check.js` verifies the links for all 156 missions in CI.
- **144 language missions**: 12 ranks per language, one per module (syntax, control flow, collections, functions, strings, data modeling, errors, standard library, generics, concurrency, testing, capstone).
- **External checkpoints**: every mission is graded by real test harnesses on Judge0 (live from the app) and GitHub Actions (current toolchains). See [docs/CHECKPOINTS.md](docs/CHECKPOINTS.md).
- **Language dossiers**: relevance, pros, cons and appropriate uses with sources. See [docs/LANGUAGES.md](docs/LANGUAGES.md).
- **Teaching method**: PRIMM stages, self-explanation prompts, and worked examples that unlock after 3 failed runs.
- **Two apps, one save format**: the web app (`web/`) and the Swift Playgrounds app (`RootAccess.swiftpm/`) share the curriculum and the JSON save (v2, v1 saves migrate automatically). Both support file backups and snapshots.

## Layout

```
curriculum/          missions, world, dossiers, engine, harnesses, reference solutions
web/                 web app (index.html, app.js, style.css); web/curriculum is built
RootAccess.swiftpm/  Swift Playgrounds / Xcode app; Curriculum.swift is generated
tools/               build, Judge0 + CI runners, Swift/docs generators, CI stubs
submissions/         drop your mission files here to have CI grade them
```

## Build

```
node tools/build.js       # web/curriculum
node tools/gen-swift.js   # RootAccess.swiftpm/Curriculum.swift
node tools/gen-docs.js    # docs/LANGUAGES.md
```

Serve `web/` with any static server. Open `RootAccess.swiftpm` in Swift Playgrounds (iPad or Mac) or Xcode 15+.
