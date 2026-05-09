"use client";

import type React from "react";

import type { TypeCDecisionRecommendation } from "../../lib/typec/typeCDecisionRecommendation.ts";
import type { TypeCScenarioComparison } from "../../lib/typec/typeCScenarioComparison.ts";

export type TypeCDecisionPanelProps = {
  recommendation: TypeCDecisionRecommendation | null;
  comparison: TypeCScenarioComparison | null;
};

const panelStyle = {
  position: "fixed",
  right: 16,
  top: 380,
  zIndex: 47,
  width: 420,
  maxWidth: "calc(100vw - 32px)",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(253, 224, 71, 0.24)",
  background: "linear-gradient(180deg, rgba(30, 27, 75, 0.94), rgba(2, 6, 23, 0.91))",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.34)",
  color: "rgba(255, 251, 235, 0.94)",
  backdropFilter: "blur(14px)",
} as const;

const labelStyle = {
  color: "rgba(253, 224, 71, 0.74)",
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
  color: "rgba(254, 243, 199, 0.84)",
  fontSize: 12,
  lineHeight: 1.45,
} as const;

function pct(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function TypeCDecisionPanel({
  recommendation,
  comparison,
}: TypeCDecisionPanelProps): React.ReactElement | null {
  if (!recommendation) return null;

  const recommendedRow = comparison?.rows.find(
    (row) => row.scenarioId === recommendation.recommendedScenarioId
  );
  const title = recommendedRow?.title ?? recommendation.recommendedScenarioId ?? "No recommendation yet";

  return (
    <aside data-nx="typec-decision-panel" aria-label="Type-C decision recommendation" style={panelStyle}>
      <div style={labelStyle}>Decision Recommendation</div>
      <h2 style={titleStyle}>{title}</h2>
      <div style={{ ...textStyle, color: "rgba(125, 211, 252, 0.86)", fontWeight: 800 }}>
        Confidence {pct(recommendation.confidence)}
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={labelStyle}>Why</div>
        <p style={textStyle}>{recommendation.reasoning}</p>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={labelStyle}>Tradeoff</div>
        <p style={textStyle}>{recommendation.tradeoff}</p>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={labelStyle}>Risk Warning</div>
        <p style={{ ...textStyle, color: "rgba(254, 202, 202, 0.9)" }}>{recommendation.riskWarning}</p>
      </div>

      <div style={{ marginTop: 10 }}>
        <div style={labelStyle}>Next Move</div>
        <p style={textStyle}>{recommendation.nextAction}</p>
      </div>
    </aside>
  );
}

export default TypeCDecisionPanel;
