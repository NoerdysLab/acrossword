"use client";

export interface SolvedEntry {
  solved: boolean;
  guesses: number;
  date: string;
  answer?: string;
  hintsUsed?: number;
  timeMs?: number | null;
}

export interface Stats {
  currentStreak: number;
  maxStreak: number;
  totalSolved: number;
  guessDistribution: Record<string, number>;
}

export interface CurrentGame {
  day: number;
  guesses: string[];
  hintsUsed?: number;
  hintsRevealed?: string[];
  startTime?: number | null;
}

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

function setItem(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSolvedData(): Record<string, SolvedEntry> {
  return getItem("acrossword-solved") || {};
}

export function setSolvedData(data: Record<string, SolvedEntry>) {
  setItem("acrossword-solved", data);
}

export function getStats(): Stats {
  return (
    getItem("acrossword-stats") || {
      currentStreak: 0,
      maxStreak: 0,
      totalSolved: 0,
      guessDistribution: {},
    }
  );
}

export function setStats(stats: Stats) {
  setItem("acrossword-stats", stats);
}

export function getCurrentGame(): CurrentGame | null {
  return getItem("acrossword-current");
}

export function setCurrentGame(game: CurrentGame | null) {
  if (game === null) {
    if (typeof window !== "undefined")
      localStorage.removeItem("acrossword-current");
    return;
  }
  setItem("acrossword-current", game);
}

export function getTheme(): "light" | "dark" | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("acrossword-theme") as "light" | "dark" | null;
}

export function setTheme(theme: "light" | "dark") {
  if (typeof window === "undefined") return;
  localStorage.setItem("acrossword-theme", theme);
}

export function markSolved(day: number, guessCount: number, answer: string, hintsUsed?: number, timeMs?: number | null) {
  const solved = getSolvedData();
  solved[String(day)] = {
    solved: true,
    guesses: guessCount,
    date: new Date().toISOString(),
    answer: answer.toUpperCase(),
    hintsUsed: hintsUsed ?? 0,
    timeMs: timeMs ?? null,
  };
  setSolvedData(solved);

  const stats = getStats();
  stats.totalSolved += 1;
  const bucket = guessCount >= 5 ? "5+" : String(guessCount);
  stats.guessDistribution[bucket] =
    (stats.guessDistribution[bucket] || 0) + 1;

  // Calculate streak
  stats.currentStreak += 1;
  if (stats.currentStreak > stats.maxStreak) {
    stats.maxStreak = stats.currentStreak;
  }
  setStats(stats);
}
