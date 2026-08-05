"use client";

import type { ReactNode } from "react";
import type { AdvisorProposal } from "../advisor/ExecutiveAdvisorTypes";
import { ExecutiveProposalCard } from "./ExecutiveProposalCard";
import { ExecutiveConversationTimeline } from "./ExecutiveConversationTimeline";
import { cockpit } from "../shell/executiveCockpitTheme";
import type {
  ConversationMessage,
  ConversationReference,
} from "./ExecutiveConversationSession";

type Props = {
  readonly messages: readonly ConversationMessage[];
  readonly welcomeCopy: string;
  readonly showInsightChrome: boolean;
  readonly showWelcomeSuggestions: boolean;
  readonly suggestions: readonly string[];
  /** Proposals surfaced via Action Inbox Review — not a permanent dashboard. */
  readonly reviewedProposals: readonly AdvisorProposal[];
  readonly highlightedProposalId: string | null;
  readonly generating?: boolean;
  readonly onSuggestion: (text: string) => void;
  readonly onSelectReference: (reference: ConversationReference) => void;
  readonly onApproveProposal: (id: string) => void;
  readonly onDismissProposal: (id: string) => void;
  readonly onRetry: (prompt: string) => void;
  readonly onCopy: (text: string) => void;
  readonly onDismissError: (messageId: string) => void;
  readonly footer: ReactNode;
};

/**
 * Sprint 6.7 — Conversation-first; proposals appear only after Inbox Review.
 */
export function ExecutiveConversationLayout({
  messages,
  welcomeCopy,
  showInsightChrome,
  showWelcomeSuggestions,
  suggestions,
  reviewedProposals,
  highlightedProposalId,
  generating = false,
  onSuggestion,
  onSelectReference,
  onApproveProposal,
  onDismissProposal,
  onRetry,
  onCopy,
  onDismissError,
  footer,
}: Props) {
  return (
    <div
      data-testid="executive-conversation-layout"
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        gap: "0.65rem",
      }}
    >
      <div
        data-testid="executive-conversation-container"
        style={{
          flex: 1,
          minHeight: 0,
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          padding: "0.15rem 0.1rem 0.35rem",
        }}
      >
        <ExecutiveConversationTimeline
          messages={messages}
          welcomeCopy={welcomeCopy}
          showInsightChrome={showInsightChrome}
          onSelectReference={onSelectReference}
          onApproveProposal={onApproveProposal}
          onDismissProposal={onDismissProposal}
          onRetry={onRetry}
          onCopy={onCopy}
          onDismissError={onDismissError}
        />

        {showWelcomeSuggestions && suggestions.length > 0 ? (
          <div
            data-testid="executive-advisor-suggestion-cards"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.35rem",
              marginTop: "0.25rem",
            }}
          >
            {suggestions.slice(0, 4).map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                data-testid="executive-advisor-suggestion-card"
                disabled={generating}
                onClick={() => onSuggestion(suggestion)}
                style={{
                  textAlign: "left",
                  padding: "0.5rem 0.15rem",
                  border: "none",
                  borderBottom: `1px solid ${cockpit.border}`,
                  background: "transparent",
                  color: cockpit.textSoft,
                  fontSize: "0.78rem",
                  lineHeight: 1.4,
                  cursor: generating ? "default" : "pointer",
                  fontFamily: "inherit",
                  opacity: generating ? 0.5 : 1,
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}

        {reviewedProposals.length > 0 ? (
          <div
            data-testid="executive-advisor-proposals"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.45rem",
              marginTop: "0.15rem",
            }}
          >
            {reviewedProposals.map((proposal) => (
              <ExecutiveProposalCard
                key={proposal.id}
                proposal={proposal}
                highlighted={highlightedProposalId === proposal.id}
                onApprove={onApproveProposal}
                onDismiss={onDismissProposal}
              />
            ))}
          </div>
        ) : null}
      </div>

      {footer}
    </div>
  );
}
