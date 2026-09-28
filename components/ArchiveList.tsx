"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSolvedData, type SolvedEntry } from "@/lib/storage";
import { PLAYABLE_WINDOW } from "@/lib/constants";
import { puzzleDateLabel } from "@/lib/dates";
import ClueLine from "./ClueLine";

const EMPTY_SLOTS = Array.from({ length: 5 }, () => ({ letter: "", state: "empty" as const }));

interface ArchiveListProps {
  todayDay: number;
  puzzles: { day: number; clue: string; length: number }[];
}

const icon = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export default function ArchiveList({ todayDay, puzzles }: ArchiveListProps) {
  const [solved, setSolved] = useState<Record<string, SolvedEntry>>({});

  useEffect(() => {
    setSolved(getSolvedData());
  }, []);

  return (
    <ul style={{ borderTop: "1px solid var(--rule)" }}>
      {[...puzzles]
        .sort((a, b) => b.day - a.day)
        .map((p) => {
          const playable = p.day >= todayDay - PLAYABLE_WINDOW && p.day <= todayDay;
          const isSolved = !!solved[String(p.day)]?.solved;
          const isToday = p.day === todayDay;

          const body = (
            <div className="flex items-center gap-4" style={{ padding: "0.875rem 0", minHeight: "4.5rem" }}>
              <div className="flex-1 min-w-0" style={{ color: playable ? "var(--ink)" : "var(--ink-3)" }}>
                <ClueLine size="sm" clue={p.clue} slots={EMPTY_SLOTS} />
                <p className="tabular" style={{ marginTop: "0.375rem", fontSize: "0.8125rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--ink-3)" }}>
                  Day {p.day} · {isToday ? <span style={{ color: "var(--ink)" }}>Today</span> : puzzleDateLabel(p.day)}
                </p>
              </div>
              <span className="flex items-center gap-1.5 shrink-0" style={{ fontSize: "0.875rem", fontWeight: 600, color: isSolved ? "var(--spot-ink)" : "var(--ink-3)" }}>
                {isSolved ? (
                  <>
                    <svg {...icon} strokeWidth={2}>
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    Solved
                  </>
                ) : playable ? (
                  <>
                    Play
                    <svg {...icon}>
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </>
                ) : (
                  <>
                    <svg {...icon}>
                      <rect x="5" y="11" width="14" height="9" rx="2" />
                      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                    </svg>
                    Locked
                  </>
                )}
              </span>
            </div>
          );

          return (
            <li key={p.day} style={{ borderBottom: "1px solid var(--rule)" }}>
              {playable ? (
                <Link href={isToday ? "/" : `/puzzle/${p.day}`} className="block archive-row" style={{ textDecoration: "none", color: "inherit" }}>
                  {body}
                </Link>
              ) : (
                body
              )}
            </li>
          );
        })}
    </ul>
  );
}
