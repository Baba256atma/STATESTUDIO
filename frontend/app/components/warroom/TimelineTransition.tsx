"use client";

import React from "react";

import { nx } from "../ui/nexoraTheme";

export type DecisionTimelineTransitionData = {
  id: string;
  label: string;
  summary: string;
  tone?: "positive" | "negative" | "neutral";
};

type TimelineTransitionProps = {
  transition: DecisionTimelineTransitionData;
};

export function TimelineTransition(props: TimelineTransitionProps) {
  const color =
    props.transition.tone === "positive"
      ? nx.success
      : props.transition.tone === "negative"
      ? nx.risk
      : "#93c5fd";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 88,
        padding: "0 4px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ color, fontSize: 18, fontWeight: 800 }}>→</div>
        <div style={{ color: "#cbd5f5", fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center" }}>
          {props.transition.label}
        </div>
        <div style={{ color: nx.muted, fontSize: 11, lineHeight: 1.35, textAlign: "center", maxWidth: 120 }}>
          {props.transition.summary}
        </div>
      </div>
    </div>
  );
}
