"use client";

import type React from "react";

import type { TypeCMultiAgentInsight } from "../../lib/typec/typeCMultiAgentContracts.ts";

export type TypeCMultiAgentPanelProps = {
  insight: TypeCMultiAgentInsight | null;
  loading: boolean;
  error: string | null;
  canRun: boolean;
  onRun: () => void;
  onClose: () => void;
};

const panelStyle = {
  position: "fixed",
  left: 16,
  top: 286,
  zIndex: 45,
  width: 390,
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "calc(100vh - 330px)",
  overflowY: "auto",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(168, 85, 247, 0.25)",
  background: "linear-gradient(180deg, rgba(49, 46, 129, 0.92), rgba(2, 6, 23, 0.9))",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.32)",
  color: "rgba(245, 243, 255, 0.94)",
  backdropFilter: "blur(14px)",
} as const;

const labelStyle = {
  color: "rgba(216, 180, 254, 0.82)",
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
  color: "rgba(237, 233, 254, 0.84)",
  fontSize: 12,
  lineHeight: 1.45,
} as const;

const buttonStyle = {
  borderRadius: 8,
  border: "1px solid rgba(233, 213, 255, 0.24)",
  background: "rgba(15, 23, 42, 0.54)",
  color: "rgba(245, 243, 255, 0.92)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 750,
  padding: "6px 9px",
} as const;

export function TypeCMultiAgentPanel({
  insight,
  loading,
  error,
  canRun,
  onRun,
  onClose,
}: TypeCMultiAgentPanelProps): React.ReactElement | null {
  if (!canRun && !insight && !error) return null;

  const disabled = loading || !canRun;

  return (
    <aside data-nx="typec-multi-agent-panel" aria-label="Type-C strategic intelligence" style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={labelStyle}>Strategic Intelligence</div>
          <h2 style={titleStyle}>{insight ? "Executive Synthesis" : "Run Strategic Intelligence"}</h2>
        </div>
        {insight || error ? (
          <button type="button" onClick={onClose} style={buttonStyle}>
            Close
          </button>
        ) : null}
      </div>

      {insight ? (
        <div style={{ marginTop: 10 }}>
          <p style={textStyle}>{insight.synthesis.executiveSummary}</p>
          <p style={textStyle}>{insight.synthesis.strategicRecommendation}</p>
          <p style={{ ...textStyle, color: "rgba(254, 226, 226, 0.86)" }}>{insight.synthesis.keyConflict}</p>
          {insight.synthesis.cautionAreas.length ? (
            <ul style={{ ...textStyle, paddingLeft: 16 }}>
              {insight.synthesis.cautionAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          ) : null}
          <div style={{ ...textStyle, display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span>Synthesis confidence</span>
            <strong>{Math.round(insight.synthesis.confidence * 100)}%</strong>
          </div>

          {insight.agentResponses.length ? (
            <div style={{ marginTop: 12 }}>
              {insight.agentResponses.map((agent) => (
                <details key={agent.agent} style={{ marginTop: 8 }}>
                  <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 800 }}>
                    {agent.agent} · {Math.round(agent.confidence * 100)}%
                  </summary>
                  <p style={textStyle}>{agent.insight}</p>
                  {agent.concerns.length ? (
                    <ul style={{ ...textStyle, paddingLeft: 16 }}>
                      {agent.concerns.map((concern) => (
                        <li key={concern}>{concern}</li>
                      ))}
                    </ul>
                  ) : null}
                </details>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <p style={textStyle}>Agents debate the deterministic recommendation. They cannot execute or mutate state.</p>
      )}

      {error ? <div style={{ ...textStyle, color: "rgba(254, 202, 202, 0.9)" }}>{error}</div> : null}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          onClick={onRun}
          disabled={disabled}
          style={{
            ...buttonStyle,
            opacity: disabled ? 0.55 : 1,
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Running..." : insight ? "Run Again" : "Run Strategic Intelligence"}
        </button>
      </div>
    </aside>
  );
}

export default TypeCMultiAgentPanel;
