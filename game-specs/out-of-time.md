# Out of Time — game spec

> Standalone build brief. Shared conventions are in [README.md](README.md); essentials repeated
> here so this file can be handed off alone.

## One-line

A judgment game in which the player evaluates a historical actor's decision *using only what
that person could have known* — practicing **contextualization** and resisting **presentism**,
the historical-thinking move the other games touch least.

## Why it exists

The fastest way AI (and students) distort history is presentism: judging the past by the
knowledge and values of the present. Generative AI is especially prone to smoothing the past
into a tidy, modern-sounding story. This game makes the player rebuild a period worldview
before judging it, and punishes the seductive pull of hindsight.

- **Audience:** secondary students.
- **Play time:** 6–9 minutes; 3–4 decision scenes.
- **Frameworks:** contextualization; noetic friction; C.O.R.E. (Openness); H.E.A.R.T. (Empathy —
  understanding people unlike us on their own terms).

## Screens

1. **Title.** Role framing: *"You are a time-bound historian. You may judge the past — but only
   with what the people there could actually have known. Hindsight is a trap."* Begin button.
2. **Play.** A scene card (an actor facing a decision at a date/place), a **context board** the
   player fills, then a judgment step. HUD meters. Mentor hint.
3. **Debrief.** Contextual fidelity vs. presentist drift, what contextualization is, replay.

## HUD meters

- **Contextual Fidelity** `0–100` — how well the player reasoned from period-available knowledge.
  Starts 50.
- **Presentist Drift** `0–100` — how often the player reached for modern knowledge/values to
  judge. Starts 0; lower is better. (Visually: a creeping bar with a warning threshold at ~50.)
- **Hindsight Traps Avoided** — counter `x / total`.

## Core loop

Each **scene** has three steps:

1. **Set the scene.** An actor, a date, a place, and a decision they must make — written without
   spoilers about how it turned out. e.g. *"A New England merchant, 1774: do you sign the
   non-importation agreement that will cost your livelihood?"*
2. **Build the context (tile pick).** The player is shown 6 **knowledge tiles** and must select
   the ~3 that were *available at the time*. Mixed in are **anachronism tiles** (true, but only
   knowable later) and **value-anachronism tiles** (modern judgments). Selecting period tiles →
   Contextual Fidelity up. Selecting anachronism/hindsight tiles → Presentist Drift up + a
   "hindsight trap" flagged with a one-line explanation.
3. **Judge.** Given the context the player assembled, choose the most defensible *historical*
   appraisal of the actor's decision (not "were they right by our standards" but "was this a
   reasonable choice given what they knew and faced"). Feedback explains why.

Then a **scene verdict**. 3–4 scenes total.

## Sample content (schema + examples — author 1 more to reach 3–4)

Tile object: `{ text, type: "period" | "anachronism" | "value", note }`.

### Scene A — The merchant and non-importation, Boston, 1774
- Tiles (player should pick the 3 `period`):
  - *period:* "Parliament has closed Boston's port (Coercive Acts)." 
  - *period:* "Committees of correspondence are pressuring merchants to comply."
  - *period:* "Signing risks your business; refusing risks your standing in the community."
  - *anachronism:* "The colonies will win independence in 1783." → trap: nobody in 1774 knew this.
  - *anachronism:* "This boycott will be studied as a model of nonviolent resistance." → trap.
  - *value:* "Anyone who hesitated was a coward." → trap: a modern moral verdict, not analysis.
- Judgment options → reward the appraisal grounded in 1774 pressures and uncertainty.

### Scene B — A delegate and the slavery clauses, Constitutional Convention, 1787
- Period tiles: the union may collapse without Southern states; the three-fifths and slave-trade
  compromises are being bargained; abolition has limited political power in 1787.
- Anachronism trap: "We know this delay helped cause the Civil War 74 years later."
- Value trap: "They were simply evil and that's all there is to say."
- Judgment: reward holding *both* — the moral stakes **and** the period political constraints —
  without collapsing into either hindsight condemnation or excuse. (This scene models that
  contextualization is **not** moral relativism; surface that explicitly in feedback.)

### Scene C — (author one more, e.g., a 1957 Little Rock decision, or a WWII homefront choice)

> Important: contextualization is not exoneration. At least one scene's debrief must state that
> understanding why people acted as they did is different from endorsing it — historians do both
> "explain in context" and "evaluate." Avoid scenarios that could read as excusing atrocity;
> frame the harder ones around constraint, uncertainty, and contested choices.

## Debrief content

- Contextual Fidelity vs. Presentist Drift, traps avoided.
- "What contextualization is" + "what it is *not* (relativism / excuse-making)."
- Map to Openness (C.O.R.E.) and Empathy (H.E.A.R.T.).
- Replay (reshuffle tiles / scene order).

## Technical notes

- Data model: `scenes[]` → `{ setup, tiles[], correctTileIds, judgments[] }`.
- Tile selection is multi-select with a confirm; cap selections to keep it a judgment, not a sweep.
- `aria-live` feedback; keyboard-selectable tiles (Space toggles, Enter confirms); reduced-motion.

## Integration

- Deploy as `out-of-time/` or its own repo. Games-hub tags: *Historical inquiry · Source literacy*.
- Link from the deck's "Anatomy of historical thinking" slide (the Contextualization card).
