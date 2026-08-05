"use client";

import type {
  AdvisorProposal,
  ExecutiveAdvisorContext,
} from "./ExecutiveAdvisorTypes";
import type { ConversationRuntimeFacts } from "../conversation/ExecutiveConversationSession";
import { ExecutiveConversationInput } from "../conversation/ExecutiveConversationInput";
import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveFooterActions } from "./ExecutiveFooterActions";

type Props = {
  readonly context: ExecutiveAdvisorContext;
  readonly facts: ConversationRuntimeFacts;
  readonly proposals: readonly AdvisorProposal[];
  readonly panelWidth: number;
  readonly guidance?: string;
  readonly iconOnly?: boolean;
  readonly generating?: boolean;
  readonly onSend: (text: string) => void;
  readonly onStop: () => void;
  readonly onSuggestion: (prompt: string) => void;
  readonly onReviewAction: (proposalId: string) => void;
  readonly onViewAllActions: () => void;
  readonly accent?: string;
};

/**
 * Sprint 6.7 — Fixed chat input + footer with Action Inbox.
 */
export function ExecutiveAdvisorFooter({
  context,
  facts,
  proposals,
  panelWidth,
  guidance,
  iconOnly = false,
  generating = false,
  onSend,
  onStop,
  onSuggestion,
  onReviewAction,
  onViewAllActions,
  accent,
}: Props) {
  return (
    <div
      data-testid="executive-advisor-footer"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
        flexShrink: 0,
        paddingTop: "0.55rem",
        borderTop: `1px solid ${cockpit.border}`,
      }}
    >
      <ExecutiveConversationInput
        generating={generating}
        onSend={onSend}
        onStop={onStop}
      />
      <ExecutiveFooterActions
        context={context}
        facts={facts}
        proposals={proposals}
        panelWidth={panelWidth}
        guidance={guidance}
        iconOnly={iconOnly}
        generating={generating}
        onSuggestion={onSuggestion}
        onReviewAction={onReviewAction}
        onViewAllActions={onViewAllActions}
        accent={accent}
      />
    </div>
  );
}
