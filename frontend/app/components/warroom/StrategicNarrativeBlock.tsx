"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";

type StrategicNarrativeBlockProps = {
  title?: string;
  context: string;
  insight: string;
  decision: string;
  consequence: string;
  keyTakeaway: string;
  caution?: string | null;
};

export function StrategicNarrativeBlock(props: StrategicNarrativeBlockProps) {
  return (
    <div
      style={{
        borderRadius: 14,
        background: "linear-gradient(180deg, rgba(15,23,42,0.72), rgba(2,6,23,0.38))",
        border: "1px solid rgba(148,163,184,0.12)",
        padding: 14,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
        <div style={{ color: nx.text, fontSize: 13, lineHeight: 1.6 }}>
          {props.context}
        </div>
        <div style={{ color: nx.text, fontSize: 13, lineHeight: 1.6 }}>
          {props.insight}
        </div>
        <div style={{ color: nx.text, fontSize: 13, lineHeight: 1.6 }}>
          {props.decision}
        </div>
        <div style={{ color: nx.text, fontSize: 13, lineHeight: 1.6 }}>
          {props.consequence}
        </div>
      </div>

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
        Key takeaway: {props.keyTakeaway}
      </div>

      {props.caution ? (
        <div style={{ color: nx.warning, fontSize: 12, lineHeight: 1.5 }}>
          Watch out: {props.caution}
        </div>
      ) : null}
    </div>
  );
}
