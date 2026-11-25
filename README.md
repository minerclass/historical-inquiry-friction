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
| NSSLA 2026 session: Leading with Technoskepticism (Dec 3, 50 minutes) | `nssla-leading-with-technoskepticism/index.html` | `https://minerclass.github.io/historical-inquiry-friction/nssla-leading-with-technoskepticism/` |
| The Devil's Advocate game | `devils-advocate/index.html` | `https://minerclass.github.io/historical-inquiry-friction/devils-advocate/` |
| Keepers of Inquiry game | `keepers-of-inquiry/index.html` | `https://minerclass.github.io/historical-inquiry-friction/keepers-of-inquiry/` |
| Out of Time game | `out-of-time/index.html` | `https://minerclass.github.io/historical-inquiry-friction/out-of-time/` |
| Informed Action game | `informed-action/index.html` | `https://minerclass.github.io/historical-inquiry-friction/informed-action/` |
| Common Ground game | `common-ground/index.html` | `https://minerclass.github.io/historical-inquiry-friction/common-ground/` |

## Video clips

Three 18-second clips play inside the decks from a **Play scene** button. They are illustrations, not real documents or student work.

| Clip | What it shows | Where it plays |
| --- | --- | --- |
| `assets/how-a-student-meets-the-past.mp4` | One question, "Where did this come from?", asked of print, broadcast, an algorithmic feed, and a generated "primary source" | Full deck slide 9 (The Medium Shapes Knowing); NCSS title slide; NSSLA slide 4 (Media Ecology) |
| `assets/twenty-eight-essays.mp4` | A teacher redesigns a task, and the principal and pacing guide make room for it (first made for the Fall 2026 doctoral colloquium; footer updated) | NSSLA slide 11 (Infrastructure Friction) |
| `assets/same-artifact-different-learning.mp4` | A nine-second AI answer, two students with the same essay and grade but only one sourcing trail, then a redesign around noetic, rhetorical, and existential friction | Full deck slide 4 (Two Students, One Artifact); NCSS slide 5 (Same Artifact) |

## Inquiry Quest clips

Three 20-second pixel-art clips, with chiptune music and sound effects, tell one story across the NSSLA session: an opening, a middle, and a close. Two longer clips in the same style explain ideas in that deck: the five stages of the word and the five technoskeptical questions. The cast is the same throughout: Pip (a student), Ms. Vale (a teacher), Dr. Lane (a district leader), and the Skip Gate (generative AI offered as a shortcut). A lit lantern stands for an argument the student can defend; a finished scroll stands for the artifact alone. Every clip ends on a pause question for the room. The characters and numbers are illustrations of the framework, not study data.

| Clip | Story beat | Pause question | Where it plays |
| --- | --- | --- | --- |
| `assets/inquiry-quest-nssla-1.mp4` | Every classroom finishes the quest and nobody opens a source | Where does your system reward speed? | NSSLA slide 2 (The Leadership Problem) |
| `assets/inquiry-quest-nssla-2.mp4` | Four signs point four ways until the leader redraws the level | Which sign in your system points the wrong way? | NSSLA slide 13 (Coherence Check) |
| `assets/inquiry-quest-stages.mp4` (30 seconds) | Walter Ong's primary orality, literacy and print, and secondary orality, then the two stages proposed by Micah Miner, algorithmic secondary orality and tertiary algorithmicity | Which stage are your students learning in? | NSSLA slide 5 (Five Stages) |
| `assets/inquiry-quest-questions.mp4` (28 seconds) | The five technoskeptical questions, each under the Postman idea it came from | Which one has your district never asked out loud? | NSSLA slide 8 (Thought Exercise) |
| `assets/inquiry-quest-nssla-3.mp4` | The redrawn map makes room for the climb in every classroom | What will you keep difficult on purpose? | NSSLA slide 18 (Closing) |

All five are drawn by `assets/inquiry-quest.js` on a 320x180 grid shown at six times scale. Each episode has a small page beside it (`assets/inquiry-quest-*.html`) that names the episode. Re-render one with:

```bash
swiftc -O tools/render-video.swift -o /tmp/render-video
/tmp/render-video assets/inquiry-quest-nssla-1.html assets/inquiry-quest-nssla-1.mp4 20 30
```

### Sound

`tools/render-video.swift` writes silent video. The sound is added afterwards:

```bash
sh tools/add-audio.sh
```

That script runs `tools/clip-audio.py`, which synthesizes every soundtrack from note patterns in the file (Python standard library only, nothing sampled or licensed), converts each to AAC with `afconvert`, and uses `tools/add-audio.swift` to put it under the picture without re-encoding the video. The Inquiry Quest clips get an original chiptune score with effects timed to the scenes; the earlier 18-second clips get a quiet ambient bed. Run it again after re-rendering any clip. The player in each deck has a volume control, and a clip only starts when the presenter clicks its button.

Each of the three earlier clips has a scene page beside it (`assets/*.html`; open one with `#seconds`, such as `#12.8`, to preview a moment). Re-render a clip with:

```bash
swiftc -O tools/render-video.swift -o /tmp/render-video
/tmp/render-video assets/how-a-student-meets-the-past.html assets/how-a-student-meets-the-past.mp4 18 30
```

The player captures keys while it is open, so a clicker does not advance the deck underneath it. Esc closes it.

## NSSLA session

The NSSLA deck (20 slides, 50 minutes) is for the National Social Studies Leaders Association session within the NCSS conference. It covers media ecology, a five-stage diagram of the word (Ong's three stages and the two proposed in this study), the technoskeptical stance, the five technoskeptical questions, a one-minute thought exercise that runs each question through one stage, a short debate, a four-question leadership diagnostic, infrastructure friction across four domains (policy and purpose, professional learning, assessment, communication), one six-minute turn-and-talk activity (one task, four decisions: keep, scaffold, shift, remove), the research questions, and three next steps. The proposal planned a 90-minute clinic with a design sprint, a constraints discussion, and a gallery walk; those were removed because the session is a 50-minute presentation, and the activity on slide 14 takes their place. The segments run foundation 17 (slides 4 to 9), diagnostic 4, framework 11, activity 6, research 3, next steps 3, and close with questions 6. The proposal described preliminary dissertation findings; because data collection is still underway, slide 15 presents the research questions only. Speaker notes mark the facilitation prompts that are drafts for Micah to revise.

Slide 7 shows the five technoskeptical questions as worded on the Civics of Technology curriculum page (`civicsoftechnology.org/curriculum`, checked November 25, 2026), where Dan Krutka and Scott Metzger adapted them from Neil Postman's March 28, 1998 talk in Denver. Each card heading paraphrases the Postman idea behind the question, and clicking a card shows the generative-AI prompt from the `technoskepticism-primer` repository. Footer links on slides 5, 8, 9, and 14 point to the matching games (Echoes, Answerable, Trailhead, Friction Lab) as take-home links, and the Resources slide links the games hub. Slide 5 names the stages as micahminer.com and the `echoes` repository do; stages IV and V are proposals, not established terms. Slide 9 is a two-minute debate on phone bans, screen time, and generative AI; its pouch-and-bypass language comes from `ietl-pouch-and-bypass` and its screen-practice question from `screen-time-wrong-question`.

## Survey invitation slide

Each deck ends with a survey invitation slide after Closing: slide 26 of the full deck, slide 27 of the NCSS version, and slide 19 of the NSSLA deck (before its references). It shows the approved survey notice (B) for NLU IRB protocol ER01884 word for word, with the survey link and a QR code for it (`assets/er01884-survey-qr.svg`, with a PNG copy for other slide tools). The QR code opens `https://forms.cloud.microsoft/r/UbTcf4EHKn`. It was decoded and checked against the link on November 5, 2026, including from 1280x720 and 1920x1080 renders of both slides.

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

In the NSSLA deck, N shows or hides the speaker notes for the current slide. On landscape screens that deck scales each slide's body text by a per-slide factor (`style="--z:…"` on the slide's `<section>`), so the content fills the screen. Lower a slide's factor if you add text to it.

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
