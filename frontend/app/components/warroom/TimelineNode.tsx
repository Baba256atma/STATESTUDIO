"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";

export type DecisionTimelineMetric = {
  label: string;
  value: string;
  tone?: "positive" | "negative" | "neutral";
};

export type DecisionTimelineStage = {
  id: string;
  title: string;
  label: string;
  narrative: string;
  metrics: DecisionTimelineMetric[];
  focusObjectId?: string | null;
};

type TimelineNodeProps = {
  stage: DecisionTimelineStage;
  active?: boolean;
  onSelect?: ((stage: DecisionTimelineStage) => void) | null;
};

export function TimelineNode(props: TimelineNodeProps) {
  return (
    <button
      type="button"
      onClick={() => props.onSelect?.(props.stage)}
      style={{
        borderRadius: 14,
        border: `1px solid ${props.active ? "rgba(96,165,250,0.32)" : nx.border}`,
        background: props.active ? "rgba(59,130,246,0.12)" : "rgba(2,6,23,0.42)",
        padding: 12,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 0,
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {props.stage.label}
        </div>
        <div style={{ color: "#f8fafc", fontSize: 13, fontWeight: 800 }}>{props.stage.title}</div>
        <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{props.stage.narrative}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {props.stage.metrics.slice(0, 4).map((metric) => {
          const toneColor =
            metric.tone === "positive" ? nx.success : metric.tone === "negative" ? nx.risk : "#cbd5e1";
          return (
            <div key={`${props.stage.id}-${metric.label}`} style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
              <div style={{ color: nx.text, fontSize: 11, fontWeight: 700 }}>{metric.label}</div>
              <div style={{ color: toneColor, fontSize: 11, fontWeight: 700 }}>{metric.value}</div>
            </div>
          );
        })}
      </div>
    </button>
  );
}
