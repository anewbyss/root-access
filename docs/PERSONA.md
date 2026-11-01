# Pet personalities (`rootaccess-persona` v1)

Your code pet can be exported as a personality for an assistant program: a JARVIS-style helper, a chat tool, a voice app, or something you build later. The file is meant to outlive the game, so the format is small, versioned and open for additions.

## Where it comes from

`curriculum/_pet.js` builds it (`RA.persona(save)`), so the web app and the Swift app produce identical files. Inputs are the pet's parts plus how you actually played:

| Trait | Driven by |
|---|---|
| warmth | bond, smile/grin mouths, blush; fangs and horns lower it |
| energy | pet energy, sparks/pulse/firewall auras, wide eyes; sleepy eyes lower it |
| curiosity | how many languages you've started; antenna, dish, circlet |
| rigor | share of clears verified on a real engine (Judge0 or on device); scanner/visor eyes, monocle |
| humor | glyph/heart/crashed eyes, grin/waveform mouths, bow tie, sprout, ears |
| boldness | horns, mohawk, flame, crown, glitch/firewall auras, cape/wings, failed runs you pushed through |
| formality | faction (Sentinel highest, Meridian lowest), monocle, bow tie, headset |
| independence | share of clears without hints, evolution stage |

The archetype is your strongest trait plus a faction role (Logos: Oracle, Sentinel: Warden, Meridian: Relay, Lantern: Archivist). Catchphrases come from your two strongest languages and your faction's creed; quirks come from parts (a glitch aura stutters, trinary eyes group things in threes). **Reroll** changes a seed that nudges the mix; sliders and text fields override anything. Overrides live in the save under `pet.persona` and travel with backups.

## The file

```jsonc
{
  "format": "rootaccess-persona", "version": 1,
  "$schema": "https://anewbyss.github.io/root-access/persona.schema.json",
  "name": "BIT", "pronouns": "it/its", "archetype": "Devoted Archivist", "summary": "...",
  "traits": { "warmth": 71, "energy": 53, "...": 0 },     // 0..100
  "voice": { "tone": [], "greeting": "", "signoff": "", "catchphrases": [], "quirks": [] },
  "knowledge": { "languages": [ { "id": "python", "ranks": 7, "of": 12, "fluent": false } ], "level": 11 },
  "appearance": { "description": "", "parts": {}, "avatarSvg": "<svg ...>" },
  "principles": [ "Ask before taking actions that change files, accounts, money..." ],
  "prompt": { "system": "You are BIT, ..." },             // ready for any LLM
  "capabilities": [], "connectors": [], "memory": { "notes": [] }, "extensions": {}
}
```

The full schema is [`web/persona.schema.json`](../web/persona.schema.json), published with the web app.

## Loading it in an assistant

The minimum: read `prompt.system` and use it as the system prompt. Everything else is there so a richer host can do more without parsing prose: show `appearance.avatarSvg`, greet with `voice.greeting`, tune speech from `traits`, adapt to `knowledge`.

```js
const persona = JSON.parse(fs.readFileSync("bit.persona.json", "utf8"));
if (persona.format !== "rootaccess-persona" || persona.version !== 1) throw new Error("unsupported persona");
const system = persona.prompt.system;   // pass as the system prompt to the model you use
```

## Growing it later (open-ended by design)

- **capabilities**: abilities the host turns on, e.g. `{ "id": "voice", "enabled": true, "settings": { "rate": 1.1 } }`.
- **connectors**: integrations, e.g. `{ "id": "calendar", "kind": "mcp", "endpoint": "...", "scopes": ["read"] }`. The game always exports these empty; a host must ask the user before attaching anything.
- **memory**: anything the host wants to remember across sessions.
- **extensions**: host-specific data under `x-` keys, e.g. `"x-jarvis": { "wakeWord": "hey bit" }`.

Rules that keep files compatible: readers ignore unknown fields and unknown trait ids; new fields are additive and keep `version: 1`; only a breaking change bumps the version. Hosts should keep `principles` even when they extend the persona.
