"use client";

import React from "react";

import { EmptyStateCard } from "../ui/panelStates";
import { nx, sectionTitleStyle, softCardStyle } from "../ui/nexoraTheme";
import type { ExecutiveOSController } from "../../lib/executive/executiveOSTypes";

type ExecutiveSignalsPanelProps = {
  controller: ExecutiveOSController;
  resolveObjectLabel?: ((id: string | null | undefined) => string | null) | null;
};

export function ExecutiveSignalsPanel({ controller, resolveObjectLabel }: ExecutiveSignalsPanelProps) {
  const signals = controller.state.executiveSignals;
  if (!signals.length) {
    return <EmptyStateCard text="Executive signals appear when Nexora detects pressure, leverage, or tradeoffs worth immediate attention." />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={sectionTitleStyle}>Executive Signals</div>
      {signals.map((signal) => (
        <button
          key={signal.signal_id}
          type="button"
          onClick={() => controller.focusObject(signal.target_object_id ?? null)}
          style={{
            ...softCardStyle,
            width: "100%",
            textAlign: "left",
            padding: 10,
            gap: 6,
            cursor: signal.target_object_id ? "pointer" : "default",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div style={{ color: nx.text, fontSize: 13, fontWeight: 700 }}>{signal.title}</div>
            <div style={{ color: "#93c5fd", fontSize: 11, fontWeight: 700 }}>{signal.kind.toUpperCase()}</div>
          </div>
          <div style={{ color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>{signal.summary}</div>
          {signal.target_object_id ? (
            <div style={{ color: nx.lowMuted, fontSize: 11 }}>
              {resolveObjectLabel?.(signal.target_object_id) ?? "This target is outside the current scene context."}
            </div>
          ) : null}
          <div style={{ display: "flex", gap: 12, color: nx.lowMuted, fontSize: 11 }}>
            <span>Impact {Number(signal.severity ?? 0).toFixed(2)}</span>
            <span>Confidence {Number(signal.confidence ?? 0).toFixed(2)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
