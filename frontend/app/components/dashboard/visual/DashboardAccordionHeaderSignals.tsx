"use client";

import React from "react";
import type { DashboardAccordionHeaderVisualSignals } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";
import {
  dashboardVisualColors,
  dashboardVisualSizing,
  dashboardVisualSpacing,
  dashboardVisualTypography,
  resolveDirectionColor,
  resolveImpactLevelColor,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { DeltaIndicator } from "./DeltaIndicator.tsx";

export type DashboardAccordionHeaderSignalsProps = {
  signals: DashboardAccordionHeaderVisualSignals;
};

const IMPACT_BADGE_LABEL: Record<DashboardAccordionHeaderVisualSignals["impactBadge"], string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};

const TREND_ARROW: Record<DashboardAccordionHeaderVisualSignals["trendDirection"], string> = {
  improving: "↑",
  stable: "→",
  deteriorating: "↓",
};

export function DashboardAccordionHeaderSignals(
  props: DashboardAccordionHeaderSignalsProps
): React.ReactElement {
  const { signals } = props;

  return (
    <div
      data-nx="dashboard-accordion-header-signals"
      style={{
        display: "flex",
        alignItems: "center",
        gap: dashboardVisualSpacing.sm,
        flexWrap: "wrap",
        marginTop: 2,
      }}
    >
      <span
        data-nx="accordion-impact-badge"
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          padding: "2px 6px",
          borderRadius: 4,
          height: dashboardVisualSizing.headerBadgeHeight,
          display: "inline-flex",
          alignItems: "center",
          color: resolveImpactLevelColor(signals.impactBadge),
          border: `1px solid ${resolveImpactLevelColor(signals.impactBadge)}`,
          background: "rgba(255,255,255,0.04)",
        }}
      >
        {IMPACT_BADGE_LABEL[signals.impactBadge]}
      </span>

      <span
        data-nx="accordion-trend-indicator"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: dashboardVisualTypography.cardMeta.fontSize,
          color: resolveDirectionColor(signals.trendDirection),
          fontWeight: 600,
        }}
      >
        <span aria-hidden>{TREND_ARROW[signals.trendDirection]}</span>
        <span style={{ textTransform: "capitalize" }}>{signals.trendDirection}</span>
      </span>

      <span
        data-nx="accordion-summary-value"
        style={{
          ...dashboardVisualTypography.summaryValue,
          color: dashboardVisualColors.text,
        }}
      >
        {signals.summaryValue}
      </span>

      {signals.delta ? <DeltaIndicator signal={signals.delta} /> : null}
    </div>
  );
}

export default DashboardAccordionHeaderSignals;
