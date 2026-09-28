import { Fragment } from "react";

export type SlotState = "empty" | "next" | "typed" | "locked";

export interface Slot {
  letter: string;
  state: SlotState;
}

interface ClueLineProps {
  clue: string;
  slots: Slot[];
  solved?: { sentence: string; start: number; end: number } | null;
  animate?: boolean;
  size?: "lg" | "sm";
  as?: "h1" | "p";
}

const GAP = "_ _ _ _ _";

// Split so the word fragments touching the gap never wrap away from it.
function splitAround(before: string, after: string) {
  const b = before.lastIndexOf(" ");
  const a = after.indexOf(" ");
  return {
    beforeHead: before.slice(0, b + 1),
    beforeTail: before.slice(b + 1),
    afterHead: a === -1 ? after : after.slice(0, a),
    afterTail: a === -1 ? "" : after.slice(a),
  };
}

export default function ClueLine({
  clue,
  slots,
  solved,
  animate = false,
  size = "lg",
  as: Tag = "p",
}: ClueLineProps) {
  const className = `clue${size === "sm" ? " clue--sm" : ""}`;

  if (solved) {
    const { sentence, start, end } = solved;
    const parts = splitAround(sentence.slice(0, start), sentence.slice(end));
    const found = sentence.slice(start, end);
    return (
      <Tag className={className}>
        {parts.beforeHead}
        <span className="clue-join">
          {parts.beforeTail}
          <span className={`found${animate ? " found--animate" : ""}`}>
            {found.split("").map((ch, i) =>
              ch === " " ? (
                <span key={i} className="found-space" aria-hidden="true">
                  {" "}
                </span>
              ) : (
                <Fragment key={i}>{ch}</Fragment>
              )
            )}
          </span>
          {parts.afterHead}
        </span>
        {parts.afterTail}
      </Tag>
    );
  }

  const [before = "", after = ""] = clue.split(GAP);
  const parts = splitAround(before, after);
  return (
    <Tag className={className}>
      {parts.beforeHead}
      <span className="clue-join">
        {parts.beforeTail}
        <span className="sr-only"> [five-letter gap] </span>
        <span aria-hidden="true">
          {slots.map((s, i) => (
            <span key={i} className={`slot slot--${s.state}`}>
              {s.letter || " "}
            </span>
          ))}
        </span>
        {parts.afterHead}
      </span>
      {parts.afterTail}
    </Tag>
  );
}
