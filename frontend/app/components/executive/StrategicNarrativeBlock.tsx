"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";

type StrategicNarrativeBlockProps = {
  title?: string;
  narrative?: string | null;
  takeaway?: string | null;
  caution?: string | null;
  isEmpty?: boolean;
};

export function StrategicNarrativeBlock(props: StrategicNarrativeBlockProps) {
  const empty = props.isEmpty || !props.narrative?.trim();

  return (
    <div
      style={{
        borderRadius: 14,
        background: "linear-gradient(180deg, rgba(15,23,42,0.74), rgba(2,6,23,0.34))",
        border: "1px solid rgba(148,163,184,0.12)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <div
          style={{
            color: "#cbd5f5",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          {props.title ?? "Strategic View"}
        </div>
        <div style={{ color: empty ? nx.muted : nx.text, fontSize: 13, lineHeight: 1.65 }}>
          {empty
            ? "No strategic narrative yet. Run a comparison, simulation, or analysis to generate an executive summary."
            : props.narrative}
        </div>
      </div>

      {!empty && props.takeaway ? (
        <div
          style={{
            color: "#dbeafe",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.5,
            paddingTop: 6,
            borderTop: `1px solid ${nx.border}`,
          }}
        >
          Key takeaway: {props.takeaway}
        </div>
      ) : null}

      {!empty && props.caution ? (
        <div style={{ color: nx.warning, fontSize: 12, lineHeight: 1.5 }}>
          Watch out: {props.caution}
        </div>
      ) : null}
    </div>
  );
}
