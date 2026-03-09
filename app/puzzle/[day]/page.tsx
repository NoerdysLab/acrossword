import { getTodayDay, getPublicPuzzle } from "@/lib/puzzles";
import { PLAYABLE_WINDOW } from "@/lib/constants";
import GameBoard from "@/components/GameBoard";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PuzzlePageProps {
  params: Promise<{ day: string }>;
}

export default async function PuzzlePage({ params }: PuzzlePageProps) {
  const { day: dayParam } = await params;
  const day = parseInt(dayParam, 10);
  const todayDay = getTodayDay();

  if (isNaN(day) || day < 1 || day > todayDay) {
    return (
      <div className="flex flex-col items-center gap-4 pt-12">
        <p style={{ color: "var(--text-secondary)" }}>Puzzle not found.</p>
        <Link href="/archive" style={{ color: "var(--accent)" }}>
          View Archive
        </Link>
      </div>
    );
  }

  // Check if within playable window
  if (day < todayDay - PLAYABLE_WINDOW) {
    return (
      <div className="flex flex-col items-center gap-4 pt-12">
        <div className="text-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="mx-auto mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="font-semibold" style={{ color: "var(--text)" }}>
            Puzzle #{day} is locked
          </p>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Only today&apos;s puzzle and the previous {PLAYABLE_WINDOW} days are
            playable.
          </p>
        </div>
        <Link href="/archive" style={{ color: "var(--accent)" }}>
          View Archive
        </Link>
      </div>
    );
  }

  // Redirect to home if it's today's puzzle
  if (day === todayDay) {
    return (
      <div className="flex flex-col items-center gap-4 pt-4">
        <GameBoard
          day={day}
          clue={getPublicPuzzle(day)!.clue}
          length={getPublicPuzzle(day)!.length}
        />
      </div>
    );
  }

  const puzzle = getPublicPuzzle(day);
  if (!puzzle) {
    return (
      <div className="flex flex-col items-center gap-4 pt-12">
        <p style={{ color: "var(--text-secondary)" }}>Puzzle not found.</p>
        <Link href="/archive" style={{ color: "var(--accent)" }}>
          View Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-4">
      <GameBoard day={puzzle.day} clue={puzzle.clue} length={puzzle.length} />
    </div>
  );
}
