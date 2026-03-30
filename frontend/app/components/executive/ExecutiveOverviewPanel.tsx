"use client";

import React from "react";

import { EmptyStateCard } from "../ui/panelStates";
import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { ExecutiveOSController } from "../../lib/executive/executiveOSTypes";

const MODES = ["observe", "investigate", "simulate", "compare", "decide", "review"] as const;

type ExecutiveOverviewPanelProps = {
  controller: ExecutiveOSController;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
};

export function ExecutiveOverviewPanel({ controller, resolveObjectLabel }: ExecutiveOverviewPanelProps) {
  const summary = controller.state.workspaceSummary;
  if (!summary) {
    return <EmptyStateCard text="Executive operating context becomes available as Nexora gathers pressure, strategy, and learning signals." />;
  }
  const focusLabel = resolveObjectLabel?.(summary.current_focus_object_id) ?? summary.current_focus_object_id ?? null;
  const modeHint =
    controller.state.operatingMode === "observe"
      ? "Monitor overall business condition and watch for pressure shifts."
      : controller.state.operatingMode === "investigate"
      ? "Drill into the object, path, or pressure point that currently matters most."
      : controller.state.operatingMode === "simulate"
      ? "Test scenario pressure before committing to an operational move."
      : controller.state.operatingMode === "compare"
      ? "Compare tradeoffs before choosing a strategic path."
      : controller.state.operatingMode === "decide"
      ? "Prepare a concrete executive move and route it into the War Room."
      : "Review what changed, what worked, and what Nexora learned.";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Executive Overview</div>
      <div style={{ ...softCardStyle, padding: 12, gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
          <div>
            <div style={{ color: nx.text, fontSize: 16, fontWeight: 800 }}>{summary.headline}</div>
            <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>{summary.summary}</div>
          </div>
          <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>{controller.state.operatingMode.toUpperCase()}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>Focus</div>
            <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>
              {summary.current_focus_object_id ? focusLabel ?? "Target is outside the current scene." : "No focus selected"}
            </div>
          </div>
          <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>Pressure</div>
            <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>
              {summary.current_pressure_level != null ? summary.current_pressure_level.toFixed(2) : "-"}
            </div>
          </div>
          <div style={{ padding: 8, borderRadius: 10, background: "rgba(2,6,23,0.35)" }}>
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>Queue</div>
            <div style={{ color: nx.text, fontSize: 12, fontWeight: 700 }}>{controller.state.operatingQueue.length}</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
          {MODES.map((mode) => {
            const active = controller.state.operatingMode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => controller.setOperatingMode(mode)}
                style={{
                  borderRadius: 10,
                  border: `1px solid ${active ? nx.borderStrong : nx.border}`,
                  background: active ? "rgba(59,130,246,0.16)" : "rgba(2,6,23,0.42)",
                  color: active ? "#dbeafe" : nx.text,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "10px 8px",
                  cursor: "pointer",
                }}
              >
                {mode[0].toUpperCase()}
                {mode.slice(1)}
              </button>
            );
          })}
        </div>
        <div style={{ padding: 10, borderRadius: 10, background: "rgba(2,6,23,0.35)", color: nx.muted, fontSize: 12, lineHeight: 1.5 }}>
          {modeHint}
        </div>
      </div>
    </div>
  );
}
