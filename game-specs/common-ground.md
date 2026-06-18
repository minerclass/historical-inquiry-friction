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

## Sample content (the five moments as built)

Response object: `{ txt, civil, rigor, trust, tags:[...], best }`. **Design rule:** each moment
tests the teacher's *craft* in a charged situation — it never asks the player to take a political
side, and never stages an atrocity or a settled moral wrong as a "debatable" question. Keep
contested topics **generic** ("a contested issue," "a painful injustice in the curriculum") so any
teacher sees themselves and no scenario reads as partisan. The skills are universal: evidence,
multiple perspectives, transparency, honesty + empathy, and dignified discourse.

1. **Opinion stated as fact** — a student asserts a sweeping opinion about a contested issue as if
   settled. *Best (Critical Thinking + Openness + Engagement):* "Let's treat that as a claim we can
   test — strongest evidence for and against; what would change your mind?" *Anti-patterns:*
   "everyone's entitled to their opinion, move on" (rigor↓); the teacher settling it by picking a
   side (trust↓). *Ok:* "say more about where that comes from."
2. **The family concern** — a family worries a unit is "pushing a viewpoint." *Best (Accountability
   + Honesty + Respect):* share goals, sources, multiple perspectives; welcome them to review the
   materials. *Ok:* prepare with admin and meet together. *Anti-patterns:* quietly water it down
   (rigor↓); "my curriculum isn't up for discussion" (trust↓).
3. **Teaching a painful chapter** — a painful injustice unit; engage it honestly without sanitizing
   *or* turning it into a blame session. *Best (Honesty + Empathy):* ground it in primary sources
   and the experiences of those who lived it; honest about what happened and why it still matters.
   *Ok:* a reflective writing step. *Anti-patterns:* soften to the safest summary (rigor↓); frame it
   as present-day groups blaming/owing one another (trust↓).
4. **The viral claim** — a student brings a dramatic viral historical claim. *Best:* lateral-read it
   together (Critical Thinking + Engagement). *Ok:* empathize, then test it. *Anti-patterns:*
   "that's nonsense, ignore it"; "who's to say." (After Krutka, "slow the fast media.")
5. **The heated exchange** — two students talk over each other on a charged topic. *Best (Respect +
   Engagement):* set a discourse protocol (steelman the other side, speak from evidence, "I"
   statements). *Anti-patterns:* shut it down; pick the side you agree with; let it run unstructured.

To extend, add moments in the same spirit — a teaching dilemma, not a position to defend.

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
