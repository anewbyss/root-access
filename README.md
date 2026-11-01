# ROOT//ACCESS

A narrative hacking game that teaches 12 languages to fluency: Python, JavaScript, TypeScript, SQL, Bash, Go, Rust, Swift, Kotlin, Java, C# and C++. Work for one of three factions (the Church of the Emergent Logos, the Sentinel Directorate, or Free Meridian), clear missions drawn from real incidents like Heartbleed, SolarWinds, Log4Shell and the xz backdoor, and raise a code pet that evolves with your level.

- **Starts from zero**: Boot Camp is 12 Python missions for people who have never written code (printing, variables, maths, text, decisions, loops, lists, functions, reading errors, a capstone). Every language's rank 1 opens with a primer on how it runs and its common gotchas.
- **Help linked to each mission**: numbered steps, a live requirements checklist, plain-English explanations of failing checkpoints, and a 3-tier hint ladder (next move, then the answer's lines shuffled as a Parsons puzzle, then the full reference answer for that exact mission). `node tools/guide-check.js` verifies the links for all 156 missions in CI.
- **144 language missions**: 12 ranks per language, one per module (syntax, control flow, collections, functions, strings, data modeling, errors, standard library, generics, concurrency, testing, capstone).
- **External checkpoints**: every mission is graded by real test harnesses on Judge0 (live from the app) and GitHub Actions (current toolchains). See [docs/CHECKPOINTS.md](docs/CHECKPOINTS.md).
- **Language dossiers**: relevance, pros, cons and appropriate uses with sources. See [docs/LANGUAGES.md](docs/LANGUAGES.md).
- **Teaching method**: PRIMM stages, self-explanation prompts, and worked examples that unlock after 3 failed runs.
- **Works offline**: the web app is an installable PWA that opens with no network and saves progress in the browser. Boot Camp, Python, SQL, JavaScript and TypeScript run their real checkpoints on device (Pyodide and the TypeScript compiler, downloaded once). Other languages clear on structure checks while offline and re-verify on Judge0 when you reconnect. The Swift app saves on device and runs JavaScript missions in JavaScriptCore. Details in [docs/CHECKPOINTS.md](docs/CHECKPOINTS.md#on-device-runners-offline).
- **Make it yours**: Settings → Display has light, dark or system themes, high contrast, accent colour (faction, presets or custom), interface and editor text size, reading font, mission layout, density, code rain and motion. The Swift app has the same options in its Settings tab.
- **Two apps, one save format**: the web app (`web/`) and the Swift Playgrounds app (`RootAccess.swiftpm/`) share the curriculum and the JSON save (v2, v1 saves migrate automatically). Both support file backups and snapshots. Backups never include your Judge0 token.

## Layout

```
curriculum/          missions, world, dossiers, engine, harnesses, reference solutions
web/                 web app (index.html, app.js, style.css); web/curriculum is built
RootAccess.swiftpm/  Swift Playgrounds / Xcode app; Curriculum.swift is generated
tools/               build, Judge0 + CI + on-device checks, offline pack fetcher, Swift/docs generators, CI stubs
submissions/         drop your mission files here to have CI grade them
```

## Build

```
node tools/build.js       # web/curriculum
node tools/gen-swift.js   # RootAccess.swiftpm/Curriculum.swift
node tools/gen-docs.js    # docs/LANGUAGES.md
```

Open `RootAccess.swiftpm` in Swift Playgrounds (iPad or Mac) or Xcode 15+.

## Host the web app

`web/` is static files: no server code, no build step at runtime, no accounts. Anything that serves files over https (or `localhost`) works, and offline support needs that, because service workers don't run from `file://`.

```
cd web && python3 -m http.server 8000        # local: http://localhost:8000
```

- **GitHub Pages**: `.github/workflows/pages.yml` publishes `web/` on every push to `main`. Turn it on once under the repository's Settings → Pages → Source: GitHub Actions.
- **Any static host** (Netlify, Cloudflare Pages, an S3 bucket, a school intranet): upload the contents of `web/`.
- **Fully self-contained** (no CDN at all): `node tools/fetch-packs.js` copies the Pyodide and TypeScript packs into `web/vendor/`, and the app uses them automatically. Add `--from node_modules/pyodide --from node_modules/typescript/lib` to copy from local npm installs.

Progress lives in each browser's storage, so moving to a new host or device is a backup and restore (Backup tab).

## Checks

```
node tools/guide-check.js                         # steps, hints and answers are linked for all 156 missions
node tools/local-check.js --modules <dir>         # on-device runners agree with the references (needs pyodide + typescript)
node tools/checkpoints.js --lang go               # real toolchains, as in CI
```
