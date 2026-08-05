"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { ConversationQuickAction } from "./ExecutiveConversationConfig";
import { ExecutiveConversationInput } from "./ExecutiveConversationInput";
import { ExecutiveQuickActions } from "./ExecutiveQuickActions";
import { ExecutiveSuggestionCards } from "./ExecutiveSuggestionCards";

type Props = {
  readonly suggestions: readonly string[];
  readonly showSuggestions: boolean;
  readonly generating: boolean;
  readonly onSuggestion: (text: string) => void;
  readonly onQuickAction: (action: ConversationQuickAction) => void;
  readonly onSend: (text: string) => void;
  readonly onStop: () => void;
};

/**
 * Sprint 6.5 — Fixed footer: suggestions → quick actions → chat input.
 */
export function ExecutiveConversationFooter({
  suggestions,
  showSuggestions,
  generating,
  onSuggestion,
  onQuickAction,
  onSend,
  onStop,
}: Props) {
  return (
    <div
      data-testid="executive-conversation-footer"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
        flexShrink: 0,
        paddingTop: "0.55rem",
        borderTop: `1px solid ${cockpit.border}`,
      }}
    >
      <ExecutiveSuggestionCards
        suggestions={suggestions}
        disabled={generating}
        visible={showSuggestions}
        onSuggestion={onSuggestion}
      />
      <ExecutiveQuickActions
        disabled={generating}
        onQuickAction={onQuickAction}
      />
      <ExecutiveConversationInput
        generating={generating}
        onSend={onSend}
        onStop={onStop}
      />
    </div>
  );
}
