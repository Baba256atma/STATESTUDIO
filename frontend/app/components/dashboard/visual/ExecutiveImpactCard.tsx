"use client";

import React from "react";
import type { ExecutiveImpactCardSignal } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";
import {
  dashboardVisualColors,
  dashboardVisualSizing,
  dashboardVisualSpacing,
  dashboardVisualTypography,
  resolveDirectionColor,
  resolveImpactLevelColor,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";

export type ExecutiveImpactCardProps = {
  signal: ExecutiveImpactCardSignal;
};

const IMPACT_LABEL: Record<ExecutiveImpactCardSignal["impactLevel"], string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};

const DIRECTION_LABEL: Record<ExecutiveImpactCardSignal["direction"], string> = {
  improving: "Improving",
  stable: "Stable",
  deteriorating: "Deteriorating",
};

const CONFIDENCE_LABEL: Record<ExecutiveImpactCardSignal["confidence"], string> = {
  low: "Low Confidence",
  moderate: "Moderate Confidence",
  high: "High Confidence",
};

const HORIZON_LABEL: Record<ExecutiveImpactCardSignal["timeHorizon"], string> = {
  immediate: "Immediate",
  short_term: "Short-Term",
  mid_term: "Mid-Term",
  long_term: "Long-Term",
};

function MetaChip(props: { label: string; color: string }): React.ReactElement {
  return (
    <span
      style={{
        fontSize: dashboardVisualTypography.cardMeta.fontSize,
        padding: "2px 6px",
        borderRadius: 4,
        border: `1px solid ${dashboardVisualColors.border}`,
        color: props.color,
        background: "rgba(255,255,255,0.03)",
        whiteSpace: "nowrap",
      }}
    >
      {props.label}
    </span>
  );
}

export function ExecutiveImpactCard(props: ExecutiveImpactCardProps): React.ReactElement {
  const { signal } = props;

  return (
    <div
      data-nx="dashboard-impact-card"
      data-impact={signal.impactLevel}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: dashboardVisualSpacing.sm,
        padding: dashboardVisualSpacing.md,
        minHeight: dashboardVisualSizing.impactCardMinHeight,
        borderRadius: 8,
        border: `1px solid ${dashboardVisualColors.border}`,
        background: dashboardVisualColors.surface,
      }}
    >
      <div style={{ ...dashboardVisualTypography.cardTitle, color: dashboardVisualColors.text }}>
        {signal.headline}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: dashboardVisualSpacing.xs }}>
        <MetaChip label={IMPACT_LABEL[signal.impactLevel]} color={resolveImpactLevelColor(signal.impactLevel)} />
        <MetaChip label={DIRECTION_LABEL[signal.direction]} color={resolveDirectionColor(signal.direction)} />
        <MetaChip label={CONFIDENCE_LABEL[signal.confidence]} color={dashboardVisualColors.textSoft} />
        <MetaChip label={HORIZON_LABEL[signal.timeHorizon]} color={dashboardVisualColors.muted} />
      </div>
    </div>
  );
}

export default ExecutiveImpactCard;
