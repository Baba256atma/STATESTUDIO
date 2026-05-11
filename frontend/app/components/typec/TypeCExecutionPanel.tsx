"use client";

import type React from "react";

import type { TypeCExecutionState } from "../../lib/typec/typeCExecutionState.ts";
import type { TypeCScenarioDraft } from "../../lib/typec/typeCScenarioDrafts.ts";

export type TypeCExecutionPanelProps = {
  executionState: TypeCExecutionState | null;
  scenario: TypeCScenarioDraft | null;
  onPause: () => void;
  onStop: () => void;
};

const panelStyle = {
  position: "fixed",
  left: 16,
  top: 88,
  zIndex: 47,
  width: 360,
  maxWidth: "calc(100vw - 32px)",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(74, 222, 128, 0.22)",
  background: "linear-gradient(180deg, rgba(6, 78, 59, 0.9), rgba(2, 6, 23, 0.9))",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.34)",
  color: "rgba(240, 253, 244, 0.94)",
  backdropFilter: "blur(14px)",
} as const;

const labelStyle = {
  color: "rgba(134, 239, 172, 0.78)",
  fontSize: 10,
  fontWeight: 850,
  textTransform: "uppercase",
} as const;

const titleStyle = {
  margin: "3px 0 0",
  fontSize: 14,
  lineHeight: 1.25,
  fontWeight: 800,
  letterSpacing: 0,
} as const;

const textStyle = {
  margin: "6px 0 0",
  color: "rgba(220, 252, 231, 0.84)",
  fontSize: 12,
  lineHeight: 1.45,
} as const;

const buttonStyle = {
  borderRadius: 8,
  border: "1px solid rgba(187, 247, 208, 0.24)",
  background: "rgba(15, 23, 42, 0.54)",
  color: "rgba(240, 253, 244, 0.92)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 750,
  padding: "6px 9px",
} as const;

function riskColor(riskLevel: TypeCExecutionState["riskLevel"]): string {
  if (riskLevel === "high") return "rgba(248, 113, 113, 0.95)";
  if (riskLevel === "medium") return "rgba(251, 191, 36, 0.95)";
  return "rgba(134, 239, 172, 0.9)";
}

function formatStartedAt(value: number | null): string {
  if (!value) return "Not started";
  try {
    return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "Started";
  }
}

export function TypeCExecutionPanel({
  executionState,
  scenario,
  onPause,
  onStop,
}: TypeCExecutionPanelProps): React.ReactElement | null {
  if (!executionState || executionState.status === "idle") return null;
  const title = scenario?.title ?? (executionState.scenarioId || "Execution stopped");

  return (
    <aside data-nx="typec-execution-panel" aria-label="Type-C execution monitoring" style={panelStyle}>
      <div style={labelStyle}>Execution Monitor</div>
      <h2 style={titleStyle}>{title}</h2>
      <div style={{ ...textStyle, display: "flex", justifyContent: "space-between", gap: 10 }}>
        <span>Status: {executionState.status}</span>
        <strong style={{ color: riskColor(executionState.riskLevel), textTransform: "uppercase" }}>
          {executionState.riskLevel}
        </strong>
      </div>
      <div style={textStyle}>Started: {formatStartedAt(executionState.startedAt)}</div>

      <div style={{ marginTop: 10 }}>
        <div style={labelStyle}>Monitored Signals</div>
        {executionState.monitoredSignals.length ? (
          <ul style={{ ...textStyle, paddingLeft: 16 }}>
            {executionState.monitoredSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        ) : (
          <div style={textStyle}>No active monitoring signals.</div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={onPause}
          disabled={executionState.status !== "running"}
          style={{
            ...buttonStyle,
            opacity: executionState.status === "running" ? 1 : 0.55,
            cursor: executionState.status === "running" ? "pointer" : "not-allowed",
          }}
        >
          Pause
        </button>
        <button type="button" onClick={onStop} style={buttonStyle}>
          Stop
        </button>
      </div>
    </aside>
  );
}

export default TypeCExecutionPanel;
