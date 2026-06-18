# When AI Does the Thinking

**Preserving Historical Inquiry Through Pedagogical Friction**
High School / Secondary - Sub-theme: *Pedagogy for the Present*
Micah Miner - Beach Park District 3

This repository hosts interactive presentation versions for the session **When AI Does the Thinking: Preserving Historical Inquiry Through Pedagogical Friction**. The presentations support a principled middle path between banning generative AI and uncritically embracing it: name what historical thinking requires cognitively, identify where AI can bypass that thinking, and design tasks that preserve productive struggle while using AI where it genuinely amplifies learning.

## Presentation versions

| Version | Local path | GitHub Pages URL |
| --- | --- | --- |
| Full interactive deck | `index.html` | `https://minerclass.github.io/historical-inquiry-friction/` |
| NCSS historical inquiry version | `ncss-historical-inquiry/index.html` | `https://minerclass.github.io/historical-inquiry-friction/ncss-historical-inquiry/` |
| The Devil's Advocate game | `devils-advocate/index.html` | `https://minerclass.github.io/historical-inquiry-friction/devils-advocate/` |
| Keepers of Inquiry game | `keepers-of-inquiry/index.html` | `https://minerclass.github.io/historical-inquiry-friction/keepers-of-inquiry/` |
| Out of Time game | `out-of-time/index.html` | `https://minerclass.github.io/historical-inquiry-friction/out-of-time/` |
| Informed Action game | `informed-action/index.html` | `https://minerclass.github.io/historical-inquiry-friction/informed-action/` |
| Common Ground game | `common-ground/index.html` | `https://minerclass.github.io/historical-inquiry-friction/common-ground/` |

## Source base

The decks are grounded in secondary social studies pedagogy, historical inquiry, and the author's practitioner-scholar work on pedagogical friction and AI:

- Miner, *Beyond Frictionless Learning: C.O.R.E., H.E.A.R.T., and the Constructivist Integration of AI in Social Studies*.
- Miner (2024), *Using your C.O.R.E. and H.E.A.R.T. to Teach Balanced Social Studies and Civics with Generative AI*.
- *Teaching Balanced History in a Polarized World*.
- Historical thinking practices such as sourcing, contextualization, corroboration, close reading, evidence-based interpretation, and civic reasoning.

## Run locally

No build step is required. Open either `index.html` file in a browser, or serve the folder statically:

```bash
python -m http.server 8000
```

Then visit:

- `http://localhost:8000/`
- `http://localhost:8000/ncss-historical-inquiry/`
- `http://localhost:8000/devils-advocate/`
- `http://localhost:8000/keepers-of-inquiry/`
- `http://localhost:8000/out-of-time/`
- `http://localhost:8000/informed-action/`
- `http://localhost:8000/common-ground/`

## Controls

The full interactive root deck includes overview, notes, resources, and fullscreen controls.

The NCSS historical inquiry version includes:

- Previous and next buttons
- Arrow key navigation
- Space or Page Down to advance
- Home and End for first or last slide
- Clickable audience prompts and facilitation cards

The Devil's Advocate game includes:
- Three contested historical inquiry cases (e.g. Aztec Empire, Space Race, Industrial Revolution)
- Verification steps where players rebut AI-generated biased or one-sided accounts using primary sources
- Scoring dials tracking Historical Rigor, Source Verification, and Argumentation

The Keepers of Inquiry game includes:

- Three social studies scenarios
- Inquiry moves that protect sourcing, context, corroboration, agency, and access
- A friction meter, inquiry integrity score, move log, and debrief

The Out of Time game includes:
- Historical decision scenes judged using only contemporarily-available information
- Contextualization checking and a hindsight bias mitigation penalty
- Interactive temporal tracking and retro-themed design feedback

The Informed Action game includes:
- Standard secondary-civics scenarios focusing on C3 Dimension 4 (Taking Informed Action)
- Interactive HUD gauges tracking Evidence Base, Stakeholder Breadth, Feasibility, and Plan Ownership (Owned, Borrowed, or Outsourced)
- Climactic AI-shortcuts requiring players to detect structural and legal flaws in raw drafts

The Common Ground game includes:
- Teacher professional development simulation focusing on polarization in social studies classrooms
- Interactive HUD gauges tracking Civil Discourse, Academic Rigor, and Student Trust
- Response paths mapping directly to C.O.R.E. and H.E.A.R.T. frameworks and a facilitator leadership profile

## Privacy

Everything runs locally in the browser. Interactive elements collect and transmit nothing. Do not add private research notes, student data, staff data, participant material, credentials, or internal district documents to this public repository.
