"use client";

import type React from "react";

import type { TypeCSandboxResult, TypeCSandboxStrategy } from "../../lib/typec/typeCSandboxContracts.ts";

export type TypeCSandboxPanelProps = {
  result: TypeCSandboxResult | null;
  loading: boolean;
  error: string | null;
  canRun: boolean;
  onRun: () => void;
  onClose: () => void;
  onReview: (strategy: TypeCSandboxStrategy) => void;
  onCompare: (strategy: TypeCSandboxStrategy) => void;
  onPromote: (strategy: TypeCSandboxStrategy) => void;
};

const panelStyle = {
  position: "fixed",
  left: 16,
  bottom: 18,
  zIndex: 47,
  width: 420,
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "calc(100vh - 180px)",
  overflowY: "auto",
  padding: 14,
  borderRadius: 12,
  border: "1px solid var(--nx-border-soft)",
  background: "color-mix(in srgb, var(--nx-bg-panel) 94%, transparent)",
  boxShadow: "0 18px 52px rgba(0, 0, 0, 0.34)",
  color: "var(--nx-text)",
  backdropFilter: "blur(14px)",
} as const;

const labelStyle = {
  color: "var(--nx-muted)",
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
  color: "var(--nx-text-soft)",
  fontSize: 12,
  lineHeight: 1.45,
} as const;

const buttonStyle = {
  borderRadius: 8,
  border: "1px solid var(--nx-border)",
  background: "var(--nx-bg-control)",
  color: "var(--nx-text-soft)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 750,
  padding: "6px 9px",
} as const;

function list(items: string[]): React.ReactNode {
  if (!items.length) return <div style={textStyle}>none</div>;
  return (
    <ul style={{ ...textStyle, paddingLeft: 16 }}>
      {items.slice(0, 3).map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function TypeCSandboxPanel({
  result,
  loading,
  error,
  canRun,
  onRun,
  onClose,
  onReview,
  onCompare,
  onPromote,
}: TypeCSandboxPanelProps): React.ReactElement | null {
  if (!canRun && !result && !error) return null;
  const disabled = loading || !canRun;
  const bestId = result?.bestStrategyId ?? null;

  return (
    <aside data-nx="typec-sandbox-panel" aria-label="Type-C autonomous sandbox" style={panelStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div style={labelStyle}>Autonomous Sandbox</div>
          <h2 style={titleStyle}>{result ? "Sandbox Futures" : "Run Autonomous Sandbox"}</h2>
        </div>
        {result || error ? (
          <button type="button" onClick={onClose} style={buttonStyle}>
            Close
          </button>
        ) : null}
      </div>

      {result ? (
        <div style={{ marginTop: 10 }}>
          <p style={textStyle}>{result.summary}</p>
          {result.strategies.map((strategy) => (
            <section
              key={strategy.id}
              style={{
                marginTop: 12,
                paddingTop: 10,
                borderTop: "1px solid var(--nx-border-soft)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <strong style={{ fontSize: 12 }}>{strategy.title}</strong>
                <span style={{ color: "var(--nx-accent-ink)", fontSize: 11 }}>
                  {bestId === strategy.id ? "Best · " : ""}
                  {Math.round(strategy.confidence * 100)}%
                </span>
              </div>
              <p style={textStyle}>{strategy.description}</p>
              <div style={textStyle}>
                <strong>Actions</strong>
                {list(strategy.proposedActions)}
                <strong>Benefits</strong>
                {list(strategy.expectedBenefits)}
                <strong>Risks</strong>
                {list(strategy.risks)}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 8, marginTop: 9 }}>
                <button type="button" onClick={() => onReview(strategy)} style={buttonStyle}>
                  Review
                </button>
                <button type="button" onClick={() => onCompare(strategy)} style={buttonStyle}>
                  Compare
                </button>
                <button type="button" onClick={() => onPromote(strategy)} style={buttonStyle}>
                  Promote to Review Queue
                </button>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p style={textStyle}>Sandbox clones the scene and explores futures. It cannot mutate the real system.</p>
      )}

      {error ? <div style={{ ...textStyle, color: "var(--nx-risk)" }}>{error}</div> : null}

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
          {loading ? "Running..." : result ? "Run Again" : "Run Autonomous Sandbox"}
        </button>
      </div>
    </aside>
  );
}

export default TypeCSandboxPanel;
