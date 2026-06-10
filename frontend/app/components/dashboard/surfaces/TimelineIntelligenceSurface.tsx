"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_TIMELINE_INTELLIGENCE_OWNER } from "../../../lib/dashboard/timelineIntelligence/timelineIntelligenceContract.ts";
import {
  initializeTimelineIntelligenceRuntime,
  resolveTimelineIntelligenceSurface,
} from "../../../lib/dashboard/timelineIntelligence/timelineIntelligenceRuntime.ts";
import {
  dashboardVisualColors,
  dashboardVisualPanelStyle,
  dashboardVisualSpacing,
  dashboardVisualTypography,
  resolveDirectionColor,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { ExecutiveImpactCard } from "../visual/ExecutiveImpactCard.tsx";
import { MicroTrendLine } from "../visual/MicroTrendLine.tsx";
import { TimelineDomainCard } from "./TimelineDomainCard.tsx";
import type { DashboardTrendLineSignal } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";

export type TimelineIntelligenceSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function TimelineIntelligenceSurface(props: TimelineIntelligenceSurfaceProps): React.ReactElement {
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
      resolveTimelineIntelligenceSurface({
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
    initializeTimelineIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const momentumSignal: DashboardTrendLineSignal = Object.freeze({
    kind: "trend_line",
    label: "Timeline Momentum",
    points: snapshot.momentum.trendPoints,
    direction: snapshot.momentum.trend,
  });

  return (
    <div
      data-nx="timeline-intelligence-surface"
      data-surface="timeline"
      data-owner={CANONICAL_TIMELINE_INTELLIGENCE_OWNER}
      data-momentum={snapshot.momentum.level}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Timeline Intelligence Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="timeline-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <TimelineDomainCard
          domain="milestone_pressure"
          title="Milestone Pressure"
          primaryValue={snapshot.milestonePressure.label}
          secondaryValue={snapshot.milestonePressure.upcomingSummary}
          meta={snapshot.milestonePressure.concentration}
        />
        <TimelineDomainCard
          domain="schedule_drift"
          title="Schedule Drift"
          primaryValue={snapshot.scheduleDrift.label}
          secondaryValue={`Trend: ${snapshot.scheduleDrift.trend} · Confidence: ${snapshot.scheduleDrift.confidence}`}
        />
        <TimelineDomainCard
          domain="event_density"
          title="Event Density"
          primaryValue={snapshot.eventDensity.label}
          secondaryValue={snapshot.eventDensity.concentration}
          meta={`Activity: ${snapshot.eventDensity.activityTrend}`}
        />
        <TimelineDomainCard
          domain="decision_windows"
          title="Decision Windows"
          primaryValue={snapshot.decisionWindows.label}
          secondaryValue={snapshot.decisionWindows.currentWindow}
          meta={snapshot.decisionWindows.upcomingWindow}
        />
      </div>

      <div
        data-nx="timeline-momentum-card"
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
        <div style={{ display: "flex", flexDirection: "column", gap: dashboardVisualSpacing.xs }}>
          <span style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
            Timeline Momentum
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(snapshot.momentum.trend),
            }}
          >
            {snapshot.momentum.label}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            Confidence: {snapshot.momentum.confidence}
          </span>
        </div>
        <MicroTrendLine signal={momentumSignal} />
      </div>

      <div
        data-nx="timeline-graphical-contract"
        style={{
          fontSize: 10,
          color: dashboardVisualColors.textSoft,
          padding: dashboardVisualSpacing.sm,
          borderRadius: 6,
          border: `1px dashed ${dashboardVisualColors.border}`,
        }}
      >
        Graphical contract: {snapshot.graphicalContract.baseline} · nodes:{" "}
        {snapshot.graphicalContract.nodes.join(", ")} · decision points:{" "}
        {snapshot.graphicalContract.decisionPoints.join(", ")}
      </div>
    </div>
  );
}

export default TimelineIntelligenceSurface;
