"use client";

import { useEffect, useId, useRef } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Dialog({ open, onClose, title, children, footer }: DialogProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      const active = document.activeElement;
      const focusUnclaimed = !active || active === document.body || panelRef.current?.contains(active);
      if (focusUnclaimed && previous && previous !== document.body) {
        previous.focus({ preventScroll: true });
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="dialog-scrim" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="dialog-panel"
        style={{ outline: "none" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4" style={{ marginBottom: "1rem" }}>
          <h2 id={titleId} style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.01em" }}>
            {title}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close" style={{ marginRight: "-0.625rem" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}
