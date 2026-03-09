"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import StatsModal from "./StatsModal";
import HowToPlay from "./HowToPlay";

export default function Header() {
  const [statsOpen, setStatsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b w-full"
        style={{
          backgroundColor: "var(--bg)",
          borderColor: "var(--header-border)",
          transition: "background-color 0.3s ease",
        }}
      >
        <div className="w-full max-w-2xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="no-underline">
            <h1
              className="text-xl tracking-tight"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                color: "var(--text)",
                fontWeight: 700,
              }}
            >
              <span style={{ fontVariant: "small-caps", fontSize: "1.1em", letterSpacing: "0.02em" }}>across</span>word
            </h1>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/archive"
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text)" }}
              aria-label="Archive"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </Link>

            <button
              onClick={() => setStatsOpen(true)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text)" }}
              aria-label="Statistics"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            </button>

            <button
              onClick={() => setHelpOpen(true)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text)" }}
              aria-label="How to play"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </header>

      <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} />
      <HowToPlay open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
