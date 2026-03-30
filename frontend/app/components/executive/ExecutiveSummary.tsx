"use client";

import React from "react";
import { cardStyle, nx, sectionTitleStyle } from "../ui/nexoraTheme";

type ExecutiveSummaryProps = {
  focusLabel: string;
  fragilityLevel: string;
  pressureIndicators: string[];
  insight: string;
  titleLabel?: string;
  focusTitle?: string;
  pressureTitle?: string;
  emptyPressureText?: string;
};

export function ExecutiveSummary(props: ExecutiveSummaryProps) {
  const normalizedLevel = props.fragilityLevel.toLowerCase();
  const stateTone = normalizedLevel.includes("high") || normalizedLevel.includes("critical")
    ? nx.risk
    : normalizedLevel.includes("medium") || normalizedLevel.includes("warning")
    ? nx.warning
    : nx.success;
  return (
    <div
      style={{
        ...cardStyle,
        gap: 12,
        border: "1px solid rgba(96,165,250,0.22)",
        boxShadow: "inset 0 0 0 1px rgba(96,165,250,0.06), 0 18px 36px rgba(2,6,23,0.16)",
        background: "linear-gradient(180deg, rgba(15,23,42,0.88), rgba(8,16,28,0.84))",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div style={sectionTitleStyle}>{props.titleLabel ?? "Executive Overview"}</div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 10px",
            borderRadius: 999,
            border: `1px solid ${nx.border}`,
            background: "rgba(2,6,23,0.44)",
            color: "#f8fafc",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: stateTone, boxShadow: `0 0 12px ${stateTone}` }} />
          {props.fragilityLevel}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 12 }}>
        <div>
          <div style={{ color: nx.lowMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
            {props.focusTitle ?? "Current Focus"}
          </div>
          <div style={{ color: nx.text, fontSize: 18, fontWeight: 800, marginTop: 4, lineHeight: 1.2 }}>{props.focusLabel}</div>
        </div>
        <div>
          <div style={{ color: nx.lowMuted, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
            {props.pressureTitle ?? "Current Pressure"}
          </div>
          <div style={{ color: nx.muted, fontSize: 12, marginTop: 4 }}>
            {props.pressureIndicators.length ? props.pressureIndicators.join(" · ") : props.emptyPressureText ?? "No major pressure signal is active in the current scene."}
          </div>
        </div>
      </div>
      <div
        style={{
          padding: "12px 14px",
          borderRadius: 14,
          border: `1px solid ${nx.border}`,
          background: "rgba(2,6,23,0.5)",
          color: "#f8fafc",
          fontSize: 13,
          fontWeight: 700,
          lineHeight: 1.5,
        }}
      >
        {props.insight}
      </div>
    </div>
  );
}
