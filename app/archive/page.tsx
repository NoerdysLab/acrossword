import { getTodayDay, getAllPublicPuzzles } from "@/lib/puzzles";
import ArchiveList from "@/components/ArchiveList";

export const dynamic = "force-dynamic";

export default function ArchivePage() {
  const todayDay = getTodayDay();
  const puzzles = getAllPublicPuzzles(todayDay);

  return (
    <div className="flex flex-col items-center gap-6">
      <h2
        className="text-lg font-bold"
        style={{ color: "var(--text)" }}
      >
        Archive
      </h2>
      <ArchiveList todayDay={todayDay} puzzles={puzzles} />
    </div>
  );
}
