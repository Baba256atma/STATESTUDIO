"use client";

import React from "react";
import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";

type Selection = {
  active_objects?: string[];
  highlighted_objects?: string[];
  rankings?: Array<{ id?: string; score?: number }>;
  reasoning?: string;
};

function toLabel(id: string): string {
  return id.replace(/^obj_/, "").replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function ObjectSelectionPanel({ selection }: { selection: Selection | null | undefined }) {
  const active = Array.isArray(selection?.active_objects) ? selection!.active_objects! : [];
  const highlighted = Array.isArray(selection?.highlighted_objects) ? selection!.highlighted_objects! : [];
  const rankings = Array.isArray(selection?.rankings) ? selection!.rankings! : [];

  if (!selection) {
    return <EmptyStateCard text="Object focus appears after analysis runs." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Active Objects</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 12, color: nx.text }}>
        {active.length ? active.map((id) => <div key={id}>• {toLabel(id)}</div>) : <div style={{ color: nx.lowMuted }}>No active objects.</div>}
      </div>

      <div style={sectionTitleStyle}>Highlighted Objects</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {highlighted.length
          ? highlighted.map((id) => (
              <span
                key={id}
                style={{
                  padding: "2px 8px",
                  borderRadius: 999,
                  border: `1px solid ${nx.border}`,
                  background: nx.bgPanel,
                  color: nx.text,
                  fontSize: 11,
                }}
              >
                {toLabel(id)}
              </span>
            ))
          : <span style={{ color: nx.lowMuted, fontSize: 12 }}>None</span>}
      </div>

      <div style={sectionTitleStyle}>Top Ranked</div>
      <div style={{ ...softCardStyle, padding: 10, gap: 4 }}>
        {rankings.slice(0, 6).map((r, i) => (
          <div key={`${r.id}-${i}`} style={{ fontSize: 12, color: nx.text }}>
            {i + 1} {toLabel(String(r.id ?? "unknown"))} ({Number(r.score ?? 0).toFixed(2)})
          </div>
        ))}
        {!rankings.length ? <div style={{ color: nx.lowMuted, fontSize: 12 }}>No rankings available yet.</div> : null}
      </div>

      {selection?.reasoning ? (
        <div style={{ fontSize: 11, color: nx.muted }}>{selection.reasoning}</div>
      ) : null}
    </div>
  );
}
