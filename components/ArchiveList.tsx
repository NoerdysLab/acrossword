"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSolvedData, type SolvedEntry } from "@/lib/storage";
import { PLAYABLE_WINDOW } from "@/lib/constants";

interface ArchiveListProps {
  todayDay: number;
  puzzles: { day: number; clue: string; length: number }[];
}

export default function ArchiveList({ todayDay, puzzles }: ArchiveListProps) {
  const [solvedData, setSolvedData] = useState<Record<string, SolvedEntry>>({});

  useEffect(() => {
    setSolvedData(getSolvedData());
  }, []);

  const isPlayable = (day: number) => day >= todayDay - PLAYABLE_WINDOW && day <= todayDay;

  return (
    <div className="w-full space-y-3">
      {puzzles
        .sort((a, b) => b.day - a.day)
        .map((puzzle) => {
          const playable = isPlayable(puzzle.day);
          const entry = solvedData[String(puzzle.day)];
          const isSolved = entry?.solved;

          const content = (
            <div
              className={`rounded-xl px-5 py-4 transition-all ${
                playable ? "cursor-pointer hover:scale-[1.01]" : ""
              }`}
              style={{
                backgroundColor: "var(--bg-secondary)",
                opacity: playable ? 1 : 0.5,
                borderLeft: isSolved
                  ? "3px solid var(--accent)"
                  : "3px solid transparent",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold" style={{ color: "var(--text)" }}>
                  Day {puzzle.day}
                  {puzzle.day === todayDay && (
                    <span
                      className="ml-2 text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: "var(--accent)",
                        color: "#fff",
                      }}
                    >
                      Today
                    </span>
                  )}
                </span>
                <span className="text-sm">
                  {isSolved ? (
                    <span style={{ color: "var(--accent)" }}>&#10003;</span>
                  ) : !playable ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  ) : (
                    <span style={{ color: "var(--text-secondary)" }}>&mdash;</span>
                  )}
                </span>
              </div>
              <p
                className="text-sm truncate"
                style={{ color: "var(--text-secondary)" }}
              >
                {puzzle.clue}
              </p>
            </div>
          );

          if (playable) {
            return (
              <Link
                key={puzzle.day}
                href={puzzle.day === todayDay ? "/" : `/puzzle/${puzzle.day}`}
                className="block no-underline hover:opacity-80 transition-opacity"
              >
                {content}
              </Link>
            );
          }

          return <div key={puzzle.day}>{content}</div>;
        })}
    </div>
  );
}
