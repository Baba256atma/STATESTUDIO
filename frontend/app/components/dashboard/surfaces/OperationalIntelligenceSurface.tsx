"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER } from "../../../lib/dashboard/operationalIntelligence/operationalIntelligenceContract.ts";
import {
  initializeOperationalIntelligenceRuntime,
  resolveOperationalIntelligenceSurface,
} from "../../../lib/dashboard/operationalIntelligence/operationalIntelligenceRuntime.ts";
import {
  dashboardVisualColors,
  dashboardVisualPanelStyle,
  dashboardVisualSpacing,
  dashboardVisualTypography,
  resolveDirectionColor,
  resolveImpactLevelColor,
} from "../../../lib/dashboard/dashboardVisualTheme.ts";
import { ExecutiveImpactCard } from "../visual/ExecutiveImpactCard.tsx";
import { MicroTrendLine } from "../visual/MicroTrendLine.tsx";
import { OperationalDomainCard } from "./OperationalDomainCard.tsx";
import type { DashboardTrendLineSignal } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";

export type OperationalIntelligenceSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

const PRESSURE_COLOR: Readonly<Record<string, string>> = Object.freeze({
  low: "var(--nx-success)",
  moderate: "var(--nx-accent)",
  high: "var(--nx-warning)",
  critical: "var(--nx-risk)",
});

const HEALTH_COLOR: Readonly<Record<string, string>> = Object.freeze({
  healthy: "var(--nx-success)",
  watch: "var(--nx-accent)",
  degraded: "var(--nx-warning)",
  critical: "var(--nx-risk)",
});

export function OperationalIntelligenceSurface(
  props: OperationalIntelligenceSurfaceProps
): React.ReactElement {
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
      resolveOperationalIntelligenceSurface({
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
    initializeOperationalIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, objectsInScene, timelineActive]);

  const { snapshot } = model;
  const demandTrendSignal: DashboardTrendLineSignal = Object.freeze({
    kind: "trend_line",
    label: "Demand Impact",
    points: snapshot.demandImpact.trendPoints,
    direction:
      snapshot.demandImpact.direction === "growing"
        ? "improving"
        : snapshot.demandImpact.direction === "declining"
          ? "deteriorating"
          : "stable",
  });

  return (
    <div
      data-nx="operational-intelligence-surface"
      data-surface="operational"
      data-owner={CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER}
      data-health={snapshot.health.level}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Operational Intelligence Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="operational-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <OperationalDomainCard
          domain="health"
          title="Operational Health"
          primaryValue={snapshot.health.status}
          secondaryValue={`Trend: ${snapshot.health.trend} · Confidence: ${snapshot.health.confidence}`}
          meta={`Level indicator`}
        />
        <OperationalDomainCard
          domain="active_objects"
          title="Active Objects"
          primaryValue={`${snapshot.activeObjects.objectsInScene} in scene`}
          secondaryValue={snapshot.activeObjects.summary}
          meta={
            snapshot.activeObjects.selectedObject
              ? `Selected: ${snapshot.activeObjects.selectedObject}`
              : "No selection"
          }
        />
        <OperationalDomainCard
          domain="signals"
          title="Operational Signals"
          primaryValue={`${snapshot.signals.signalCount} signals`}
          secondaryValue={snapshot.signals.recentSummary}
          meta={`Activity: ${snapshot.signals.activityTrend}`}
        />
        <OperationalDomainCard
          domain="pressure"
          title="Operational Pressure"
          primaryValue={snapshot.pressure.level}
          secondaryValue={snapshot.pressure.attentionStatus}
          meta={`Trend: ${snapshot.pressure.trend}`}
        />
      </div>

      <div
        data-nx="demand-impact-card"
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
            Demand Impact
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(demandTrendSignal.direction),
            }}
          >
            {snapshot.demandImpact.summaryValue}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            Directional pressure on operational system
          </span>
        </div>
        <MicroTrendLine signal={demandTrendSignal} />
      </div>

      <div
        style={{
          display: "flex",
          gap: dashboardVisualSpacing.sm,
          flexWrap: "wrap",
          fontSize: 10,
          color: dashboardVisualColors.textSoft,
        }}
      >
        <span style={{ color: HEALTH_COLOR[snapshot.health.level] }}>
          Health: {snapshot.health.status}
        </span>
        <span style={{ color: PRESSURE_COLOR[snapshot.pressure.level] }}>
          Pressure: {snapshot.pressure.level}
        </span>
        <span style={{ color: resolveImpactLevelColor("moderate") }}>
          Sources: {model.contextSources.join(", ")}
        </span>
      </div>
    </div>
  );
}

export default OperationalIntelligenceSurface;
