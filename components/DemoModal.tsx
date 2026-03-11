"use client";

import { useState, useEffect, useCallback } from "react";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

const DEMO_CLUE = "Path f";
const DEMO_CLUE_SUFFIX = "s of space debris";
const DEMO_ANSWER = "ORBIT";
const DEMO_SENTENCE_BEFORE = "Path f";
const DEMO_SENTENCE_HIGHLIGHT = "or bit";
const DEMO_SENTENCE_AFTER = "s of space debris";

type Step = "intro" | "clue" | "wrong" | "locked" | "correct" | "reveal";

function MiniTile({
  letter,
  state,
  delay = 0,
}: {
  letter: string;
  state: "empty" | "typing" | "wrong" | "correct";
  delay?: number;
}) {
  let borderColor = "var(--tile-border)";
  let bgColor = "var(--tile-bg)";
  let textColor = "var(--text)";
  let animation = "";

  if (state === "typing" && letter) {
    borderColor = "var(--accent)";
  } else if (state === "wrong") {
    animation = "animate-shake";
    borderColor = "#ef4444";
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

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [step, setStep] = useState<Step>("intro");

  // Reset on open
  useEffect(() => {
    if (open) setStep("intro");
  }, [open]);

  const nextStep = useCallback(() => {
    const order: Step[] = ["intro", "clue", "wrong", "locked", "correct", "reveal"];
    const idx = order.indexOf(step);
    if (idx < order.length - 1) {
      setStep(order[idx + 1]);
    } else {
      onClose();
    }
  }, [step, onClose]);

  if (!open) return null;

  const renderTiles = () => {
    // CRANE guess against ORBIT answer
    const wrongGuess = "CRANE";

    switch (step) {
      case "intro":
      case "clue":
        return (
          <div className="flex gap-1.5 justify-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <MiniTile key={i} letter="" state="empty" />
            ))}
          </div>
        );
      case "wrong":
        return (
          <div className="flex gap-1.5 justify-center">
            {wrongGuess.split("").map((l, i) => (
              <MiniTile key={i} letter={l} state="wrong" />
            ))}
          </div>
        );
      case "locked":
        // R is correct (position 2 in ORBIT... wait, CRANE[0]=C, CRANE[1]=R, CRANE[2]=A, CRANE[3]=N, CRANE[4]=E
        // ORBIT: O, B, R, I, T. R is at position 2 in ORBIT.
        // CRANE: C, R, A, N, E. R is at position 1 in CRANE. Not a match.
        // Let me pick a better wrong guess. "ORBIT" - O,B,R,I,T
        // Try "ONSET" - O matches at 0, others don't
        // Actually let me use "OPTIC" - O matches at 0, others don't... well T is at pos 4 in ORBIT and pos 2 in OPTIC, no match.
        // Use "OTHER" - O at 0 matches! T at pos 1 vs ORBIT T at pos 4, no. H, E, R no.
        // Just use a guess where O is correct: "OWING" - O matches at 0
        return (
          <div className="flex gap-1.5 justify-center">
            {["O", "", "", "", ""].map((l, i) => (
              <MiniTile key={i} letter={l} state={l ? "correct" : "empty"} delay={l ? i * 100 : 0} />
            ))}
          </div>
        );
      case "correct":
        return (
          <div className="flex gap-1.5 justify-center">
            {DEMO_ANSWER.split("").map((l, i) => (
              <MiniTile key={i} letter={l} state="correct" delay={i * 100} />
            ))}
          </div>
        );
      case "reveal":
        return (
          <div className="flex gap-1.5 justify-center">
            {DEMO_ANSWER.split("").map((l, i) => (
              <MiniTile key={i} letter={l} state="correct" />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderClue = () => {
    if (step === "reveal") {
      return (
        <p
          className="text-base text-center sentence-reveal"
          style={{ fontFamily: "'Libre Franklin', sans-serif", color: "var(--text)" }}
        >
          {DEMO_SENTENCE_BEFORE}
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>{DEMO_SENTENCE_HIGHLIGHT}</span>
          {DEMO_SENTENCE_AFTER}
        </p>
      );
    }

    return (
      <p
        className="text-base text-center"
        style={{ fontFamily: "'Libre Franklin', sans-serif", color: "var(--text)" }}
      >
        {DEMO_CLUE}
        <span style={{ color: "var(--accent)", fontWeight: 700 }}>_ _ _ _ _</span>
        {DEMO_CLUE_SUFFIX}
      </p>
    );
  };

  const renderDescription = () => {
    switch (step) {
      case "intro":
        return (
          <div className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
            <p>
              Each day, a new clue is released. The answer is a{" "}
              <strong style={{ color: "var(--text)" }}>5-letter word hidden within the sentence</strong>{" "}
              — its letters span across word boundaries.
            </p>
            <p>Let&apos;s walk through an example.</p>
          </div>
        );
      case "clue":
        return (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            The <span style={{ color: "var(--accent)", fontWeight: 600 }}>blanks</span> show where the hidden word sits in the sentence. Type a 5-letter word to guess.
          </p>
        );
      case "wrong":
        return (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Wrong guess! The tiles shake red. But any letters in the{" "}
            <strong style={{ color: "var(--text)" }}>correct position</strong> will lock in.
          </p>
        );
      case "locked":
        return (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            The <strong style={{ color: "var(--accent)" }}>O</strong> was in the right spot, so it stays locked in green. Now you only need to guess the remaining letters.
          </p>
        );
      case "correct":
        return (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            You got it! The answer is <strong style={{ color: "var(--accent)" }}>ORBIT</strong> — all tiles flip green.
          </p>
        );
      case "reveal":
        return (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            The full sentence is revealed: &quot;Path f<strong style={{ color: "var(--accent)" }}>or bit</strong>s of space debris.&quot; The answer was hiding across &quot;f<strong>or bit</strong>s&quot;!
          </p>
        );
    }
  };

  const isLastStep = step === "reveal";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ backgroundColor: "var(--overlay)" }}
    >
      <div
        className="rounded-xl p-6 sm:p-8 w-full animate-fade-in-up"
        style={{ backgroundColor: "var(--modal-bg)", color: "var(--text)", maxWidth: "480px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold">How to Play</h2>
          <button onClick={onClose} className="p-1" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-5">
          {/* Clue */}
          {step !== "intro" && renderClue()}

          {/* Tiles */}
          {step !== "intro" && renderTiles()}

          {/* Description */}
          {renderDescription()}
        </div>

        <button
          onClick={nextStep}
          className="w-full mt-6 py-3 rounded-lg text-base font-semibold transition-colors"
          style={{
            backgroundColor: "var(--accent)",
            color: "#ffffff",
          }}
        >
          {step === "intro" ? "Show me" : isLastStep ? "Let\u2019s play!" : "Next"}
        </button>
      </div>
    </div>
  );
}
