---
name: ACROSSword
description: a daily hidden word puzzle, set as one line of type with a gap
colors:
  paper: "#f6f7f7"
  paper-raised: "#ffffff"
  ink: "#15171a"
  ink-2: "#4a4f57"
  ink-3: "#676d76"
  rule: "#dde0e3"
  rule-strong: "#8e949b"
  spot: "#23968e"
  spot-ink: "#16756e"
  spot-wash: "rgba(35, 150, 142, 0.14)"
  on-spot: "#ffffff"
  scrim: "rgba(21, 23, 26, 0.38)"
  paper-dark: "#121416"
  paper-raised-dark: "#1b1e21"
  ink-dark: "#eceeef"
  ink-2-dark: "#aab0b7"
  ink-3-dark: "#8a9199"
  rule-dark: "#2a2e33"
  rule-strong-dark: "#646b73"
  spot-dark: "#2aa198"
  spot-ink-dark: "#52c4b9"
  spot-wash-dark: "rgba(82, 196, 185, 0.16)"
  on-spot-dark: "#ffffff"
  scrim-dark: "rgba(0, 0, 0, 0.6)"
typography:
  wordmark:
    fontFamily: "DM Serif Display, Georgia, serif"
    fontSize: "1.375rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.005em"
  display:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.625rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.012em"
    fontFeature: "\"kern\", \"liga\""
  display-sm:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: "-0.012em"
  sort:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1
  sort-sm:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
  headline:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    letterSpacing: "-0.01em"
  figure:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    fontFeature: "\"tnum\""
  body:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
  button:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    letterSpacing: "0.005em"
  caption:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
  dateline:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.06em"
    fontFeature: "\"tnum\""
  guess-trail:
    fontFamily: "Libre Franklin, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    letterSpacing: "0.14em"
rounded:
  mark: "2px"
  sort-sm: "5px"
  sort: "6px"
  control: "8px"
  sheet: "14px"
spacing:
  "4": "4px"
  "6": "6px"
  "8": "8px"
  "10": "10px"
  "12": "12px"
  "14": "14px"
  "16": "16px"
  "20": "20px"
  "24": "24px"
  "28": "28px"
  "32": "32px"
  "48": "48px"
  gutter: "16px"
  measure: "24rem"
  measure-wide: "28rem"
  bar: "56px"
components:
  sort:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.sort}"
    rounded: "{rounded.sort}"
  sort-locked:
    backgroundColor: "{colors.spot}"
    textColor: "{colors.on-spot}"
    typography: "{typography.sort}"
    rounded: "{rounded.sort}"
  sort-sm:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    typography: "{typography.sort-sm}"
    rounded: "{rounded.sort-sm}"
  clue-line:
    textColor: "{colors.ink}"
    typography: "{typography.display}"
  clue-slot-locked:
    textColor: "{colors.spot-ink}"
  found-word:
    textColor: "{colors.spot-ink}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "52px"
  button-ink-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.ink-3}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    height: "52px"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "52px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.caption}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    size: "44px"
  icon-button-hover:
    textColor: "{colors.ink}"
  dateline:
    textColor: "{colors.ink-3}"
    typography: "{typography.dateline}"
  dialog-sheet:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "20px"
  dialog-panel:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
    padding: "24px"
    width: "26rem"
---

# Design System: ACROSSword

## Overview

**Creative North Star: "The Composing Stick"**

The page is a printer's composing stick. The clue is one line of set type with a five-letter gap in it, and the player's letters are type sorts that drop into that gap. Nothing sits behind the line: no background art, no card, no app chrome beyond a hairline-ruled top bar. Everything that is not the clue exists to help fill it, check it, or share it.

The world is cool white stock and near-black ink, with one spot ink: the brand teal. Teal means "this letter is right". It prints locked letters, the found word, and the correct cells of a result. Depth comes from hairline rules and the pressed edge along the bottom of each sort, never from shadows, glass, or gradients. The layout is dense and single-column, sized for one thumb on a 390px phone, and the desktop view is the same column centered on a wider measure.

Motion is typesetting motion. Sorts set in with a small scale-up, press in when they lock, and shake sideways on a wrong guess. On solve, the gap closes into the finished sentence: the real word space opens inside the answer, the letters ink from black to teal, and a teal rule draws under the hidden word from left to right. Every move eases out and settles. Nothing bounces.

**Key Characteristics:**
- One line of type is the hero; the gap in the clue mirrors the tiles as the player types.
- Cool neutral paper, near-black ink, and a single teal spot ink used for correct letters.
- Hairline 1px rules for structure; the only other depth is a 2px pressed inset edge on the sorts.
- Libre Franklin for everything, DM Serif Display for the wordmark only, tabular figures for every changing number.
- Ease-out settles (`cubic-bezier(0.25, 1, 0.5, 1)`) and no overshoot.
- Light and dark themes share one set of token names and swap values under `data-theme="dark"`.

## Colors

Cool paper and near-black ink carry the page; one teal spot ink marks correctness and nothing else decorative.

### Primary
- **Spot Teal** (`spot`): the fill of locked and solved sorts, the underline of locked slots, the rule drawn under the found word, and the correct cells of the result grid. It is also the global focus ring (2px outline, 2px offset) and the text caret. In dark mode it becomes `spot-dark`.
- **Spot Ink** (`spot-ink`): teal as text. Used for letters that are right when they sit in running type: locked letters in the clue gap, the found word after solve, correct letters in the guess history, and the "Solved" status in the archive. It is darker than Spot Teal in light mode so it holds up as text (5.1:1 on paper), and lighter in dark mode (`spot-ink-dark`, 8.8:1 on paper).
- **Spot Wash** (`spot-wash`): the text-selection background. Nowhere else.
- **On Spot** (`on-spot`): white letters on a teal sort. Sort letters are 28px bold, so they clear the large-text threshold (3.6:1 light, 3.2:1 dark).

### Neutral
- **Cool Paper** (`paper` / `paper-dark`): the page background and the text color of the ink button. A cool neutral with no warmth.
- **Raised Stock** (`paper-raised` / `paper-raised-dark`): the face of an empty or typed sort and the dialog panel. It is one step lighter than paper in both themes, so sorts and sheets read as a separate piece of stock.
- **Ink** (`ink` / `ink-dark`): the clue, headings, typed letters, the ink button fill, the active-nav rule, and the border of a typed sort.
- **Ink 2** (`ink-2` / `ink-2-dark`): secondary copy, the resting color of icon buttons, status messages, and the bars in the guess distribution chart.
- **Ink 3** (`ink-3` / `ink-3-dark`): the dateline, hints, the countdown, the footer version, disabled button text, locked archive rows, and the border or underline that marks the next empty position.
- **Rule** (`rule` / `rule-dark`): every hairline divider (header bottom, section tops, list rows, stat cells, dialog border) and the 2px pressed edge inside a sort.
- **Rule Strong** (`rule-strong` / `rule-strong-dark`): the 1.5px border of an empty sort, the underline of an empty clue slot, the border of the line button and the disabled Submit, and the "miss" cells of the result grid.
- **Scrim** (`scrim` / `scrim-dark`): the dimmed layer behind a dialog.

### Named Rules
**The One Spot Ink Rule.** Teal means a letter is right. It fills locked and solved sorts, colors correct letters in type, and draws the found-word rule; beyond that it appears only as the system focus ring, caret, and selection wash. Buttons, links, headings, icons, and chart bars stay in ink.

**The Cool Stock Rule.** The paper is cool neutral (`#f6f7f7`), never cream or warm. Raised surfaces are plain white (`#ffffff`) in light mode and a single lighter step (`#1b1e21`) in dark mode.

**The Paired Theme Rule.** Every color is a named custom property on `:root`, redefined under `:root[data-theme="dark"]`. Components use the property, never a raw hex, so both themes come from one component definition.

## Typography

**Display Font:** DM Serif Display (with Georgia, serif), wordmark only
**Body Font:** Libre Franklin, variable 400–700 (with system-ui, sans-serif)

**Character:** A sturdy grotesque sets the clue like a line of news type, weight 500 at display size with slightly tight tracking. The serif wordmark is the only ornamental face on the page, a masthead above plain type. Both are self-hosted woff2 files in `public/fonts`, preloaded, with `font-display: swap`.

### Hierarchy
- **Wordmark** (DM Serif Display 400, 22px, line-height 1): "ACROSS" in capitals tracked to 0.03em, "word" in lowercase at 0.005em. Header only.
- **Display / Clue** (500, 26px, rising to 30px at 640px and up, line-height 1.3, tracking -0.012em, `text-wrap: pretty`): the clue line on the puzzle page. It is the `h1` of the puzzle screen.
- **Display small** (500, 18px, rising to 19px at 640px and up, line-height 1.35): clue lines in archive rows and the How to Play demo.
- **Sort letter** (700, 28px, rising to 32px at 640px and up, uppercase, line-height 1): letters on the sorts. Small sorts in the demo use 20px.
- **Headline** (700, 28px, tracking -0.015em): page titles such as "Archive". A notice title ("Day N is locked") uses 24px with -0.01em.
- **Title** (700, 20px, tracking -0.01em): dialog titles and the "Solved in N guesses" result heading.
- **Figure** (700, 28px, line-height 1.2, tabular): the three stat numbers.
- **Body** (400, 16px, line-height 1.5): dialog copy. Status and secondary copy run at 15px.
- **Button** (600, 16px, tracking 0.005em): button labels, sentence case.
- **Caption** (500, 14px): countdown, demo captions, archive row status, small section heads ("Your guesses" at 600).
- **Dateline** (600, 13px, uppercase, tracking 0.06em, tabular): the "DAY 204 · MON, SEP 28" line directly under the clue, and the same line under each archive clue.
- **Guess trail** (600, 16px, tracking 0.14em, uppercase): previous guesses, set as spaced type with correct letters in Spot Ink at 700.

### Named Rules
**The Wordmark-Only Serif Rule.** DM Serif Display sets the wordmark and nothing else. Headings, numbers, and buttons are Libre Franklin.

**The Figures Line Up Rule.** Any number that changes (day number, countdown, stats, guess counts, version) uses `font-variant-numeric: tabular-nums` so digits do not shift.

**The Dateline Follows Rule.** The tracked-caps dateline sits under the clue it dates and carries real data. It is not a label placed above headings.

## Layout

A single centered column. The content measure is 24rem (384px) below 640px and 28rem (448px) at 640px and up, with a 16px side gutter; the header bar uses the same measure, so the wordmark and the icon row line up with the clue. On a 390px phone the column is 358px wide.

The header bar is 56px tall with a 1px rule under it. The main area has 32px of space above and 48px below. On the puzzle page the rhythm is: clue, 12px, dateline, 28px, the stick of five sorts, 16px, the full-width Submit button, 14px, the status line, then a ruled section for guesses or the result. Sections below the stick start with a 1px top rule and 16–20px of padding.

The stick is a five-column grid with 10px gaps (8px in the demo). Sorts are square and fill their column, so on a 390px phone each sort is about 64px, and about 82px at the 448px measure.

Spacing is small and granular. The values in use are 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, and 48px. The one breakpoint is 640px: the measure widens, type steps up, and dialogs switch from a bottom sheet to a centered panel.

## Elevation & Depth

The system is flat. Structure comes from 1px hairline rules, and the only depth cue is a pressed edge at the bottom of each sort. There are no drop shadows anywhere, including on dialogs, which separate from the page with a scrim and a hairline border.

### Shadow Vocabulary
- **Pressed edge** (`box-shadow: inset 0 -2px 0 var(--rule)`): the inside bottom edge of an empty or typed sort, like the foot of a piece of type.
- **Pressed edge on spot** (`box-shadow: inset 0 -2px 0 rgba(0, 0, 0, 0.16)`): the same edge on a locked or solved sort.

### Named Rules
**The Hairline Rule.** Dividers are 1px `rule` lines. Borders on controls are 1.5px. The two heavier marks are deliberate: the 2px ink rule under the current nav item and the rule under the found word, which is 0.08em thick.

**The No Lift Rule.** Nothing floats. No drop shadows, glass, blur, gradients, or background shapes. A dialog is a sheet of raised stock over a scrim.

## Shapes

Small, square-shouldered corners. Sorts use a 6px radius (5px in the demo) so they read as pieces of type, not pills. Buttons and icon buttons use 8px. Dialogs use 14px: top corners only as a bottom sheet on phones, all four corners as a centered panel at 640px and up. Result-grid cells and distribution bars use 2px. The focus ring has a 6px radius.

Clue slots are not boxes. Each is an underline (0.08em thick, 0.68em wide) under a letter position in running type, so the gap stays part of the sentence.

Icons are inline SVG line drawings: 24-unit viewBox, 1.75 stroke, round caps and joins, drawn at 22px in the header and 20px elsewhere.

## Components

### Sorts (letter tiles)
Square pieces of type in a five-column stick.
- **Shape:** square, 6px radius, 1.5px border.
- **Empty:** Raised Stock face, Rule Strong border, pressed edge in Rule.
- **Next:** border darkens to Ink 3 to mark where the next letter lands.
- **Typed:** border becomes Ink; the letter sets in with a scale from 0.9 to 1 over 140ms.
- **Locked / Solved:** Spot Teal fill and border, white letter, darker pressed edge. A newly locked sort presses in (scale 1 to 0.92 to 1 over 260ms). On solve, the sorts press in sequence with a 60ms stagger.
- **Wrong guess:** the typed sorts shake ±4px over 320ms, then clear after 340ms.
- **Small variant:** 20px letters, 5px radius, 8px gaps, used in the How to Play demo.

### Clue line (signature)
The clue set as display type with an inline five-slot gap that mirrors the sorts.
- **Slots:** 0.68em-wide underlines in Rule Strong. The next slot's underline turns Ink 3, a typed slot turns Ink, and a locked slot shows its letter in Spot Ink over a Spot Teal underline.
- **No-wrap join:** the word fragments on both sides of the gap never wrap away from it.
- **Solve:** the gap is replaced by the completed sentence. The found word opens a 0.26em word space inside itself (360ms), inks from Ink to Spot Ink (360ms), and a Spot Teal rule draws under it from the left (560ms, starting after 260ms).
- **Screen readers:** the slots are hidden and replaced with "[five-letter gap]"; the real input is an off-screen text field.

### Buttons
- **Shape:** 8px radius, 52px minimum height, 24px horizontal padding, 1.5px border.
- **Ink (primary):** Ink fill with Paper text. Submit, Copy result, and Play are full width. Hover mixes 14% paper into the ink; press scales to 0.98.
- **Ink, disabled:** transparent fill, Rule Strong border, Ink 3 text. This is how Submit rests until five letters are in.
- **Line (secondary):** transparent with a Rule Strong border and Ink text; the border darkens to Ink 2 on hover. Used for "Go to the archive".
- **Focus:** the global 2px Spot Teal outline with a 2px offset.
- **Transitions:** color, background, and border over 150ms; press transform over 120ms, all on the ease-out curve.

### Icon buttons and navigation
- **Style:** 44px square minimum, 8px radius, Ink 2 icon. Hover turns the icon Ink over a 6% ink wash; press scales to 0.94.
- **Header:** the wordmark on the left is itself the home link. On the right: Archive, Statistics, How to play, a 1px by 20px Rule divider, and the theme toggle.
- **Current page:** a 2px Ink rule sits on the header's bottom hairline under the current item (the wordmark or Archive) and slides between them over 240ms.
- **Theme toggle:** the sun and moon icons cross-fade, rotating by -60° and scaling to 0.6 on the way out (260ms).

### Dialogs
Used for How to Play and Statistics.
- **Phone:** a bottom sheet of Raised Stock with a 1px top rule, 14px top corners, 88dvh maximum height, 20px padding plus the safe-area inset at the bottom. It slides up 24px and fades in over 240ms.
- **640px and up:** a centered 26rem panel with a hairline border on all sides, 14px radius, and 24px padding. It rises 8px and fades in over 240ms.
- **Scrim:** fades in over 180ms. Clicking it or pressing Escape closes the dialog, and focus returns to the control that opened it.
- **Header:** a Title-style heading on the left and a close icon button on the right.

### Statistics
- **Figures:** three cells (Solved, Streak, Best streak) between top and bottom hairlines, divided by vertical hairlines. Labels are 13px Ink 3; numbers use the Figure style.
- **Distribution:** rows for 1, 2, 3, 4, and 5+ guesses. Each bar is a 10px Rule track with a 2px radius and an Ink 2 fill scaled to the largest count.

### Result block
- **Layout:** a ruled section with "Solved in N guesses" (Title) and the countdown on the left, and the result grid on the right.
- **Result grid:** 12px cells, 2px radius, 3px gaps; Spot Teal for correct letters and Rule Strong for the rest. It mirrors the shared emoji grid and never shows letters.
- **Actions:** a full-width Ink "Copy result" button whose icon becomes a check with the label "Copied" for 2 seconds, then an inline underlined Ink link for reader submissions.
- **Entrance:** fades up 6px over 240ms, 420ms after the solve begins.

### Archive rows
- **Row:** at least 72px tall, split by hairlines. A small clue line and dateline on the left; a status on the right (Play with a chevron, Solved with a check in Spot Ink, or Locked with a padlock in Ink 3).
- **Hover:** a 4% ink wash with a 6px radius that bleeds 12px past the column on each side.
- **Locked:** the clue text drops to Ink 3 and the row is not a link.

### Motion
- **Curve:** `cubic-bezier(0.25, 1, 0.5, 1)` for everything except the error shake, which uses `ease-in-out`.
- **Durations:** 120ms press, 140ms set, 150ms color, 180ms scrim, 200ms theme background, 240ms sheet or panel, fade-up, and nav rule, 260ms lock press and icon swap, 320ms shake, 360ms word-space and ink, 560ms found-word rule.
- **Reduced motion:** all animations and transitions collapse to 1ms with no delay.

## Do's and Don'ts

### Do:
- **Do** keep the clue as the largest type on the page (26px, 30px at 640px and up) and let the gap sit inside the sentence.
- **Do** use Spot Teal and Spot Ink only for letters that are right, plus the focus ring, caret, and selection wash.
- **Do** separate regions with 1px `rule` hairlines and spacing, not boxes or shadows.
- **Do** keep primary actions full width, 52px tall, in Ink, directly under the stick.
- **Do** give every interactive control a hit area of at least 44px.
- **Do** set every changing number in tabular figures.
- **Do** use the ease-out curve `cubic-bezier(0.25, 1, 0.5, 1)`, keep durations between 120ms and 560ms, and honor reduced motion.
- **Do** define every new color as a custom property with both a light and a `data-theme="dark"` value.

### Don't:
- **Don't** use DM Serif Display anywhere but the wordmark.
- **Don't** add drop shadows, glass or blur, gradients, or background blobs. The only shadow is the 2px inset pressed edge on sorts.
- **Don't** warm the paper toward cream or add a second accent hue.
- **Don't** color buttons, links, headings, icons, or chart bars teal.
- **Don't** round sorts past 6px or turn them into pills or circles.
- **Don't** let any motion overshoot or bounce; scale moves go down and return to 1.
- **Don't** put tracked-caps labels above headings; the dateline sits under the clue it dates.
