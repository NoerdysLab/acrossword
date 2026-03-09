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
          setTileStates(Array(length).fill("correct"));
          setShowConfetti(true);
          markSolved(day, totalGuesses);
          setCurrentGame(null);
          // After tile flip animation, transition to completed sentence
          setTimeout(() => setShowSentence(true), 1200);
          setTimeout(() => setShowConfetti(false), 2500);
        } else {
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
        setTileStates(Array(length).fill("empty"));
      }
    },
    [currentGuess, day, length, previousGuesses, solved]
  );

  const displayLetters = solved ? currentGuess || "     " : currentGuess;

  // Render the completed sentence with the hidden word highlighted
  const renderCompletedSentence = () => {
    const sentenceLower = completedSentence.toLowerCase();
    // Get the answer from the puzzle data — we can derive it from the completedSentence
    // by finding 5 consecutive letter chars (ignoring spaces) that match across word boundaries
    // But we actually have the answer in displayLetters or can parse from clue
    // Use a simpler approach: find the answer span using the clue's prefix/suffix

    // Extract prefix (before underscores) and suffix (after underscores)
    const underscoreIdx = clue.indexOf("_ _ _ _ _");
    if (underscoreIdx === -1) return <span>{completedSentence}</span>;

    const cluePrefix = clue.slice(0, underscoreIdx);
    const clueSuffix = clue.slice(underscoreIdx + 9); // "_ _ _ _ _" = 9 chars

    // The prefix in clue ends at the start of the hidden letters
    // The prefix text in the completed sentence should match
    // Find where the prefix text ends in the completed sentence
    // The clue prefix ends with partial word chars that lead into the answer
    // e.g., "La Scala performance where Eur" — the "Eur" is part of "Europe"
    // In the completed sentence: "La Scala performance where Europe ranks highest"
    // We need to find that the answer "OPERA" spans from "Eur[ope ra]nks"
    // i.e., prefix ends with "Eur" and suffix starts with "nks"

    // Match prefix length to find answer start in completedSentence
    // The clue prefix = completed sentence prefix (they share the same text up to where underscores start)
    const prefixLen = cluePrefix.length;

    // Now find where the suffix starts in the completed sentence
    // The suffix text from the clue should match the end of the completed sentence
    const suffixTrimmed = clueSuffix.trimStart();
    let answerEnd = -1;
    if (suffixTrimmed.length > 0) {
      // Find suffix in completed sentence
      const suffixIdx = completedSentence.toLowerCase().indexOf(
        suffixTrimmed.toLowerCase().slice(0, Math.min(suffixTrimmed.length, 10))
      );
      if (suffixIdx >= 0) {
        answerEnd = suffixIdx;
      }
    }

    // Also try: from the prefix position, scan forward to find matching suffix
    if (answerEnd === -1) {
      answerEnd = completedSentence.length - clueSuffix.length;
    }

    // The clue prefix might have trailing/leading differences with the sentence
    // Better approach: use the actual answer letters to find span
    const answer = (displayLetters || "opera").toLowerCase();
    let answerStart = -1;
    let endPos = -1;

    for (let i = 0; i < sentenceLower.length; i++) {
      let matched = 0;
      let j = i;
      while (j < sentenceLower.length && matched < answer.length) {
        if (sentenceLower[j] === " ") {
          j++;
          continue;
        }
        if (sentenceLower[j] === answer[matched]) {
          matched++;
          j++;
        } else {
          break;
        }
      }
      if (matched === answer.length) {
        answerStart = i;
        endPos = j;
        break;
      }
    }

    if (answerStart === -1) {
      return <span>{completedSentence}</span>;
    }

    const before = completedSentence.slice(0, answerStart);
    const highlighted = completedSentence.slice(answerStart, endPos);
    const after = completedSentence.slice(endPos);

    return (
      <>
        <span>{before}</span>
        <span
          style={{
            color: "var(--accent)",
            fontWeight: 700,
          }}
        >
          {highlighted}
        </span>
        <span>{after}</span>
      </>
    );
  };

  return (
    <div
      className="flex flex-col items-center gap-6 w-full"
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
      {showSentence ? (
        <div
          className={`text-lg sm:text-xl text-center leading-relaxed max-w-lg px-4 ${
            alreadySolved ? "" : "sentence-reveal"
          }`}
          style={{
            fontFamily: "'Libre Franklin', sans-serif",
            color: "var(--text)",
          }}
        >
          {renderCompletedSentence()}
        </div>
      ) : (
        <div
          className="text-lg sm:text-xl text-center leading-relaxed max-w-lg px-4 animate-fade-in-up"
          style={{
            fontFamily: "'Libre Franklin', sans-serif",
            color: "var(--text)",
          }}
        >
          {clue.split(/(_ _ _ _ _)/).map((part, i) =>
            part === "_ _ _ _ _" ? (
              <span
                key={i}
                style={{ color: "var(--accent)", fontWeight: 700 }}
              >
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      )}

      {/* Tiles — visible while playing and during correct animation */}
      {(!showSentence || (solved && !alreadySolved && !showSentence)) && (
        <div
          className={`relative flex gap-2 ${showSentence ? "tiles-fly-out" : "animate-fade-in-up"}`}
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
        currentGuess.length === 0 && (
          <p
            className="text-sm animate-fade-in-up"
            style={{
              color: "var(--text-secondary)",
              animationDelay: "200ms",
            }}
          >
            Type your guess and press Enter
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
