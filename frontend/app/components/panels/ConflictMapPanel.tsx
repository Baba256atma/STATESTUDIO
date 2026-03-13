"use client";

import React from "react";
import { cardStyle, nx, softCardStyle } from "../ui/nexoraTheme";
import { EmptyStateCard } from "../ui/panelStates";

type ConflictItem = {
  a?: string;
  b?: string;
  score?: number;
  reason?: string;
};

export default function ConflictMapPanel({ conflicts }: { conflicts: ConflictItem[] | null | undefined }) {
  if (!Array.isArray(conflicts) || conflicts.length === 0) {
    return <EmptyStateCard text="No active conflicts detected." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {conflicts.map((c, i) => (
        <div
          key={i}
          style={{
            ...cardStyle,
            padding: 10,
            background: nx.bgPanelSoft,
          }}
        >
          <div style={{ fontSize: 12, color: nx.text, fontWeight: 600 }}>
            {String(c?.a ?? "unknown")} {"\u2194"} {String(c?.b ?? "unknown")}
          </div>
          <div style={{ fontSize: 11, color: nx.muted }}>
            {String(c?.reason ?? "")}
          </div>
          <div style={{ fontSize: 10, color: nx.lowMuted }}>
            score: {Number(c?.score ?? 0).toFixed(3)}
          </div>
        </div>
      ))}
    </div>
  );
}
