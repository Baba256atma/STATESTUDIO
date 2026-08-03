"use client";

import type { DataJournalEntry } from "./ExecutiveDataConfig";
import { ExecutiveConnectionBadge } from "./ExecutiveConnectionBadge";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly entry: DataJournalEntry;
};

export function ExecutiveDataJournalEntry({ entry }: Props) {
  return (
    <article
      data-testid={`executive-data-journal-${entry.id}`}
      style={{
        padding: "0.6rem 0.65rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.borderStrong}`,
        background: cockpit.panelSoft,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.4rem",
          alignItems: "center",
        }}
      >
        <strong style={{ fontSize: "0.8rem", color: cockpit.accent }}>
          Data · {entry.sourceName}
        </strong>
        <ExecutiveConnectionBadge status={entry.connection} compact />
      </div>
      <p
        style={{
          margin: "0.35rem 0 0",
          fontSize: "0.72rem",
          color: cockpit.textSoft,
        }}
      >
        {entry.summary}
      </p>
      <p
        style={{
          margin: "0.3rem 0 0",
          fontSize: "0.66rem",
          color: cockpit.muted,
        }}
      >
        {entry.mappingsSummary} · {entry.createdDate}
      </p>
    </article>
  );
}
