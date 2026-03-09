"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Tile from "./Tile";
import Confetti from "./Confetti";
import {
  getSolvedData,
  getCurrentGame,
  setCurrentGame,
  markSolved,
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

  // Load saved state
  useEffect(() => {
    const solvedData = getSolvedData();
    const entry = solvedData[String(day)];
    if (entry?.solved) {
      setSolved(true);
      setAlreadySolved(true);
      setGuessCount(entry.guesses);
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

  const submittingRef = useRef(false);

  const submitGuess = useCallback(
    async (guess: string) => {
      if (submittingRef.current) return;
      submittingRef.current = true;

      try {
        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day, guess }),
        });
        const data = await res.json();

        if (data.correct) {
          const totalGuesses = previousGuesses.length + 1;
          setGuessCount(totalGuesses);
          setSolved(true);
          setSolvedAnswer(guess.toUpperCase());
          setTileStates(Array(length).fill("correct"));
          setShowConfetti(true);
          markSolved(day, totalGuesses, guess);
          setCurrentGame(null);

          // After tile flip, show the completed sentence
          setTimeout(() => setShowSentence(true), 800);
          setTimeout(() => setShowConfetti(false), 2500);
        } else {
          setTileStates(Array(length).fill("wrong"));
          const newGuesses = [
            ...previousGuesses,
            guess.toUpperCase(),
          ];
          setPreviousGuesses(newGuesses);
          setCurrentGame({ day, guesses: newGuesses });

          setTimeout(() => {
            setCurrentGuess("");
            setTileStates(Array(length).fill("empty"));
            inputRef.current?.focus();
            submittingRef.current = false;
          }, 400);
          return;
        }
      } catch {
        setTileStates(Array(length).fill("empty"));
      }
      submittingRef.current = false;
    },
    [day, length, previousGuesses]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (solved) return;
      const val = e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, length);
      setCurrentGuess(val);

      const newStates: TileState[] = Array(length).fill("empty");
      for (let i = 0; i < val.length; i++) {
        newStates[i] = "typing";
      }
      setTileStates(newStates);

      // Auto-submit when all letters are filled
      if (val.length === length) {
        submitGuess(val);
      }
    },
    [solved, length, submitGuess]
  );

  const handleSubmit = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter" || solved) return;
      if (currentGuess.length !== length) return;
      submitGuess(currentGuess);
    },
    [currentGuess, length, solved, submitGuess]
  );

  // Letters to display in tiles: saved answer when solved, current guess while playing
  const displayLetters = solved ? solvedAnswer || currentGuess : currentGuess;

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

      {/* Success message */}
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
    </div>
  );
}
