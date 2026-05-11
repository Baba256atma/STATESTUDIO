"use client";

import type React from "react";

import type { TypeCLearningSignals, TypeCMemoryState } from "../../lib/typec/typeCMemory.ts";

export type TypeCMemoryPanelProps = {
  memoryState: TypeCMemoryState;
  learningSignals: TypeCLearningSignals;
  onClearMemory: () => void;
};

const panelStyle = {
  position: "fixed",
  left: 16,
  bottom: 18,
  zIndex: 44,
  width: 360,
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "min(42vh, 360px)",
  overflowY: "auto",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(125, 211, 252, 0.2)",
  background: "linear-gradient(180deg, rgba(12, 74, 110, 0.88), rgba(2, 6, 23, 0.9))",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.3)",
  color: "rgba(240, 249, 255, 0.94)",
  backdropFilter: "blur(14px)",
} as const;

const labelStyle = {
  color: "rgba(125, 211, 252, 0.78)",
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
  margin: "4px 0 0",
  color: "rgba(224, 242, 254, 0.82)",
  fontSize: 12,
  lineHeight: 1.45,
} as const;

const buttonStyle = {
  borderRadius: 8,
  border: "1px solid rgba(186, 230, 253, 0.24)",
  background: "rgba(15, 23, 42, 0.54)",
  color: "rgba(240, 249, 255, 0.92)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 750,
  padding: "6px 9px",
} as const;

function riskColor(riskLevel: "low" | "medium" | "high"): string {
  if (riskLevel === "high") return "rgba(248, 113, 113, 0.95)";
  if (riskLevel === "medium") return "rgba(251, 191, 36, 0.95)";
  return "rgba(134, 239, 172, 0.9)";
}

function formatTime(timestamp: number): string {
  try {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "Recorded";
  }
}

function renderSignals(title: string, signals: string[]): React.ReactElement | null {
  if (!signals.length) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={labelStyle}>{title}</div>
      <ul style={{ ...textStyle, paddingLeft: 16 }}>
        {signals.map((signal) => (
          <li key={signal}>{signal}</li>
        ))}
      </ul>
    </div>
  );
}

export function TypeCMemoryPanel({
  memoryState,
  learningSignals,
  onClearMemory,
}: TypeCMemoryPanelProps): React.ReactElement | null {
  const entries = memoryState.entries;
  if (!entries.length) return null;

  return (
    <aside data-nx="typec-memory-panel" aria-label="Type-C memory and learning" style={panelStyle}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={labelStyle}>Memory</div>
          <h2 style={titleStyle}>Learning Loop</h2>
        </div>
        <button type="button" onClick={onClearMemory} style={buttonStyle}>
          Clear Memory
        </button>
      </div>

      {renderSignals("Repeated risks", learningSignals.repeatedRisks)}
      {renderSignals("Stable patterns", learningSignals.stablePatterns)}
      {renderSignals("Unstable patterns", learningSignals.unstablePatterns)}

      <div style={{ marginTop: 12 }}>
        <div style={labelStyle}>Past executions</div>
        <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
          {entries.slice(0, 6).map((entry) => (
            <div
              key={entry.id}
              style={{
                borderRadius: 10,
                border: "1px solid rgba(186, 230, 253, 0.14)",
                background: "rgba(15, 23, 42, 0.34)",
                padding: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <strong style={{ fontSize: 11 }}>{entry.scenarioId}</strong>
                <span style={{ color: "rgba(224, 242, 254, 0.58)", fontSize: 10 }}>
                  {formatTime(entry.timestamp)}
                </span>
              </div>
              <div style={{ ...textStyle, display: "flex", gap: 10 }}>
                <span style={{ color: riskColor(entry.riskLevel), textTransform: "uppercase" }}>
                  {entry.riskLevel}
                </span>
                <span>Outcome: {entry.outcome}</span>
              </div>
              <div style={textStyle}>{entry.decisionSummary}</div>
              {entry.signalsObserved.length ? (
                <div style={{ ...textStyle, color: "rgba(186, 230, 253, 0.66)", fontSize: 11 }}>
                  Signals: {entry.signalsObserved.slice(0, 3).join(", ")}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default TypeCMemoryPanel;
