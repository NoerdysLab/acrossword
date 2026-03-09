import { getTodayDay, getPublicPuzzle } from "@/lib/puzzles";
import GameBoard from "@/components/GameBoard";

export const dynamic = "force-dynamic";

export default function Home() {
  const todayDay = getTodayDay();
  const puzzle = getPublicPuzzle(todayDay);

  if (!puzzle) {
    return (
      <div className="flex flex-col items-center gap-4 pt-12">
        <p style={{ color: "var(--text-secondary)" }}>
          No puzzle available today. Check back tomorrow!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <GameBoard day={puzzle.day} clue={puzzle.clue} completedSentence={puzzle.completedSentence} length={puzzle.length} />
    </div>
  );
}
