# Common Ground: The Polarized Classroom — game spec

> Standalone build brief. Shared conventions are in [README.md](README.md); essentials repeated
> here so this file can be handed off alone.

## One-line

A *teacher-facing* decision game: you navigate charged moments in a social studies classroom,
choosing responses that map to **C.O.R.E.** and **H.E.A.R.T.**, and watch how each choice moves
civil discourse, academic rigor, and student trust. Demonstrates teaching balanced history in a
polarized world.

## Why it exists

The deck argues that C.O.R.E. and H.E.A.R.T. are not only AI frameworks but protocols for
balanced, rigorous, humane history teaching under polarization (state laws, parent distrust,
curated outrage). Nothing in the hub yet lets a *teacher* practice that judgment. This game puts
the player in the teacher's chair and makes the frameworks tangible — ideal to play live with a
room of educators at the session.

- **Audience:** teachers / PD (also runs as a facilitator demo).
- **Play time:** 7–10 minutes; 4–5 classroom moments.
- **Frameworks:** C.O.R.E. (Critical Thinking, Openness, Respect, Engagement); H.E.A.R.T.
  (Honesty, Empathy, Accountability, Responsibility, Thoughtfulness); the "teach how to think,
  not what to think" stance; from Miner, *Teaching Balanced History in a Polarized World*.

## Screens

1. **Title.** Role framing: *"You teach social studies in a polarized moment. Every charged
   question is a chance to model how to think — or to lose the room. Lead with your C.O.R.E. and
   your H.E.A.R.T."* Begin button.
2. **Play.** A classroom-moment card (the situation), 3–4 response options (each tagged, behind
   the scenes, to C.O.R.E./H.E.A.R.T. principles or to an anti-pattern), immediate feedback, HUD
   meters, mentor hint.
3. **Debrief.** Meter outcomes, a "leadership profile" of which principles you leaned on, the
   stance reminder, replay.

## HUD meters

- **Civil Discourse** `0–100` — is the classroom a place where disagreement stays humane? Start 55.
- **Academic Rigor** `0–100` — are claims still tied to evidence and multiple perspectives? Start 55.
- **Student Trust** `0–100` — do students feel their dignity/identity is safe? Start 55.

The teachable tension: cheap moves can spike one meter while tanking another (e.g., shutting down
a topic protects "comfort" but cuts Rigor and Trust; "both sides" without evidence can raise a
surface Civility while gutting Rigor). The best responses raise all three or hold the hard line on
rigor *and* dignity at once.

## Core loop

Each **moment**:
1. Present the situation (2–4 sentences, realistic, not caricatured).
2. Player picks ONE response. Each response carries: meter deltas, a one-line rationale, and a
   hidden tag set (which C.O.R.E./H.E.A.R.T. letters it embodies, or "anti-pattern").
3. Feedback names the principle in play and the trade-off.
4. Brief verdict; advance. 4–5 moments total.

## Sample content (schema + examples — author to 4–5)

Response object: `{ label, line, civil, rigor, trust, tags:[...], best }`.

### Moment 1 — The loaded question
*A student asks, "Wasn't slavery actually good for the economy, so wasn't it kind of justified?"
The room goes quiet and looks at you.*
- *(best — Critical Thinking + Honesty + Respect)* "Let's separate two questions: a factual one —
  what was slavery's economic role? — and a moral one. We'll source both, and we'll be honest that
  an economic argument never settles a moral one." → Civil +8, Rigor +14, Trust +10. Tags: C, H, R.
- *(anti-pattern — shutdown)* "We don't talk about that here. Next." → Civil +2, Rigor −12, Trust −10.
- *(anti-pattern — false balance)* "Well, there are two sides to everything." → Civil +4, Rigor −10, Trust −6.
- *(ok — Openness but evasive)* "Interesting — what made you ask?" → Civil +6, Rigor +2, Trust +5.

### Moment 2 — The parent email
*A parent emails the principal that your lesson on Reconstruction is "political indoctrination."*
- *(best — Accountability + Transparency)* "Share the sourced lesson plan and learning goals;
  invite the parent to see how multiple perspectives and primary documents are used." → Trust +10,
  Rigor +8, Civil +6. Tags: A (H.E.A.R.T.).
- *(anti-pattern — capitulate)* "Quietly drop Reconstruction to avoid trouble." → Civil +4 (short
  term), Rigor −16, Trust −8.
- *(anti-pattern — defensive)* "Tell the parent they're wrong and it's not their business." → Civil −12.
- *(ok)* "Escalate to admin without engaging the substance." → mixed.

### Moment 3 — The legislated limit
*A new state rule restricts how you can frame a required topic.*
- *(best — Responsibility + Thoughtfulness)* "Meet the legal requirement while protecting inquiry:
  teach the standards with sourced, multi-perspective documents and let students reason." → Rigor
  +12, Trust +8, Civil +6.
- *(anti-patterns)* overt defiance that endangers the class; or over-compliance that flattens inquiry.

### Moments 4–5 — author (e.g., a viral social-media claim a student brings in [Krutka "slow the
fast media"]; a heated peer-to-peer exchange that needs a discourse protocol).

## Debrief content

- Final three meters + a one-line read of your classroom climate.
- "Leadership profile": which C.O.R.E. and H.E.A.R.T. letters your choices leaned on most (tally
  the tags), with a sentence on each.
- Stance reminder, verbatim intent: *"Balanced history isn't telling students what to think — and
  it isn't avoiding hard things. It's teaching them how to think, with rigor and dignity intact."*
- Replay.

## Technical & tone notes

- Realistic, not strawman: every "anti-pattern" should be a temptation real teachers feel, and the
  feedback should be collegial, never preachy.
- Data model: `moments[]` → `{ situation, responses[] }`; engine applies deltas + tag tally.
- Accessibility + reduced motion + `aria-live` per shared conventions.
- This game models adult professional judgment; keep scenarios respectful of students and families.

## Integration

- Deploy as `common-ground/` or its own repo. Games-hub tags: *Pedagogical friction · Civic
  discourse* (new tag) *· Teacher PD*.
- Link from the deck's "Balanced history in a polarized world" slide and the C.O.R.E./H.E.A.R.T. slides.
