"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { IntelligenceJournalEntry } from "./ExecutiveSignalTypes";

type Props = {
  readonly entry: IntelligenceJournalEntry;
};

export function ExecutiveIntelligenceJournalEntry({ entry }: Props) {
  return (
    <article
      data-testid={`executive-intelligence-journal-${entry.id}`}
      style={{
        padding: "0.65rem 0.7rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panelSoft,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "0.55rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: cockpit.accent,
        }}
      >
        Intelligence Pack
      </p>
      <h3
        style={{
          margin: "0.3rem 0 0",
          fontSize: "0.82rem",
          color: cockpit.text,
        }}
      >
        {entry.summary}
      </h3>
      <p style={{ margin: "0.35rem 0 0", fontSize: "0.72rem", color: cockpit.textSoft }}>
        Reason · {entry.reason}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Objects · {entry.objects}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Context · {entry.context}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Recommendation · {entry.recommendation}
      </p>
    </article>
  );
}
