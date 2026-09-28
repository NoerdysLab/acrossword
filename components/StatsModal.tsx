"use client";

import { useEffect, useState } from "react";
import Dialog from "./Dialog";
import { getStats, type Stats } from "@/lib/storage";

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
}

const BUCKETS = ["1", "2", "3", "4", "5+"];

export default function StatsModal({ open, onClose }: StatsModalProps) {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (open) setStats(getStats());
  }, [open]);

  const max = stats ? Math.max(...Object.values(stats.guessDistribution), 1) : 1;

  return (
    <Dialog open={open && !!stats} onClose={onClose} title="Statistics">
      {stats && (
        <>
          <dl className="grid grid-cols-3" style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)" }}>
            {[
              ["Solved", stats.totalSolved],
              ["Streak", stats.currentStreak],
              ["Best streak", stats.maxStreak],
            ].map(([label, value], i) => (
              <div key={label} style={{ padding: "0.875rem 0", paddingLeft: i ? "1rem" : 0, borderLeft: i ? "1px solid var(--rule)" : undefined }}>
                <dt style={{ fontSize: "0.8125rem", color: "var(--ink-3)" }}>{label}</dt>
                <dd className="tabular" style={{ fontSize: "1.75rem", fontWeight: 700, lineHeight: 1.2 }}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <h3 style={{ marginTop: "1.25rem", fontSize: "0.9375rem", fontWeight: 600 }}>Guesses per solve</h3>
          {stats.totalSolved === 0 ? (
            <p style={{ marginTop: "0.5rem", fontSize: "0.9375rem", color: "var(--ink-2)" }}>
              Solve today&apos;s clue to start your streak.
            </p>
          ) : (
            <ul style={{ marginTop: "0.625rem" }} className="flex flex-col gap-2">
              {BUCKETS.map((b) => {
                const count = stats.guessDistribution[b] || 0;
                return (
                  <li key={b} className="grid items-center tabular" style={{ gridTemplateColumns: "1.75rem 1fr 2rem", gap: "0.5rem", fontSize: "0.9375rem" }}>
                    <span style={{ color: "var(--ink-2)" }}>{b}</span>
                    <span style={{ height: 10, borderRadius: 2, background: "var(--rule)" }}>
                      <span
                        style={{
                          display: "block",
                          height: "100%",
                          borderRadius: 2,
                          background: "var(--ink-2)",
                          transformOrigin: "left center",
                          transform: `scaleX(${count / max})`,
                        }}
                      />
                    </span>
                    <span style={{ textAlign: "right", fontWeight: 600, color: count ? "var(--ink)" : "var(--ink-3)" }}>{count}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </Dialog>
  );
}
