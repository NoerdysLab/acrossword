"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Tile from "./Tile";
import Confetti from "./Confetti";
import Toast from "./Toast";
import {
  getSolvedData,
  getCurrentGame,
  setCurrentGame,
  markSolved,
  getStats,
} from "@/lib/storage";

interface GameBoardProps {
  day: number;
  clue: string;
  completedSentence: string;
  length: number;
}

type TileState = "empty" | "typing" | "wrong" | "correct" | "solved";

// Find where the answer letters span in the completed sentence.
function findAnswerSpan(
  sentence: string,
  answerLength: number,
  clue: string
) {
  const uscoreIdx = clue.indexOf("_ _ _ _ _");
  if (uscoreIdx === -1) return null;

  const prefixLen = clue.slice(0, uscoreIdx).length;
  let end = prefixLen;
  let consumed = 0;
  while (end < sentence.length && consumed < answerLength) {
    if (sentence[end] === " ") {
      end++;
      continue;
    }
    consumed++;
    end++;
  }

  if (consumed === answerLength) {
    return { start: prefixLen, end };
  }
  return null;
}

// Derive the answer from the completed sentence by extracting
// the non-space characters from the answer span.
function deriveAnswer(
  sentence: string,
  answerLength: number,
  clue: string
): string {
  const span = findAnswerSpan(sentence, answerLength, clue);
  if (!span) return "";
  const middle = sentence.slice(span.start, span.end);
  return middle
    .replace(/\s/g, "")
    .toUpperCase();
}

export default function GameBoard({
  day,
  clue,
  completedSentence,
  length,
}: GameBoardProps) {
  const [currentGuess, setCurrentGuess] = useState("");
  const [tileStates, setTileStates] = useState<TileState[]>(
    Array(length).fill("empty")
  );
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [solvedAnswer, setSolvedAnswer] = useState("");
  const [guessCount, setGuessCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSentence, setShowSentence] = useState(false);
  const [alreadySolved, setAlreadySolved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Locked-in correct letters (Wordle-style). Array of length, empty string means not locked.
  const [lockedLetters, setLockedLetters] = useState<string[]>(
    Array(length).fill("")
  );

  // Timer state
  const startTimeRef = useRef<number | null>(null);

  // Share / toast state
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const submittingRef = useRef(false);

  // Derived answer for client-side letter checking
  const answer = deriveAnswer(completedSentence, length, clue);

  // Load saved state
  useEffect(() => {
    const solvedData = getSolvedData();
    const entry = solvedData[String(day)];
    if (entry?.solved) {
      setSolved(true);
      setAlreadySolved(true);
      setGuessCount(entry.guesses);
      const ans = entry.answer || deriveAnswer(completedSentence, length, clue);
      setSolvedAnswer(ans);
      setTileStates(Array(length).fill("solved"));
      setShowSentence(true);
      return;
    }

    const current = getCurrentGame();
    if (current && current.day === day) {
      setPreviousGuesses(current.guesses);
      if (current.startTime) startTimeRef.current = current.startTime;
      // Restore locked letters from saved state
      if (current.lockedLetters) {
        setLockedLetters(current.lockedLetters);
        // Set tile states for locked letters
        const states: TileState[] = Array(length).fill("empty");
        current.lockedLetters.forEach((letter: string, i: number) => {
          if (letter) states[i] = "correct";
        });
        setTileStates(states);
      }
    }
  }, [day, length]);

  // Focus input
  useEffect(() => {
    if (!solved) {
      inputRef.current?.focus();
    }
  }, [solved]);

  const focusInput = useCallback(() => {
    if (!solved) {
      inputRef.current?.focus();
    }
  }, [solved]);

  // Record first interaction for timer
  const ensureTimerStarted = useCallback(() => {
    if (startTimeRef.current !== null) return;
    startTimeRef.current = Date.now();
    const current = getCurrentGame();
    if (current && current.day === day) {
      setCurrentGame({ ...current, startTime: startTimeRef.current });
    } else {
      setCurrentGame({ day, guesses: [], startTime: startTimeRef.current });
    }
  }, [day]);

  // Build tile states accounting for locked letters and current guess
  const buildTileStates = useCallback(
    (guess: string, locked: string[]): TileState[] => {
      const states: TileState[] = Array(length).fill("empty");
      let typedIdx = 0;
      for (let i = 0; i < length; i++) {
        if (locked[i]) {
          states[i] = "correct";
        } else if (typedIdx < guess.length) {
          states[i] = "typing";
          typedIdx++;
        }
      }
      return states;
    },
    [length]
  );

  // Build full guess: merge locked letters with typed letters
  const buildFullGuess = useCallback(
    (typed: string, locked: string[]): string => {
      let result = "";
      let typedIdx = 0;
      for (let i = 0; i < length; i++) {
        if (locked[i]) {
          result += locked[i];
        } else if (typedIdx < typed.length) {
          result += typed[typedIdx];
          typedIdx++;
        }
      }
      return result;
    },
    [length]
  );

  // Number of unlocked positions
  const unlockedCount = lockedLetters.filter((l) => !l).length;

  const submitGuess = useCallback(
    async (guess: string) => {
      if (submittingRef.current) return;
      submittingRef.current = true;

      const fullGuess = buildFullGuess(guess, lockedLetters);

      try {
        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day, guess: fullGuess }),
        });
        const data = await res.json();

        if (data.correct) {
          const totalGuesses = previousGuesses.length + 1;
          const elapsedMs = startTimeRef.current
            ? Date.now() - startTimeRef.current
            : null;
          setGuessCount(totalGuesses);
          setSolved(true);
          setSolvedAnswer(fullGuess.toUpperCase());
          setTileStates(Array(length).fill("correct"));
          setShowConfetti(true);
          markSolved(day, totalGuesses, fullGuess, 0, elapsedMs);
          setCurrentGame(null);

          setTimeout(() => setShowSentence(true), 800);
          setTimeout(() => setShowConfetti(false), 2500);
        } else {
          // Wordle-style: lock in correct letters
          const newLocked = [...lockedLetters];
          const fullUpper = fullGuess.toUpperCase();
          for (let i = 0; i < length; i++) {
            if (!newLocked[i] && fullUpper[i] === answer[i]) {
              newLocked[i] = answer[i];
            }
          }

          setTileStates(Array(length).fill("wrong"));
          const newGuesses = [
            ...previousGuesses,
            fullGuess.toUpperCase(),
          ];
          setPreviousGuesses(newGuesses);

          setTimeout(() => {
            setLockedLetters(newLocked);
            setCurrentGuess("");
            setTileStates(buildTileStates("", newLocked));
            inputRef.current?.focus();
            submittingRef.current = false;

            // Save state with locked letters
            setCurrentGame({
              day,
              guesses: newGuesses,
              startTime: startTimeRef.current,
              lockedLetters: newLocked,
            });
          }, 400);
          return;
        }
      } catch {
        setTileStates(buildTileStates(guess, lockedLetters));
      }
      submittingRef.current = false;
    },
    [day, length, previousGuesses, lockedLetters, answer, buildFullGuess, buildTileStates]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (solved) return;
      ensureTimerStarted();
      const val = e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, unlockedCount);
      setCurrentGuess(val);
      setTileStates(buildTileStates(val, lockedLetters));

      // Auto-submit when all letters are filled
      if (val.length === unlockedCount) {
        submitGuess(val);
      }
    },
    [solved, unlockedCount, lockedLetters, submitGuess, buildTileStates, ensureTimerStarted]
  );

  const handleSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter" || solved) return;
      if (currentGuess.length !== unlockedCount) return;
      submitGuess(currentGuess);
    },
    [currentGuess, unlockedCount, solved, submitGuess]
  );

  // Build share text
  const buildShareText = useCallback(() => {
    const stats = getStats();
    const firstGuess = guessCount === 1;
    let text = `ACROSSword — Day ${day}\n`;
    text += firstGuess
      ? `🟦 Solved in 1 guess\n`
      : `🟦 Solved in ${guessCount} guesses\n`;
    text += `Streak: ${stats.currentStreak}\n`;
    text += `ACROSSword.org`;
    return text;
  }, [day, guessCount]);

  // Share handler (native share sheet)
  const handleShare = useCallback(async () => {
    const shareText = buildShareText();
    const canShare =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ text: shareText });

    if (canShare) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback to copy
      try {
        await navigator.clipboard.writeText(shareText);
        setToastMessage("Copied!");
        setToastVisible(true);
      } catch {
        // Clipboard failed
      }
    }
  }, [buildShareText]);

  // Copy handler
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildShareText());
      setToastMessage("Copied!");
      setToastVisible(true);
    } catch {
      // Clipboard failed
    }
  }, [buildShareText]);

  // Build display letters: locked letters + typed letters filling unlocked positions
  const getDisplayLetters = (): string => {
    if (solved) return solvedAnswer || buildFullGuess(currentGuess, lockedLetters);
    return buildFullGuess(currentGuess, lockedLetters);
  };
  const displayLetters = getDisplayLetters();

  const answerSpan = findAnswerSpan(completedSentence, length, clue);

  // Completed sentence with highlighted answer portion
  const renderCompletedSentence = () => {
    if (!answerSpan) return <span>{completedSentence}</span>;

    const before = completedSentence.slice(0, answerSpan.start);
    const highlighted = completedSentence.slice(
      answerSpan.start,
      answerSpan.end
    );
    const after = completedSentence.slice(answerSpan.end);

    return (
      <>
        <span>{before}</span>
        <span style={{ color: "var(--accent)", fontWeight: 700 }}>
          {highlighted}
        </span>
        <span>{after}</span>
      </>
    );
  };

  // Clue with highlighted underscores
  const renderClue = () =>
    clue.split(/(_ _ _ _ _)/).map((part, i) =>
      part === "_ _ _ _ _" ? (
        <span key={i} style={{ color: "var(--accent)", fontWeight: 700 }}>
          {part}
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    );

  return (
    <div
      className="flex flex-col items-center gap-8 w-full"
      onClick={focusInput}
    >
      {/* Puzzle number */}
      <div
        className="text-sm font-semibold tracking-wide uppercase"
        style={{ color: "var(--text-secondary)" }}
      >
        Day #{day}
      </div>

      {/* Clue or Completed Sentence */}
      <div
        className="text-lg sm:text-xl text-center leading-relaxed max-w-lg px-4"
        style={{
          fontFamily: "'Libre Franklin', sans-serif",
          color: "var(--text)",
          minHeight: "3em",
        }}
      >
        {showSentence ? (
          <span
            className={!alreadySolved ? "sentence-reveal" : ""}
            style={{ display: "inline-block" }}
          >
            {renderCompletedSentence()}
          </span>
        ) : (
          <span
            className="animate-fade-in-up"
            style={{ display: "inline-block" }}
          >
            {renderClue()}
          </span>
        )}
      </div>

      {/* Tiles — always visible */}
      <div
        className="relative flex gap-2 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        {Array.from({ length }).map((_, i) => (
          <Tile
            key={i}
            index={i}
            letter={displayLetters[i] || ""}
            state={tileStates[i]}
            animationDelay={tileStates[i] === "correct" ? i * 100 : 0}
          />
        ))}
        {showConfetti && <Confetti />}
      </div>

      {/* Hidden input */}
      {!solved && (
        <input
          ref={inputRef}
          type="text"
          value={currentGuess}
          onChange={handleInput}
          onKeyDown={handleSubmit}
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          className="game-input"
          aria-label="Type your guess"
        />
      )}

      {/* Prompt to type */}
      {!solved &&
        previousGuesses.length === 0 &&
        currentGuess.length === 0 && (
          <p
            className="text-sm animate-fade-in-up"
            style={{
              color: "var(--text-secondary)",
              animationDelay: "200ms",
            }}
          >
            Type your guess
          </p>
        )}

      {/* Success message + Share */}
      {solved && showSentence && (
        <div
          className={`flex flex-col items-center text-center ${alreadySolved ? "" : "animate-fade-in-up"}`}
          style={{ animationDelay: alreadySolved ? "0ms" : "200ms" }}
        >
          <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>
            Solved!
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {guessCount === 1
              ? "Got it in 1 guess!"
              : `Got it in ${guessCount} guesses`}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
            className="mt-4 px-8 py-3 rounded-lg text-base font-semibold transition-colors"
            style={{
              backgroundColor: "var(--accent)",
              color: "#ffffff",
            }}
          >
            Share
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-colors"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Copy results
          </button>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSfI5c6NX5fZxPnIY5SHWYrnubzfISLBY8TVftSvGuoVALPC6A/viewform?usp=publish-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="animate-fade-in-up text-sm mt-3"
            style={{
              color: "var(--text-secondary)",
              animationDelay: alreadySolved ? "0ms" : "600ms",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            Submit your own ACROSSword
          </a>
        </div>
      )}

      {/* Previous guesses */}
      {previousGuesses.length > 0 && !solved && (
        <div className="w-full max-w-xs">
          <div
            className="text-xs font-semibold uppercase tracking-wide mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Previous guesses
          </div>
          <div className="flex flex-wrap gap-2">
            {previousGuesses.map((g, i) => (
              <span
                key={i}
                className="text-sm px-3 py-1 rounded-full"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                }}
              >
                {g}
              </span>
            ))}
          </div>
        </div>
      )}

      <Toast
        message={toastMessage}
        visible={toastVisible}
        onDone={() => setToastVisible(false)}
      />
    </div>
  );
}
