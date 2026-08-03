"use client";

import type { ExecutionJournalEntry as Entry } from "./ExecutionConfig";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly entry: Entry;
};

/**
 * ExecutionJournalEntry — mock Execution Journal Pack card.
 */
export function ExecutionJournalEntry({ entry }: Props) {
  return (
    <article
      data-testid={`execution-journal-${entry.id}`}
      style={{
        padding: "0.6rem 0.65rem",
        borderRadius: "0.45rem",
        border: "1px solid rgba(18,183,106,0.35)",
        background: cockpit.panelSoft,
      }}
    >
      <strong style={{ fontSize: "0.8rem", color: "#12B76A" }}>
        {entry.planName}
      </strong>
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
        Decision · {entry.decisionReference} · {entry.owner} ·{" "}
        {entry.startedDate}
      </p>
      <p
        style={{
          margin: "0.25rem 0 0",
          fontSize: "0.68rem",
          color: cockpit.lowMuted,
        }}
      >
        Status · {entry.executionStatus}
      </p>
    </article>
  );
}
