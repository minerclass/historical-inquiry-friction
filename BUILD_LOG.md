# Historical Inquiry Friction - build log

## Phase 4 - 2026-07-11

- Added named ARIA progressbar semantics and synchronized values to Devil's Advocate, Common Ground, Keepers of Inquiry, Out of Time, and Informed Action.
- Keepers of Inquiry now uses exact barrier bands: Accessible <=20, Drifting 21-30, High >30.
- Out of Time scoring was retuned so a perfect run advances 63, 76, 89, then 100; it reached 98 after the final context lock and 100 only after the final appraisal.
- Informed Action now includes school start-time and public-library-access scenarios.
- Fixed AI-assist ownership state so accepted shortcuts visibly change the plan from Owned to Borrowed.
- Added scenario-specific owned-plan debrief language and generalized failure language so it does not inherit street-safety details.
- Replaced visible Markdown-style note markers with semantic strong labels.

## Validation

- All five inline scripts pass Node syntax checks.
- Browser smoke checks: zero console errors and no horizontal overflow at desktop or 390px phone width.
- Start-time scenario: complete best-path playthrough reached 100/100/100 with Owned status.
- Library-access scenario: failure path confirmed Borrowed transition, then direct AI submission confirmed Outsourced debrief.
- Out of Time: perfect 4-scene playthrough finished at 100 fidelity, 0 drift, and 12/12 traps avoided; a separate trap test produced 51 fidelity, 25 drift, and 11/12 avoided.

## Pending content approval

- Keeper of the Source Level 1 remains unchanged pending approval of the chronology/citation packet.

## Phase 5 - 2026-09-01 - Shared token adoption

- All seven pages now link the shared ecosystem token layer at
  `https://minerclass.github.io/tokens.css`. Ground, ink, muted, and rule
  colours are adopted; every reference carries its pre-adoption value as a
  fallback so a failed load changes nothing.
- Per-level ground gradients, `--paper-2`, `--panel2`, and `--paper-ink` stay
  local. Those carry each level's atmosphere and the light-slide surface pair.
- 32 pre-existing contrast failures repaired: 12 kickers on the hub, 4 muted
  passages in Devil's Advocate, and 16 gold-on-parchment items in the NCSS deck.
  All were present beforehand and each was confirmed by eye before being changed.

## Validation

- Before/after contrast measured for every text-bearing element on every pane of
  all seven pages, with each pane activated in turn so hidden screens and slides
  were included: 1,306 elements compared, 32 fixed, zero regressions past
  threshold.
- NCSS deck still alternates 13 light and 13 dark slides; light slides unchanged
  at `#f6f1e7`.
- One reported failure in Keepers of Inquiry (`.dial`, 1.70) is a false positive:
  the numeral sits on the dark centre of a pseudo-element donut, not the teal
  arc. Verified readable and left unchanged.
