"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import {
  CONVERSATION_QUICK_ACTIONS,
  type ConversationQuickAction,
} from "./ExecutiveConversationConfig";

type Props = {
  readonly suggestions: readonly string[];
  readonly disabled?: boolean;
  readonly onSuggestion: (text: string) => void;
  readonly onQuickAction: (action: ConversationQuickAction) => void;
};

export function ExecutiveSuggestionBar({
  suggestions,
  disabled = false,
  onSuggestion,
  onQuickAction,
}: Props) {
  return (
    <div
      data-testid="executive-conversation-suggestions"
      style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}
    >
      {suggestions.length ? (
        <div
          data-testid="executive-advisor-suggestion-cards"
          style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              data-testid="executive-advisor-suggestion-card"
              disabled={disabled}
              onClick={() => onSuggestion(suggestion)}
              style={{
                textAlign: "left",
                padding: "0.5rem 0.6rem",
                borderRadius: cockpit.radius.md,
                border: `1px solid ${cockpit.accent}40`,
                background: `${cockpit.accent}10`,
                color: cockpit.text,
                fontSize: "0.74rem",
                lineHeight: 1.4,
                cursor: disabled ? "default" : "pointer",
                fontFamily: "inherit",
                opacity: disabled ? 0.55 : 1,
                boxShadow: cockpit.elevation.raised,
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      <div
        data-testid="executive-conversation-quick-actions"
        style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}
      >
        {CONVERSATION_QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            data-testid="executive-conversation-quick-action"
            disabled={disabled}
            onClick={() => onQuickAction(action)}
            style={{
              padding: "0.3rem 0.5rem",
              borderRadius: cockpit.radius.sm,
              border: `1px solid ${cockpit.borderStrong}`,
              background: "transparent",
              color: cockpit.accent,
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: disabled ? "default" : "pointer",
              fontFamily: "inherit",
              opacity: disabled ? 0.5 : 1,
            }}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
}
