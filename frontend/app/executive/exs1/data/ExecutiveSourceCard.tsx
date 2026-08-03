"use client";

import type { ExecutiveDataSource } from "./ExecutiveDataConfig";
import { ExecutiveConnectionBadge } from "./ExecutiveConnectionBadge";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly source: ExecutiveDataSource;
  readonly selected?: boolean;
  readonly onSelect?: () => void;
};

export function ExecutiveSourceCard({
  source,
  selected = false,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      data-testid={`executive-source-card-${source.id}`}
      data-status={source.status}
      onClick={onSelect}
      style={{
        width: "100%",
        textAlign: "left",
        padding: "0.65rem 0.7rem",
        borderRadius: cockpit.radius.md,
        border: selected
          ? `1px solid ${cockpit.accent}`
          : `1px solid ${cockpit.border}`,
        background: selected ? cockpit.accentSoft : cockpit.panelSoft,
        color: cockpit.text,
        cursor: "pointer",
        fontFamily: "inherit",
        transition: cockpit.transition,
        boxShadow: selected ? cockpit.elevation.focus : cockpit.elevation.raised,
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
        <strong style={{ fontSize: cockpit.type.cardTitle.size }}>
          {source.name}
        </strong>
        <ExecutiveConnectionBadge status={source.status} compact />
      </div>
      <p
        style={{
          margin: "0.35rem 0 0",
          fontSize: "0.68rem",
          color: cockpit.muted,
        }}
      >
        {source.type} · {source.rows} rows · {source.lastSync}
      </p>
      <p
        style={{
          margin: "0.25rem 0 0",
          fontSize: "0.66rem",
          color: cockpit.textSoft,
        }}
      >
        Objects ·{" "}
        {source.objectsConnected.length
          ? source.objectsConnected.join(", ")
          : "None"}
      </p>
      <p
        style={{
          margin: "0.2rem 0 0",
          fontSize: "0.62rem",
          color: cockpit.lowMuted,
        }}
      >
        Owner · {source.owner}
      </p>
    </button>
  );
}
