"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import {
  initializeExecutiveSummaryRuntime,
  resolveExecutiveSummarySurface,
} from "../../../lib/dashboard/executiveSummary/executiveSummaryRuntime.ts";
import { CANONICAL_EXECUTIVE_SUMMARY_OWNER } from "../../../lib/dashboard/executiveSummary/executiveSummaryContract.ts";
import {
  dashboardVisualColors,
  dashboardVisualPanelStyle,
  dashboardVisualSpacing,
  dashboardVisualTypography,
  resolveImpactLevelColor,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { ExecutiveImpactCard } from "../visual/ExecutiveImpactCard.tsx";
import { MicroTrendLine } from "../visual/MicroTrendLine.tsx";
import { ExecutiveSummaryCard } from "./ExecutiveSummaryCard.tsx";

export type ExecutiveSummarySurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  timelineActive?: boolean;
};

const ATTENTION_BADGE: Readonly<Record<string, string>> = Object.freeze({
  attention_required: "Attention Required",
  monitor: "Monitor",
  stable: "Stable",
  unknown: "Unknown",
});

const ATTENTION_IMPACT: Readonly<Record<string, "low" | "moderate" | "high" | "critical">> = Object.freeze({
  attention_required: "critical",
  monitor: "moderate",
  stable: "low",
  unknown: "moderate",
});

export function ExecutiveSummarySurface(props: ExecutiveSummarySurfaceProps): React.ReactElement {
  const {
    dashboardContext,
    normalizedContext = null,
    selectedObjectId = null,
    selectedObjectLabel = null,
    timelineActive = false,
  } = props;

  const model = useMemo(
    () =>
      resolveExecutiveSummarySurface({
        dashboardContext,
        normalizedContext,
        selectedObjectId,
        selectedObjectLabel,
        timelineActive,
        openContextCount: normalizedContext ? 1 : 0,
      }),
    [dashboardContext, normalizedContext, selectedObjectId, selectedObjectLabel, timelineActive]
  );

  useEffect(() => {
    initializeExecutiveSummaryRuntime({ dashboardContext, normalizedContext });
  }, [dashboardContext, normalizedContext?.id]);

  const trendChart = model.visualBundle.microCharts.find((chart) => chart.kind === "trend_line");

  return (
    <div
      data-nx="executive-summary-surface"
      data-surface="executive_summary"
      data-owner={CANONICAL_EXECUTIVE_SUMMARY_OWNER}
      data-attention={model.attention}
      style={dashboardVisualPanelStyle()}
    >
      <div
        style={{
          ...dashboardVisualTypography.microLabel,
          color: dashboardVisualColors.textSoft,
        }}
      >
        Executive Summary Surface
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: dashboardVisualSpacing.sm, flexWrap: "wrap" }}>
        <h2
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 600,
            color: dashboardVisualColors.text,
            flex: 1,
            minWidth: 0,
          }}
        >
          {model.headline}
        </h2>
        <span
          data-nx="executive-attention-badge"
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: 4,
            color: resolveImpactLevelColor(ATTENTION_IMPACT[model.attention]),
            border: `1px solid ${resolveImpactLevelColor(ATTENTION_IMPACT[model.attention])}`,
          }}
        >
          {ATTENTION_BADGE[model.attention]}
        </span>
      </div>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="executive-summary-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        {model.cards.map((card) => (
          <ExecutiveSummaryCard key={card.kind} card={card} />
        ))}
      </div>

      {trendChart && trendChart.kind === "trend_line" ? (
        <div data-nx="executive-summary-trend">
          <MicroTrendLine signal={trendChart} />
        </div>
      ) : null}

      <div
        data-nx="executive-investigate-next"
        style={{
          ...dashboardVisualTypography.cardMeta,
          color: dashboardVisualColors.textSoft,
          padding: dashboardVisualSpacing.sm,
          borderRadius: 6,
          border: `1px dashed ${dashboardVisualColors.border}`,
        }}
      >
        Investigate next: {model.investigateNext}
      </div>
    </div>
  );
}

export default ExecutiveSummarySurface;
