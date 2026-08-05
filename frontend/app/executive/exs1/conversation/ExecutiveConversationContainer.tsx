"use client";

import type { AdvisorProposal } from "../advisor/ExecutiveAdvisorTypes";
import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveProposalCard } from "./ExecutiveProposalCard";
import { ExecutiveConversationTimeline } from "./ExecutiveConversationTimeline";
import type {
  ConversationMessage,
  ConversationReference,
} from "./ExecutiveConversationSession";

type Props = {
  readonly messages: readonly ConversationMessage[];
  readonly welcomeCopy: string;
  readonly showInsightChrome: boolean;
  readonly pendingProposals: readonly AdvisorProposal[];
  readonly onSelectReference: (reference: ConversationReference) => void;
  readonly onApproveProposal: (id: string) => void;
  readonly onDismissProposal: (id: string) => void;
  readonly onRetry: (prompt: string) => void;
  readonly onCopy: (text: string) => void;
  readonly onDismissError: (messageId: string) => void;
};

/**
 * Sprint 6.5 — Scrollable conversation region (proposals live inline).
 */
export function ExecutiveConversationContainer({
  messages,
  welcomeCopy,
  showInsightChrome,
  pendingProposals,
  onSelectReference,
  onApproveProposal,
  onDismissProposal,
  onRetry,
  onCopy,
  onDismissError,
}: Props) {
  return (
    <div
      data-testid="executive-conversation-container"
      style={{
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
        paddingRight: "0.1rem",
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

      {pendingProposals.length > 0 ? (
        <div
          data-testid="executive-advisor-proposals"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
            marginTop: messages.length === 0 ? "0.15rem" : 0,
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: cockpit.lowMuted,
            }}
          >
            Proposed actions
          </p>
          {pendingProposals.map((proposal) => (
            <ExecutiveProposalCard
              key={proposal.id}
              proposal={proposal}
              onApprove={onApproveProposal}
              onDismiss={onDismissProposal}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
