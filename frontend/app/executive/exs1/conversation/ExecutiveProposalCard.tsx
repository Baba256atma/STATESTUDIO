"use client";

import type { CSSProperties } from "react";
import type { AdvisorProposal } from "../advisor/ExecutiveAdvisorTypes";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly proposal: AdvisorProposal;
  readonly highlighted?: boolean;
  readonly onApprove: (id: string) => void;
  readonly onDismiss: (id: string) => void;
};

/**
 * Inline conversation proposal — manager approval remains mandatory.
 */
export function ExecutiveProposalCard({
  proposal,
  highlighted = false,
  onApprove,
  onDismiss,
}: Props) {
  const pending = proposal.status === "pending";
  return (
    <div
      id={`executive-proposal-${proposal.id}`}
      data-testid={`executive-conversation-proposal-${proposal.id}`}
      data-proposal-id={proposal.id}
      data-highlighted={highlighted ? "true" : "false"}
      data-status={proposal.status}
      style={{
        padding: "0.55rem 0.6rem",
        borderRadius: cockpit.radius.md,
        border: highlighted
          ? `1px solid ${cockpit.accent}`
          : `1px solid ${cockpit.accent}44`,
        background: highlighted
          ? "rgba(56,189,248,0.14)"
          : "rgba(56,189,248,0.06)",
        boxShadow: highlighted ? cockpit.elevation.focus : "none",
        opacity: pending ? 1 : 0.65,
        transition: `border-color 160ms ease, background 160ms ease, box-shadow 160ms ease`,
        scrollMarginTop: "0.75rem",
      }}
    >
      <div
        style={{
          fontSize: "0.52rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: cockpit.accent,
        }}
      >
        Pending Executive Action · {proposal.kind}
      </div>
      <div
        style={{
          marginTop: "0.2rem",
          fontSize: "0.78rem",
          fontWeight: 550,
          color: cockpit.text,
        }}
      >
        {proposal.title}
      </div>
      <div
        style={{
          marginTop: "0.12rem",
          fontSize: "0.7rem",
          lineHeight: 1.4,
          color: cockpit.textSoft,
        }}
      >
        {proposal.body}
      </div>
      {pending ? (
        <div style={{ display: "flex", gap: "0.3rem", marginTop: "0.45rem" }}>
          <button
            type="button"
            data-testid={`conversation-proposal-approve-${proposal.id}`}
            onClick={() => onApprove(proposal.id)}
            style={btn("#12B76A")}
          >
            Approve
          </button>
          <button
            type="button"
            data-testid={`conversation-proposal-dismiss-${proposal.id}`}
            onClick={() => onDismiss(proposal.id)}
            style={btn("#F04438")}
          >
            Dismiss
          </button>
        </div>
      ) : (
        <div
          style={{
            marginTop: "0.35rem",
            fontSize: "0.55rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: cockpit.muted,
          }}
        >
          {proposal.status}
        </div>
      )}
    </div>
  );
}

function btn(color: string): CSSProperties {
  return {
    padding: "0.28rem 0.48rem",
    borderRadius: cockpit.radius.sm,
    border: `1px solid ${color}`,
    background: `${color}22`,
    color,
    fontSize: "0.6rem",
    fontWeight: 550,
    cursor: "pointer",
    fontFamily: "inherit",
  };
}
