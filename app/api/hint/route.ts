import { NextRequest, NextResponse } from "next/server";
import { getPuzzle } from "@/lib/puzzles";

export async function POST(request: NextRequest) {
  try {
    const { day, hint } = await request.json();

    if (typeof day !== "number" || (hint !== 1 && hint !== 2)) {
      return NextResponse.json(
        { error: "Invalid request. Expected { day: number, hint: 1 | 2 }" },
        { status: 400 }
      );
    }

    const puzzle = getPuzzle(day);
    if (!puzzle) {
      return NextResponse.json(
        { error: "Puzzle not found" },
        { status: 404 }
      );
    }

    // hint 1 = 1st letter (index 0), hint 2 = 2nd letter (index 1)
    const letter = puzzle.answer[hint - 1];
    if (!letter) {
      return NextResponse.json(
        { error: "Invalid hint index" },
        { status: 400 }
      );
    }

    return NextResponse.json({ letter: letter.toUpperCase() });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
