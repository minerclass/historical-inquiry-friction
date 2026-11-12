# Out of Time 3D (prototype)

A first-person version of Out of Time. You stand in a Boston merchant's counting house in late June 1774. Eight papers are in the room. Four belong to that moment and four carry knowledge, words, or verdicts from later. You carry three to the desk, then appraise the merchant's hesitation to sign a boycott covenant.

Open it through any static server, for example `python3 -m http.server` from the repository root, then visit `/out-of-time/3d/`.

This prototype has one scene. The 2D game's other three scenes are not built here yet.

## What is different from the 2D game

- **Nothing on a paper says whether it belongs.** The later papers are written in the present tense, as period papers are. You tell them apart by what they assume, the words they use, or when their events happened.
- **The hindsight lantern costs something.** It shows at once whether a paper belongs, and each use adds presentist drift. Reading closely is free.
- **No running score while you sort.** Fidelity appears only in the debrief, so taking a paper does not tell you whether you were right.
- **The appraisals are shuffled**, and the debrief says when a sound appraisal rests on papers from later.

## Historical basis

The Boston Port Act (in force June 1, 1774), the Solemn League and Covenant (approved by Boston's committee of correspondence in early June 1774), the printed list of those who protested it, and Lexington and Concord (April 1775) are real. The covenant text is a paraphrase. The merchant, his ledger, and his neighbour's note are composites written for the game.

## Files

- `rules.js`: content and all game logic, with no DOM or 3D code.
- `scene.js`: the Three.js room. Low-poly, no textures, shadows, or post-processing. It redraws only when something moves.
- `game.js`: the page controller. Every action is an ordinary button.
- `vendor/three.min.js`: Three.js r160, MIT licence, copied from the Echoes repository.

## Accessibility and low-power devices

- The list of papers under the room does everything the 3D view does. It takes over when 3D is unavailable, and `?list=1` forces it.
- Walk with W A S D or the arrow keys, drag to look, or use the on-screen buttons, which also take single steps from the keyboard. E reads the paper you face. Escape puts it down.
- Reduced-motion settings skip the lantern's light change.
- `?low=1` forces the low-power renderer. It is chosen automatically on devices with four or fewer cores.

## Not yet done

- One scene of four.
- Not measured on a school Chromebook, and not tested with a screen reader or a real touch device.
- No automated tests yet. `rules.js` is written so they can be added.

Scores are an illustrative model of the pedagogical friction framework, not a validated measure of learning.
