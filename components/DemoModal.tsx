"use client";

import { useState, useEffect } from "react";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

// LIGHT vs ORBIT: only T (position 4) matches
const WRONG_GUESS = "LIGHT";
const ANSWER = "ORBIT";

function MiniTile({
  letter,
  state,
  delay = 0,
}: {
  letter: string;
  state: "empty" | "wrong" | "correct-lock" | "correct";
  delay?: number;
}) {
  let borderColor = "var(--tile-border)";
  let bgColor = "var(--tile-bg)";
  let textColor = "var(--text)";
  let animation = "";

  if (state === "wrong") {
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

type Phase = "clue" | "wrong" | "locked" | "solved";

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [phase, setPhase] = useState<Phase>("clue");

  useEffect(() => {
    if (!open) {
      setPhase("clue");
      return;
    }

    // Animate through phases
    const t1 = setTimeout(() => setPhase("wrong"), 600);
    const t2 = setTimeout(() => setPhase("locked"), 1200);
    const t3 = setTimeout(() => setPhase("solved"), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [open]);

  if (!open) return null;

  const renderTiles = () => {
    switch (phase) {
      case "clue":
        return ANSWER.split("").map((_, i) => (
          <MiniTile key={i} letter="" state="empty" />
        ));
      case "wrong":
        // Show LIGHT, all shake (T matches but we show the shake first)
        return WRONG_GUESS.split("").map((l, i) => (
          <MiniTile key={i} letter={l} state="wrong" />
        ));
      case "locked":
        // T locked at position 4, rest empty
        return ANSWER.split("").map((_, i) => (
          <MiniTile
            key={i}
            letter={i === 4 ? "T" : ""}
            state={i === 4 ? "correct-lock" : "empty"}
            delay={i === 4 ? 0 : 0}
          />
        ));
      case "solved":
        // All ORBIT letters flip green
        return ANSWER.split("").map((l, i) => (
          <MiniTile key={i} letter={l} state="correct" delay={i * 100} />
        ));
    }
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
            <p className="text-base text-center" style={{ fontFamily: "'Libre Franklin', sans-serif", color: "var(--text)" }}>
              Path f<span style={{ color: "var(--accent)", fontWeight: 700 }}>_ _ _ _ _</span>s of space debris
            </p>
            <div className="flex gap-1.5 justify-center">
              {renderTiles()}
            </div>
            <p className="text-xs text-center">
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
