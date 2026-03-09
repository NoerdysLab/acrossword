"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  onDone: () => void;
}

export default function Toast({ message, visible, onDone }: ToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setExiting(false);
    const timer = setTimeout(() => setExiting(true), 1600);
    const cleanup = setTimeout(() => onDone(), 1800);
    return () => {
      clearTimeout(timer);
      clearTimeout(cleanup);
    };
  }, [visible, onDone]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-50" style={{ transform: "translateX(-50%)" }}>
      <div
        className={`px-4 py-2 rounded-lg text-sm font-medium shadow-lg ${exiting ? "toast-exit" : "toast-enter"}`}
        style={{
          backgroundColor: "var(--text)",
          color: "var(--bg)",
        }}
      >
        {message}
      </div>
    </div>
  );
}
