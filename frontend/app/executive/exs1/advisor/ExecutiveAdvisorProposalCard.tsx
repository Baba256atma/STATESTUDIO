"use client";

import type { CSSProperties } from "react";
import { cockpit } from "../shell/executiveCockpitTheme";
import type { AdvisorProposal } from "./ExecutiveAdvisorTypes";

type Props = {
  readonly proposal: AdvisorProposal;
  readonly onApprove: (id: string) => void;
  readonly onDismiss: (id: string) => void;
};

export function ExecutiveAdvisorProposalCard({
  proposal,
  onApprove,
  onDismiss,
}: Props) {
  const pending = proposal.status === "pending";
  return (
    <div
      data-testid={`executive-advisor-proposal-${proposal.id}`}
      data-status={proposal.status}
      data-kind={proposal.kind}
      style={{
        padding: "0.65rem 0.7rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.accent}55`,
        background: cockpit.panelSoft,
        opacity: pending ? 1 : 0.65,
        transition: cockpit.transition,
      }}
    >
      <div
        style={{
          fontSize: "0.58rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: cockpit.accent,
        }}
      >
        Pending Executive Action · {proposal.kind}
      </div>
      <div
        style={{
          marginTop: "0.25rem",
          fontSize: "0.8rem",
          fontWeight: 550,
          color: cockpit.text,
        }}
      >
        {proposal.title}
      </div>
      <div
        style={{
          marginTop: "0.2rem",
          fontSize: "0.74rem",
          lineHeight: 1.45,
          color: cockpit.textSoft,
        }}
      >
        {proposal.body}
      </div>
      {pending ? (
        <div
          style={{
            display: "flex",
            gap: "0.35rem",
            marginTop: "0.55rem",
          }}
        >
          <button
            type="button"
            data-testid={`advisor-proposal-approve-${proposal.id}`}
            onClick={() => onApprove(proposal.id)}
            style={btn("#12B76A")}
          >
            Approve
          </button>
          <button
            type="button"
            data-testid={`advisor-proposal-dismiss-${proposal.id}`}
            onClick={() => onDismiss(proposal.id)}
            style={btn("#F04438")}
          >
            Dismiss
          </button>
        </div>
      ) : (
        <div
          style={{
            marginTop: "0.45rem",
            fontSize: "0.62rem",
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
    padding: "0.32rem 0.55rem",
    borderRadius: cockpit.radius.sm,
    border: `1px solid ${color}`,
    background: `${color}22`,
    color,
    fontSize: "0.64rem",
    fontWeight: 550,
    cursor: "pointer",
    fontFamily: "inherit",
  };
}
