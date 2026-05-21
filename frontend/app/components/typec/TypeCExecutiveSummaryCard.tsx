"use client";

import type React from "react";
import { useState } from "react";

import {
  isTypeCEnhanceDisabled,
  type TypeCAIExecutiveInsight,
} from "../../lib/typec/aiTypeCExecutiveInsight.ts";
import type { TypeCExecutiveAction } from "../../lib/typec/typeCExecutiveActions.ts";
import type { TypeCExecutiveSummary } from "../../lib/typec/typeCExecutiveSummary.ts";
import type { ExecutiveMetaCognitionSnapshot } from "../../lib/meta-cognition";
import type { ExecutiveReasoningTransparency } from "../../lib/reasoning-transparency";

export type TypeCExecutiveSummaryCardPlacement = "stage" | "panel" | "overlay";

export type TypeCExecutiveSummaryCardProps = {
  placement?: TypeCExecutiveSummaryCardPlacement;
  summary: TypeCExecutiveSummary | null;
  aiInsight?: TypeCAIExecutiveInsight | null;
  onEnhance?: () => Promise<void>;
  hasSelectedObject?: boolean;
  executiveActions?: TypeCExecutiveAction[];
  onExecutiveAction?: (action: TypeCExecutiveAction) => void;
  metaCognition?: ExecutiveMetaCognitionSnapshot | null;
  reasoningTransparency?: ExecutiveReasoningTransparency | null;
};

const cardStyle = {
  position: "fixed",
  right: 16,
  top: 76,
  zIndex: 40,
  width: 300,
  maxWidth: "calc(100vw - 32px)",
  padding: 14,
  borderRadius: 12,
  border: "1px solid rgba(148, 163, 184, 0.2)",
  background: "linear-gradient(180deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.82))",
  boxShadow: "0 18px 48px rgba(0, 0, 0, 0.28)",
  color: "rgba(241, 245, 249, 0.94)",
  backdropFilter: "blur(14px)",
  pointerEvents: "auto",
} as const;

const eyebrowStyle = {
  marginBottom: 8,
  color: "rgba(125, 211, 252, 0.82)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: 0,
  textTransform: "uppercase",
} as const;

const headlineStyle = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.25,
  fontWeight: 700,
  letterSpacing: 0,
} as const;

const textStyle = {
  margin: "8px 0 0",
  color: "rgba(203, 213, 225, 0.9)",
  fontSize: 12,
  lineHeight: 1.45,
} as const;

const sectionStyle = {
  marginTop: 10,
  paddingTop: 8,
  borderTop: "1px solid rgba(148, 163, 184, 0.14)",
} as const;

const sectionTitleStyle = {
  marginBottom: 4,
  color: "rgba(226, 232, 240, 0.88)",
  fontSize: 11,
  fontWeight: 700,
} as const;

const buttonStyle = {
  marginTop: 10,
  borderRadius: 8,
  border: "1px solid rgba(125, 211, 252, 0.24)",
  background: "rgba(15, 23, 42, 0.42)",
  color: "rgba(226, 232, 240, 0.86)",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 700,
  padding: "6px 9px",
} as const;

const disabledButtonStyle = {
  ...buttonStyle,
  cursor: "not-allowed",
  opacity: 0.45,
} as const;

function formatConfidence(summary: TypeCExecutiveSummary): string {
  return `${summary.confidence.label} (${summary.confidence.value}%)`;
}

function topTwo(items: string[]): string[] {
  return items.slice(0, 2);
}

function MiniList({ title, items }: { title: string; items: string[] }): React.ReactElement | null {
  const displayItems = topTwo(items);
  if (!displayItems.length) return null;

  return (
    <div style={sectionStyle}>
      <div style={sectionTitleStyle}>{title}</div>
      {displayItems.map((item) => (
        <div key={item} style={textStyle}>
          {item}
        </div>
      ))}
    </div>
  );
}

export function TypeCExecutiveSummaryCard({
  summary,
  aiInsight = null,
  onEnhance,
  hasSelectedObject = true,
  executiveActions = [],
  onExecutiveAction,
  metaCognition = null,
  reasoningTransparency = null,
}: TypeCExecutiveSummaryCardProps): React.ReactElement | null {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!summary) return null;

  const isEnhanceDisabled = isTypeCEnhanceDisabled(summary, Boolean(onEnhance), hasSelectedObject);
  const handleEnhance = async () => {
    if (!onEnhance || isEnhanceDisabled || isEnhancing) return;
    try {
      setIsEnhancing(true);
      setError(null);
      await onEnhance();
    } catch {
      setError("Enhancement failed");
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <aside data-nx="typec-executive-summary-card" aria-label="Type-C executive summary" style={cardStyle}>
      <div style={eyebrowStyle}>Executive Summary</div>
      <h2 style={headlineStyle}>{summary.headline}</h2>
      <p style={textStyle}>{summary.recommendation}</p>
      <div style={sectionStyle}>
        <div style={sectionTitleStyle}>Confidence</div>
        <div style={textStyle}>{formatConfidence(summary)}</div>
      </div>
      <MiniList title="Why" items={summary.why} />
      {reasoningTransparency ? (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Reasoning Transparency</div>
          <div style={textStyle}>{reasoningTransparency.rightRailLine}</div>
        </div>
      ) : metaCognition ? (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Reasoning Reflection</div>
          <div style={textStyle}>{metaCognition.rightRailReflectionLine}</div>
        </div>
      ) : null}
      <MiniList title="Next Actions" items={summary.nextActions} />
      <MiniList title="Risk Notes" items={summary.riskNotes} />
      <button
        type="button"
        data-nx="typec-enhance-insight-btn"
        onClick={handleEnhance}
        disabled={isEnhanceDisabled || isEnhancing}
        style={isEnhanceDisabled || isEnhancing ? disabledButtonStyle : buttonStyle}
      >
        {isEnhancing ? "Enhancing..." : "Enhance Insight"}
      </button>
      {error ? <div style={{ ...textStyle, color: "rgba(252, 165, 165, 0.9)" }}>{error}</div> : null}
      {executiveActions.length ? (
        <div style={sectionStyle}>
          <div style={sectionTitleStyle}>Actions</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {executiveActions.map((action) => (
              <button
                key={action.id}
                type="button"
                data-nx={`typec-executive-action-${action.kind}`}
                onClick={() => {
                  if (!action.disabled) onExecutiveAction?.(action);
                }}
                disabled={Boolean(action.disabled) || !onExecutiveAction}
                style={action.disabled || !onExecutiveAction ? disabledButtonStyle : buttonStyle}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {aiInsight ? (
        <div className="ai-insight-block" style={sectionStyle}>
          <div style={sectionTitleStyle}>AI Enhanced</div>
          <div style={textStyle}>{aiInsight.headline}</div>
          <div style={textStyle}>{aiInsight.executiveBrief}</div>
          <div style={textStyle}>{aiInsight.recommendedMove}</div>
        </div>
      ) : null}
    </aside>
  );
}

export default TypeCExecutiveSummaryCard;
