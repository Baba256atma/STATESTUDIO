"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_SCENARIO_INTELLIGENCE_OWNER } from "../../../lib/dashboard/scenarioIntelligence/scenarioIntelligenceContract.ts";
import {
  initializeScenarioIntelligenceRuntime,
  resolveScenarioIntelligenceSurface,
} from "../../../lib/dashboard/scenarioIntelligence/scenarioIntelligenceRuntime.ts";
import { attachScenarioIntelligenceFeed } from "../../../lib/dashboard/scenarioIntelligence/scenarioIntelligenceFeedBridge.ts";
import {
  dashboardVisualColors,
  dashboardVisualPanelStyle,
  dashboardVisualSpacing,
  dashboardVisualTypography,
  resolveDirectionColor,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { ExecutiveImpactCard } from "../visual/ExecutiveImpactCard.tsx";
import { MicroBarSeries } from "../visual/MicroBarSeries.tsx";
import { ScenarioDomainCard } from "./ScenarioDomainCard.tsx";
import type { DashboardMicroBarSeriesSignal } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";

export type ScenarioIntelligenceSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
  sceneJson?: unknown;
};

export function ScenarioIntelligenceSurface(props: ScenarioIntelligenceSurfaceProps): React.ReactElement {
  const {
    dashboardContext,
    normalizedContext = null,
    selectedObjectId = null,
    selectedObjectLabel = null,
    objectsInScene,
    timelineActive = false,
    sceneJson,
  } = props;

  const model = useMemo(() => {
    const baseModel = resolveScenarioIntelligenceSurface({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });

    return attachScenarioIntelligenceFeed(baseModel, {
      sceneJson,
      selectedObjectId,
    });
  }, [
    dashboardContext,
    normalizedContext,
    selectedObjectId,
    selectedObjectLabel,
    objectsInScene,
    timelineActive,
    sceneJson,
  ]);

  useEffect(() => {
    initializeScenarioIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const feed = model.intelligenceFeed;
  const feedBound = feed?.feedStatus === "bound";
  const scoreChart = model.visualBundle.microCharts.find(
    (chart) => chart.kind === "micro_bar" && chart.label === "Scenario Scores"
  );
  const barSignal: DashboardMicroBarSeriesSignal = Object.freeze({
    kind: "micro_bar",
    label: "Scenario Scores",
    values:
      scoreChart?.kind === "micro_bar"
        ? scoreChart.values
        : snapshot.portfolio.scenarios.map((entry) => entry.score),
  });

  return (
    <div
      data-nx="scenario-intelligence-surface"
      data-surface="scenario"
      data-owner={CANONICAL_SCENARIO_INTELLIGENCE_OWNER}
      data-confidence={snapshot.confidence.level}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Scenario Intelligence Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="scenario-portfolio-card"
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
            {feedBound ? feed.scenarioSummaries.title : "Scenario Portfolio"}
          </span>
          <span style={{ ...dashboardVisualTypography.summaryValue, color: dashboardVisualColors.text }}>
            {feedBound
              ? feed.scenarioSummaries.primaryValue
              : `${snapshot.portfolio.activeCount} active · ${snapshot.portfolio.totalCount} tracked`}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            {feedBound ? feed.scenarioSummaries.secondaryValue : snapshot.portfolio.comparisonEntryPoint}
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: dashboardVisualSpacing.xs, marginTop: 4 }}>
            {snapshot.portfolio.scenarios.map((entry) => (
              <span
                key={entry.id}
                data-scenario-id={entry.id}
                data-active={entry.active ? "1" : "0"}
                style={{
                  fontSize: 10,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: entry.active ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.04)",
                  color: dashboardVisualColors.textSoft,
                }}
              >
                {entry.label}
              </span>
            ))}
          </div>
        </div>
        <MicroBarSeries signal={barSignal} />
      </div>

      <div
        data-nx="scenario-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <ScenarioDomainCard
          domain="scenario_confidence"
          title={feedBound ? feed.scenarioConfidence.title : "Scenario Confidence"}
          primaryValue={feedBound ? feed.scenarioConfidence.primaryValue : snapshot.confidence.label}
          secondaryValue={feedBound ? feed.scenarioConfidence.secondaryValue : snapshot.confidence.summary}
          meta={feedBound ? "DS-7 scenario intelligence feed" : `Trend: ${snapshot.confidence.trend}`}
        />
        <ScenarioDomainCard
          domain="expected_impact"
          title={feedBound ? feed.scenarioRecommendations.title : "Expected Impact"}
          primaryValue={
            feedBound ? feed.scenarioRecommendations.primaryValue : snapshot.expectedImpact.label
          }
          secondaryValue={
            feedBound ? feed.scenarioRecommendations.secondaryValue : snapshot.expectedImpact.summary
          }
          meta={feedBound ? feed.scenarioRecommendations.meta : `Trend: ${snapshot.expectedImpact.trend}`}
        />
        <ScenarioDomainCard
          domain="tradeoff_analysis"
          title={feedBound ? feed.scenarioComparisonSummaries.title : "Tradeoff Analysis"}
          primaryValue={
            feedBound
              ? feed.scenarioComparisonSummaries.primaryValue
              : snapshot.tradeoffs.tradeoffs[0]?.indicator ?? "Competing objectives"
          }
          secondaryValue={
            feedBound ? feed.scenarioComparisonSummaries.secondaryValue : snapshot.tradeoffs.summary
          }
          meta={
            feedBound
              ? "Scenario comparison intelligence feed"
              : snapshot.tradeoffs.tradeoffs[1]?.indicator
          }
        />
        <ScenarioDomainCard
          domain="investigation_paths"
          title="Investigation Paths"
          primaryValue={
            feedBound
              ? feed.scenarioRecommendations.meta ?? feed.scenarioRecommendations.primaryValue
              : snapshot.investigationPaths.paths[0]?.label ?? "Review paths"
          }
          secondaryValue={
            feedBound ? feed.scenarioRecommendations.secondaryValue : snapshot.investigationPaths.summary
          }
          meta={
            feedBound
              ? "DS-7 recommendation intelligence feed"
              : snapshot.investigationPaths.paths.length > 1
                ? snapshot.investigationPaths.paths
                    .slice(1)
                    .map((path) => path.label)
                    .join(" · ")
                : undefined
          }
        />
      </div>

      <div
        data-nx="scenario-comparison-contract"
        style={{
          fontSize: 10,
          color: dashboardVisualColors.textSoft,
          padding: dashboardVisualSpacing.sm,
          borderRadius: 6,
          border: `1px dashed ${dashboardVisualColors.border}`,
        }}
      >
        Comparison:{" "}
        {feedBound ? feed.scenarioComparisonSummaries.primaryValue : snapshot.comparisonContract.summary} · mode:{" "}
        {snapshot.comparisonContract.mode}
        {snapshot.comparisonContract.preferredScenarioId
          ? ` · preferred: ${snapshot.comparisonContract.preferredScenarioId}`
          : ""}
      </div>

      <div
        data-nx="war-room-escalation-contract"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: dashboardVisualSpacing.sm,
          fontSize: 10,
          color: resolveDirectionColor(
            snapshot.warRoomEscalation.readiness === "ready" ? "deteriorating" : "stable"
          ),
          padding: dashboardVisualSpacing.sm,
          borderRadius: 6,
          border: `1px dashed ${dashboardVisualColors.border}`,
        }}
      >
        <span>War Room Escalation: {snapshot.warRoomEscalation.summary}</span>
        <span data-readiness={snapshot.warRoomEscalation.readiness}>
          {snapshot.warRoomEscalation.readiness}
        </span>
      </div>
    </div>
  );
}

export default ScenarioIntelligenceSurface;
