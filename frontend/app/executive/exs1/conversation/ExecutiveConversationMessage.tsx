"use client";

import type { AdvisorProposal } from "../advisor/ExecutiveAdvisorTypes";
import { cockpit } from "../shell/executiveCockpitTheme";
import { ExecutiveProposalCard } from "./ExecutiveProposalCard";
import { ExecutiveReferenceChip } from "./ExecutiveReferenceChip";
import { ExecutiveStreamingIndicator } from "./ExecutiveStreamingIndicator";
import type {
  ConversationMessage,
  ConversationReference,
} from "./ExecutiveConversationSession";

type Props = {
  readonly message: ConversationMessage;
  readonly showInsightChrome: boolean;
  readonly onSelectReference: (reference: ConversationReference) => void;
  readonly onApproveProposal: (id: string) => void;
  readonly onDismissProposal: (id: string) => void;
  readonly onRetry?: (prompt: string) => void;
  readonly onCopy?: (text: string) => void;
  readonly onDismissError?: (messageId: string) => void;
};

function roleLabel(role: ConversationMessage["role"]): string {
  switch (role) {
    case "user":
      return "You";
    case "insight":
      return "Insight";
    case "proposal":
      return "Proposal";
    case "system":
      return "System";
    default:
      return "Advisor";
  }
}

function toneColor(tone?: string): string {
  switch (tone) {
    case "critical":
      return "#F04438";
    case "warning":
      return "#FDB022";
    case "positive":
      return "#12B76A";
    default:
      return cockpit.accent;
  }
}

export function ExecutiveConversationMessage({
  message,
  showInsightChrome,
  onSelectReference,
  onApproveProposal,
  onDismissProposal,
  onRetry,
  onCopy,
  onDismissError,
}: Props) {
  const isUser = message.role === "user";
  const streaming =
    message.streamState === "thinking" || message.streamState === "streaming";

  return (
    <div
      data-testid={`executive-conversation-message-${message.role}`}
      data-message-id={message.id}
      style={{
        alignSelf: isUser ? "flex-end" : "stretch",
        maxWidth: isUser ? "92%" : "100%",
        padding: "0.55rem 0.65rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${
          isUser ? "rgba(255,255,255,0.08)" : `${cockpit.accent}33`
        }`,
        background: isUser
          ? "rgba(255,255,255,0.04)"
          : "rgba(56,189,248,0.08)",
        color: cockpit.textSoft,
        fontSize: "0.76rem",
        lineHeight: 1.5,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.5rem",
          marginBottom: "0.2rem",
        }}
      >
        <span
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: cockpit.lowMuted,
          }}
        >
          {roleLabel(message.role)}
        </span>
        <span
          style={{
            fontSize: "0.55rem",
            color: cockpit.lowMuted,
            letterSpacing: "0.04em",
          }}
        >
          {new Date(message.at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {streaming && !message.text ? (
        <ExecutiveStreamingIndicator state={message.streamState ?? "thinking"} />
      ) : (
        <div style={{ whiteSpace: "pre-wrap" }}>{message.text}</div>
      )}

      {streaming && message.text ? (
        <div style={{ marginTop: "0.35rem" }}>
          <ExecutiveStreamingIndicator state="streaming" />
        </div>
      ) : null}

      {showInsightChrome && message.insight ? (
        <div
          data-testid="executive-conversation-insight-block"
          style={{
            marginTop: "0.55rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.45rem",
          }}
        >
          {message.insight.kpiCards?.length ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.35rem",
              }}
            >
              {message.insight.kpiCards.map((kpi) => (
                <div
                  key={kpi.id}
                  style={{
                    padding: "0.4rem 0.45rem",
                    borderRadius: cockpit.radius.sm,
                    border: `1px solid ${toneColor(kpi.tone)}44`,
                    background: `${toneColor(kpi.tone)}12`,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.52rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: toneColor(kpi.tone),
                    }}
                  >
                    {kpi.label}
                  </div>
                  <div
                    style={{
                      marginTop: "0.15rem",
                      fontSize: "0.72rem",
                      color: cockpit.text,
                      fontWeight: 550,
                    }}
                  >
                    {kpi.value}
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {message.insight.comparisonRows?.length ? (
            <table
              data-testid="executive-conversation-comparison"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.68rem",
              }}
            >
              <tbody>
                {message.insight.comparisonRows.map((row) => (
                  <tr key={row.id}>
                    <td
                      style={{
                        padding: "0.25rem 0.3rem 0.25rem 0",
                        color: cockpit.muted,
                        width: "34%",
                        verticalAlign: "top",
                      }}
                    >
                      {row.label}
                    </td>
                    <td
                      style={{
                        padding: "0.25rem 0",
                        color: cockpit.textSoft,
                      }}
                    >
                      {row.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {message.insight.evidence?.length ? (
            <div data-testid="executive-conversation-evidence">
              {message.insight.evidence.map((row) => (
                <div
                  key={row.id}
                  style={{
                    padding: "0.3rem 0",
                    borderTop: `1px solid ${cockpit.border}`,
                    color: cockpit.textSoft,
                    fontSize: "0.7rem",
                  }}
                >
                  {row.detail}
                </div>
              ))}
            </div>
          ) : null}

          {message.insight.chartPlaceholder ? (
            <div
              data-testid="executive-conversation-chart-placeholder"
              style={{
                padding: "0.55rem",
                borderRadius: cockpit.radius.sm,
                border: `1px dashed ${cockpit.border}`,
                color: cockpit.lowMuted,
                fontSize: "0.66rem",
                textAlign: "center",
              }}
            >
              {message.insight.chartPlaceholder}
            </div>
          ) : null}
        </div>
      ) : null}

      {message.references?.length ? (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.28rem",
            marginTop: "0.45rem",
          }}
        >
          {message.references.map((reference) => (
            <ExecutiveReferenceChip
              key={reference.id}
              reference={reference}
              onSelect={onSelectReference}
            />
          ))}
        </div>
      ) : null}

      {message.proposals?.map((proposal: AdvisorProposal) => (
        <ExecutiveProposalCard
          key={proposal.id}
          proposal={proposal}
          onApprove={onApproveProposal}
          onDismiss={onDismissProposal}
        />
      ))}

      {message.error ? (
        <div
          data-testid="executive-conversation-error"
          style={{
            marginTop: "0.45rem",
            padding: "0.45rem 0.5rem",
            borderRadius: cockpit.radius.sm,
            border: "1px solid #F0443866",
            background: "#F0443818",
            color: cockpit.textSoft,
          }}
        >
          <div style={{ fontSize: "0.72rem" }}>{message.error}</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.3rem",
              marginTop: "0.4rem",
            }}
          >
            {message.retryPrompt && onRetry ? (
              <button
                type="button"
                data-testid="executive-conversation-retry"
                onClick={() => onRetry(message.retryPrompt!)}
                style={actionBtn}
              >
                Retry
              </button>
            ) : null}
            {onCopy ? (
              <button
                type="button"
                data-testid="executive-conversation-copy"
                onClick={() => onCopy(message.text || message.error || "")}
                style={actionBtn}
              >
                Copy
              </button>
            ) : null}
            {onDismissError ? (
              <button
                type="button"
                data-testid="executive-conversation-dismiss-error"
                onClick={() => onDismissError(message.id)}
                style={actionBtn}
              >
                Dismiss
              </button>
            ) : null}
            {onRetry && message.retryPrompt ? (
              <button
                type="button"
                data-testid="executive-conversation-continue"
                onClick={() => onRetry(message.retryPrompt!)}
                style={actionBtn}
              >
                Continue
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {!isUser && !streaming && message.text && onCopy ? (
        <div style={{ marginTop: "0.35rem" }}>
          <button
            type="button"
            data-testid="executive-conversation-copy-message"
            onClick={() => onCopy(message.text)}
            style={{
              ...actionBtn,
              border: "none",
              background: "transparent",
              padding: 0,
              color: cockpit.lowMuted,
            }}
          >
            Copy
          </button>
        </div>
      ) : null}
    </div>
  );
}

const actionBtn = {
  padding: "0.28rem 0.45rem",
  borderRadius: cockpit.radius.sm,
  border: `1px solid ${cockpit.border}`,
  background: "rgba(255,255,255,0.03)",
  color: cockpit.muted,
  fontSize: "0.6rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase" as const,
  cursor: "pointer",
  fontFamily: "inherit",
};
