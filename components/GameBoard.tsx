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

type TileState = "empty" | "typing" | "wrong" | "correct" | "solved" | "hint";

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

  // Hint state
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState<string[]>([]);
  const [hintLoading, setHintLoading] = useState(false);

  // Timer state
  const startTimeRef = useRef<number | null>(null);

  // Share / toast state
  const [solvedHintsUsed, setSolvedHintsUsed] = useState(0);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const submittingRef = useRef(false);

  // Load saved state
  useEffect(() => {
    const solvedData = getSolvedData();
    const entry = solvedData[String(day)];
    if (entry?.solved) {
      setSolved(true);
      setAlreadySolved(true);
      setGuessCount(entry.guesses);
      setSolvedHintsUsed(entry.hintsUsed ?? 0);
      // Use stored answer, or derive it from the completed sentence as fallback
      const answer = entry.answer || deriveAnswer(completedSentence, length, clue);
      setSolvedAnswer(answer);
      setTileStates(Array(length).fill("solved"));
      setShowSentence(true);
      return;
    }

    const current = getCurrentGame();
    if (current && current.day === day) {
      setPreviousGuesses(current.guesses);
      // Restore hint state
      if (current.hintsUsed) setHintsUsed(current.hintsUsed);
      if (current.hintsRevealed) setHintsRevealed(current.hintsRevealed);
      // Restore timer
      if (current.startTime) startTimeRef.current = current.startTime;
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
    // Persist to localStorage
    const current = getCurrentGame();
    if (current && current.day === day) {
      setCurrentGame({ ...current, startTime: startTimeRef.current });
    } else {
      setCurrentGame({ day, guesses: [], startTime: startTimeRef.current });
    }
  }, [day]);

  // Build tile states accounting for hints
  const buildTileStates = useCallback(
    (guess: string, revealed: string[]): TileState[] => {
      const states: TileState[] = Array(length).fill("empty");
      for (let i = 0; i < length; i++) {
        if (i < revealed.length) {
          states[i] = "hint";
        } else if (i < guess.length + revealed.length) {
          states[i] = "typing";
        }
      }
      return states;
    },
    [length]
  );

  // Build full display value: hints + typed guess
  const buildFullGuess = useCallback(
    (typed: string, revealed: string[]): string => {
      const hintPart = revealed.join("");
      return hintPart + typed;
    },
    []
  );

  const submitGuess = useCallback(
    async (guess: string) => {
      if (submittingRef.current) return;
      submittingRef.current = true;

      const fullGuess = buildFullGuess(guess, hintsRevealed);

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
          setSolvedHintsUsed(hintsUsed);
          setTileStates(Array(length).fill("correct"));
          setShowConfetti(true);
          markSolved(day, totalGuesses, fullGuess, hintsUsed, elapsedMs);
          setCurrentGame(null);

          // After tile flip, show the completed sentence
          setTimeout(() => setShowSentence(true), 800);
          setTimeout(() => setShowConfetti(false), 2500);
        } else {
          setTileStates(Array(length).fill("wrong"));
          const newGuesses = [
            ...previousGuesses,
            fullGuess.toUpperCase(),
          ];
          setPreviousGuesses(newGuesses);
          setCurrentGame({
            day,
            guesses: newGuesses,
            hintsUsed,
            hintsRevealed,
            startTime: startTimeRef.current,
          });

          setTimeout(() => {
            setCurrentGuess("");
            setTileStates(buildTileStates("", hintsRevealed));
            inputRef.current?.focus();
            submittingRef.current = false;
          }, 400);
          return;
        }
      } catch {
        setTileStates(buildTileStates(guess, hintsRevealed));
      }
      submittingRef.current = false;
    },
    [day, length, previousGuesses, hintsUsed, hintsRevealed, buildFullGuess, buildTileStates]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (solved) return;
      ensureTimerStarted();
      const maxTypable = length - hintsRevealed.length;
      const val = e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, maxTypable);
      setCurrentGuess(val);
      setTileStates(buildTileStates(val, hintsRevealed));

      // Auto-submit when all letters are filled
      if (val.length === maxTypable) {
        submitGuess(val);
      }
    },
    [solved, length, hintsRevealed, submitGuess, buildTileStates, ensureTimerStarted]
  );

  const handleSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter" || solved) return;
      const maxTypable = length - hintsRevealed.length;
      if (currentGuess.length !== maxTypable) return;
      submitGuess(currentGuess);
    },
    [currentGuess, length, solved, submitGuess, hintsRevealed]
  );

  // Hint handler
  const useHint = useCallback(async () => {
    if (hintLoading || solved || hintsUsed >= 2) return;
    ensureTimerStarted();
    setHintLoading(true);
    const hintNumber = hintsUsed + 1;

    try {
      const res = await fetch("/api/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ day, hint: hintNumber }),
      });
      const data = await res.json();

      if (data.letter) {
        const newRevealed = [...hintsRevealed, data.letter];
        const newHintsUsed = hintNumber;
        setHintsRevealed(newRevealed);
        setHintsUsed(newHintsUsed);

        // If the user had typed a letter in the hint position, remove it
        const newGuess = currentGuess.slice(0, length - newRevealed.length);
        setCurrentGuess(newGuess);
        setTileStates(buildTileStates(newGuess, newRevealed));

        // Save state
        const current = getCurrentGame();
        setCurrentGame({
          day,
          guesses: current?.guesses ?? previousGuesses,
          hintsUsed: newHintsUsed,
          hintsRevealed: newRevealed,
          startTime: startTimeRef.current,
        });

        inputRef.current?.focus();

        // Auto-submit if all positions filled after hint
        const maxTypable = length - newRevealed.length;
        if (newGuess.length === maxTypable) {
          submitGuess(newGuess);
        }
      }
    } catch {
      // silently fail
    }
    setHintLoading(false);
  }, [
    hintLoading, solved, hintsUsed, hintsRevealed, day, currentGuess,
    length, previousGuesses, buildTileStates, submitGuess, ensureTimerStarted,
  ]);

  // Share handler
  const handleShare = useCallback(async () => {
    const stats = getStats();
    const firstGuess = guessCount === 1;

    let shareText = `acrossword — Day ${day}\n`;
    shareText += firstGuess
      ? `🟩 Solved in 1 guess!\n`
      : `🟩 Solved!\n`;
    shareText += `💡 Hints: ${solvedHintsUsed}/2\n`;
    shareText += `🔥 Streak: ${stats.currentStreak}\n`;
    shareText += `\nacrossword.org`;

    const canShare =
      typeof navigator !== "undefined" &&
      typeof navigator.share === "function" &&
      typeof navigator.canShare === "function" &&
      navigator.canShare({ text: shareText });

    if (canShare) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // User cancelled or share failed — do nothing
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText);
        setToastMessage("Copied!");
        setToastVisible(true);
      } catch {
        // Clipboard failed
      }
    }
  }, [day, guessCount, solvedHintsUsed]);

  // Build display letters: hints + typed letters
  const displayLetters = solved
    ? solvedAnswer || buildFullGuess(currentGuess, hintsRevealed)
    : buildFullGuess(currentGuess, hintsRevealed);

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
        Puzzle #{day}
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

      {/* Hint button */}
      {!solved && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            useHint();
          }}
          disabled={hintsUsed >= 2 || hintLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-opacity"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: hintsUsed >= 2 ? "var(--text-secondary)" : "var(--text)",
            opacity: hintsUsed >= 2 ? 0.5 : 1,
            cursor: hintsUsed >= 2 ? "default" : "pointer",
          }}
          aria-label={`Use hint (${2 - hintsUsed} remaining)`}
        >
          <span>💡</span>
          <span>{2 - hintsUsed}</span>
        </button>
      )}

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
        currentGuess.length === 0 &&
        hintsUsed === 0 && (
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
          className={`text-center ${alreadySolved ? "" : "animate-fade-in-up"}`}
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
            className="mt-3 px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{
              backgroundColor: "var(--accent)",
              color: "#ffffff",
            }}
          >
            Share
          </button>
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
