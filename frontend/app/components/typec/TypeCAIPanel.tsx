"use client";

import type React from "react";

import type { TypeCAIInsightResponse } from "../../lib/typec/typeCAIContracts.ts";

export type TypeCAIPanelProps = {
  insight: TypeCAIInsightResponse | null;
  loading: boolean;
  error: string | null;
  canGenerate: boolean;
  onGenerate: () => void;
  onClose: () => void;
};

const panelStyle = {
  position: "fixed",
  right: 16,
  top: 286,
  zIndex: 45,
  width: 360,
  maxWidth: "calc(100vw - 32px)",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(14, 165, 233, 0.24)",
  background: "linear-gradient(180deg, rgba(8, 47, 73, 0.92), rgba(2, 6, 23, 0.9))",
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
  margin: "7px 0 0",
  color: "rgba(224, 242, 254, 0.84)",
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

export function TypeCAIPanel({
  insight,
  loading,
  error,
  canGenerate,
  onGenerate,
  onClose,
}: TypeCAIPanelProps): React.ReactElement | null {
  if (!canGenerate && !insight && !error) return null;

  const disabled = loading || !canGenerate;

  return (
    <aside data-nx="typec-ai-panel" aria-label="Type-C AI insight" style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={labelStyle}>AI Advisory</div>
          <h2 style={titleStyle}>{insight ? "Executive Insight" : "Generate AI Insight"}</h2>
        </div>
        {insight || error ? (
          <button type="button" onClick={onClose} style={buttonStyle}>
            Close
          </button>
        ) : null}
      </div>

      {insight ? (
        <div style={{ marginTop: 10 }}>
          <p style={textStyle}>{insight.executiveSummary}</p>
          <p style={textStyle}>{insight.strategicInsight}</p>
          <p style={{ ...textStyle, color: "rgba(254, 202, 202, 0.84)" }}>{insight.cautionNote}</p>
          {insight.suggestedQuestions.length ? (
            <ul style={{ ...textStyle, paddingLeft: 16 }}>
              {insight.suggestedQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          ) : null}
          <div style={{ ...textStyle, display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span>AI confidence</span>
            <strong>{Math.round(insight.confidence * 100)}%</strong>
          </div>
        </div>
      ) : (
        <p style={textStyle}>AI can summarize the deterministic recommendation. It cannot execute or mutate state.</p>
      )}

      {error ? <div style={{ ...textStyle, color: "rgba(254, 202, 202, 0.9)" }}>{error}</div> : null}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={onGenerate}
          disabled={disabled}
          style={{
            ...buttonStyle,
            opacity: disabled ? 0.55 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Generating..." : insight ? "Regenerate" : "Generate AI Insight"}
        </button>
      </div>
    </aside>
  );
}

export default TypeCAIPanel;
