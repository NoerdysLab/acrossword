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
        <div style={{ maxWidth: "42rem", marginLeft: "auto", marginRight: "auto", width: "100%", paddingLeft: "1.25rem", paddingRight: "1.25rem", height: "3.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="no-underline">
            <h1
              className="text-xl tracking-tight"
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                color: "var(--text)",
                fontWeight: 700,
              }}
            >
              <span style={{ letterSpacing: "0.02em" }}>ACROSS</span>word
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

            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSfI5c6NX5fZxPnIY5SHWYrnubzfISLBY8TVftSvGuoVALPC6A/viewform?usp=publish-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg transition-colors"
              style={{ color: "var(--text)" }}
              aria-label="Suggest a puzzle"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18h6" />
                <path d="M10 22h4" />
                <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
              </svg>
            </a>

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
