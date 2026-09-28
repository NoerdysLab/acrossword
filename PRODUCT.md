# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Daily word-game fans: Wordle and NYT Games regulars who fit one quick puzzle into their day, mostly on their phone. They arrive with a habit already formed and want a new daily ritual that rewards a moment of insight rather than a long grind.

## Product Purpose

ACROSSword is a free daily word puzzle at ACROSSword.org. Each day everyone gets the same clue: a sentence with a gap, where a 5-letter word hides across the boundary between words ("Path f_ _ _ _ _s of space debris" hides ORBIT in "for bits"). Players type guesses until they find it, then share a spoiler-free result.

Success means all of these at once:
- **Daily habit:** players return every day and keep their streaks going.
- **Shared results:** players post their emoji grid and it pulls in new players.
- **Reader-written puzzles:** a steady supply of puzzles submitted by players.
- **Just for fun:** it is a craft project the owner enjoys running, with no business pressure behind it.

## Positioning

The answer is hidden across word boundaries inside the clue itself, like a cryptic crossword's "hidden word" device turned into a daily game. The payoff is the moment the sentence snaps together and the word appears in plain sight. A neighboring daily game can copy the grid or the streak but not this mechanism.

## Operating Context

- Played in a phone browser, often in a spare minute, then shared into a group chat or social feed.
- One puzzle per day for everyone, released at midnight Eastern Time.
- Players commonly also play Wordle and similar games, so they arrive knowing conventions like emoji result grids, streaks, and letters locking in place.
- Puzzles are written by the owner. Players can submit their own through a Google Form linked after solving.

## Capabilities and Constraints

- **Core loop:** the clue shows five blanks; the player types a 5-letter guess into tiles and submits it (Enter or the Submit button). Guesses are unlimited.
- **Feedback:** letters in the correct position lock in, Wordle-style, and stay filled for later guesses. There is no "wrong position" feedback.
- **Solve:** the tiles confirm, the clue becomes the completed sentence with the answer highlighted, and confetti plays.
- **Share:** "Copy results" puts an emoji grid on the clipboard (🟦 for correct letters, ⬜ or ⬛ for the rest, matching the theme), plus the day number, current streak, and ACROSSword.org. The grid must never reveal the answer.
- **Stats:** puzzles solved, current streak, max streak, and guess distribution.
- **Archive:** shows the last 5 days; recent days within the playable window can still be played.
- **Onboarding:** first-time visitors see an animated one-screen demo (LIGHT as a wrong guess, then ORBIT), which the Help button reopens.
- **Themes:** light and dark.
- **No accounts:** all progress, streaks, and settings live in the browser's localStorage. Answers are checked by the server.
- **Puzzle library:** 16 hand-written puzzles in `data/puzzles.json`. Day numbering runs from 2026-03-09 and keeps counting; puzzles loop back to the start once the library runs out. Growing the library, including through reader submissions, is an open need.
- **Terminology:** "Day #N" (not "Puzzle #N"), "clue", "guess", "Submit".

Must always hold:
- Free, with no login or account.
- No ads.
- One shared puzzle a day, with no unlimited or practice mode.
- Phone-first; desktop is the secondary case.

## Brand Commitments

- **Name:** "ACROSSword", with ACROSS in capitals and "word" in lowercase, echoing the across-the-words mechanic.
- **Domain:** ACROSSword.org, which appears in every shared result.
- **Tagline in metadata:** "a daily hidden word puzzle".
- No other voice, personality, or asset commitments have been confirmed.

## Evidence on Hand

- 16 puzzles with clues, answers, and completed sentences in `data/puzzles.json`.
- A reader-submission Google Form, linked from the solved screen.
- No testimonials, press, player counts, reviews, or partner logos exist. Future work must not invent any.

## Product Principles

1. **The aha is the product.** Everything serves the moment the hidden word snaps across the boundary; nothing should compete with or spoil it.
2. **One puzzle, shared by everyone.** The same clue for every player each day is what makes results worth comparing and sharing.
3. **Respect the player.** Free, no login, no ads, and no manipulative streak or notification tactics; the habit should come from the puzzle being good.
4. **Phone-first, thumb-first.** Design and test for a phone in one hand before anything else.
5. **Results travel without spoilers.** A shared result shows effort and invites curiosity, never the answer.
