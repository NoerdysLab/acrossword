import { NextRequest, NextResponse } from "next/server";
import { getPublicPuzzle, getTodayDay } from "@/lib/puzzles";

export async function GET(request: NextRequest) {
  const dayParam = request.nextUrl.searchParams.get("day");
  const day = dayParam ? parseInt(dayParam, 10) : getTodayDay();

  if (isNaN(day) || day < 1) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  const todayDay = getTodayDay();
  if (day > todayDay) {
    return NextResponse.json({ error: "Puzzle not yet available" }, { status: 404 });
  }

  const puzzle = getPublicPuzzle(day);
  if (!puzzle) {
    return NextResponse.json({ error: "Puzzle not found" }, { status: 404 });
  }

  return NextResponse.json(puzzle);
}
