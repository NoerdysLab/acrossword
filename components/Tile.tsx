"use client";

interface TileProps {
  letter: string;
  index: number;
  state: "empty" | "typing" | "wrong" | "correct" | "solved";
  animationDelay?: number;
}

export default function Tile({ letter, state, animationDelay = 0 }: TileProps) {
  let borderColor = "var(--tile-border)";
  let bgColor = "var(--tile-bg)";
  let textColor = "var(--text)";
  let animation = "";

  if (state === "typing" && letter) {
    animation = "animate-pop";
    borderColor = "var(--accent)";
  } else if (state === "wrong") {
    animation = "animate-shake";
    borderColor = "#ef4444";
  } else if (state === "correct" || state === "solved") {
    animation = state === "correct" ? "animate-flip" : "";
    bgColor = "var(--accent)";
    borderColor = "var(--accent)";
    textColor = "#ffffff";
  }

  return (
    <div
      className={`inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 border-2 rounded-lg text-2xl sm:text-3xl font-bold select-none ${animation}`}
      style={{
        borderColor,
        backgroundColor: bgColor,
        color: textColor,
        transition: "background-color 0.3s, border-color 0.3s",
        animationDelay: `${animationDelay}ms`,
        animationFillMode: "both",
      }}
    >
      {letter.toUpperCase()}
    </div>
  );
}
