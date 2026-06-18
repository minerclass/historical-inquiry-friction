# Informed Action — game spec

> Standalone build brief. Shared conventions are in [README.md](README.md); essentials repeated
> here so this file can be handed off alone.

## One-line

A civics game in which the player builds a defensible **civic action plan** on a real issue —
framing the problem, gathering evidence, mapping stakeholders, and weighing trade-offs — while
deciding when to accept or interrogate an AI's instant, frictionless ready-made plan.

## Why it exists

The C3 Framework's capstone is **Dimension 4: Taking Informed Action**. Generative AI can draft a
polished civic action plan in seconds — which is exactly the bypass: the plan arrives without the
reasoning that makes a citizen *informed*. This game makes that reasoning the gameplay and offers
the "AI shortcut" as a live temptation: take the fast plan (and lose ownership and rigor) or
interrogate it (and earn a plan you can actually defend). It fills the **civics** gap in the
games-hub, which currently leans historical.

- **Audience:** secondary students (civics / U.S. government; social studies broadly).
- **Play time:** 7–10 minutes; 1 deep scenario or a choice of 2.
- **Frameworks:** civic reasoning; C3 inquiry arc (esp. Dim 4); pedagogical friction (the
  frictionless-plan trap); C.O.R.E. (Critical Thinking, Engagement); H.E.A.R.T. (Accountability,
  Responsibility, Empathy).

## Tone guardrail (important)

Keep every scenario **nonpartisan and process-focused**. The game rewards *how* a student reasons
(evidence quality, whose voices are weighed, feasibility, ownership) — never a particular policy
position. Use local, age-appropriate civic issues where reasonable people can disagree on means.
Avoid hot-button partisan framings; if an issue has a partisan valence, foreground the deliberative
process, not the "right" answer. This aligns with the deck's "teach how to think, not what to think."

## Screens

1. **Title.** Role framing: *"An issue needs action. AI can hand you a finished plan in seconds —
   but an informed citizen can defend the evidence, the stakeholders, and the trade-offs as their
   own. Build a plan you can stand behind."* Begin button; pick-an-issue selector (optional).
2. **Play.** A phase tracker (the C3 arc), the current decision, options, immediate feedback, HUD
   meters, mentor hint, and a recurring **AI Assist** offer.
3. **Debrief.** Plan viability, ownership, a map to C3 Dim 4 + frameworks, the meta-lesson, replay.

## HUD meters

- **Evidence Base** `0–100` — is the plan grounded in credible, varied sources (not one source,
  not vibes)? Start 40.
- **Stakeholder Breadth** `0–100` — whose interests/voices are considered, including those most
  affected? Start 40.
- **Feasibility** `0–100` — is it realistic given authority, resources, and time (vs. performative
  or impossible)? Start 50.
- **Ownership** — a *state* chip: `Owned → Borrowed → Outsourced`. Accepting AI's ready-made plan
  or steps drives it toward Outsourced; interrogating/building drives it toward Owned. Start `Owned`.

## Core loop — phases (compressed C3 arc)

Each scenario runs five phases; each is one decision (some offer an AI Assist temptation):

1. **Frame the question.** Pick the strongest, most actionable framing of the problem
   (too-vague / too-narrow / partisan-loaded / well-scoped). Rewards a researchable, actionable
   civic question.
2. **Gather evidence.** Choose sources to rely on. *AI Assist offered:* "Want an instant summary
   of the issue?" Accept (fast; Evidence stays flat or dips if unverified; Ownership → Borrowed) or
   "Use it, then verify against primary/official sources" (costs a beat; Evidence up; Ownership holds).
3. **Map stakeholders.** Select whose interests must be weighed; traps = omitting the most-affected
   group, or tokenizing. Rewards breadth + including those with the least power.
4. **Weigh trade-offs / choose the action.** Options range from **performative** (a hashtag, a
   poster) to **substantive & feasible** (a sourced proposal to the body with actual authority) to
   **overreach** (impossible scope). Rewards feasible action matched to who can actually decide.
5. **The AI shortcut (climactic temptation).** "AI has drafted your complete action plan — submit
   it?" *Accept* → fast finish, Ownership → Outsourced, and any earlier weaknesses (missing
   stakeholder, thin evidence) ship unfixed. *Interrogate* → you must catch the plan's flaw(s);
   doing so raises Evidence/Ownership and produces a plan you can defend.

Each choice: meter deltas + a one-line rationale. End of scenario → plan **viability verdict**.

## Sample content (schema + examples — author 1–2 full scenarios)

Scenario object: `{ title, prompt, phases: [{ kind, question, options:[{label, line, ev, st, fe, own, best}] }] }`.

### Scenario A — "The dangerous crossing" (local safety)
*Students report near-misses at an intersection by school. You want safer crossing.*
- **Frame:** best = "Should the city add a crossing signal/upgrade at [intersection] near the
  school, and what's the strongest case to the body that can approve it?" (scoped + actionable).
  Traps: "Cars are bad" (too broad/loaded); "Make my friend less scared" (too narrow).
- **Evidence:** options — rely on one viral post (Evidence ↓); pull crash data + a traffic study +
  student survey (Evidence ↑↑); *AI Assist:* "instant summary" → verify vs. the city's actual data.
- **Stakeholders:** include drivers, pedestrians/students, residents, the city traffic dept,
  disability access; trap = omit drivers or the deciding agency.
- **Action:** performative (a petition with no audience) vs. substantive (a sourced proposal to the
  city council / traffic committee with a specific ask) vs. overreach ("ban cars downtown").
- **AI shortcut:** AI's plan omits the approving body and the access angle — catch it to ship.

### Scenario B — "Phones in school" (school policy; keep nonpartisan)
- Frame a researchable question about a specific policy; gather evidence (research + student/teacher
  input); stakeholders (students, teachers, families, admin, students with accommodations); action
  pitched to who actually sets the policy; AI shortcut omits the accommodations stakeholder.

> Provide at least one scenario where the AI shortcut's plan is **fluent but flawed** (e.g., skips
> the most-affected stakeholder or pitches to a body with no authority) so "interrogate" is clearly
> the better move — that is the friction lesson.

## Debrief content

- Final meters + Ownership; a "plan viability" line (e.g., *defensible / promising but thin /
  performative*).
- Map to **C3 Dimension 4 (Taking Informed Action)** and the inquiry arc, plus C.O.R.E.
  (Engagement, Critical Thinking) and H.E.A.R.T. (Accountability, Responsibility, Empathy).
- Meta-lesson, verbatim intent: *"AI can draft a civic action plan in seconds. Informed action
  means you can defend the evidence, the stakeholders, and the trade-offs as your own — and would
  catch it when the fast plan leaves someone out."*
- Replay (reshuffle options / switch scenario).

## Technical notes

- Data model: `scenarios[]` → `phases[]` → `options[]` with `{ ev, st, fe, own, best }` deltas.
- The recurring **AI Assist** is a reusable mini-component: an offer card with Accept / Interrogate.
- Keyboard selection (1–4), Enter to advance; `aria-live` feedback; reduced-motion; no data collection.

## Integration

- Deploy as `informed-action/` (subfolder of `historical-inquiry-friction`) or its own repo.
- Games-hub tags: *Civics · Source literacy · Pedagogical friction* (add a **Civics** filter).
- Link from the deck's "Where AI genuinely amplifies" / civic-reasoning content and the closing resources.
