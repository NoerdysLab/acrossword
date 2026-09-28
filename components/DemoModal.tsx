"use client";

import { useEffect, useState } from "react";
import Dialog from "./Dialog";
import ClueLine, { type Slot } from "./ClueLine";
import Tile, { type SortAnim, type SortState } from "./Tile";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

// LIGHT vs ORBIT: only T (position 4) matches.
const WRONG = "LIGHT";
const ANSWER = "ORBIT";
const CLUE = "Path f_ _ _ _ _s of space debris";
const SENTENCE = "Path for bits of space debris";
const SPAN = { start: 6, end: 12 };

type Phase =
  | { k: "clue" }
  | { k: "typing-wrong"; n: number }
  | { k: "wrong" }
  | { k: "locked" }
  | { k: "typing-right"; n: number }
  | { k: "solved" }
  | { k: "reveal" };

type Sort = { letter: string; state: SortState; anim: SortAnim; delay: number };

function sortsFor(p: Phase): Sort[] {
  const blank = (): Sort => ({ letter: "", state: "empty", anim: "none", delay: 0 });
  const T: Sort = { letter: "T", state: "locked", anim: "none", delay: 0 };
  switch (p.k) {
    case "clue":
      return ANSWER.split("").map(() => blank());
    case "typing-wrong":
      return WRONG.split("").map((l, i) =>
        i < p.n ? { letter: l, state: "typed", anim: "set", delay: 0 } : blank()
      );
    case "wrong":
      return WRONG.split("").map((l) => ({ letter: l, state: "typed", anim: "shake", delay: 0 }));
    case "locked":
      return ANSWER.split("").map((_, i) => (i === 4 ? { ...T, anim: "press" } : blank()));
    case "typing-right":
      return ANSWER.split("").map((l, i) =>
        i === 4 ? T : i < p.n ? { letter: l, state: "typed", anim: "set", delay: 0 } : blank()
      );
    case "solved":
      return ANSWER.split("").map((l, i) => ({
        letter: l,
        state: "solved",
        anim: i < 4 ? "press" : "none",
        delay: i * 60,
      }));
    case "reveal":
      return ANSWER.split("").map((l) => ({ letter: l, state: "solved", anim: "none", delay: 0 }));
  }
}

function caption(p: Phase): string {
  switch (p.k) {
    case "clue":
    case "typing-wrong":
      return "Type a guess.";
    case "wrong":
      return "LIGHT isn't it…";
    case "locked":
      return "…but its T is in the right spot, so it locks in.";
    case "typing-right":
      return "Fill in the rest.";
    case "solved":
    case "reveal":
      return "ORBIT, hiding in “for bits”.";
  }
}

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [phase, setPhase] = useState<Phase>({ k: "clue" });

  useEffect(() => {
    if (!open) {
      setPhase({ k: "clue" });
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (t: number, p: Phase) => timers.push(setTimeout(() => setPhase(p), t));
    let t = 1500;
    for (let n = 1; n <= 5; n++, t += 400) at(t, { k: "typing-wrong", n });
    t += 600;
    at(t, { k: "wrong" });
    t += 1500;
    at(t, { k: "locked" });
    t += 1200;
    for (let n = 1; n <= 4; n++, t += 400) at(t, { k: "typing-right", n });
    t += 800;
    at(t, { k: "solved" });
    t += 1500;
    at(t, { k: "reveal" });
    return () => timers.forEach(clearTimeout);
  }, [open]);

  const sorts = sortsFor(phase);
  const slots: Slot[] = sorts.map((s) => ({
    letter: s.letter,
    state: s.state === "solved" ? "locked" : s.state,
  }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="How to play"
      footer={
        <button type="button" className="btn btn--ink w-full" style={{ marginTop: "1.25rem" }} onClick={onClose}>
          Play
        </button>
      }
    >
      <p style={{ fontSize: "1rem", lineHeight: 1.5, color: "var(--ink-2)" }}>
        Find the <strong style={{ color: "var(--ink)" }}>5-letter word</strong> hiding across the words of the clue.
      </p>

      <div
        aria-hidden="true"
        style={{
          marginTop: "1rem",
          padding: "1rem 0",
          borderTop: "1px solid var(--rule)",
          borderBottom: "1px solid var(--rule)",
        }}
      >
        <ClueLine
          size="sm"
          clue={CLUE}
          slots={slots}
          solved={phase.k === "reveal" ? { sentence: SENTENCE, ...SPAN } : null}
          animate
        />
        <div className="stick stick--sm" style={{ marginTop: "0.875rem" }}>
          {sorts.map((s, i) => (
            <Tile key={`${i}-${s.state}-${s.anim}`} letter={s.letter} state={s.state} anim={s.anim} delay={s.delay} />
          ))}
        </div>
        <p style={{ marginTop: "0.75rem", minHeight: "1.4em", fontSize: "0.875rem", color: "var(--ink-2)" }}>
          {caption(phase)}
        </p>
      </div>

      <p style={{ marginTop: "1rem", fontSize: "1rem", lineHeight: 1.5, color: "var(--ink-2)" }}>
        Letters in the right spot lock in teal. A new clue drops every day at midnight ET.
      </p>
    </Dialog>
  );
}
