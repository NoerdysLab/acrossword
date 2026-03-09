import { getTodayDay, getAllPublicPuzzles } from "@/lib/puzzles";
import ArchiveList from "@/components/ArchiveList";

export const dynamic = "force-dynamic";

export default function ArchivePage() {
  const todayDay = getTodayDay();
  const puzzles = getAllPublicPuzzles(todayDay);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--text)" }}
        >
          Archive
        </h2>
        <span
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          {puzzles.length} puzzle{puzzles.length !== 1 ? "s" : ""}
        </span>
      </div>
      <ArchiveList todayDay={todayDay} puzzles={puzzles} />
    </div>
  );
}
