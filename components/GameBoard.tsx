"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Tile, { type SortAnim, type SortState } from "./Tile";
import ClueLine, { type Slot } from "./ClueLine";
import NextClue from "./NextClue";
import DemoModal from "./DemoModal";
import { puzzleDateLabel } from "@/lib/dates";
import {
  getSolvedData,
  getCurrentGame,
  setCurrentGame,
  markSolved,
  getStats,
  hasSeenDemo,
  markDemoSeen,
} from "@/lib/storage";

interface GameBoardProps {
  day: number;
  clue: string;
  completedSentence: string;
  length: number;
}

type Phase = "idle" | "checking" | "wrong" | "solving" | "solved";

const SUBMIT_FORM =
  "https://docs.google.com/forms/d/e/1FAIpQLSfI5c6NX5fZxPnIY5SHWYrnubzfISLBY8TVftSvGuoVALPC6A/viewform?usp=publish-editor";

function findAnswerSpan(sentence: string, answerLength: number, clue: string) {
  const gapIdx = clue.indexOf("_ _ _ _ _");
  if (gapIdx === -1) return null;
  const start = gapIdx;
  let end = start;
  let consumed = 0;
  while (end < sentence.length && consumed < answerLength) {
    if (sentence[end] !== " ") consumed++;
    end++;
  }
  return consumed === answerLength ? { start, end } : null;
}

function deriveAnswer(sentence: string, answerLength: number, clue: string): string {
  const span = findAnswerSpan(sentence, answerLength, clue);
  if (!span) return "";
  return sentence.slice(span.start, span.end).replace(/\s/g, "").toUpperCase();
}

// Locked letters stay in place; typed letters fill the open positions in order.
function placeLetters(typed: string, locked: string[]): string[] {
  const out = [...locked];
  let t = 0;
  for (let i = 0; i < out.length; i++) {
    if (!out[i] && t < typed.length) out[i] = typed[t++].toUpperCase();
  }
  return out;
}

export default function GameBoard({ day, clue, completedSentence, length }: GameBoardProps) {
  const answer = deriveAnswer(completedSentence, length, clue);
  const answerSpan = findAnswerSpan(completedSentence, length, clue);

  const [typed, setTyped] = useState("");
  const [locked, setLocked] = useState<string[]>(() => Array(length).fill(""));
  const [justLocked, setJustLocked] = useState<number[]>([]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [solvedAnswer, setSolvedAnswer] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [animateSolve, setAnimateSolve] = useState(false);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const submittingRef = useRef(false);

  const solved = phase === "solving" || phase === "solved";
  const openCount = locked.filter((l) => !l).length;
  const ready = !solved && typed.length === openCount && phase !== "checking";

  useEffect(() => {
    const firstVisit = !hasSeenDemo();
    if (firstVisit) setShowDemo(true);

    const entry = getSolvedData()[String(day)];
    if (entry?.solved) {
      setPhase("solved");
      setGuessCount(entry.guesses);
      setSolvedAnswer(entry.answer || deriveAnswer(completedSentence, length, clue));
      if (entry.guessHistory) setGuesses(entry.guessHistory.slice(0, -1));
      return;
    }

    const current = getCurrentGame();
    if (current && current.day === day) {
      setGuesses(current.guesses);
      if (current.startTime) startTimeRef.current = current.startTime;
      if (current.lockedLetters) setLocked(current.lockedLetters);
    }

    if (!firstVisit && window.matchMedia("(pointer: fine)").matches) {
      inputRef.current?.focus({ preventScroll: true });
    }
  }, [day, length, clue, completedSentence]);

  const handleDemoClose = useCallback(() => {
    setShowDemo(false);
    markDemoSeen();
    inputRef.current?.focus();
  }, []);

  const focusInput = useCallback(() => {
    if (!solved) inputRef.current?.focus();
  }, [solved]);

  const ensureTimerStarted = useCallback(() => {
    if (startTimeRef.current !== null) return;
    startTimeRef.current = Date.now();
    const current = getCurrentGame();
    setCurrentGame(
      current && current.day === day
        ? { ...current, startTime: startTimeRef.current }
        : { day, guesses: [], startTime: startTimeRef.current }
    );
  }, [day]);

  const submitGuess = useCallback(async () => {
    if (submittingRef.current || !ready) return;
    submittingRef.current = true;
    const full = placeLetters(typed, locked).join("");
    setPhase("checking");
    setStatus("");

    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, guess: full }),
      });
      const data = await res.json();

      if (data.correct) {
        const total = guesses.length + 1;
        const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : null;
        markSolved(day, total, full, 0, elapsed, [...guesses, full]);
        setCurrentGame(null);
        setGuessCount(total);
        setSolvedAnswer(full);
        setTyped("");
        setAnimateSolve(true);
        setPhase("solving");
        setStatus(`Solved in ${total} ${total === 1 ? "guess" : "guesses"}.`);
        setTimeout(() => setPhase("solved"), 520);
        submittingRef.current = false;
        return;
      }

      const newLocked = [...locked];
      const fresh: number[] = [];
      for (let i = 0; i < length; i++) {
        if (!newLocked[i] && full[i] === answer[i]) {
          newLocked[i] = answer[i];
          fresh.push(i);
        }
      }
      const newGuesses = [...guesses, full];
      setGuesses(newGuesses);
      setPhase("wrong");
      setStatus(
        fresh.length === 0
          ? locked.some(Boolean)
            ? "Not it. No new letters locked in."
            : "Not it. No letters in the right spot."
          : `Not it. ${fresh.length} ${fresh.length === 1 ? "letter" : "letters"} locked in.`
      );

      setTimeout(() => {
        setLocked(newLocked);
        setJustLocked(fresh);
        setTyped("");
        setPhase("idle");
        submittingRef.current = false;
        inputRef.current?.focus();
        setCurrentGame({ day, guesses: newGuesses, startTime: startTimeRef.current, lockedLetters: newLocked });
      }, 340);
    } catch {
      setPhase("idle");
      setStatus("Couldn't check that guess. Check your connection and try again.");
      submittingRef.current = false;
    }
  }, [ready, typed, locked, day, guesses, length, answer]);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (solved || phase === "checking") return;
      ensureTimerStarted();
      const val = e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, openCount).toUpperCase();
      setTyped(val);
      setJustLocked([]);
      if (phase === "wrong") setPhase("idle");
    },
    [solved, phase, openCount, ensureTimerStarted]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") submitGuess();
    },
    [submitGuess]
  );

  const buildShareText = useCallback(() => {
    const stats = getStats();
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    const miss = dark ? "⬛" : "⬜";
    const line = (g: string) =>
      Array.from({ length }, (_, i) => (g[i]?.toUpperCase() === answer[i] ? "🟦" : miss)).join("");
    return [
      `ACROSSword — Day ${day}`,
      ...[...guesses, solvedAnswer].map(line),
      `Streak: ${stats.currentStreak}`,
      "ACROSSword.org",
    ].join("\n");
  }, [day, length, answer, guesses, solvedAnswer]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildShareText());
      setCopied(true);
      setStatus("Result copied.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setStatus("Couldn't copy. Your browser blocked clipboard access.");
    }
  }, [buildShareText]);

  // ----- Derived view state -----

  const letters = solved ? (solvedAnswer || answer).split("") : placeLetters(typed, locked);
  const nextIndex = solved ? -1 : letters.findIndex((l) => !l);

  const sorts: { letter: string; state: SortState; anim: SortAnim; delay: number }[] = letters.map((letter, i) => {
    if (solved) {
      return {
        letter,
        state: "solved",
        anim: animateSolve && !locked[i] ? "press" : "none",
        delay: animateSolve ? i * 60 : 0,
      };
    }
    if (locked[i]) {
      return { letter, state: "locked", anim: justLocked.includes(i) ? "press" : "none", delay: 0 };
    }
    if (phase === "wrong") return { letter, state: "typed", anim: "shake", delay: 0 };
    if (letter) return { letter, state: "typed", anim: "set", delay: 0 };
    return { letter: "", state: i === nextIndex ? "next" : "empty", anim: "none", delay: 0 };
  });

  const slots: Slot[] = sorts.map((s) => ({
    letter: s.letter,
    state: s.state === "solved" ? "locked" : s.state,
  }));

  const hint =
    openCount === length
      ? "Type a 5-letter word to fill the gap."
      : `Type the ${openCount} missing ${openCount === 1 ? "letter" : "letters"}.`;

  const resultRows = [...guesses, solvedAnswer || answer];

  return (
    <div className="flex flex-col w-full">
      <section aria-label={`Day ${day} clue`} onClick={focusInput} style={{ cursor: solved ? "default" : "text" }}>
        <ClueLine
          as="h1"
          clue={clue}
          slots={slots}
          solved={phase === "solved" || (phase === "solving" && !animateSolve) ? (answerSpan ? { sentence: completedSentence, ...answerSpan } : null) : null}
          animate={animateSolve}
        />
        <p className="tabular" style={{ marginTop: "0.75rem", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>
          Day {day} · {puzzleDateLabel(day)}
        </p>

        <div className="stick" aria-hidden="true" style={{ marginTop: "1.75rem" }}>
          {sorts.map((s, i) => (
            <Tile key={`${i}-${s.anim}-${guesses.length}`} letter={s.letter} state={s.state} anim={s.anim} delay={s.delay} />
          ))}
        </div>
      </section>

      {!solved && (
        <>
          <input
            ref={inputRef}
            type="text"
            value={typed}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            autoCapitalize="characters"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="go"
            data-form-type="other"
            data-lpignore="true"
            name="acrossword-guess"
            id="acrossword-guess"
            className="game-input"
            aria-label={`Your guess. ${hint}`}
          />
          <button
            type="button"
            className="btn btn--ink w-full"
            style={{ marginTop: "1rem" }}
            onClick={(e) => {
              e.stopPropagation();
              submitGuess();
            }}
            disabled={!ready}
          >
            {phase === "checking" ? "Checking…" : "Submit"}
          </button>
          <p aria-hidden="true" style={{ marginTop: "0.875rem", minHeight: "1.25rem", fontSize: "0.9375rem", color: status ? "var(--ink-2)" : "var(--ink-3)" }}>
            {status || (guesses.length === 0 && typed.length === 0 ? hint : "")}
          </p>

          {guesses.length > 0 && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--rule)" }}>
              <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--ink-2)" }}>
                Your guesses <span className="tabular" style={{ color: "var(--ink-3)", fontWeight: 500 }}>{guesses.length}</span>
              </h2>
              <ol className="flex flex-wrap" style={{ gap: "0.5rem 1.25rem", marginTop: "0.5rem" }}>
                {guesses.map((g, gi) => (
                  <li key={gi} style={{ fontSize: "1rem", fontWeight: 600, letterSpacing: "0.14em", color: "var(--ink-3)" }}>
                    {g.split("").map((ch, i) => (
                      <span key={i} style={ch === answer[i] ? { color: "var(--spot-ink)", fontWeight: 700 } : undefined}>
                        {ch}
                      </span>
                    ))}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}

      {phase === "solved" && (
        <section aria-label="Result" className={animateSolve ? "fade-up" : undefined} style={{ marginTop: "1.75rem", paddingTop: "1.25rem", borderTop: "1px solid var(--rule)", animationDelay: animateSolve ? "420ms" : undefined }}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
                Solved in {guessCount} {guessCount === 1 ? "guess" : "guesses"}
              </h2>
              <div style={{ marginTop: "0.25rem" }}>
                <NextClue />
              </div>
            </div>
            <div aria-label={`Result grid, ${resultRows.length} ${resultRows.length === 1 ? "row" : "rows"}`} role="img" className="flex flex-col" style={{ gap: "3px" }}>
              {resultRows.map((g, r) => (
                <div key={r} className="flex" style={{ gap: "3px" }}>
                  {Array.from({ length }, (_, i) => (
                    <span
                      key={i}
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        background: g[i]?.toUpperCase() === answer[i] ? "var(--spot)" : "var(--rule-strong)",
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          <button type="button" className="btn btn--ink w-full" style={{ marginTop: "1.25rem" }} onClick={handleCopy}>
            {copied ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="9" width="12" height="12" rx="2" />
                <path d="M5 15V5a2 2 0 0 1 2-2h10" />
              </svg>
            )}
            {copied ? "Copied" : "Copy result"}
          </button>

          <p style={{ marginTop: "1.25rem", fontSize: "0.9375rem", color: "var(--ink-2)" }}>
            Have a sentence that hides a word?{" "}
            <a href={SUBMIT_FORM} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ink)", fontWeight: 600, textDecoration: "underline" }}>
              Submit your own clue
            </a>
          </p>
        </section>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {status}
      </p>

      <DemoModal open={showDemo} onClose={handleDemoClose} />
    </div>
  );
}
