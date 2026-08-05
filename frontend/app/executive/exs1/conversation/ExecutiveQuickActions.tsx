"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import {
  CONVERSATION_QUICK_ACTIONS,
  type ConversationQuickAction,
} from "./ExecutiveConversationConfig";

type Props = {
  readonly disabled?: boolean;
  readonly onQuickAction: (action: ConversationQuickAction) => void;
};

/**
 * Sprint 6.5 — Single-row quick action chips.
 */
export function ExecutiveQuickActions({
  disabled = false,
  onQuickAction,
}: Props) {
  return (
    <div
      data-testid="executive-conversation-quick-actions"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.28rem",
        flexShrink: 0,
      }}
    >
      {CONVERSATION_QUICK_ACTIONS.map((action) => (
        <button
          key={action}
          type="button"
          data-testid="executive-conversation-quick-action"
          disabled={disabled}
          onClick={() => onQuickAction(action)}
          style={{
            padding: "0.22rem 0.42rem",
            borderRadius: cockpit.radius.sm,
            border: `1px solid ${cockpit.border}`,
            background: "transparent",
            color: cockpit.muted,
            fontSize: "0.56rem",
            letterSpacing: "0.07em",
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
  );
}
