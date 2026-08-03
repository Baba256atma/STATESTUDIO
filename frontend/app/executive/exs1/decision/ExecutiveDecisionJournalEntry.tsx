"use client";

import type { DecisionJournalEntry } from "./ExecutiveDecisionConfig";
import { ExecutiveDecisionBadge } from "./ExecutiveDecisionBadge";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly entry: DecisionJournalEntry;
};

/**
 * ExecutiveDecisionJournalEntry — mock Decision Journal Pack card.
 */
export function ExecutiveDecisionJournalEntry({ entry }: Props) {
  return (
    <article
      data-testid={`executive-decision-journal-${entry.id}`}
      style={{
        padding: "0.6rem 0.65rem",
        borderRadius: "0.45rem",
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panelSoft,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.4rem",
        }}
      >
        <strong style={{ fontSize: "0.8rem", color: cockpit.text }}>
          {entry.decisionName}
        </strong>
        <ExecutiveDecisionBadge status={entry.approvalState} compact />
      </div>
      <p
        style={{
          margin: "0.35rem 0 0",
          fontSize: "0.72rem",
          color: cockpit.textSoft,
          lineHeight: 1.4,
        }}
      >
        {entry.summary}
      </p>
      <p
        style={{
          margin: "0.35rem 0 0",
          fontSize: "0.66rem",
          color: cockpit.muted,
        }}
      >
        {entry.owner} · {entry.createdDate}
      </p>
      <p
        style={{
          margin: "0.25rem 0 0",
          fontSize: "0.68rem",
          color: cockpit.lowMuted,
          lineHeight: 1.4,
        }}
      >
        Reason · {entry.reason}
      </p>
    </article>
  );
}
