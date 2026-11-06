# When AI Does the Thinking

**Preserving Historical Inquiry Through Pedagogical Friction**
High School / Secondary - Sub-theme: *Pedagogy for the Present*
Micah Miner - Beach Park District 3

This repository hosts interactive presentation versions for the session **When AI Does the Thinking: Preserving Historical Inquiry Through Pedagogical Friction**. The presentations support a principled middle path between banning generative AI and uncritically embracing it: name what historical thinking requires cognitively, identify where AI can bypass that thinking, and design tasks that preserve productive struggle while using AI where it genuinely amplifies learning.

## Presentation versions

| Version | Local path | GitHub Pages URL |
| --- | --- | --- |
| Full interactive deck | `index.html` | `https://minerclass.github.io/historical-inquiry-friction/` |
| NCSS 2026 session deck: Teaching History Among Algorithms (Dec 4, 50 minutes) | `ncss-historical-inquiry/index.html` | `https://minerclass.github.io/historical-inquiry-friction/ncss-historical-inquiry/` |
| NSSLA 2026 leadership clinic: Leading with Technoskepticism (Dec 3, 55 minutes) | `nssla-leading-with-technoskepticism/index.html` | `https://minerclass.github.io/historical-inquiry-friction/nssla-leading-with-technoskepticism/` |
| The Devil's Advocate game | `devils-advocate/index.html` | `https://minerclass.github.io/historical-inquiry-friction/devils-advocate/` |
| Keepers of Inquiry game | `keepers-of-inquiry/index.html` | `https://minerclass.github.io/historical-inquiry-friction/keepers-of-inquiry/` |
| Out of Time game | `out-of-time/index.html` | `https://minerclass.github.io/historical-inquiry-friction/out-of-time/` |
| Informed Action game | `informed-action/index.html` | `https://minerclass.github.io/historical-inquiry-friction/informed-action/` |
| Common Ground game | `common-ground/index.html` | `https://minerclass.github.io/historical-inquiry-friction/common-ground/` |

## Video clips

Three 18-second silent clips play inside the decks from a **Play scene** button. They are illustrations, not real documents or student work.

| Clip | What it shows | Where it plays |
| --- | --- | --- |
| `assets/how-a-student-meets-the-past.mp4` | One question, "Where did this come from?", asked of print, broadcast, an algorithmic feed, and a generated "primary source" | Full deck slide 9 (The Medium Shapes Knowing); NCSS title slide; NSSLA slide 4 (Media Ecology) |
| `assets/twenty-eight-essays.mp4` | A teacher redesigns a task, and the principal and pacing guide make room for it (first made for the Fall 2026 doctoral colloquium; footer updated) | NSSLA slide 8 (Infrastructure Friction) |
| `assets/same-artifact-different-learning.mp4` | A nine-second AI answer, two students with the same essay and grade but only one sourcing trail, then a redesign around noetic, rhetorical, and existential friction | Full deck slide 4 (Two Students, One Artifact); NCSS slide 5 (Same Artifact) |

Each clip has a scene page beside it (`assets/*.html`; open one with `#seconds`, such as `#12.8`, to preview a moment). Re-render a clip with:

```bash
swiftc -O tools/render-video.swift -o /tmp/render-video
/tmp/render-video assets/how-a-student-meets-the-past.html assets/how-a-student-meets-the-past.mp4 18 30
```

The player captures keys while it is open, so a clicker does not advance the deck underneath it. Esc closes it.

## NSSLA leadership clinic

The NSSLA deck (19 slides, 55 minutes) follows the NSSLA 2026 proposal: media ecology and tertiary algorithmicity, a four-question leadership diagnostic, infrastructure friction across four domains (policy and purpose, professional learning, assessment, communication), a design sprint for a one-page Social Studies + GenAI Leadership Brief, a quick feedback swap, and action planning. The proposal planned a 90-minute clinic; the accepted slot is 55 minutes, so the segments run foundation 10, diagnostic 6, framework 12, sprint 15 (tables draft the purpose statement and minimum expectations), feedback swap 4 in place of the gallery walk, study and commitments 5, and close 3. The proposal described preliminary dissertation findings; because data collection is still underway, slide 14 presents the research questions only. Speaker notes mark the facilitation prompts that are drafts for Micah to revise.

## Survey invitation slide

Each deck ends with a survey invitation slide after Closing: slide 26 of the full deck, slide 27 of the NCSS version, and slide 18 of the NSSLA deck (before its references). It shows the approved survey notice (B) for NLU IRB protocol ER01884 word for word, with the survey link and a QR code for it (`assets/er01884-survey-qr.svg`, with a PNG copy for other slide tools). The QR code opens `https://forms.cloud.microsoft/r/UbTcf4EHKn`. It was decoded and checked against the link on November 5, 2026, including from 1280x720 and 1920x1080 renders of both slides.

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
