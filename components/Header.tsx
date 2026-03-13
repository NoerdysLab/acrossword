"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import StatsModal from "./StatsModal";
import DemoModal from "./DemoModal";

export default function Header() {
  const [statsOpen, setStatsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLElement | null)[]>([]);

  // Mouse-tracking glare
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = glassRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }, []);

  // Sliding pill position
  const updatePill = useCallback(() => {
    const container = navRef.current;
    const pill = pillRef.current;
    const btn = btnRefs.current[activeIndex];
    if (!container || !pill || !btn) return;
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    pill.style.width = `${btnRect.width}px`;
    pill.style.transform = `translateX(${btnRect.left - containerRect.left}px)`;
  }, [activeIndex]);

  useEffect(() => {
    updatePill();
    window.addEventListener("resize", updatePill);
    return () => window.removeEventListener("resize", updatePill);
  }, [updatePill]);

  // Re-measure after fonts load
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => updatePill());
    }
  }, [updatePill]);

  const navItems = [
    {
      label: "Home",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      href: "/",
      onClick: undefined,
    },
    {
      label: "Archive",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      href: "/archive",
      onClick: undefined,
    },
    {
      label: "Stats",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      href: undefined,
      onClick: () => setStatsOpen(true),
    },
    {
      label: "Help",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
      href: undefined,
      onClick: () => setHelpOpen(true),
    },
  ];

  return (
    <>
      <nav
        ref={glassRef}
        className="glass-nav"
        onMouseMove={handleMouseMove}
        style={{
          "--mx": "50%",
          "--my": "50%",
        } as React.CSSProperties}
      >
        {/* Specular highlight */}
        <div className="glass-specular" />
        {/* Mouse-tracking glare */}
        <div className="glass-glare" />

        <div className="glass-nav-inner" ref={navRef}>
          {/* Sliding active pill */}
          <div ref={pillRef} className="glass-pill" />

          {navItems.map((item, i) => {
            const isLink = !!item.href;
            const Tag = isLink ? Link : "button";
            const props: Record<string, unknown> = {
              key: item.label,
              ref: (el: HTMLElement | null) => { btnRefs.current[i] = el; },
              className: `glass-nav-btn ${activeIndex === i ? "active" : ""}`,
              onClick: () => {
                setActiveIndex(i);
                item.onClick?.();
              },
              "aria-label": item.label,
            };
            if (isLink) props.href = item.href;

            return (
              <Tag {...(props as any)}>
                {item.icon}
                <span className="glass-nav-label">{item.label}</span>
              </Tag>
            );
          })}

          {/* Divider */}
          <div className="glass-divider" />

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </nav>

      <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} />
      <DemoModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
