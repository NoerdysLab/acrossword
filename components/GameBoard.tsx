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
// Uses the clue prefix (text before _ _ _ _ _) to locate the start position,
// then counts forward through `answerLength` non-space characters.
function findAnswerSpan(sentence: string, answerLength: number, clue: string) {
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
  const [alreadySolved, setAlreadySolved] = useState(false);
  // Animation phases: "playing" | "correct" | "flying" | "landed"
  const [phase, setPhase] = useState<
    "playing" | "correct" | "flying" | "landed"
  >("playing");
  const inputRef = useRef<HTMLInputElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const targetRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [flyStyles, setFlyStyles] = useState<React.CSSProperties[]>([]);

  // Load saved state
  useEffect(() => {
    const solvedData = getSolvedData();
    const entry = solvedData[String(day)];
    if (entry?.solved) {
      setSolved(true);
      setAlreadySolved(true);
      setGuessCount(entry.guesses);
      setPhase("landed");
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

  // Measure tile + target positions and set CSS transforms to animate tiles flying up
  const startFlyAnimation = useCallback(() => {
    setPhase("flying");

    // Double rAF to ensure the sentence targets are rendered and measured
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const styles: React.CSSProperties[] = [];
        for (let i = 0; i < length; i++) {
          const tile = tileRefs.current[i];
          const target = targetRefs.current[i];
          if (tile && target) {
            const tileRect = tile.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const dx =
              targetRect.left +
              targetRect.width / 2 -
              (tileRect.left + tileRect.width / 2);
            const dy =
              targetRect.top +
              targetRect.height / 2 -
              (tileRect.top + tileRect.height / 2);
            styles.push({
              transform: `translate(${dx}px, ${dy}px) scale(0.4)`,
              opacity: 0,
              transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 80}ms`,
            });
          } else {
            styles.push({});
          }
        }
        setFlyStyles(styles);

        // After all letters land, switch to final state
        setTimeout(() => {
          setPhase("landed");
        }, 600 + length * 80 + 150);
      });
    });
  }, [length]);

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
          setPhase("correct");

          // After flip completes, start flying
          setTimeout(() => startFlyAnimation(), 700);
          setTimeout(() => setShowConfetti(false), 3000);
        } else {
          setTileStates(Array(length).fill("wrong"));
          const newGuesses = [
            ...previousGuesses,
            currentGuess.toUpperCase(),
          ];
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
    [currentGuess, day, length, previousGuesses, solved, startFlyAnimation]
  );

  const displayLetters = solved ? currentGuess || "     " : currentGuess;
  const answerSpan = findAnswerSpan(completedSentence, length, clue);

  // Completed sentence with individual letter spans as fly targets
  const renderSentenceWithTargets = () => {
    if (!answerSpan) return <span>{completedSentence}</span>;

    const before = completedSentence.slice(0, answerSpan.start);
    const middle = completedSentence.slice(answerSpan.start, answerSpan.end);
    const after = completedSentence.slice(answerSpan.end);

    let letterIdx = 0;
    const middleElements = middle.split("").map((char, i) => {
      if (char === " ") {
        return <span key={`sp-${i}`}> </span>;
      }
      const idx = letterIdx;
      letterIdx++;
      const isLanded = phase === "landed";
      return (
        <span
          key={`l-${i}`}
          ref={(el) => {
            targetRefs.current[idx] = el;
          }}
          className={isLanded && !alreadySolved ? "letter-land" : ""}
          style={{
            display: "inline-block",
            color: "var(--accent)",
            fontWeight: 700,
            animationDelay:
              isLanded && !alreadySolved ? `${idx * 80}ms` : undefined,
          }}
        >
          {char}
        </span>
      );
    });

    return (
      <>
        <span>{before}</span>
        <span>{middleElements}</span>
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

  const showTiles =
    phase === "playing" || phase === "correct" || phase === "flying";
  const showSentenceText = phase === "flying" || phase === "landed";

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

      {/* Clue / Completed Sentence */}
      <div
        className="text-lg sm:text-xl text-center leading-relaxed max-w-lg px-4"
        style={{
          fontFamily: "'Libre Franklin', sans-serif",
          color: "var(--text)",
          minHeight: "3em",
        }}
      >
        {showSentenceText ? (
          <span
            className={
              phase === "landed" && !alreadySolved ? "sentence-reveal" : ""
            }
          >
            {renderSentenceWithTargets()}
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

      {/* Tiles — visible while playing, during flip, and during fly */}
      {showTiles && (
        <div
          className="relative flex gap-2 animate-fade-in-up"
          style={{ animationDelay: "100ms" }}
        >
          {Array.from({ length }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                tileRefs.current[i] = el;
              }}
              style={phase === "flying" && flyStyles[i] ? flyStyles[i] : {}}
            >
              <Tile
                index={i}
                letter={displayLetters[i] || ""}
                state={tileStates[i]}
                animationDelay={tileStates[i] === "correct" ? i * 100 : 0}
              />
            </div>
          ))}
          {showConfetti && <Confetti />}
        </div>
      )}

      {/* Solved tiles — always shown in landed state */}
      {phase === "landed" && (
        <div
          className={`flex gap-2 ${alreadySolved ? "" : "animate-fade-in-up"}`}
          style={{ animationDelay: alreadySolved ? "0ms" : "100ms" }}
        >
          {Array.from({ length }).map((_, i) => (
            <Tile
              key={i}
              index={i}
              letter={displayLetters[i] || ""}
              state="solved"
              animationDelay={0}
            />
          ))}
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
      {phase === "landed" && (
        <div
          className={`text-center ${alreadySolved ? "" : "animate-fade-in-up"}`}
          style={{ animationDelay: alreadySolved ? "0ms" : "300ms" }}
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
