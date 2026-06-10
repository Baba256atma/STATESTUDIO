"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_DECISION_GUIDANCE_OWNER } from "../../../lib/dashboard/decisionGuidance/decisionGuidanceContract.ts";
import {
  initializeDecisionGuidanceRuntime,
  resolveDecisionGuidanceSurface,
} from "../../../lib/dashboard/decisionGuidance/decisionGuidanceRuntime.ts";
import {
  dashboardVisualColors,
  dashboardVisualPanelStyle,
  dashboardVisualSpacing,
  dashboardVisualTypography,
  resolveDirectionColor,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { ExecutiveImpactCard } from "../visual/ExecutiveImpactCard.tsx";
import { MicroBarSeries } from "../visual/MicroBarSeries.tsx";
import { AdvisoryDomainCard } from "./AdvisoryDomainCard.tsx";
import type { DashboardMicroBarSeriesSignal } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";

export type DecisionGuidanceSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function DecisionGuidanceSurface(props: DecisionGuidanceSurfaceProps): React.ReactElement {
  const {
    dashboardContext,
    normalizedContext = null,
    selectedObjectId = null,
    selectedObjectLabel = null,
    objectsInScene,
    timelineActive = false,
  } = props;

  const model = useMemo(
    () =>
      resolveDecisionGuidanceSurface({
        dashboardContext,
        normalizedContext,
        selectedObjectId,
        selectedObjectLabel,
        objectsInScene,
        timelineActive,
      }),
    [
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    ]
  );

  useEffect(() => {
    initializeDecisionGuidanceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const urgencyChart = model.visualBundle.microCharts.find(
    (chart) => chart.kind === "micro_bar" && chart.label === "Guidance Urgency"
  );
  const barSignal: DashboardMicroBarSeriesSignal = Object.freeze({
    kind: "micro_bar",
    label: "Guidance Urgency",
    values:
      urgencyChart?.kind === "micro_bar"
        ? urgencyChart.values
        : snapshot.executiveGuidance.entries.map((_, index) => 1 / (index + 1)),
  });

  return (
    <div
      data-nx="decision-guidance-surface"
      data-surface="decision_guidance"
      data-owner={CANONICAL_DECISION_GUIDANCE_OWNER}
      data-focus={snapshot.decisionFocus.focus}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Decision Guidance Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="decision-focus-card"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: dashboardVisualSpacing.md,
          padding: dashboardVisualSpacing.md,
          borderRadius: 8,
          border: `1px solid ${dashboardVisualColors.border}`,
          background: dashboardVisualColors.surface,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: dashboardVisualSpacing.xs, flex: 1 }}>
          <span style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
            Decision Focus
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(
                snapshot.decisionFocus.focus === "decision_required" ||
                  snapshot.decisionFocus.focus === "decision_recommended"
                  ? "deteriorating"
                  : "stable"
              ),
            }}
          >
            {snapshot.decisionFocus.label}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            {snapshot.decisionFocus.summary}
          </span>
          <span style={{ fontSize: 10, color: dashboardVisualColors.textSoft }}>
            Urgency: {snapshot.decisionFocus.urgency} · Attention: {snapshot.decisionFocus.attentionStatus}
          </span>
        </div>
        <MicroBarSeries signal={barSignal} />
      </div>

      <div
        data-nx="decision-guidance-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <AdvisoryDomainCard
          domain="executive_guidance"
          title="Executive Guidance"
          primaryValue={snapshot.executiveGuidance.entries[0]?.label ?? "Review guidance"}
          secondaryValue={snapshot.executiveGuidance.summary}
          meta={snapshot.executiveGuidance.entries
            .slice(1, 3)
            .map((entry) => entry.label)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="confidence_summary"
          title="Confidence Summary"
          primaryValue={snapshot.confidenceSummary.label}
          secondaryValue={snapshot.confidenceSummary.summary}
          meta={`Trend: ${snapshot.confidenceSummary.trend}`}
        />
        <AdvisoryDomainCard
          domain="explanation_summary"
          title="Explanation Summary"
          primaryValue={snapshot.explanationSummary.summary}
          secondaryValue={snapshot.explanationSummary.reasoningPath}
          meta={`${snapshot.explanationSummary.confidenceDrivers} · ${snapshot.explanationSummary.confidenceLimiters}`}
        />
        <AdvisoryDomainCard
          domain="tradeoff_summary"
          title="Tradeoff Summary"
          primaryValue={snapshot.tradeoffSummary.tradeoffs[0]?.label ?? "Competing objectives"}
          secondaryValue={snapshot.tradeoffSummary.summary}
          meta={snapshot.tradeoffSummary.tradeoffs
            .slice(1)
            .map((entry) => entry.indicator)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="decision_context"
          title="Decision Context"
          primaryValue={snapshot.decisionContext.highlights[0]?.label ?? "Operational context"}
          secondaryValue={snapshot.decisionContext.summary}
          meta={snapshot.decisionContext.highlights
            .slice(1, 4)
            .map((entry) => entry.label)
            .join(" · ")}
        />
      </div>
    </div>
  );
}

export default DecisionGuidanceSurface;
