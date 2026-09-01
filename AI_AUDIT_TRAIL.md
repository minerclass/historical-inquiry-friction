# AI-Use Audit Trail: Visual Learning Simulations (Phase 1 Upgrades)

**Date of Log**: 2026-07-07
**Researcher / Author**: Micah J. Miner (assisted by Antigravity)
**Project Context**: Qualitative-dominant convergent mixed-methods study on *Pedagogical Friction* in the generative AI age. (Corrected 2026-09-01: this header previously read "case study". The controlling proposal is not a case study; the inherited label was wrong and is not used in this repository.)
**Audit Purpose**: Hand-off review, reconciliation, and audit logs for Codex / Claude Code / Antigravity agents.

---

## 1. Summary of Logged Upgrades

| Repository / Directory | Files Edited | Key Implementations | Verification Method |
| :--- | :--- | :--- | :--- |
| **friction_game** | `index.html`, `game.js` | Trajectory replay (SVG path mapping), Drag-to-Map spatial sorting quiz, mobile/touch taps, keyboard button fallback bar, 2 new Bypass scenarios. | Static page load, coordinate maps checked, keyboard navigability validated. |
| **historical-inquiry-friction** (Out of Time) | `out-of-time/index.html` | Hindsight Lens spotlight overlay, keypress toggling (`H`), mouse/focus-based coordinate distance tracking, violet glows on presentist traps, +3/s drift penalty interval. | Mouse move tracking, setInterval checks, keyboard focus auto-centering verified. |
| **historical-inquiry-friction** (Common Ground) | `common-ground/index.html` | 24 student dots grid seating chart, trust lean (toward center), drift/reddening (polarization), gray-out (silence), Moment 1 vs 5 comparative maps on debrief, trade-off feedback. | SVG rendering checks, score-scaling mathematical offsets verified. |
| **historical-inquiry-friction** (The Devil's Advocate) | `devils-advocate/index.html` | Marble slab textures (CSS gradients), shake & crack overlay animations on strong counter-arguments, scale shrinking on concessions, Rationale-Before-Reveal blocking textbox. | State checks, textarea input validation (min-length 6) verified. |
| **historical-inquiry-friction** (Keepers of Inquiry) | `keepers-of-inquiry/index.html` | SVG dash-offset gold light pulses on unlocked nodes, node locking rings, victory constellation lines. | Node metric thresholds checked, CSS keyframes checked. |
| **orality_game** | `game.js` | Reach × Fidelity quadrant debrief text mappings: *The Living Archive*, *The Telephone Trap*, *The Whispering Gallery*, *The Silent Dust*. | Threshold checks (`reach >= 100k` and `fid >= 75`). |

---

## 2. Detailed Audit Log (Step-by-Step)

### Entry 1: Friction Lab (Calibration Map & Spatial Quiz)
*   **Tool Used**: `replace_file_content` / `multi_replace_file_content`
*   **Task Performed**: Upgraded results screen layout and replaced multiple-choice quiz with spatial drag-and-drop grid.
*   **Data Type Used**: Calibration map coordinates, quiz questions JSON pool.
*   **Prompt/Instruction**: Implement visual map path, numbered marker hops, drag-to-map drops, and keyboard fallbacks.
*   **Output Summary**: Trajectory replay draws SVG points dynamically. The quiz supports desktop drag-and-drop, mobile touch, and keyboard categories.
*   **Researcher Action**: Approved spatial calibrations.
*   **Verification**: Verified absolute-to-percentage formula (`svgY = 100 - bottomPercentage`).

### Entry 2: Out of Time (Hindsight Lens)
*   **Tool Used**: `multi_replace_file_content`
*   **Task Performed**: Added visual Hindsight Lens overlay spotlight and drift penalty.
*   **Data Type Used**: HTML button structures, mouse position event coordinates, tile button IDs.
*   **Prompt/Instruction**: Hold `H` to activate lens; traps glow violet; increment drift by +3 per second; focus centering for accessibility.
*   **Output Summary**: Inserted `#hindsight-lens` div with radial gradient spotlight/shadow, key listeners for `keydown`/`keyup` on `H`, mouse position calculation, and `setInterval` drift updater.
*   **Researcher Action**: Approved warning banner text and focus binding.
*   **Verification**: Tested keyboard tab-focus listener centering coordinates.

### Entry 3: Common Ground (Classroom Seating Chart)
*   **Tool Used**: `multi_replace_file_content`
*   **Task Performed**: Rebuilt classroom seating map with 24 student dots.
*   **Data Type Used**: SVG coordinate vectors, trust/discourse metrics.
*   **Prompt/Instruction**: Student dots lean toward center (trust), separate/redden (polarization), or gray out (silence). Compare Moment 1 vs Moment 5 in debrief.
*   **Output Summary**: Created `drawClassroom()` function with dynamic vector offsets and color interpolation based on discourse/trust metrics. Side-by-side snapshot comparison rendered in final debrief cards.
*   **Researcher Action**: Checked lean-drift offsets to prevent overlap.
*   **Verification**: Tested color mappings: gray out when `discourse < 50`, redden when `trust < 40`.

### Entry 4: The Devil's Advocate (Marble Slab & Rationale Block)
*   **Tool Used**: `multi_replace_file_content`
*   **Task Performed**: Styled marble texturing, crack overlays, concessions scaling, and Rationale-Before-Reveal blocks.
*   **Data Type Used**: Text area elements, CSS animations, card actions metadata.
*   **Prompt/Instruction**: Add marble slab styling; crack overlay/screen shake on strong counter-arguments; concede shrink; rationale textbox.
*   **Output Summary**: Inserted SVG crack overlay background-image, `.shake` keyframe animation class, `.concede-shrink` scale class, and `#rationaleArea` containing textarea block with a validation length check ($\ge 6$).
*   **Researcher Action**: Insisted on key listener exclusions so the `1-4` options shortcuts don't fire while typing in the rationale text area.
*   **Verification**: Verified keypress exclusion logic `document.activeElement === $("rationaleInput")`.

### Entry 5: Keepers of Inquiry (Living Map Path)
*   **Tool Used**: `multi_replace_file_content`
*   **Task Performed**: Animated SVG connection pulses and constellation victory lines.
*   **Data Type Used**: SVG path and line nodes.
*   **Prompt/Instruction**: Animate gold light pulses along paths; node locking rings; show cross-connecting constellation lines on victory.
*   **Output Summary**: Added `.pulse-gold` CSS transitions (`stroke-dasharray` and `stroke-dashoffset`), `.node.unlocked::before` pulsing ring CSS rule, and four cross-connecting `<line>` tags in SVG.
*   **Researcher Action**: Linked victory status to the map container.
*   **Verification**: Verified victory check (`all metrics >= 45`) toggles class `.victory-active`.

### Entry 6: Keeper of the Word (Reach × Fidelity Quadrants)
*   **Tool Used**: `replace_file_content`
*   **Task Performed**: Mapped end debrief text to reach × fidelity quadrants.
*   **Data Type Used**: Reach and fidelity variables on final screen.
*   **Prompt/Instruction**: Implement 4 quadrant profiles: *The Living Archive*, *The Telephone Trap*, *The Whispering Gallery*, *The Silent Dust*.
*   **Output Summary**: Overwrote `document.getElementById('endthesis').innerHTML` with quadrant conditions based on `S.reach >= 100000` and `S.fid >= 75`.
*   **Researcher Action**: Verified alignment with Walter Ong-inspired terminology.
*   **Verification**: Tested threshold conditions.

---

## 3. Replication / Reconciliation Checklist for Next Agent

1.  **Repository Sync**: Run `git commit -am "Phase 1 upgrades: visual enhancements and pedagogical friction modifications"` in:
    *   `/friction_game`
    *   `/historical-inquiry-friction`
    *   `/orality_game`
2.  **No CDNs**: Confirm zero external resource queries or style links are introduced in the edits.
3.  **Keyboard trap tests**: Verify that any showing/hiding overlays do not block standard keyboard tab indexes.
4.  **Disclaimer presence**: Ensure all final screens in the 3 repositories contain the required disclaimer text.

## 4. Phase 3 Audit Log (2026-07-08)

### Entry 7: Keepers of Inquiry (Inline Validation)
*   **Files Edited**: `historical-inquiry-friction/keepers-of-inquiry/index.html`
*   **Key Implementations**: Replaced browser `alert()` with inline `#rationaleValidation` container having `aria-live="polite"` and auto-clearing on textarea input.

### Entry 8: Informed Action (Verdict Voice and Civic Softening)
*   **Files Edited**: `historical-inquiry-friction/informed-action/index.html`
*   **Key Implementations**: Rewrote "Optimal Path Chosen" -> "Balanced Civic Strategy", "Sub-optimal Decision" -> "Skewed Civic Strategy", and softened Change.org petition feedback to focus on trade-offs.

### Entry 9: Devil's Advocate & Common Ground (Content Pools and Sampling)
*   **Files Edited**: `historical-inquiry-friction/devils-advocate/index.html`, `historical-inquiry-friction/common-ground/index.html`
*   **Key Implementations**: Expanded Devil's Advocate to 4 exchanges per case (sampling 2 per run) and Common Ground to 10 moments total (sampling 5 per run) using a linear congruential shuffle helper `shuffleArray`.

## 5. Dissertation Bridge Audit Log (2026-07-12)

### Entry 10: Informed Action and Out of Time
*   **Files Edited**: `informed-action/index.html`, `out-of-time/index.html`
*   **Key Implementations**: Added debrief cards with one game-specific prompt for each current research-question domain and a link to the Dissertation Proposal Dashboard.
*   **Source-of-Truth Decision**: Full research-question wording was not copied into either game, preventing public wording drift when the proposal changes.
*   **Proposal-Stage Guardrail**: The cards invite reflection on the current study; they do not describe participant evidence or findings.
*   **Verification**: Each page contains one bridge, three prompts, the correct dashboard link, unique IDs, no horizontal overflow, and zero console errors in local browser checks.

## 6. Shared Token Adoption and Contrast Repair (2026-09-01)

Agent: Claude Code (Opus 5). This repository was the last of 31 in the
dissertation ecosystem to adopt the shared token layer at
`https://minerclass.github.io/tokens.css`, and was deliberately deferred from
the earlier batches because its seven pages use three different naming
conventions and would have been guessed at rather than verified in a batch.

### Entry 11: Token adoption across all seven pages

*   **Files Edited**: `index.html`, `devils-advocate/index.html`,
    `informed-action/index.html`, `out-of-time/index.html`,
    `common-ground/index.html`, `keepers-of-inquiry/index.html`,
    `ncss-historical-inquiry/index.html`
*   **What was adopted**: ground, ink, muted, and rule colours only. Every
    reference carries the page's pre-adoption value as a `var()` fallback, so a
    failed stylesheet load changes nothing.
*   **What was deliberately kept local, and why**:
    *   The four level games (`informed-action`, `out-of-time`, `common-ground`,
        `keepers-of-inquiry`) each paint a hardcoded per-level gradient on
        `html, body`. That gradient carries the level's atmosphere and is signal,
        not decoration, so only the text and rules were adopted.
    *   `--paper-2` in three of those games is **dual-role**: a light panel
        background in some rules and bright text on dark in others. A single
        shared mapping would be wrong for one of the two roles, so it was left
        alone.
    *   `--panel2` and `--paper-ink` in `ncss-historical-inquiry` are the
        light-slide surface pair. Leaving them local is what preserves the
        deck's 13-light / 13-dark alternation, which was verified after the
        change.

### Entry 12: Naming conventions recorded for future work

These traps cost real time and are recorded so the next pass does not repeat them:

*   **Inverted names.** In `informed-action`, `out-of-time`, `common-ground`,
    and `keepers-of-inquiry`, `--ink` is a dark **panel** colour and `--paper`
    is the **text**. Reading these names the usual way inverts the page.
*   **Dead tokens.** In `devils-advocate`, `--ink`, `--paper`, and `--forest`
    have zero references. They name nothing; the ground is the gradient on
    `body` and the text colours were hardcoded. They were left in place but
    should not be trusted as a description of the page.
*   **Undefined token.** `index.html` used `border-left-color:var(--teal)` while
    defining no `--teal`, so that accent stripe rendered as nothing. It now uses
    the shared teal.

### Entry 13: Pre-existing contrast failures repaired (32 total)

All were present before this change; none were introduced by it. Each was
confirmed by eye before being touched.

| Page | Element | Before | After | Cause |
| :--- | :--- | :--- | :--- | :--- |
| `index.html` | `.kicker` x12 | 4.39 | 5.06 | `--ember` as text on the light sheet |
| `devils-advocate` | body copy x4 | 2.92 | 6.98 | `--muted` was a **light-ground** value (`#6b6b62`) sitting on a dark green ground |
| `ncss-historical-inquiry` | `.big`, `.rail .n`, `.timeline-item strong`, `.tab-pane h3`, `.artifact .label` x16 | 1.85-2.18 | 4.73-5.42 | `--gold` as text on the parchment `--panel2` |

Accent tokens were not globally repointed. Vivid accents remain correct as
borders, fills, and on dark grounds; only the **text** usages were moved to
lifted variants (`--ember-text`, `--gold-text`), which is why the visual
identity of each page is unchanged.

`--gold-text` in `ncss-historical-inquiry` is `#836010`, two points darker than
the shared `--mjm-gold-ink` (`#8a6412`). This is deliberate: the rail's active
item lays `rgba(217,164,65,.12)` over the parchment, and the shared value clears
the plain slide (4.77) but not that tint (4.41). `#836010` clears both.

### Entry 14: Verification method

A before/after measurement was taken for every text-bearing element on every
pane of all seven pages, with each pane activated in turn so hidden game screens
and slides were measured too, not just the opening state.

*   **Result**: 1,306 elements compared. 32 crossed from fail to pass. **Zero**
    crossed from pass to fail on any page.
*   Remaining drops are all sub-1.1 movements far above threshold (for example
    17.6 to 16.6) caused by the ground and ink shifting to the shared values.
*   The 13-light / 13-dark slide alternation in `ncss-historical-inquiry` was
    confirmed intact after the change, with light slides unchanged at `#f6f1e7`.

**Measurement caveat, recorded honestly.** The instrument used has two known
blind spots: it cannot see `::before` / `::after` overlays, and it cannot
resolve which part of a partial-coverage gradient sits behind a given glyph.
One reported failure in `keepers-of-inquiry` (`.dial`, 1.70) is a **false
positive** of the first kind: the numeral sits on the dark hole of a donut drawn
by a pseudo-element, not on the teal arc, and was confirmed readable by eye. It
was correctly left alone. Absolute readings from any such tool should be
confirmed visually before code is changed on their authority.
