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
  length: number;
}

type TileState = "empty" | "typing" | "wrong" | "correct" | "solved";

export default function GameBoard({ day, clue, length }: GameBoardProps) {
  const [currentGuess, setCurrentGuess] = useState("");
  const [tileStates, setTileStates] = useState<TileState[]>(
    Array(length).fill("empty")
  );
  const [previousGuesses, setPreviousGuesses] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [guessCount, setGuessCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load saved state
  useEffect(() => {
    const solvedData = getSolvedData();
    const entry = solvedData[String(day)];
    if (entry?.solved) {
      setSolved(true);
      setGuessCount(entry.guesses);
      setTileStates(Array(length).fill("solved"));
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
    },
    [solved, length]
  );

  const handleSubmit = useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter" || solved) return;
      if (currentGuess.length !== length) return;

      try {
        const res = await fetch("/api/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ day, guess: currentGuess }),
        });
        const data = await res.json();

        if (data.correct) {
          const totalGuesses = previousGuesses.length + 1;
          setGuessCount(totalGuesses);
          setSolved(true);
          setTileStates(
            Array(length)
              .fill("correct")
          );
          setShowConfetti(true);
          markSolved(day, totalGuesses);
          setCurrentGame(null);
          setTimeout(() => setShowConfetti(false), 2000);
        } else {
          // Wrong guess
          setTileStates(Array(length).fill("wrong"));
          const newGuesses = [...previousGuesses, currentGuess.toUpperCase()];
          setPreviousGuesses(newGuesses);
          setCurrentGame({ day, guesses: newGuesses });

          setTimeout(() => {
            setCurrentGuess("");
            setTileStates(Array(length).fill("empty"));
            inputRef.current?.focus();
          }, 400);
        }
      } catch {
        // Network error, reset
        setTileStates(Array(length).fill("empty"));
      }
    },
    [currentGuess, day, length, previousGuesses, solved]
  );

  // Get the answer display for solved state
  const displayLetters = solved
    ? currentGuess || "     " // Will be replaced by tiles showing the word
    : currentGuess;

  return (
    <div className="flex flex-col items-center gap-6 w-full" onClick={focusInput}>
      {/* Puzzle number */}
      <div
        className="text-sm font-semibold tracking-wide uppercase"
        style={{ color: "var(--text-secondary)" }}
      >
        Puzzle #{day}
      </div>

      {/* Clue */}
      <div
        className="text-lg sm:text-xl text-center leading-relaxed max-w-lg px-4 animate-fade-in-up"
        style={{
          fontFamily: "'Libre Franklin', sans-serif",
          color: "var(--text)",
        }}
      >
        {clue.split(/(_ _ _ _ _)/).map((part, i) =>
          part === "_ _ _ _ _" ? (
            <span key={i} style={{ color: "var(--accent)", fontWeight: 700 }}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>

      {/* Tiles */}
      <div className="relative flex gap-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
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
      {!solved && previousGuesses.length === 0 && currentGuess.length === 0 && (
        <p
          className="text-sm animate-fade-in-up"
          style={{ color: "var(--text-secondary)", animationDelay: "200ms" }}
        >
          Type your guess and press Enter
        </p>
      )}

      {/* Success message */}
      {solved && (
        <div className="text-center animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <p className="text-lg font-bold" style={{ color: "var(--accent)" }}>
            Solved!
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
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
