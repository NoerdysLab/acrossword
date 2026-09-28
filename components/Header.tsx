"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import StatsModal from "./StatsModal";
import DemoModal from "./DemoModal";

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export default function Header() {
  const pathname = usePathname();
  const [statsOpen, setStatsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const homeRef = useRef<HTMLAnchorElement>(null);
  const archiveRef = useRef<HTMLAnchorElement>(null);
  const [rule, setRule] = useState<{ x: number; w: number } | null>(null);

  const current = pathname === "/archive" ? "archive" : "home";

  const measure = useCallback(() => {
    const bar = barRef.current;
    const el = current === "archive" ? archiveRef.current : homeRef.current;
    if (!bar || !el) return;
    const b = bar.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setRule({ x: r.left - b.left, w: r.width });
  }, [current]);

  useLayoutEffect(measure, [measure]);

  useEffect(() => {
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  return (
    <>
      <header style={{ borderBottom: "1px solid var(--rule)", background: "var(--paper)" }}>
        <div
          ref={barRef}
          className="relative flex items-center justify-between"
          style={{ maxWidth: "calc(var(--measure) + 2rem)", margin: "0 auto", padding: "0 1rem", height: "3.5rem" }}
        >
          <Link
            ref={homeRef}
            href="/"
            className="icon-btn"
            aria-current={current === "home" ? "page" : undefined}
            style={{ marginLeft: "-0.625rem", textDecoration: "none" }}
          >
            <span className="wordmark">
              <b>ACROSS</b>word
            </span>
          </Link>

          <nav aria-label="Main" className="flex items-center" style={{ marginRight: "-0.625rem" }}>
            <Link
              ref={archiveRef}
              href="/archive"
              className="icon-btn"
              aria-current={current === "archive" ? "page" : undefined}
              aria-label="Archive"
              title="Archive"
              style={{ textDecoration: "none" }}
            >
              <svg {...iconProps}>
                <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
                <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
                <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
                <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
              </svg>
            </Link>
            <button type="button" className="icon-btn" onClick={() => setStatsOpen(true)} aria-label="Statistics" title="Statistics">
              <svg {...iconProps}>
                <path d="M6 20v-6M12 20V4M18 20v-10" />
              </svg>
            </button>
            <button type="button" className="icon-btn" onClick={() => setHelpOpen(true)} aria-label="How to play" title="How to play">
              <svg {...iconProps}>
                <circle cx="12" cy="12" r="9" />
                <path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.3-2.4 2.3" />
                <path d="M12 16.6h.01" />
              </svg>
            </button>
            <span aria-hidden="true" style={{ width: 1, height: 20, background: "var(--rule)", margin: "0 0.25rem" }} />
            <ThemeToggle />
          </nav>

          {rule && (
            <span
              aria-hidden="true"
              className="nav-rule"
              style={{ transform: `translateX(${rule.x + 10}px) scaleX(${rule.w - 20})` }}
            />
          )}
        </div>
      </header>

      <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} />
      <DemoModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
