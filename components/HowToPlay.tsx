"use client";

interface HowToPlayProps {
  open: boolean;
  onClose: () => void;
}

export default function HowToPlay({ open, onClose }: HowToPlayProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--overlay)" }}
      onClick={onClose}
    >
      <div
        className="rounded-xl p-6 max-w-md w-full animate-fade-in-up"
        style={{ backgroundColor: "var(--modal-bg)", color: "var(--text)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">How to Play</h2>
          <button onClick={onClose} className="p-1" aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-sm" style={{ color: "var(--text-secondary)" }}>
          <p>
            Each day, a new clue is released. The answer is a <strong style={{ color: "var(--text)" }}>single word hidden within the clue</strong> — its letters span across word boundaries.
          </p>

          <div className="rounded-lg p-4" style={{ backgroundColor: "var(--bg-secondary)" }}>
            <p className="font-mono text-base mb-2" style={{ color: "var(--text)" }}>
              La Scala performance where Eur<span style={{ color: "var(--accent)" }}>_ _ _ _ _</span>nks highest
            </p>
            <p className="text-xs">
              The answer is <strong style={{ color: "var(--accent)" }}>OPERA</strong> — hidden across &quot;Eur<strong>ope ra</strong>nks&quot;
            </p>
          </div>

          <p>
            Type your guess and press <strong style={{ color: "var(--text)" }}>Enter</strong>. You have unlimited guesses.
          </p>

          <p>
            A new puzzle is released every day at midnight ET. You can also play the previous 3 days from the Archive.
          </p>
        </div>
      </div>
    </div>
  );
}
