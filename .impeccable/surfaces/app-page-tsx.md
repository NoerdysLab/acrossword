---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/puzzle/[day]/page.tsx","app/archive/page.tsx","components/Header.tsx"]
---

# Daily puzzle screen

## Scope and mode

Operate. The daily puzzle page (`/` and `/puzzle/[day]`) plus the surfaces that orbit it: the top bar, How to Play demo, Stats, and Archive.

## Audience, job, constraints

A daily word-game regular on a phone, one hand, a spare minute. Job: read the clue, find the 5-letter word hiding across a word boundary, share a spoiler-free result, come back tomorrow. Constraints from PRODUCT.md hold (free, no login, no ads, one puzzle a day, phone-first). The user delegated the design and asked for the cleanest result. The user reverted fonts to DM Serif Display (wordmark) and Libre Franklin (everything else); treat those faces as pinned. Teal is the incumbent brand accent.

## Chosen direction

Letterpress composing stick. The clue is a line of set type with a gap; the player's letters are type sorts that fill it.

## Memorable moment

Typing drops letters into the gap inside the clue itself, so the player reads their guess in context. On solve, the sentence closes up and the real word space opens inside the answer ("wi·th umb·rellas"), showing where the word was hiding.

## Unresolved

- Brand voice is unconfirmed; keep copy plain and short.
- The glass nav and background blobs from the previous iteration are dropped in favor of this direction; restore on request.

## Direction contract

THESIS: The clue is the page. A single line of type with a gap, filled by the player's sorts, replaces the category default of a floating heading above a detached tile grid with app chrome around it.

OWN-WORLD: Cool white stock (never cream) and near-black ink; one spot ink, the brand teal, used only for locked and found letters. Hairline printer's rules, square type-sort tiles with a small radius and a pressed inset edge, no glass, gradients, blobs or shadows beyond the hairline. DM Serif Display appears only in the wordmark; Libre Franklin sets everything else, with tabular figures for numbers.

STORY: The player sees today's line, types, and watches their guess sit inside the sentence. Locked letters print in teal. On solve the gap closes into the completed sentence, then a compact result block offers the share grid and a countdown to tomorrow.

FIRST VIEWPORT (390px phone): hairline-ruled top bar with the wordmark left and four 44px icon controls right; an edition line ("DAY 204 · SEP 28") in small tracked caps; the clue set large across the measure with an inline 5-slot gap; the composing stick of five 56px sorts; a full-width ink Submit block directly beneath, inside thumb reach. Nothing decorative behind it.

FORM: Letterpress composing stick, candidate 3 of 7 by resonance; seed key 34e6ddac (degraded roll, no challengers). Signature interaction: the inline gap mirrors typing and closes into the completed sentence on solve, with an ease-out settle, no bounce.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
