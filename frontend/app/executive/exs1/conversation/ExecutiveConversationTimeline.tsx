"use client";

import { ExecutiveConversationMessage } from "./ExecutiveConversationMessage";
import { ExecutiveConversationWelcome } from "./ExecutiveConversationWelcome";
import type {
  ConversationMessage,
  ConversationReference,
} from "./ExecutiveConversationSession";

type Props = {
  readonly messages: readonly ConversationMessage[];
  readonly welcomeCopy: string;
  readonly showInsightChrome: boolean;
  readonly onSelectReference: (reference: ConversationReference) => void;
  readonly onApproveProposal: (id: string) => void;
  readonly onDismissProposal: (id: string) => void;
  readonly onRetry: (prompt: string) => void;
  readonly onCopy: (text: string) => void;
  readonly onDismissError: (messageId: string) => void;
};

export function ExecutiveConversationTimeline({
  messages,
  welcomeCopy,
  showInsightChrome,
  onSelectReference,
  onApproveProposal,
  onDismissProposal,
  onRetry,
  onCopy,
  onDismissError,
}: Props) {
  return (
    <div
      data-testid="executive-conversation-timeline"
      style={{
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
        paddingRight: "0.15rem",
      }}
    >
      {messages.length === 0 ? (
        <ExecutiveConversationWelcome copy={welcomeCopy} />
      ) : (
        messages.map((message) => (
          <ExecutiveConversationMessage
            key={message.id}
            message={message}
            showInsightChrome={showInsightChrome}
            onSelectReference={onSelectReference}
            onApproveProposal={onApproveProposal}
            onDismissProposal={onDismissProposal}
            onRetry={onRetry}
            onCopy={onCopy}
            onDismissError={onDismissError}
          />
        ))
      )}
    </div>
  );
}
