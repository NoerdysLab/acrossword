"use client";

import { useEffect, useState } from "react";
import { formatCountdown, msUntilNextPuzzle } from "@/lib/dates";

export default function NextClue() {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setLabel(formatCountdown(msUntilNextPuzzle()));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  if (!label) return null;
  return (
    <p className="tabular" style={{ fontSize: "0.875rem", color: "var(--ink-3)" }}>
      Next clue in {label}
    </p>
  );
}
