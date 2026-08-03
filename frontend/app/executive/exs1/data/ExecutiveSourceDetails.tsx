"use client";

import { ExecutiveConnectionBadge } from "./ExecutiveConnectionBadge";
import { useExecutiveData } from "./hooks/useExecutiveData";
import { cockpit } from "../shell/executiveCockpitTheme";

export function ExecutiveSourceDetails() {
  const { selectedSource, selectedMappings } = useExecutiveData();
  if (!selectedSource) {
    return (
      <p style={{ margin: 0, color: cockpit.muted, fontSize: "0.78rem" }}>
        Select a source to inspect details.
      </p>
    );
  }

  return (
    <article
      data-testid="executive-source-details"
      style={{
        padding: "0.7rem",
        borderRadius: cockpit.radius.md,
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panelSoft,
        display: "flex",
        flexDirection: "column",
        gap: "0.55rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.4rem",
        }}
      >
        <strong style={{ color: cockpit.accent }}>{selectedSource.name}</strong>
        <ExecutiveConnectionBadge health={selectedSource.health} compact />
      </div>
      <Block title="Metadata" body={`${selectedSource.type} · ${selectedSource.rows} rows`} />
      <Block title="Connection" body={`${selectedSource.status} · ${selectedSource.lastSync}`} />
      <Block
        title="Objects"
        body={
          selectedSource.objectsConnected.join(" · ") || "No objects connected"
        }
      />
      <Block
        title="History"
        body={`${selectedMappings.length} mapping rows linked to this source`}
      />
      <Block title="Notes" body={selectedSource.notes} />
    </article>
  );
}

function Block({ title, body }: { readonly title: string; readonly body: string }) {
  return (
    <div>
      <p
        style={{
          margin: 0,
          fontSize: cockpit.type.status.size,
          letterSpacing: cockpit.type.status.tracking,
          textTransform: "uppercase",
          color: cockpit.lowMuted,
        }}
      >
        {title}
      </p>
      <p
        style={{
          margin: "0.2rem 0 0",
          fontSize: "0.74rem",
          color: cockpit.textSoft,
          lineHeight: 1.4,
        }}
      >
        {body}
      </p>
    </div>
  );
}
