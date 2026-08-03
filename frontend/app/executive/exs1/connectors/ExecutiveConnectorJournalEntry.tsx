"use client";

import { cockpit } from "../shell/executiveCockpitTheme";
import type { ConnectorJournalEntry } from "./ExecutiveConnectorContracts";

type Props = {
  readonly entry: ConnectorJournalEntry;
};

export function ExecutiveConnectorJournalEntry({ entry }: Props) {
  return (
    <article
      data-testid={`executive-connector-journal-${entry.id}`}
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
        Connector Pack
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
        Source · {entry.sourceName}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Schema · {entry.schemaSummary}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Mappings · {entry.mappingsSummary}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Objects · {entry.objectsSummary}
      </p>
      <p style={{ margin: "0.2rem 0 0", fontSize: "0.7rem", color: cockpit.muted }}>
        Published · {entry.published ? "Yes" : "No"} · {entry.timestamp.slice(0, 19)}
      </p>
    </article>
  );
}
