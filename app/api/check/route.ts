import { NextRequest, NextResponse } from "next/server";
import { checkAnswer } from "@/lib/puzzles";

export async function POST(request: NextRequest) {
  try {
    const { day, guess } = await request.json();

    if (typeof day !== "number" || typeof guess !== "string") {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const correct = checkAnswer(day, guess);
    return NextResponse.json({ correct });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
