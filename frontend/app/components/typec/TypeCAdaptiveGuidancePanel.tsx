"use client";

import type React from "react";

import type { TypeCAdaptiveGuidance } from "../../lib/typec/typeCAdaptiveGuidance.ts";

export type TypeCAdaptiveGuidancePanelProps = {
  guidance: TypeCAdaptiveGuidance | null;
};

const panelStyle = {
  position: "fixed",
  right: 16,
  top: 88,
  zIndex: 45,
  width: 360,
  maxWidth: "calc(100vw - 32px)",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(168, 85, 247, 0.22)",
  background: "linear-gradient(180deg, rgba(59, 7, 100, 0.9), rgba(2, 6, 23, 0.9))",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.3)",
  color: "rgba(250, 245, 255, 0.94)",
  backdropFilter: "blur(14px)",
} as const;

const labelStyle = {
  color: "rgba(216, 180, 254, 0.78)",
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
  margin: "7px 0 0",
  color: "rgba(243, 232, 255, 0.84)",
  fontSize: 12,
  lineHeight: 1.45,
} as const;

const tagStyle = {
  borderRadius: 999,
  border: "1px solid rgba(233, 213, 255, 0.18)",
  background: "rgba(15, 23, 42, 0.36)",
  color: "rgba(243, 232, 255, 0.82)",
  fontSize: 10,
  fontWeight: 750,
  padding: "3px 7px",
} as const;

export function TypeCAdaptiveGuidancePanel({
  guidance,
}: TypeCAdaptiveGuidancePanelProps): React.ReactElement | null {
  if (!guidance) return null;

  return (
    <aside data-nx="typec-adaptive-guidance-panel" aria-label="Type-C adaptive guidance" style={panelStyle}>
      <div style={labelStyle}>Adaptive Guidance</div>
      <h2 style={titleStyle}>{guidance.message}</h2>
      <p style={textStyle}>{guidance.recommendedAdjustment}</p>

      {guidance.contextFactors.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
          {guidance.contextFactors.map((factor) => (
            <span key={factor} style={tagStyle}>
              {factor}
            </span>
          ))}
        </div>
      ) : null}

      <div style={{ ...textStyle, display: "flex", justifyContent: "space-between", gap: 10 }}>
        <span>Confidence</span>
        <strong>{Math.round(guidance.confidence * 100)}%</strong>
      </div>
    </aside>
  );
}

export default TypeCAdaptiveGuidancePanel;
