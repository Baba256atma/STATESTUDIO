"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ExecutiveAdvisorFooter } from "../advisor/ExecutiveAdvisorFooter";
import { findProposalForAction } from "../advisor/hooks/useExecutiveActionInbox";
import type { AdvisorProposal } from "../advisor/ExecutiveAdvisorTypes";
import type { ExecutiveAdvisorContext } from "../advisor/ExecutiveAdvisorTypes";
import { useExecutiveRuntimeStoreApi } from "../runtime";
import type { ExecutiveAdvisorTab } from "../shell/executiveCockpitTypes";
import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveConversationLayout } from "./ExecutiveConversationLayout";
import type {
  ConversationMessage,
  ConversationReference,
  ConversationRuntimeFacts,
  ConversationStreamState,
} from "./ExecutiveConversationSession";

type Props = {
  readonly perspective: ExecutiveAdvisorTab;
  readonly accent?: string;
  readonly welcomeCopy: string;
  readonly messages: readonly ConversationMessage[];
  readonly suggestions: readonly string[];
  readonly pendingProposals: readonly AdvisorProposal[];
  readonly streamState: ConversationStreamState;
  readonly panelWidth: number;
  readonly advisorContext: ExecutiveAdvisorContext;
  readonly facts: ConversationRuntimeFacts;
  readonly guidance?: string;
  readonly onSend: (text: string) => void;
  readonly onStop: () => void;
  readonly onSuggestion: (text: string) => void;
  readonly onSelectReference: (reference: ConversationReference) => void;
  readonly onApproveProposal: (id: string) => void;
  readonly onDismissProposal: (id: string) => void;
  readonly onRetry: (prompt: string) => void;
  readonly onCopy: (text: string) => void;
  readonly onDismissError: (messageId: string) => void;
};

/**
 * Sprint 6.7 — Conversation workspace with Action Inbox review focus.
 */
export function ExecutiveConversationView({
  perspective,
  accent = cockpit.accent,
  welcomeCopy,
  messages,
  suggestions,
  pendingProposals,
  streamState,
  panelWidth,
  advisorContext,
  facts,
  guidance,
  onSend,
  onStop,
  onSuggestion,
  onSelectReference,
  onApproveProposal,
  onDismissProposal,
  onRetry,
  onCopy,
  onDismissError,
}: Props) {
  const store = useExecutiveRuntimeStoreApi();
  const generating =
    streamState === "thinking" || streamState === "streaming";

  const hasUserMessage = useMemo(
    () => messages.some((message) => message.role === "user"),
    [messages],
  );

  const iconOnly = panelWidth < 360;

  const [reviewedIds, setReviewedIds] = useState<readonly string[]>([]);
  const [highlightedProposalId, setHighlightedProposalId] = useState<
    string | null
  >(null);

  const reviewedProposals = useMemo(() => {
    return reviewedIds
      .map((id) => findProposalForAction(pendingProposals, id))
      .filter((p): p is AdvisorProposal => p != null && p.status === "pending");
  }, [reviewedIds, pendingProposals]);

  const focusProposalInConversation = useCallback((proposalId: string) => {
    setReviewedIds((prev) =>
      prev.includes(proposalId) ? prev : [...prev, proposalId],
    );
    setHighlightedProposalId(proposalId);
  }, []);

  useEffect(() => {
    if (!highlightedProposalId) return;
    const timer = window.setTimeout(() => {
      const el = document.getElementById(
        `executive-proposal-${highlightedProposalId}`,
      );
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 40);
    const clearHighlight = window.setTimeout(() => {
      setHighlightedProposalId(null);
    }, 2400);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(clearHighlight);
    };
  }, [highlightedProposalId, reviewedProposals.length]);

  const onReviewAction = useCallback(
    (proposalId: string) => {
      const existing = findProposalForAction(pendingProposals, proposalId);
      if (!existing) {
        // Proposal should already exist from Advisor Engine; surface via ask if absent.
        onSuggestion("Review the pending executive action that needs approval.");
      }
      focusProposalInConversation(proposalId);
    },
    [pendingProposals, onSuggestion, focusProposalInConversation],
  );

  const onViewAllActions = useCallback(() => {
    // Existing Explorer — Journal is the executive action history surface.
    store.actions.setNav("Journal");
  }, [store]);

  return (
    <div
      data-testid="executive-conversation-view"
      data-perspective={perspective}
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ExecutiveConversationLayout
        messages={messages}
        welcomeCopy={welcomeCopy}
        showInsightChrome={perspective === "Insight"}
        showWelcomeSuggestions={!hasUserMessage}
        suggestions={suggestions}
        reviewedProposals={reviewedProposals}
        highlightedProposalId={highlightedProposalId}
        generating={generating}
        onSuggestion={onSuggestion}
        onSelectReference={onSelectReference}
        onApproveProposal={onApproveProposal}
        onDismissProposal={onDismissProposal}
        onRetry={onRetry}
        onCopy={onCopy}
        onDismissError={onDismissError}
        footer={
          <ExecutiveAdvisorFooter
            context={advisorContext}
            facts={facts}
            proposals={pendingProposals}
            panelWidth={panelWidth}
            guidance={guidance}
            iconOnly={iconOnly}
            generating={generating}
            onSend={onSend}
            onStop={onStop}
            onSuggestion={onSuggestion}
            onReviewAction={onReviewAction}
            onViewAllActions={onViewAllActions}
            accent={accent}
          />
        }
      />
    </div>
  );
}
