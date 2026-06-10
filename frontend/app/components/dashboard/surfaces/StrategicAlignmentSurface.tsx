"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_STRATEGIC_ALIGNMENT_OWNER } from "../../../lib/dashboard/strategicAlignment/strategicAlignmentContract.ts";
import {
  initializeStrategicAlignmentRuntime,
  resolveStrategicAlignmentSurface,
} from "../../../lib/dashboard/strategicAlignment/strategicAlignmentRuntime.ts";
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

export type StrategicAlignmentSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function StrategicAlignmentSurface(props: StrategicAlignmentSurfaceProps): React.ReactElement {
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
      resolveStrategicAlignmentSurface({
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
    initializeStrategicAlignmentRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const alignmentChart = model.visualBundle.microCharts.find(
    (chart) => chart.kind === "micro_bar" && chart.label === "Strategic Alignment"
  );
  const barSignal: DashboardMicroBarSeriesSignal = Object.freeze({
    kind: "micro_bar",
    label: "Strategic Alignment",
    values:
      alignmentChart?.kind === "micro_bar"
        ? alignmentChart.values
        : snapshot.objectivesImpact.objectives.map((_, index) => 1 / (index + 1)),
  });

  return (
    <div
      data-nx="strategic-alignment-surface"
      data-surface="strategic_alignment"
      data-owner={CANONICAL_STRATEGIC_ALIGNMENT_OWNER}
      data-score={snapshot.alignmentScore.score}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Strategic Alignment Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="strategic-alignment-score-card"
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
            Strategic Alignment Score
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(
                snapshot.alignmentScore.score === "strong_alignment"
                  ? "improving"
                  : snapshot.alignmentScore.score === "potential_misalignment"
                    ? "deteriorating"
                    : "stable"
              ),
            }}
          >
            {snapshot.alignmentScore.label}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            {snapshot.alignmentScore.summary}
          </span>
          <span style={{ fontSize: 10, color: dashboardVisualColors.textSoft }}>
            Trend: {snapshot.alignmentScore.trend}
          </span>
        </div>
        <MicroBarSeries signal={barSignal} />
      </div>

      <div
        data-nx="strategic-alignment-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <AdvisoryDomainCard
          domain="objectives_impact"
          title="Strategic Objectives Impact"
          primaryValue={snapshot.objectivesImpact.objectives[0]?.label ?? "Objectives"}
          secondaryValue={snapshot.objectivesImpact.summary}
          meta={snapshot.objectivesImpact.objectives
            .map((entry) => `${entry.label.split(" ").pop()}: ${entry.impact}`)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="strategic_direction"
          title="Strategic Direction"
          primaryValue={snapshot.strategicDirection.label}
          secondaryValue={snapshot.strategicDirection.summary}
          meta={`Trend: ${snapshot.strategicDirection.trend}`}
        />
        <AdvisoryDomainCard
          domain="strategic_tradeoffs"
          title="Strategic Tradeoffs"
          primaryValue={snapshot.strategicTradeoffs.tradeoffs[0]?.label ?? "Tradeoffs"}
          secondaryValue={snapshot.strategicTradeoffs.summary}
          meta={snapshot.strategicTradeoffs.tradeoffs
            .slice(1, 3)
            .map((entry) => entry.label)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="strategic_tension"
          title="Strategic Tension"
          primaryValue={snapshot.strategicTension.label}
          secondaryValue={snapshot.strategicTension.summary}
          meta={snapshot.strategicTension.conflictingPriorities.slice(0, 2).join(" · ")}
        />
        <AdvisoryDomainCard
          domain="strategic_confidence"
          title="Strategic Confidence"
          primaryValue={snapshot.strategicConfidence.label}
          secondaryValue={snapshot.strategicConfidence.summary}
          meta={snapshot.strategicConfidence.metadata}
        />
        <AdvisoryDomainCard
          domain="strategic_attention"
          title="Strategic Attention"
          primaryValue={snapshot.strategicAttention.label}
          secondaryValue={snapshot.strategicAttention.summary}
          meta={`${snapshot.strategicAttention.escalationIndicator} · ${snapshot.strategicAttention.leadershipReviewIndicator}`}
        />
      </div>
    </div>
  );
}

export default StrategicAlignmentSurface;
