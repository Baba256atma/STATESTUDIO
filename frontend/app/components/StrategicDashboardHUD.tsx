"use client";

import React from "react";

export function StrategicDashboardHUD(props: {
  strategicState?: any;
  layoutMode?: "floating" | "split";
}) {
  const { strategicState } = props;

  if (!strategicState) {
    return (
      <div
        style={{
          padding: 12,
          borderRadius: 14,
          background: "rgba(10,14,22,0.72)",
          border: "1px solid rgba(120,170,255,0.25)",
          color: "rgba(255,255,255,0.9)",
          fontSize: 12,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Strategic Dashboard</div>
        <div style={{ opacity: 0.75 }}>No strategic data yet.</div>
      </div>
    );
  }

  const toPct = (v: any) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    return `${Math.round(n * 100)}%`;
  };

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 14,
        background: "rgba(10,14,22,0.72)",
        border: "1px solid rgba(120,170,255,0.25)",
        color: "rgba(255,255,255,0.9)",
        fontSize: 12,
      }}
    >
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Strategic Dashboard</div>
      <div style={{ display: "grid", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ opacity: 0.75 }}>Tension</span>
          <span>{toPct(1 - Number(strategicState?.stability ?? 0))}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ opacity: 0.75 }}>Risk</span>
          <span>{toPct(strategicState?.systemicRisk)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ opacity: 0.75 }}>Stability</span>
          <span>{toPct(strategicState?.stability)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ opacity: 0.75 }}>Dominant Loop</span>
          <span>{strategicState?.dominantLoopId ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}
