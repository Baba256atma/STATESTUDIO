"use client";

import React from "react";
import { cardStyle, nx, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";
import type { RiskPanelData } from "../../lib/panels/panelDataContract";

function prettyObjectName(id: string) {
  return String(id || "")
    .replace(/^obj_/, "")
    .replace(/_\d+$/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function RiskPropagationPanel({ risk }: { risk: RiskPanelData | null | undefined }) {
  const edges = Array.isArray(risk?.edges) ? risk.edges : [];
  if (!edges.length) {
    return <EmptyStateCard text="Risk changes will appear after a disruption is simulated." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {edges[0] ? (
        <div style={{ ...softCardStyle, fontSize: 12, color: nx.text }}>
          Risk summary: {prettyObjectName(String(edges[0]?.from ?? "source"))} risk is increasing and propagating to{" "}
          {prettyObjectName(String(edges[0]?.to ?? "target"))}.
        </div>
      ) : null}
      {risk?.summary ? <div style={{ fontSize: 11, color: nx.muted }}>{String(risk.summary)}</div> : null}
      {edges.map((e, i) => (
        <div
          key={`${e.from ?? "src"}-${e.to ?? "dst"}-${i}`}
          style={{
            ...cardStyle,
            padding: 10,
            background: nx.bgPanelSoft,
          }}
        >
          <div style={{ fontSize: 12, color: nx.text, fontWeight: 600 }}>
            {prettyObjectName(String(e.from ?? "unknown"))} {"\u2192"} {prettyObjectName(String(e.to ?? "unknown"))}
          </div>
          <div style={{ fontSize: 11, color: nx.muted }}>weight: {Number(e.weight ?? 0).toFixed(3)}</div>
        </div>
      ))}
    </div>
  );
}
