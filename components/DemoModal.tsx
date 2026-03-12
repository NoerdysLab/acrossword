"use client";

import { useState, useEffect } from "react";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

// LIGHT vs ORBIT: only T (position 4) matches
const WRONG_GUESS = "LIGHT";
const ANSWER = "ORBIT";
const CLUE_BEFORE = "Path f";
const CLUE_AFTER = "s of space debris";
const COMPLETED_SENTENCE = "Path forbits of space debris";

function MiniTile({
  letter,
  state,
  delay = 0,
}: {
  letter: string;
  state: "empty" | "typing" | "wrong" | "correct-lock" | "correct";
  delay?: number;
}) {
  let borderColor = "var(--tile-border)";
  let bgColor = "var(--tile-bg)";
  let textColor = "var(--text)";
  let animation = "";

  if (state === "typing") {
    animation = "animate-pop";
    borderColor = "var(--text-secondary)";
  } else if (state === "wrong") {
    animation = "animate-shake";
    borderColor = "#ef4444";
  } else if (state === "correct-lock") {
    animation = "animate-flip";
    bgColor = "var(--accent)";
    borderColor = "var(--accent)";
    textColor = "#ffffff";
  } else if (state === "correct") {
    animation = "animate-flip";
    bgColor = "var(--accent)";
    borderColor = "var(--accent)";
    textColor = "#ffffff";
  }

  return (
    <div
      className={`inline-flex items-center justify-center border-2 rounded-lg text-lg font-bold select-none ${animation}`}
      style={{
        width: "2.75rem",
        height: "2.75rem",
        borderColor,
        backgroundColor: bgColor,
        color: textColor,
        transition: "background-color 0.3s, border-color 0.3s",
        animationDelay: `${delay}ms`,
        animationFillMode: "both",
      }}
    >
      {letter}
    </div>
  );
}

type Phase =
  | "clue"
  | { type: "typing-wrong"; count: number }
  | "wrong"
  | "locked"
  | { type: "typing-correct"; count: number }
  | "solved"
  | "reveal";

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [phase, setPhase] = useState<Phase>("clue");

  useEffect(() => {
    if (!open) {
      setPhase("clue");
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    let t = 1500; // initial pause

    // Type LIGHT one letter at a time
    for (let i = 1; i <= 5; i++) {
      const count = i;
      timers.push(setTimeout(() => setPhase({ type: "typing-wrong", count }), t));
      t += 400;
    }

    // Shake (wrong)
    t += 600;
    timers.push(setTimeout(() => setPhase("wrong"), t));

    // Lock T at position 4
    t += 1500;
    timers.push(setTimeout(() => setPhase("locked"), t));

    // Type ORBIT: O, R, B, I into unlocked slots (T already locked)
    t += 1200;
    for (let i = 1; i <= 4; i++) {
      const count = i;
      timers.push(setTimeout(() => setPhase({ type: "typing-correct", count }), t));
      t += 400;
    }

    // Solved — all flip green
    t += 800;
    timers.push(setTimeout(() => setPhase("solved"), t));

    // Reveal — letters animate into the clue
    t += 1500;
    timers.push(setTimeout(() => setPhase("reveal"), t));

    return () => timers.forEach(clearTimeout);
  }, [open]);

  if (!open) return null;

  const isReveal = phase === "reveal";

  const renderClue = () => {
    if (isReveal) {
      // Show the completed sentence with answer highlighted
      return (
        <p
          className="text-base text-center sentence-reveal"
          style={{ fontFamily: "'Libre Franklin', sans-serif", color: "var(--text)" }}
        >
          {CLUE_BEFORE}<span style={{ color: "var(--accent)", fontWeight: 700 }}>or bit</span>{CLUE_AFTER}
        </p>
      );
    }

    return (
      <p className="text-base text-center" style={{ fontFamily: "'Libre Franklin', sans-serif", color: "var(--text)" }}>
        {CLUE_BEFORE}<span style={{ color: "var(--accent)", fontWeight: 700 }}>_ _ _ _ _</span>{CLUE_AFTER}
      </p>
    );
  };

  const renderTiles = () => {
    if (isReveal) {
      // Keep tiles visible in solved green state
      return ANSWER.split("").map((l, i) => (
        <MiniTile key={i} letter={l} state="correct" delay={0} />
      ));
    }

    if (phase === "clue") {
      return ANSWER.split("").map((_, i) => (
        <MiniTile key={i} letter="" state="empty" />
      ));
    }

    if (typeof phase === "object" && phase.type === "typing-wrong") {
      return WRONG_GUESS.split("").map((l, i) => (
        <MiniTile
          key={i}
          letter={i < phase.count ? l : ""}
          state={i < phase.count ? "typing" : "empty"}
        />
      ));
    }

    if (phase === "wrong") {
      return WRONG_GUESS.split("").map((l, i) => (
        <MiniTile key={i} letter={l} state="wrong" />
      ));
    }

    if (phase === "locked") {
      return ANSWER.split("").map((_, i) => (
        <MiniTile
          key={i}
          letter={i === 4 ? "T" : ""}
          state={i === 4 ? "correct-lock" : "empty"}
        />
      ));
    }

    if (typeof phase === "object" && phase.type === "typing-correct") {
      // Unlocked positions are 0,1,2,3 — T is locked at position 4
      // The letters to type are O, R, B, I
      const typingLetters = ["O", "R", "B", "I"];
      return ANSWER.split("").map((_, i) => {
        if (i === 4) {
          return <MiniTile key={i} letter="T" state="correct-lock" delay={0} />;
        }
        // i maps to typingLetters index (0→0, 1→1, 2→2, 3→3)
        if (i < phase.count) {
          return <MiniTile key={i} letter={typingLetters[i]} state="typing" />;
        }
        return <MiniTile key={i} letter="" state="empty" />;
      });
    }

    if (phase === "solved") {
      return ANSWER.split("").map((l, i) => (
        <MiniTile key={i} letter={l} state="correct" delay={i * 100} />
      ));
    }

    return null;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "var(--overlay)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 sm:p-8 w-full animate-fade-in-up"
        style={{ backgroundColor: "var(--modal-bg)", color: "var(--text)", maxWidth: "480px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4">How to Play</h2>

        <div className="space-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
          <p>
            Find the <strong style={{ color: "var(--text)" }}>5-letter word</strong> hidden across word boundaries in the clue.
          </p>

          <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: "var(--bg-secondary)" }}>
            {renderClue()}
            <div className="flex gap-1.5 justify-center">
              {renderTiles()}
            </div>
            <p className="text-xs text-center" style={{ opacity: isReveal ? 1 : 0.6, transition: "opacity 0.5s" }}>
              The answer is <strong style={{ color: "var(--accent)" }}>ORBIT</strong> — hidden in &quot;f<strong style={{ color: "var(--accent)" }}>or bit</strong>s&quot;
            </p>
          </div>

          <p>
            Letters in the <strong style={{ color: "var(--text)" }}>correct position</strong> lock in green after each guess. A new puzzle drops daily at midnight ET.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-lg text-base font-semibold transition-colors"
          style={{
            backgroundColor: "var(--accent)",
            color: "#ffffff",
          }}
        >
          Play
        </button>
      </div>
    </div>
  );
}
