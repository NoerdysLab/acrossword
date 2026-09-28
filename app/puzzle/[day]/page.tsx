import Link from "next/link";
import { getTodayDay, getPublicPuzzle } from "@/lib/puzzles";
import { PLAYABLE_WINDOW } from "@/lib/constants";
import GameBoard from "@/components/GameBoard";

export const dynamic = "force-dynamic";

interface PuzzlePageProps {
  params: Promise<{ day: string }>;
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ paddingTop: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.01em" }}>{title}</h1>
      <p style={{ marginTop: "0.5rem", fontSize: "1rem", color: "var(--ink-2)" }}>{body}</p>
      <Link href="/archive" className="btn btn--line" style={{ marginTop: "1.5rem", textDecoration: "none" }}>
        Go to the archive
      </Link>
    </div>
  );
}

export default async function PuzzlePage({ params }: PuzzlePageProps) {
  const { day: dayParam } = await params;
  const day = parseInt(dayParam, 10);
  const todayDay = getTodayDay();
  const puzzle = !isNaN(day) && day >= 1 && day <= todayDay ? getPublicPuzzle(day) : undefined;

  if (!puzzle) {
    return <Notice title="Clue not found" body="That day doesn't have a clue yet." />;
  }

  if (day < todayDay - PLAYABLE_WINDOW) {
    return (
      <Notice
        title={`Day ${day} is locked`}
        body={`Only today's clue and the ${PLAYABLE_WINDOW} days before it can be played.`}
      />
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
