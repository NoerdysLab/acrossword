import puzzlesData from "@/data/puzzles.json";
import { START_DATE } from "./constants";

export interface Puzzle {
  day: number;
  clue: string;
  answer: string;
  length: number;
}

export interface PublicPuzzle {
  day: number;
  clue: string;
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
  return (puzzlesData as Puzzle[]).find((p) => p.day === day);
}

export function getPublicPuzzle(day: number): PublicPuzzle | undefined {
  const puzzle = getPuzzle(day);
  if (!puzzle) return undefined;
  return { day: puzzle.day, clue: puzzle.clue, length: puzzle.length };
}

export function getAllPublicPuzzles(upToDay: number): PublicPuzzle[] {
  return (puzzlesData as Puzzle[])
    .filter((p) => p.day <= upToDay)
    .map((p) => ({ day: p.day, clue: p.clue, length: p.length }));
}

export function checkAnswer(day: number, guess: string): boolean {
  const puzzle = getPuzzle(day);
  if (!puzzle) return false;
  return guess.toUpperCase().trim() === puzzle.answer.toUpperCase();
}
