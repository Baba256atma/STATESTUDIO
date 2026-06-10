"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_RISK_INTELLIGENCE_OWNER } from "../../../lib/dashboard/riskIntelligence/riskIntelligenceContract.ts";
import {
  initializeRiskIntelligenceRuntime,
  resolveRiskIntelligenceSurface,
} from "../../../lib/dashboard/riskIntelligence/riskIntelligenceRuntime.ts";
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
import { RiskDomainCard } from "./RiskDomainCard.tsx";
import type { DashboardTrendLineSignal } from "../../../lib/dashboard/dashboardVisualSignalContract.ts";

export type RiskIntelligenceSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

const EXPOSURE_COLOR: Readonly<Record<string, string>> = Object.freeze({
  low: "var(--nx-success)",
  moderate: "var(--nx-accent)",
  high: "var(--nx-warning)",
  critical: "var(--nx-risk)",
});

const ATTENTION_COLOR: Readonly<Record<string, string>> = Object.freeze({
  monitor: "var(--nx-success)",
  review: "var(--nx-accent)",
  investigate: "var(--nx-warning)",
  immediate_attention: "var(--nx-risk)",
});

export function RiskIntelligenceSurface(props: RiskIntelligenceSurfaceProps): React.ReactElement {
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
      resolveRiskIntelligenceSurface({
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
    initializeRiskIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const momentumTrend: DashboardTrendLineSignal = Object.freeze({
    kind: "trend_line",
    label: "Risk Momentum",
    points: snapshot.momentum.trendPoints,
    direction:
      snapshot.momentum.momentum === "improving"
        ? "improving"
        : snapshot.momentum.momentum === "worsening"
          ? "deteriorating"
          : "stable",
  });

  const activeRiskLabel =
    snapshot.activeRisks.count === 0
      ? "No Active Risks"
      : snapshot.activeRisks.count === 1
        ? "1 Active Risk"
        : "Multiple Active Risks";

  return (
    <div
      data-nx="risk-intelligence-surface"
      data-surface="risk"
      data-owner={CANONICAL_RISK_INTELLIGENCE_OWNER}
      data-exposure={snapshot.exposure.level}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Risk Intelligence Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="risk-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <RiskDomainCard
          domain="active_risks"
          title="Active Risks"
          primaryValue={activeRiskLabel}
          secondaryValue={snapshot.activeRisks.summary}
          meta={`Top: ${snapshot.activeRisks.topRisk}`}
        />
        <RiskDomainCard
          domain="exposure"
          title="Risk Exposure"
          primaryValue={snapshot.exposure.label}
          secondaryValue={`Trend: ${snapshot.exposure.trend} · Confidence: ${snapshot.exposure.confidence}`}
        />
        <RiskDomainCard
          domain="confidence"
          title="Risk Confidence"
          primaryValue={snapshot.confidence.level}
          secondaryValue={snapshot.confidence.summary}
          meta={`Trend: ${snapshot.confidence.trend}`}
        />
        <RiskDomainCard
          domain="executive_attention"
          title="Executive Attention Required"
          primaryValue={snapshot.executiveAttention.label}
          secondaryValue={snapshot.executiveAttention.recommendation}
          meta={`Urgency: ${snapshot.executiveAttention.urgency}`}
        />
      </div>

      <div
        data-nx="risk-momentum-card"
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
            Risk Momentum
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(momentumTrend.direction),
            }}
          >
            {snapshot.momentum.label} {snapshot.momentum.indicator}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            Directional movement of risk posture
          </span>
        </div>
        <MicroTrendLine signal={momentumTrend} />
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
        <span style={{ color: EXPOSURE_COLOR[snapshot.exposure.level] }}>
          Exposure: {snapshot.exposure.label}
        </span>
        <span style={{ color: resolveDirectionColor(momentumTrend.direction) }}>
          Momentum: {snapshot.momentum.label}
        </span>
        <span style={{ color: ATTENTION_COLOR[snapshot.executiveAttention.status] }}>
          Attention: {snapshot.executiveAttention.label}
        </span>
        <span style={{ color: resolveImpactLevelColor("moderate") }}>
          Sources: {model.contextSources.join(", ")}
        </span>
      </div>
    </div>
  );
}

export default RiskIntelligenceSurface;
