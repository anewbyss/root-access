# ROOT//ACCESS for Swift Playgrounds

Open this folder in Swift Playgrounds 4.4+ (iPad or Mac) or Xcode 15+. Requires iOS/iPadOS 17.

- Same 156 missions (Boot Camp plus 144 language missions), step-by-step guides, hint ladder, faction briefs, dossiers and pet as the web app. `Curriculum.swift` embeds the shared JavaScript curriculum, and `Engine.swift` runs it in JavaScriptCore, so checkpoint harnesses are identical to the web app and GitHub Actions.
- Run external checkpoints: your code is composed with the mission's harness and sent to Judge0 over URLSession. Set your own Judge0 host or token in the Engines tab.
- CI-only missions (go12, sw10–12, kt10, kt12, jv11, jv12) run structure checks here and export a file for `submissions/`.
- Backups: autosave to the app's Documents folder, 10 rolling snapshots, export/import JSON through Files or iCloud Drive, share sheet, clipboard, and an Export submissions folder button. The JSON is the same v2 format as the web app; v1 saves upgrade on load.

Regenerate `Curriculum.swift` after editing `curriculum/`: `node tools/build.js && node tools/gen-swift.js`.
