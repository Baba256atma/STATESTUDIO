"use client";

import type { AdvisorProposal, ExecutiveAdvisorContext } from "./ExecutiveAdvisorTypes";
import type { ConversationRuntimeFacts } from "../conversation/ExecutiveConversationSession";
import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveActionInboxButton } from "./ExecutiveActionInboxButton";
import { ExecutiveContextPopover } from "./ExecutiveContextPopover";
import { ExecutiveHelpPopover } from "./ExecutiveHelpPopover";
import { ExecutiveSuggestionPopover } from "./ExecutiveSuggestionPopover";

type Props = {
  readonly context: ExecutiveAdvisorContext;
  readonly facts: ConversationRuntimeFacts;
  readonly proposals: readonly AdvisorProposal[];
  readonly panelWidth: number;
  readonly guidance?: string;
  readonly iconOnly?: boolean;
  readonly generating?: boolean;
  readonly onSuggestion: (prompt: string) => void;
  readonly onReviewAction: (proposalId: string) => void;
  readonly onViewAllActions: () => void;
  readonly accent?: string;
};

/**
 * Sprint 6.7 — Footer: ⚙ Context · ✨ More · ✔ Approvals · ?
 */
export function ExecutiveFooterActions({
  context,
  facts,
  proposals,
  panelWidth,
  guidance,
  iconOnly = false,
  generating = false,
  onSuggestion,
  onReviewAction,
  onViewAllActions,
  accent = cockpit.accent,
}: Props) {
  return (
    <div
      data-testid="executive-footer-actions"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "0.25rem",
        flexShrink: 0,
        flexWrap: "wrap",
      }}
    >
      <ExecutiveContextPopover
        context={context}
        facts={facts}
        iconOnly={iconOnly}
        accent={accent}
      />
      <ExecutiveSuggestionPopover
        iconOnly={iconOnly}
        disabled={generating}
        onSelect={onSuggestion}
        accent={accent}
      />
      <ExecutiveActionInboxButton
        proposals={proposals}
        panelWidth={panelWidth}
        iconOnly={iconOnly}
        accent={accent}
        onReview={onReviewAction}
        onViewAll={onViewAllActions}
      />
      <ExecutiveHelpPopover
        guidance={guidance}
        iconOnly={iconOnly}
        accent={accent}
      />
      <style>{`@keyframes exs-pop-in{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
