export type SortState = "empty" | "next" | "typed" | "locked" | "solved";
export type SortAnim = "none" | "set" | "press" | "shake";

interface TileProps {
  letter: string;
  state: SortState;
  anim?: SortAnim;
  delay?: number;
}

export default function Tile({ letter, state, anim = "none", delay = 0 }: TileProps) {
  return (
    <div
      className={`sort sort--${state}${anim !== "none" ? ` anim-${anim}` : ""}`}
      style={delay ? { animationDelay: `${delay}ms`, transitionDelay: `${delay}ms` } : undefined}
    >
      {letter}
    </div>
  );
}
