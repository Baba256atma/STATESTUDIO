"use client";

import React from "react";

function readDashboardMetric(state: unknown, flatKey: string, signalKey?: string): unknown {
  if (!state || typeof state !== "object") return undefined;
  const record = state as Record<string, unknown>;
  if (flatKey in record) return record[flatKey];
  const signals = record.signals;
  if (!Array.isArray(signals) || !signalKey) return undefined;
  const match = signals.find(
    (entry) => entry && typeof entry === "object" && (entry as Record<string, unknown>).key === signalKey
  );
  return match && typeof match === "object" ? (match as Record<string, unknown>).value : undefined;
}

export function StrategicDashboardHUD(props: {
  strategicState?: unknown;
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

  const toPct = (v: unknown) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return "—";
    return `${Math.round(n * 100)}%`;
  };

  const stability = readDashboardMetric(strategicState, "stability", "stability");
  const systemicRisk = readDashboardMetric(strategicState, "systemicRisk", "systemicRisk");
  const dominantLoopId = readDashboardMetric(strategicState, "dominantLoopId");

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
          <span>{toPct(1 - Number(stability ?? 0))}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ opacity: 0.75 }}>Risk</span>
          <span>{toPct(systemicRisk)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ opacity: 0.75 }}>Stability</span>
          <span>{toPct(stability)}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <span style={{ opacity: 0.75 }}>Dominant Loop</span>
          <span>{typeof dominantLoopId === "string" && dominantLoopId.trim() ? dominantLoopId : "—"}</span>
        </div>
      </div>
    </div>
  );
}
