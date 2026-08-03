"use client";

import type { MonitoringJournalEntry } from "./ExecutiveMonitoringConfig";
import { ExecutiveHealthBadge } from "./ExecutiveHealthBadge";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly entry: MonitoringJournalEntry;
};

/**
 * ExecutiveMonitoringJournalEntry — mock Monitoring Journal Pack card.
 */
export function ExecutiveMonitoringJournalEntry({ entry }: Props) {
  return (
    <article
      data-testid={`monitoring-journal-${entry.id}`}
      style={{
        padding: "0.6rem 0.65rem",
        borderRadius: "0.45rem",
        border: "1px solid rgba(3,152,85,0.35)",
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
        <strong style={{ fontSize: "0.8rem", color: "#039855" }}>
          Monitoring Snapshot
        </strong>
        <ExecutiveHealthBadge health={entry.executiveHealth} compact />
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
        {entry.alerts} · {entry.createdDate}
      </p>
      <p
        style={{
          margin: "0.25rem 0 0",
          fontSize: "0.68rem",
          color: cockpit.lowMuted,
        }}
      >
        {entry.observedStatus}
      </p>
    </article>
  );
}
