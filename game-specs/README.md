# Game specs — "When AI Does the Thinking" learning games

Handoff specifications for three social-studies learning games that extend the
[games-hub](https://minerclass.github.io/games-hub/) family (Keepers of Inquiry, Keeper of
the Source, Friction Lab, Keeper of the Word). Each `.md` is a standalone brief an agent
(Codex, Google Antigravity, Claude, etc.) can build from without further context.

| Spec | Game | Teaches | Status |
| --- | --- | --- | --- |
| [devils-advocate.md](devils-advocate.md) | The Devil's Advocate | Rhetorical friction; building counterarguments against fluent AI claims | **Build first (in progress)** |
| [out-of-time.md](out-of-time.md) | Out of Time | Contextualization; resisting presentism | Handoff-ready |
| [common-ground.md](common-ground.md) | Common Ground: The Polarized Classroom | C.O.R.E. & H.E.A.R.T.; balanced history in a polarized world (teacher-facing) | Handoff-ready |

A fourth concept — **Informed Action** (civics / C3 "taking informed action") — is available on
request and not yet spec'd.

## Shared build conventions (apply to all three)

- **One self-contained `index.html`** — inline `<style>` + `<script>`, no build step, no runtime
  dependencies except (optional) Google Fonts / FontAwesome via CDN. Ships as a GitHub Pages
  subfolder (e.g. `devils-advocate/`) or its own repo linked from the games-hub.
- **No data collection.** Everything runs client-side; nothing is transmitted or stored
  server-side. This is "playable public scholarship." Do not add analytics or student data.
- **Design language (match the deck family):** serif display (Georgia / "Playfair Display"),
  sans UI ("Segoe UI" / Outfit), mono labels (Consolas / "Fira Code"). Palette — ink `#171914`,
  paper `#f4f0e6`, forest `#183c32`, moss `#49735f`, ember `#b84f32`, gold `#d5ae58`,
  blue `#315d7a`. Rounded cards, soft shadows, both dark and paper surfaces.
- **Three screens:** Title (role framing + premise + Start) → Play (HUD meters + scenario +
  choices + immediate feedback) → Debrief (score + what each move taught + Replay).
- **Feel:** meters animate; every choice gives an immediate consequence plus a one-line
  rationale; each round ends with a short verdict; the final debrief maps play back to the
  historical-thinking moves and to C.O.R.E. / H.E.A.R.T.
- **Accessibility:** full keyboard operation, visible focus rings, `aria-live` on dynamic
  feedback, `prefers-reduced-motion` support, legible contrast on both surfaces.
- **Framework grounding:** Miner's pedagogical friction (noetic / rhetorical / existential /
  infrastructural); C.O.R.E. (Critical Thinking, Openness, Respect, Engagement); H.E.A.R.T.
  (Honesty, Empathy, Accountability, Responsibility, Thoughtfulness); historical-thinking
  moves (sourcing, contextualization, corroboration, close reading, evidence-based
  interpretation); Wineburg / SHEG; Bjork & Bjork "desirable difficulties."
- **Tone:** the games are not anti-AI. They treat AI output as a *source to interrogate* and
  reward judgment, not refusal. Never pass/fail — score + reflect + replay.
- **Integration:** add a tile to the games-hub catalog and a launch link from the relevant
  slide of the deck (`historical-inquiry-friction`), mirroring how Keepers of Inquiry is linked.

## Historical accuracy

All historical content must be defensible and sourced to the period. Where a claim is
contested among historians, present it *as* contested — that is the teachable point. Keep
examples drawn from widely taught secondary topics (American Revolution, the Constitution /
Federalist debates, causes of the Civil War, Reconstruction, civil rights). Avoid inventing
quotations; paraphrase or use well-attested ones.
