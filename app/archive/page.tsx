import { getTodayDay, getAllPublicPuzzles } from "@/lib/puzzles";
import { PLAYABLE_WINDOW } from "@/lib/constants";
import ArchiveList from "@/components/ArchiveList";

export const dynamic = "force-dynamic";

export default function ArchivePage() {
  const todayDay = getTodayDay();
  const puzzles = getAllPublicPuzzles(todayDay);

  return (
    <div className="flex flex-col w-full">
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "-0.015em" }}>Archive</h1>
      <p style={{ marginTop: "0.375rem", marginBottom: "1.25rem", fontSize: "0.9375rem", color: "var(--ink-2)" }}>
        Today&apos;s clue and the {PLAYABLE_WINDOW} before it are still playable.
      </p>
      <ArchiveList todayDay={todayDay} puzzles={puzzles} />
    </div>
  );
}
