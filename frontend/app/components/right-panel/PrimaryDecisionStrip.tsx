"use client";

import React, { useMemo } from "react";
import { nx } from "../ui/nexoraTheme";

type LooseRecord = Record<string, unknown>;

function asRecord(v: unknown): LooseRecord | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as LooseRecord) : null;
}

function pickString(...candidates: unknown[]): string | null {
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

function pickConfidencePercent(advice: LooseRecord | null, canonical: LooseRecord | null): string | null {
  const conf = advice?.confidence;
  const confRec = asRecord(conf);
  const score =
    typeof confRec?.score === "number"
      ? confRec.score
      : typeof confRec?.level === "number"
        ? confRec.level
        : typeof advice?.confidence === "number"
          ? (advice.confidence as number)
          : null;
  if (score != null && Number.isFinite(score)) {
    const pct = score <= 1 ? Math.round(score * 100) : Math.round(score);
    return `${Math.min(100, Math.max(0, pct))}%`;
  }
  const canonConf = asRecord(canonical?.confidence as unknown);
  const cScore = typeof canonConf?.score === "number" ? canonConf.score : null;
  if (cScore != null && Number.isFinite(cScore)) {
    const pct = cScore <= 1 ? Math.round(cScore * 100) : Math.round(cScore);
    return `${Math.min(100, Math.max(0, pct))}%`;
  }
  return null;
}

function pickRiskLabel(
  advice: LooseRecord | null,
  fragility: LooseRecord | null,
  riskPanel: LooseRecord | null
): string | null {
  const rs = pickString(advice?.risk_summary, advice?.riskSummary);
  if (rs && rs.length < 48) return rs.toUpperCase();
  const level = pickString(
    fragility?.fragility_level,
    fragility?.level,
    (fragility?.fragility as LooseRecord | undefined)?.level,
    riskPanel?.severity
  );
  if (level) return level.replace(/\s+/g, " ").toUpperCase();
  return null;
}

export type PrimaryDecisionStripProps = {
  /** Existing merged panel payload (no new fetch). */
  panelData: unknown;
};

/**
 * Compact decision-first summary above RightPanelHost content.
 * Read-only: derives copy from advice / canonical / fragility when present.
 */
export function PrimaryDecisionStrip(props: PrimaryDecisionStripProps) {
  const { actionLine, confidenceLabel, riskLabel } = useMemo(() => {
    const root = asRecord(props.panelData);
    const advice = asRecord(root?.strategicAdvice ?? root?.advice);
    const canonical = asRecord(root?.canonicalRecommendation ?? root?.canonical_recommendation);
    const primary = asRecord(canonical?.primary as unknown);
    const fragility = asRecord(root?.fragility);
    const riskPanel = asRecord(root?.risk);

    const action =
      pickString(
        advice?.recommendation,
        (advice?.primary_recommendation as LooseRecord | undefined)?.action,
        primary?.action,
        advice?.summary
      ) ?? "Review decision context";

    const conf = pickConfidencePercent(advice, canonical);
    const riskStr = pickRiskLabel(advice, fragility, riskPanel);

    return {
      actionLine: action.length > 72 ? `${action.slice(0, 71)}…` : action,
      confidenceLabel: conf ? `Confidence: ${conf}` : "Confidence: —",
      riskLabel: riskStr ? `Risk: ${riskStr}` : "Risk: —",
    };
  }, [props.panelData]);

  return (
    <div
      className="nx-primary-decision"
      style={{
        flexShrink: 0,
        marginBottom: 12,
        padding: "10px 12px",
        borderRadius: 10,
        border: `1px solid ${nx.border}`,
        background: nx.bgPanelSoft,
        boxSizing: "border-box",
      }}
    >
      <div
        className="label"
        style={{
          fontSize: 9,
          fontWeight: 800,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: nx.lowMuted,
          opacity: 0.85,
          marginBottom: 6,
        }}
      >
        Primary decision
      </div>
      <div className="action" style={{ fontSize: 14, fontWeight: 800, color: nx.text, lineHeight: 1.3 }}>
        {actionLine}
      </div>
      <div
        className="meta"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 14px",
          marginTop: 8,
          fontSize: 11,
          fontWeight: 600,
          color: nx.muted,
        }}
      >
        <span>{confidenceLabel}</span>
        <span>{riskLabel}</span>
      </div>
    </div>
  );
}
