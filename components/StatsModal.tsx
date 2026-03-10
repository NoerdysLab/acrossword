"use client";

import { useEffect, useState } from "react";
import { getStats, type Stats } from "@/lib/storage";

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
}

export default function StatsModal({ open, onClose }: StatsModalProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (open) {
      setStats(getStats());
    }
  }, [open]);

  if (!open || !stats) return null;

  const maxGuesses = Math.max(
    ...Object.values(stats.guessDistribution),
    1
  );

  const buckets = ["1", "2", "3", "4", "5+"];

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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Statistics</h2>
          <button onClick={onClose} className="p-1" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <div className="text-3xl font-bold">{stats.totalSolved}</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Solved</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.currentStreak}</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Current Streak</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{stats.maxStreak}</div>
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>Max Streak</div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--text-secondary)" }}>
            Guess Distribution
          </h3>
          <div className="space-y-2">
            {buckets.map((bucket) => {
              const count = stats.guessDistribution[bucket] || 0;
              const width = maxGuesses > 0 ? Math.max((count / maxGuesses) * 90, 8) : 8;
              return (
                <div key={bucket} className="flex items-center gap-2">
                  <span className="text-sm w-5 text-right">{bucket}</span>
                  <div
                    className="h-6 rounded flex items-center justify-end px-2 text-xs font-bold text-white transition-all"
                    style={{
                      width: `${width}%`,
                      backgroundColor: count > 0 ? "var(--accent)" : "var(--tile-border)",
                      minWidth: "24px",
                    }}
                  >
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
