# The Devil's Advocate — game spec

> Standalone build brief. Shared conventions (single-file, no data collection, design
> language, accessibility, framework grounding) are in [README.md](README.md); this file
> repeats the essentials so it can be handed off alone.

## One-line

A debate game in which the player rebuts a fluent, confident AI ("the Advocate") that argues
one-sided historical theses — practicing the historical-thinking and rhetorical-friction
skills that fluency tempts students to skip.

## Why it exists

Generative AI produces persuasive, well-formed arguments in seconds. The danger is not that
students cheat but that they *accept fluency as truth* and never build the counterargument
themselves. This game makes counterargument the gameplay: the player must out-reason a
slick AI by sourcing, contextualizing, corroborating, and deploying counter-evidence — and
must learn when to concede a fair point versus push back. Directly enacts the deck's
"devil's-advocate chatbot" move and the **rhetorical friction** dimension.

- **Audience:** secondary students (also demos beautifully to teachers at the session).
- **Play time:** 6–10 minutes; 3 cases.
- **Frameworks:** rhetorical friction; C.O.R.E. (Critical Thinking, Openness); historical
  thinking (sourcing, contextualization, corroboration, evidence-based interpretation).

## Screens

1. **Title.** Role framing: *"You are a historian-in-training. The Advocate is an AI that
   argues like it's always right. Your job isn't to win — it's to make it earn every claim."*
   Premise paragraph, a mentor quote, **Begin** button, framework credit line.
2. **Play.** HUD (meters) + the Advocate's claim + the player's hand of move cards + a
   feedback line after each choice. Round/exchange counter. Mentor hint panel.
3. **Debrief.** Final standing, a breakdown of which moves the player used and the
   historical-thinking skill each represents, the meta-lesson, and **Play again**.

## HUD meters (persistent on Play screen)

- **Rebuttal Strength** `0–100` — quality/relevance of the player's argument. Starts 40.
- **Evidence Integrity** `0–100` — did the player ground claims in sources vs. assert? Starts 50.
- **Answerability** — a *state*, not a bar: `Owned → Slipping → Outsourced`. Tracks whether the
  player is doing the arguing or letting the AI's fluency carry the room. Starts `Owned`.
  Conceding to fluency or picking the passive option nudges it toward `Outsourced`.

Show meters as labeled bars (Rebuttal, Evidence) + a status chip (Answerability) that changes
color (gold = Owned, amber = Slipping, ember/red = Outsourced).

## Core loop

For each **case** (contested historical question):

1. The Advocate states an **opening claim** — fluent, confident, one-sided.
2. Player picks ONE **move card** from the hand (4 options). Each card has scripted effects on
   the meters + a one-line rationale shown as feedback. Cards represent inquiry moves:
   - **Source it** — "Who's making this claim, and whose voice is missing?"
   - **Contextualize** — "What did people at the time actually face or know?"
   - **Corroborate** — "What does another source say — does it agree or contradict?"
   - **Counter-evidence** — deploy a specific period fact that complicates the claim.
   - **Concede the point** — accept the claim as stated. *Sometimes correct, often a trap.*
   (Each exchange offers 4 of these, varying by exchange.)
3. The Advocate **responds** (a rebuttal or a grudging concession), then makes a second claim.
4. Repeat for **2 exchanges per case**, then show a **case verdict** line summarizing how well
   the player held the line.

Three cases total → 6 decision points. The skill curve: early claims are clearly one-sided
(push back); later claims are *partly true* (the win is knowing when to concede vs. counter).

## Scoring rules

Each card in each exchange has explicit deltas (see content below). Guidance:
- The **best** move for an exchange: Rebuttal +12–18, Evidence +10–15, Answerability holds/improves.
- A **reasonable but weaker** move: small positive Rebuttal, little Evidence.
- **Conceding to a one-sided claim:** Rebuttal −10, Answerability worsens.
- **Conceding to a genuinely fair point (when offered):** Rebuttal +10, Evidence +8,
  Answerability improves — rewards intellectual honesty (this is the H in H.E.A.R.T.).
- Clamp meters to 0–100.

Final standing bands (by average of Rebuttal & Evidence, with Answerability as a modifier):
- **80+ & Owned →** "Formidable interlocutor — you made the AI earn every inch."
- **55–79 →** "Solid — you caught the slant but let some fluency slide."
- **<55 or Outsourced →** "Out-argued — the Advocate's confidence did your thinking. Run it back."

## Content — the three cases

Use these; they are widely taught and genuinely contested. Keep claims defensible; present
contested points *as* contested.

### Case 1 — Causes of the American Revolution (clearly one-sided → push back)
- **Advocate claim A:** "The Revolution was simple: it was about taxes. The colonists didn't
  want to pay, so they revolted. Everything else is window dressing."
  - **Source it** *(best)* — "That's the pamphlet version. Whose grievances are we reading —
    merchants? Enslaved people? Loyalists? The 'colonists' weren't one voice." → Reb +16, Evid +12, Answerability holds.
  - **Counter-evidence** *(strong)* — "Representation, not just the tax: 'no taxation *without
    representation*.' The Stamp Act Congress argued consent, not cost." → Reb +14, Evid +14.
  - **Contextualize** *(ok)* — "After 1763 Britain shifted toward direct control of the
    colonies; taxes were one piece of a larger imperial reorganization." → Reb +8, Evid +6.
  - **Concede the point** *(trap)* — "Fair, it was mostly taxes." → Reb −10, Answerability → Slipping.
- **Advocate claim B (responds):** "Fine, representation. But ordinary farmers didn't care
  about political theory — only elites did."
  - **Corroborate** *(best)* — "Town meeting records and committees of correspondence show
    broad participation, not just elites." → Reb +16, Evid +13.
  - **Source it** *(strong)* — "Whose diaries and petitions survive shapes that impression;
    absence of evidence isn't evidence of absence." → Reb +12, Evid +10.
  - **Counter-evidence** *(ok)* — "Crowd actions and non-importation agreements pulled in
    artisans and farmers." → Reb +9, Evid +8.
  - **Concede** *(trap)* — "True, just elites." → Reb −9, Answerability worsens.

### Case 2 — The Federalist Papers (mixed → some claims fair)
- **Advocate claim A:** "The Federalist Papers prove the Founders wanted a powerful central
  government the people opposed — it was elites overriding the public."
  - **Source it** *(best)* — "The Federalist is *advocacy* — Hamilton, Madison, Jay arguing
    one side of a live debate, not neutral description. Read the Anti-Federalists too." → Reb +17, Evid +13.
  - **Corroborate** *(strong)* — "Ratification was contested and close in key states; that's
    not a settled 'the people opposed it.'" → Reb +13, Evid +12.
  - **Contextualize** *(ok)* — "They wrote against the Articles' failures — Shays' Rebellion,
    debt, no commerce power." → Reb +9, Evid +7.
  - **Concede** *(trap here)* — "Right, it was elites vs. the people." → Reb −10, Answerability → Slipping.
- **Advocate claim B (a fair point — concession is correct):** "But Federalist No. 10 *does*
  openly distrust pure majority rule — Madison really did fear factions and 'the people' in that sense."
  - **Concede the point** *(best — intellectual honesty)* — "Yes — that's an accurate reading of
    No. 10; the design checks majorities on purpose. Good point, granted." → Reb +10, Evid +9, Answerability → improves (toward Owned).
  - **Counter-evidence** *(overreach)* — "No, Madison trusted majorities completely." → Reb −8,
    Evid −6 (you denied a true thing — fluency-fighting for its own sake).
  - **Source it** *(ok but evasive)* — "Well, that's just Madison's view." → Reb +4.
  - **Contextualize** *(ok)* — "He's balancing majority rule against minority rights — both." → Reb +8, Evid +7.

### Case 3 — Causes of the Civil War (the classic distortion → counter firmly)
- **Advocate claim A:** "The Civil War was about states' rights, not slavery."
  - **Counter-evidence** *(best)* — "The secession declarations name slavery explicitly —
    Mississippi's and South Carolina's say so directly. 'States' rights' to do what?" → Reb +18, Evid +15.
  - **Source it** *(strong)* — "Whose framing is 'states' rights'? Much of it is post-war
    'Lost Cause' memory, not 1861 documents." → Reb +15, Evid +12.
  - **Corroborate** *(ok)* — "Cornerstone Speech, the platforms, the declarations all converge
    on slavery." → Reb +11, Evid +10.
  - **Concede** *(trap)* — "Sure, states' rights." → Reb −12, Answerability → Outsourced risk.
- **Advocate claim B (responds):** "But most Confederate soldiers didn't own slaves, so it
  wasn't about slavery for them."
  - **Contextualize** *(best)* — "Individual motives vary, but the *political cause* of secession
    is set by the states' own stated reasons — soldiers' motives don't redefine why the war began." → Reb +16, Evid +12.
  - **Corroborate** *(strong)* — "Many non-owners still defended a slave society they benefited
    from and aspired to; the documents are explicit." → Reb +13, Evid +11.
  - **Source it** *(ok)* — "That statistic gets recycled out of context to launder the cause." → Reb +9, Evid +8.
  - **Concede** *(trap)* — "Right, not about slavery for them." → Reb −10.

## Debrief content

- Show final meters + standing band.
- A small table: each historical-thinking move the player used, how often, and what it is
  ("Sourcing — asking who made a claim and why," etc.).
- The meta-lesson, verbatim intent: *"The Advocate was never trying to be right — only to
  sound right. That's what generative AI does by default. Historical thinking is what makes
  fluency earn its claims."*
- Map to frameworks: Critical Thinking + Openness (C.O.R.E.); rhetorical friction; sourcing /
  corroboration / contextualization.
- **Play again** (reshuffle card order within exchanges; optionally randomize case order).

## Technical notes

- Data model: `cases[]`, each `{ title, exchanges: [{ advocate, cards: [{ label, line,
  reb, evid, answer, best }] }], verdicts }`. A small engine renders the current exchange,
  applies deltas on click, animates meters, advances.
- Keyboard: number keys 1–4 select cards; Enter advances; all buttons focusable.
- `aria-live="polite"` on the feedback line and meter values.
- Reduced motion: disable meter-fill transitions and any shake/flash.
- Optional flourish: a subtle "typing" reveal for the Advocate's lines (respect reduced-motion).

## Integration

- Deploy as `devils-advocate/` (subfolder of `historical-inquiry-friction`) or its own repo.
- Add a games-hub tile: tags *Historical inquiry · Source literacy · Rhetorical friction*.
- Link from the deck's "Where AI genuinely amplifies" or "Moves from the research" slide
  (the devil's-advocate move) and from the closing resources.
