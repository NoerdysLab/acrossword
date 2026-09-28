import { getTodayDay, getPublicPuzzle } from "@/lib/puzzles";
import GameBoard from "@/components/GameBoard";

export const dynamic = "force-dynamic";

export default function Home() {
  const puzzle = getPublicPuzzle(getTodayDay());

  if (!puzzle) {
    return (
      <p style={{ paddingTop: "3rem", color: "var(--ink-2)" }}>
        No clue today. Check back tomorrow.
      </p>
    );
  }

  return (
    <GameBoard
      day={puzzle.day}
      clue={puzzle.clue}
      completedSentence={puzzle.completedSentence}
      length={puzzle.length}
    />
  );
}
