# When AI Does the Thinking

**Preserving Historical Inquiry Through Pedagogical Friction**
High School / Secondary · Sub-theme: *Pedagogy for the Present*
Micah Miner · Beach Park District 3

A single-file, self-contained, highly interactive session deck for secondary history
teachers. It argues a principled middle path between banning and uncritically embracing
generative AI: name what historical thinking requires cognitively, see where AI does that
thinking for students, and design tasks that preserve the productive struggle while using
AI where it genuinely amplifies learning.

Built on the same engine and design system as the AAACS *Pedagogical Friction* deck,
re-anchored to **historical inquiry** (sourcing, contextualization, corroboration, close
reading, evidence-based interpretation — after Wineburg and the Stanford History Education
Group) and grounded in the author's own scholarship:

- Miner, *Beyond Frictionless Learning: C.O.R.E., H.E.A.R.T., and the Constructivist
  Integration of AI in Social Studies* (Theory and Research in Social Education).
- Miner (2024), *Using your C.O.R.E. and H.E.A.R.T. to Teach Balanced Social Studies and
  Civics with Generative AI* (The Leader, 37(4), NSSLA).
- *Teaching Balanced History in a Polarized World* (blog).

## Run it

No build step. Open `index.html` in a browser, or serve the folder statically:

```
python -m http.server 8000
# then visit http://localhost:8000/
```

For GitHub Pages, push the folder to a repo (or a subfolder of an existing Pages repo);
`.nojekyll` is included so the static files are served as-is.

## Controls

| Key | Action |
| --- | --- |
| `←` `→` / space | Previous / next slide |
| `O` | Slide overview |
| `N` | Speaker notes (every slide has them) |
| `R` | Resources drawer |
| `F` | Fullscreen |
| `Home` / `End` | First / last slide |

Deep-link to any slide with `#<n>` (e.g. `index.html#14`).

## Interactive components

- Reveal-on-choice prompts (the 10-second cold open; the polarized-classroom responses)
- A per-device audience pulse (two students, one artifact)
- Eleven click-to-explore panels: historical-thinking anatomy, constructivist foundations,
  a media-shift timeline, the three frictions, the paradoxes of frictionless AI, **C.O.R.E.**,
  **H.E.A.R.T.**, technoskepticism (Postman), the four-question design test, redesign moves,
  and classroom moves from the research
- A three-tab worked example (the Revolution DBQ)
- A build-your-own friction-preserving move generator (copyable)

## Structure (25 slides)

**Movement I — Recognize**
1. Title
2. The hour as a complicated conversation (roadmap)
3. The 10-second history class
4. Two students, one artifact
5. The question under the panic — ban / embrace / design
6. The field is reporting

**Movement II — Understand**
7. Anatomy of historical thinking
8. Why the struggle is the point (Dewey / Vygotsky / Piaget / Freire)
9. The medium shapes knowing (media timeline)
10. Productive struggle, named (Piaget; Bjork & Bjork)

**Movement III — Design (the frameworks)**
11. Three frictions worth protecting
12. The friction test (productive vs. exclusionary)
13. The paradoxes of frictionless AI
14. C.O.R.E.
15. H.E.A.R.T.
16. Technoskepticism (Postman; Krutka et al.)
17. A four-question design test

**Movement IV — Act**
18. One task, two formations (the Revolution DBQ)
19. Where to put the friction back
20. Moves from the research (bias audit, AI vs. primary docs, devil's advocate, SAC)
21. Where AI genuinely amplifies

**Movement V — Complicate & Close**
22. Friction is unevenly distributed (equity)
23. Balanced history in a polarized world
24. Build a friction-preserving move (8-minute activity)
25. Closing + discussion + resources

## Privacy

Everything runs locally in the browser. The audience pulse and the activity builder
collect and transmit nothing.
