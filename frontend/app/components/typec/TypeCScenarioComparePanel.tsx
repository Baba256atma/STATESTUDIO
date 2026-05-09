"use client";

import type React from "react";

import type { TypeCScenarioComparison } from "../../lib/typec/typeCScenarioComparison.ts";

export type TypeCScenarioComparePanelProps = {
  comparison: TypeCScenarioComparison | null;
  onClose: () => void;
  onOpenBest: () => void;
};

const panelStyle = {
  position: "fixed",
  right: 16,
  top: 88,
  zIndex: 47,
  width: 420,
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "calc(100vh - 128px)",
  overflowY: "auto",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(125, 211, 252, 0.24)",
  background: "linear-gradient(180deg, rgba(12, 24, 49, 0.94), rgba(2, 6, 23, 0.91))",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.36)",
  color: "rgba(241, 245, 249, 0.94)",
  backdropFilter: "blur(14px)",
} as const;

const titleStyle = {
  margin: 0,
  fontSize: 14,
  lineHeight: 1.25,
  fontWeight: 800,
  letterSpacing: 0,
} as const;

const textStyle = {
  margin: "6px 0 0",
  color: "rgba(203, 213, 225, 0.86)",
  fontSize: 12,
  lineHeight: 1.45,
} as const;

const buttonStyle = {
  borderRadius: 8,
  border: "1px solid rgba(148, 163, 184, 0.24)",
  background: "rgba(15, 23, 42, 0.54)",
  color: "rgba(226, 232, 240, 0.92)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 750,
  padding: "6px 9px",
} as const;

function riskColor(riskLevel: TypeCScenarioComparison["rows"][number]["riskLevel"]): string {
  if (riskLevel === "high") return "rgba(248, 113, 113, 0.95)";
  if (riskLevel === "medium") return "rgba(251, 191, 36, 0.95)";
  return "rgba(125, 211, 252, 0.9)";
}

function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function TypeCScenarioComparePanel({
  comparison,
  onClose,
  onOpenBest,
}: TypeCScenarioComparePanelProps): React.ReactElement | null {
  if (!comparison) return null;

  return (
    <aside data-nx="typec-scenario-compare-panel" aria-label="Type-C scenario comparison" style={panelStyle}>
      <div style={{ color: "rgba(125, 211, 252, 0.74)", fontSize: 10, fontWeight: 800 }}>
        Scenario Compare
      </div>
      <h2 style={titleStyle}>Compare Futures</h2>
      <p style={textStyle}>{comparison.summary}</p>

      <div style={{ marginTop: 12, display: "grid", gap: 9 }}>
        {comparison.rows.length ? (
          comparison.rows.map((row) => (
            <div
              key={row.scenarioId}
              style={{
                borderRadius: 10,
                border:
                  row.scenarioId === comparison.bestOptionId
                    ? "1px solid rgba(125, 211, 252, 0.42)"
                    : "1px solid rgba(148, 163, 184, 0.16)",
                background:
                  row.scenarioId === comparison.bestOptionId
                    ? "rgba(14, 116, 144, 0.16)"
                    : "rgba(15, 23, 42, 0.36)",
                padding: 10,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <strong style={{ fontSize: 12 }}>{row.title}</strong>
                <span
                  style={{
                    color: riskColor(row.riskLevel),
                    fontSize: 10,
                    fontWeight: 850,
                    textTransform: "uppercase",
                  }}
                >
                  {row.riskLevel}
                </span>
              </div>
              <div style={textStyle}>
                affected {row.affectedCount} · paths {row.pathCount} · confidence {pct(row.confidence)}
              </div>
              <div style={textStyle}>{row.tradeoff}</div>
              {row.scenarioId === comparison.bestOptionId ? (
                <div style={{ ...textStyle, color: "rgba(125, 211, 252, 0.86)", fontWeight: 750 }}>
                  Best structural option
                </div>
              ) : null}
              {row.scenarioId === comparison.highestRiskScenarioId ? (
                <div style={{ ...textStyle, color: "rgba(248, 113, 113, 0.86)", fontWeight: 750 }}>
                  Highest-risk future
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div style={textStyle}>No simulations available.</div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button type="button" onClick={onClose} style={buttonStyle}>
          Close Compare
        </button>
        <button
          type="button"
          onClick={onOpenBest}
          disabled={!comparison.bestOptionId}
          style={{
            ...buttonStyle,
            cursor: comparison.bestOptionId ? "pointer" : "not-allowed",
            opacity: comparison.bestOptionId ? 1 : 0.55,
          }}
        >
          Open Best in War Room
        </button>
      </div>
    </aside>
  );
}

export default TypeCScenarioComparePanel;
