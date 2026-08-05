"use client";

import { useState } from "react";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly suggestions: readonly string[];
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly maxVisible?: number;
  readonly onSuggestion: (text: string) => void;
};

/**
 * Sprint 6.5 — Compact suggestion cards (max 4 + More).
 */
export function ExecutiveSuggestionCards({
  suggestions,
  disabled = false,
  visible = true,
  maxVisible = 4,
  onSuggestion,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  if (!visible || suggestions.length === 0) return null;

  const shown = expanded ? suggestions : suggestions.slice(0, maxVisible);
  const hasMore = suggestions.length > maxVisible;

  return (
    <div
      data-testid="executive-advisor-suggestion-cards"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.28rem",
        flexShrink: 0,
      }}
    >
      {shown.map((suggestion) => (
        <button
          key={suggestion}
          type="button"
          data-testid="executive-advisor-suggestion-card"
          disabled={disabled}
          onClick={() => onSuggestion(suggestion)}
          style={{
            textAlign: "left",
            padding: "0.42rem 0.55rem",
            borderRadius: cockpit.radius.sm,
            border: `1px solid ${cockpit.border}`,
            background: "rgba(255,255,255,0.025)",
            color: cockpit.textSoft,
            fontSize: "0.72rem",
            lineHeight: 1.35,
            cursor: disabled ? "default" : "pointer",
            fontFamily: "inherit",
            opacity: disabled ? 0.55 : 1,
          }}
        >
          {suggestion}
        </button>
      ))}
      {hasMore ? (
        <button
          type="button"
          data-testid="executive-suggestion-more"
          disabled={disabled}
          onClick={() => setExpanded((v) => !v)}
          style={{
            alignSelf: "flex-start",
            padding: "0.2rem 0.4rem",
            border: "none",
            background: "transparent",
            color: cockpit.accent,
            fontSize: "0.58rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {expanded ? "Less" : "More"}
        </button>
      ) : null}
    </div>
  );
}
