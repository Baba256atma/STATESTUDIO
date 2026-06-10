"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER } from "../../../lib/dashboard/warRoomIntelligence/warRoomIntelligenceContract.ts";
import {
  initializeWarRoomIntelligenceRuntime,
  resolveWarRoomIntelligenceSurface,
} from "../../../lib/dashboard/warRoomIntelligence/warRoomIntelligenceRuntime.ts";
import {
  dashboardVisualColors,
  dashboardVisualPanelStyle,
  dashboardVisualSpacing,
  dashboardVisualTypography,
  resolveDirectionColor,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { ExecutiveImpactCard } from "../visual/ExecutiveImpactCard.tsx";
import { MicroTrendLine } from "../visual/MicroTrendLine.tsx";
import { MicroBarSeries } from "../visual/MicroBarSeries.tsx";
import { WarRoomDomainSection } from "./WarRoomDomainSection.tsx";
import { getAdvisoryExplanationForWarRoom } from "../../../lib/dashboard/executiveAdvisory/explainability/advisoryExplainabilityRuntime.ts";
import { AdvisoryExplainabilitySection } from "./AdvisoryExplainabilitySection.tsx";
import { getAdvisoryWarRoomIntegrationForWarRoom } from "../../../lib/dashboard/advisoryWarRoomIntegration/advisoryWarRoomIntegrationRuntime.ts";
import type {
  DashboardMicroBarSeriesSignal,
  DashboardTrendLineSignal,
} from "../../../lib/dashboard/dashboardVisualSignalContract.ts";

export type WarRoomIntelligenceSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function WarRoomIntelligenceSurface(props: WarRoomIntelligenceSurfaceProps): React.ReactElement {
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
      resolveWarRoomIntelligenceSurface({
        dashboardContext,
        normalizedContext,
        selectedObjectId,
        selectedObjectLabel,
        objectsInScene,
        timelineActive: timelineActive || dashboardContext === "war_room",
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
    initializeWarRoomIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive: timelineActive || dashboardContext === "war_room",
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const integrationBundle = useMemo(
    () =>
      getAdvisoryWarRoomIntegrationForWarRoom({
        dashboardContext,
        normalizedContext,
        selectedObjectId,
        selectedObjectLabel,
        objectsInScene,
        timelineActive: timelineActive || dashboardContext === "war_room",
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
  const explainabilityBundle = useMemo(
    () =>
      getAdvisoryExplanationForWarRoom({
        dashboardContext,
        normalizedContext,
        selectedObjectId,
        selectedObjectLabel,
        objectsInScene,
        timelineActive: timelineActive || dashboardContext === "war_room",
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
  const threatChart = model.visualBundle.microCharts.find(
    (chart) => chart.kind === "trend_line" && chart.label === "Threat Level"
  );
  const urgencyChart = model.visualBundle.microCharts.find(
    (chart) => chart.kind === "micro_bar" && chart.label === "Action Urgency"
  );

  const threatSignal: DashboardTrendLineSignal = Object.freeze({
    kind: "trend_line",
    label: "Threat Level",
    points: threatChart?.kind === "trend_line" ? threatChart.points : [0.3, 0.55, 0.78, 0.92],
    direction: "deteriorating",
  });

  const urgencySignal: DashboardMicroBarSeriesSignal = Object.freeze({
    kind: "micro_bar",
    label: "Action Urgency",
    values:
      urgencyChart?.kind === "micro_bar"
        ? urgencyChart.values
        : snapshot.scenarioComparison.scenarios.map((entry) => entry.score),
  });

  return (
    <div
      data-nx="war-room-intelligence-surface"
      data-surface="war_room"
      data-owner={CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER}
      data-decision-focus={snapshot.decisionFocus.focus}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        War Room Intelligence Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="war-room-visual-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: dashboardVisualSpacing.md,
          flexWrap: "wrap",
          padding: dashboardVisualSpacing.sm,
          borderRadius: 8,
          border: `1px solid ${dashboardVisualColors.border}`,
          background: dashboardVisualColors.surface,
        }}
      >
        <MicroTrendLine signal={threatSignal} />
        <MicroBarSeries signal={urgencySignal} />
      </div>

      <div
        data-nx="war-room-command-layout"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <WarRoomDomainSection
          domain="situation_overview"
          title="Situation Overview"
          primaryValue={snapshot.situationOverview.currentState}
          secondaryValue={snapshot.situationOverview.executiveSummary}
          details={Object.freeze([
            `System: ${snapshot.situationOverview.systemCondition}`,
            `Attention: ${snapshot.situationOverview.attentionSummary}`,
            snapshot.situationOverview.briefing,
          ])}
        />

        <WarRoomDomainSection
          domain="critical_risks"
          title="Critical Risks"
          primaryValue={snapshot.criticalRisks.exposure}
          secondaryValue={snapshot.criticalRisks.summary}
          details={snapshot.criticalRisks.topRisks}
          meta={`Momentum: ${snapshot.criticalRisks.momentum} · Urgency: ${snapshot.criticalRisks.urgency}`}
        />

        <WarRoomDomainSection
          domain="timeline_pressure"
          title="Timeline Pressure"
          primaryValue={snapshot.timelinePressure.decisionWindow}
          secondaryValue={snapshot.timelinePressure.urgencySummary}
          meta={`${snapshot.timelinePressure.milestonePressure} · ${snapshot.timelinePressure.timelineMomentum} · ${snapshot.timelinePressure.scheduleDrift}`}
        />

        <WarRoomDomainSection
          domain="scenario_comparison"
          title="Scenario Comparison"
          primaryValue={snapshot.scenarioComparison.comparisonSummary}
          secondaryValue={snapshot.scenarioComparison.preferredPath}
          details={snapshot.scenarioComparison.scenarios.map(
            (entry) => `${entry.label}: ${entry.impact} · ${entry.confidence} · ${entry.tradeoff}`
          )}
        />

        <WarRoomDomainSection
          domain="tradeoff_analysis"
          title="Tradeoff Analysis"
          primaryValue={snapshot.tradeoffAnalysis.tradeoffs[0]?.indicator ?? "Competing objectives"}
          secondaryValue={snapshot.tradeoffAnalysis.summary}
          details={snapshot.tradeoffAnalysis.tradeoffs.map(
            (entry) => `${entry.label}: ${entry.indicator}`
          )}
        />

        <WarRoomDomainSection
          domain="decision_focus"
          title="Decision Focus"
          primaryValue={snapshot.decisionFocus.label}
          secondaryValue={snapshot.decisionFocus.recommendation}
          meta={`Urgency: ${snapshot.decisionFocus.urgency}`}
          details={Object.freeze([
            `Trend: ${snapshot.decisionFocus.trend}`,
            `Focus: ${snapshot.decisionFocus.focus}`,
          ])}
        />
      </div>

      <div
        data-nx="war-room-decision-guidance-bridge"
        style={{
          fontSize: 10,
          color: dashboardVisualColors.textSoft,
          padding: dashboardVisualSpacing.sm,
          borderRadius: 6,
          border: `1px solid ${dashboardVisualColors.border}`,
        }}
      >
        Integration: {integrationBundle.trace.pathLabel} · {integrationBundle.guidanceDelivery.snapshot.decisionFocus.label} · {integrationBundle.confidencePropagation.evaluation.overall.label}
      </div>

      <AdvisoryExplainabilitySection
        dataNx="war-room-explainability"
        explanationBundle={explainabilityBundle}
      />

      <div
        data-nx="advisory-integration-contract"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: dashboardVisualSpacing.sm,
          fontSize: 10,
          color: resolveDirectionColor(
            snapshot.advisoryIntegration.readiness === "ready" ? "deteriorating" : "stable"
          ),
          padding: dashboardVisualSpacing.sm,
          borderRadius: 6,
          border: `1px dashed ${dashboardVisualColors.border}`,
        }}
      >
        <span>Advisory Integration: {snapshot.advisoryIntegration.summary}</span>
        <span data-readiness={snapshot.advisoryIntegration.readiness}>
          {snapshot.advisoryIntegration.readiness}
        </span>
      </div>
    </div>
  );
}

export default WarRoomIntelligenceSurface;
