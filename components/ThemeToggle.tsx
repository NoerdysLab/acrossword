"use client";

import { useEffect, useState } from "react";
import { setTheme as saveTheme } from "@/lib/storage";

type Theme = "light" | "dark";

export default function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    setThemeState(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setThemeState(next);
    saveTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const dark = theme === "dark";
  const icon = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ visibility: theme ? "visible" : "hidden" }}
    >
      <span className="relative block" style={{ width: 22, height: 22 }} aria-hidden="true">
        <svg {...icon} className={`theme-icon${dark ? "" : " theme-icon--out"}`}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
        </svg>
        <svg {...icon} className={`theme-icon${dark ? " theme-icon--out" : ""}`}>
          <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.6 6.6 0 0 0 10.7 10.7z" />
        </svg>
      </span>
    </button>
  );
}
