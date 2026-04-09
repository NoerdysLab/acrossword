import puzzlesData from "@/data/puzzles.json";
import { START_DATE } from "./constants";

export interface Puzzle {
  day: number;
  clue: string;
  answer: string;
  completedSentence: string;
  length: number;
}

export interface PublicPuzzle {
  day: number;
  clue: string;
  completedSentence: string;
  length: number;
}

export function getTodayDay(): number {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const start = new Date(START_DATE + "T00:00:00");
  const diff = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff + 1;
}

export function getPuzzle(day: number): Puzzle | undefined {
  const puzzles = puzzlesData as Puzzle[];
  if (puzzles.length === 0) return undefined;
  // Loop back to the beginning when we run out of puzzles
  const idx = ((day - 1) % puzzles.length + puzzles.length) % puzzles.length;
  return { ...puzzles[idx], day };
}

export function getPublicPuzzle(day: number): PublicPuzzle | undefined {
  const puzzle = getPuzzle(day);
  if (!puzzle) return undefined;
  return {
    day: puzzle.day,
    clue: puzzle.clue,
    completedSentence: puzzle.completedSentence,
    length: puzzle.length,
  };
}

export function getAllPublicPuzzles(upToDay: number): PublicPuzzle[] {
  const result: PublicPuzzle[] = [];
  for (let d = 1; d <= upToDay; d++) {
    const p = getPublicPuzzle(d);
    if (p) result.push(p);
  }
  return result;
}

export function checkAnswer(day: number, guess: string): boolean {
  const puzzle = getPuzzle(day);
  if (!puzzle) return false;
  return guess.toUpperCase().trim() === puzzle.answer.toUpperCase();
}
