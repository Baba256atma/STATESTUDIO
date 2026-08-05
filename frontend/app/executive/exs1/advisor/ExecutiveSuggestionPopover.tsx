"use client";

import { useEffect, useRef, useState } from "react";
import { cockpit } from "../shell/executiveCockpitTheme";
import {
  MORE_SUGGESTION_ITEMS,
  type MoreSuggestionItem,
} from "../conversation/ExecutiveConversationConfig";

type Props = {
  readonly iconOnly?: boolean;
  readonly disabled?: boolean;
  readonly onSelect: (prompt: string) => void;
  readonly accent?: string;
};

/**
 * Sprint 6.6 — ✨ More suggestion popover. Starts conversation on click.
 */
export function ExecutiveSuggestionPopover({
  iconOnly = false,
  disabled = false,
  onSelect,
  accent = cockpit.accent,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = (item: MoreSuggestionItem) => {
    onSelect(item.prompt);
    setOpen(false);
  };

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        type="button"
        data-testid="executive-advisor-more-button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="More suggestions"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "0.32rem 0.5rem",
          borderRadius: cockpit.radius.sm,
          border: open ? `1px solid ${accent}66` : "1px solid transparent",
          background: open ? `${accent}14` : "transparent",
          color: open ? accent : cockpit.muted,
          fontSize: "0.62rem",
          letterSpacing: "0.04em",
          cursor: disabled ? "default" : "pointer",
          fontFamily: "inherit",
          opacity: disabled ? 0.45 : 1,
        }}
      >
        {iconOnly ? "✨" : "✨ More"}
      </button>
      {open ? (
        <div
          role="dialog"
          aria-label="Suggestions"
          data-testid="executive-advisor-suggestion-popover"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: "calc(100% + 0.4rem)",
            width: "min(15rem, 72vw)",
            zIndex: 30,
            padding: "0.45rem",
            borderRadius: cockpit.radius.md,
            border: `1px solid ${cockpit.border}`,
            background: cockpit.panel,
            boxShadow: cockpit.elevation.floating,
            display: "flex",
            flexDirection: "column",
            gap: "0.2rem",
            animation: "exs-pop-in 160ms ease",
          }}
        >
          {MORE_SUGGESTION_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              data-testid={`executive-more-suggestion-${item.id}`}
              onClick={() => choose(item)}
              style={{
                textAlign: "left",
                padding: "0.4rem 0.5rem",
                borderRadius: cockpit.radius.sm,
                border: "1px solid transparent",
                background: "transparent",
                color: cockpit.textSoft,
                fontSize: "0.74rem",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
