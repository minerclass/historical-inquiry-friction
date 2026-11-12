# Out of Time 3D (prototype)

A first-person version of Out of Time. You choose one of four rooms, each at one moment in the past. Eight papers are in the room. Four belong to that moment and four carry knowledge, words, or verdicts from later. You carry three to the table, then appraise the choice someone there is facing.

| Room | Moment | The choice |
| --- | --- | --- |
| Counting house, Boston | late June 1774 | A merchant hesitating to sign a boycott covenant |
| Delegate's lodging, Philadelphia | late August 1787 | A Northern delegate's vote on the slave trade bargain |
| Barracks room, Manzanar | February 1943 | A young man's answers to questions 27 and 28 |
| Church basement office, Nashville | mid-May 1961 | Students deciding to send new Freedom Riders into Alabama |

Add `?scene=` with `boston-1774`, `philadelphia-1787`, `manzanar-1943`, or `nashville-1961` to open a room directly.

Open it through any static server, for example `python3 -m http.server` from the repository root, then visit `/out-of-time/3d/`.

## What is different from the 2D game

- **Nothing on a paper says whether it belongs.** The later papers are written in the present tense, as period papers are. You tell them apart by what they assume, the words they use, or when their events happened.
- **The hindsight lantern costs something.** It shows at once whether a paper belongs, and each use adds presentist drift. Reading closely is free.
- **No running score while you sort.** Fidelity appears only in the debrief, so taking a paper does not tell you whether you were right.
- **The appraisals are shuffled**, and the debrief says when a sound appraisal rests on papers from later.

## Historical basis

Each debrief says which papers are paraphrases of real documents and which are composites written for the game.

- **Boston, 1774.** The Boston Port Act (in force June 1, 1774); the Solemn League and Covenant (approved by Boston's committee of correspondence in early June 1774) and the printed list of those who protested it; Lexington and Concord (April 1775).
- **Philadelphia, 1787.** The August debate on the slave trade as recorded in Madison's notes; the clause barring Congress from ending the trade before 1808; the Pennsylvania Abolition Society's June 1787 petition, which was not presented; Shays' Rebellion (1786 to 1787); the cotton gin (1793).
- **Manzanar, 1943.** Questions 27 and 28 of the February 1943 questionnaire; the bar on naturalisation for immigrants from Japan; the combat team announced that month; the segregation policy and Tule Lake (July 1943); the 1988 apology and redress.
- **Nashville, 1961.** The Anniston and Birmingham attacks (May 14, 1961); the end of the first ride; the Justice Department call to the Nashville students; riders' wills and letters; the Interstate Commerce Commission order (issued September 1961, in effect that November); John Lewis's election to Congress (1986).

These scenes deal with slavery, wartime confinement, and racist violence. The rooms show no people and no violence. The wording of every paper should be reviewed by the author before classroom use.

## Files

- `rules.js`: content and all game logic, with no DOM or 3D code.
- `rooms.js`: the four rooms as data: dimensions, light, furniture, and where each paper sits.
- `scene.js`: the Three.js room engine. Low-poly, no textures, shadows, or post-processing. It redraws only when something moves.
- `game.js`: the page controller. Every action is an ordinary button.
- `vendor/three.min.js`: Three.js r160, MIT licence, copied from the Echoes repository.

## Accessibility and low-power devices

- The list of papers under the room does everything the 3D view does. It takes over when 3D is unavailable, and `?list=1` forces it.
- Walk with W A S D or the arrow keys, drag to look, or use the on-screen buttons, which also take single steps from the keyboard. E reads the paper you face. Escape puts it down.
- Reduced-motion settings skip the lantern's light change.
- `?low=1` forces the low-power renderer. It is chosen automatically on devices with four or fewer cores.

## Not yet done

- Not measured on a school Chromebook, and not tested with a screen reader or a real touch device.
- No automated tests yet. `rules.js` is written so they can be added.

Scores are an illustrative model of the pedagogical friction framework, not a validated measure of learning.
