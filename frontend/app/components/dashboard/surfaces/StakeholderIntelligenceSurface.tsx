"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER } from "../../../lib/dashboard/stakeholderIntelligence/stakeholderIntelligenceContract.ts";
import {
  initializeStakeholderIntelligenceRuntime,
  resolveStakeholderIntelligenceSurface,
} from "../../../lib/dashboard/stakeholderIntelligence/stakeholderIntelligenceRuntime.ts";
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

export type StakeholderIntelligenceSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function StakeholderIntelligenceSurface(
  props: StakeholderIntelligenceSurfaceProps
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
      resolveStakeholderIntelligenceSurface({
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
    initializeStakeholderIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const impactChart = model.visualBundle.microCharts.find(
    (chart) => chart.kind === "micro_bar" && chart.label === "Stakeholder Impact"
  );
  const barSignal: DashboardMicroBarSeriesSignal = Object.freeze({
    kind: "micro_bar",
    label: "Stakeholder Impact",
    values:
      impactChart?.kind === "micro_bar"
        ? impactChart.values
        : snapshot.stakeholderVisibility.stakeholders.map((_, index) => 1 / (index + 1)),
  });

  return (
    <div
      data-nx="stakeholder-intelligence-surface"
      data-surface="stakeholder_intelligence"
      data-owner={CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER}
      data-impact={snapshot.stakeholderImpact.impact}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Stakeholder Intelligence Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="stakeholder-impact-card"
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
            Stakeholder Impact
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(
                snapshot.stakeholderImpact.impact === "positive"
                  ? "improving"
                  : snapshot.stakeholderImpact.impact === "negative"
                    ? "deteriorating"
                    : "stable"
              ),
            }}
          >
            {snapshot.stakeholderImpact.label}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            {snapshot.stakeholderImpact.summary}
          </span>
          <span style={{ fontSize: 10, color: dashboardVisualColors.textSoft }}>
            Trend: {snapshot.stakeholderImpact.trend}
          </span>
        </div>
        <MicroBarSeries signal={barSignal} />
      </div>

      <div
        data-nx="stakeholder-visibility-strip"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: dashboardVisualSpacing.xs,
          padding: `${dashboardVisualSpacing.xs}px 0`,
        }}
      >
        {snapshot.stakeholderVisibility.stakeholders.map((entry) => (
          <span
            key={entry.groupId}
            style={{
              fontSize: 10,
              padding: "2px 8px",
              borderRadius: 4,
              border: `1px solid ${dashboardVisualColors.border}`,
              color: dashboardVisualColors.textSoft,
            }}
          >
            {entry.label}
          </span>
        ))}
      </div>

      <div
        data-nx="stakeholder-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <AdvisoryDomainCard
          domain="stakeholder_visibility"
          title="Stakeholder Visibility"
          primaryValue={snapshot.stakeholderVisibility.stakeholders[0]?.label ?? "Stakeholders"}
          secondaryValue={snapshot.stakeholderVisibility.summary}
          meta={snapshot.stakeholderVisibility.stakeholders
            .slice(1, 4)
            .map((entry) => entry.label)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="stakeholder_alignment"
          title="Stakeholder Alignment"
          primaryValue={snapshot.stakeholderAlignment.label}
          secondaryValue={snapshot.stakeholderAlignment.summary}
          meta={snapshot.stakeholderAlignment.entries
            .slice(0, 2)
            .map((entry) => entry.label)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="stakeholder_influence"
          title="Stakeholder Influence"
          primaryValue={snapshot.stakeholderInfluence.entries[0]?.label ?? "Influence"}
          secondaryValue={snapshot.stakeholderInfluence.summary}
          meta={snapshot.stakeholderInfluence.entries
            .slice(1, 3)
            .map((entry) => entry.influence)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="stakeholder_tension"
          title="Stakeholder Tension"
          primaryValue={snapshot.stakeholderTension.label}
          secondaryValue={snapshot.stakeholderTension.summary}
          meta={snapshot.stakeholderTension.competingInterests.slice(0, 2).join(" · ")}
        />
        <AdvisoryDomainCard
          domain="stakeholder_support"
          title="Stakeholder Support"
          primaryValue={snapshot.stakeholderSupport.entries[0]?.label ?? "Support"}
          secondaryValue={snapshot.stakeholderSupport.summary}
          meta={snapshot.stakeholderSupport.entries
            .slice(1, 3)
            .map((entry) => entry.support.replace(/_/g, " "))
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="stakeholder_confidence"
          title="Stakeholder Confidence"
          primaryValue={snapshot.stakeholderConfidence.label}
          secondaryValue={snapshot.stakeholderConfidence.summary}
          meta={snapshot.stakeholderConfidence.metadata}
        />
        <AdvisoryDomainCard
          domain="stakeholder_attention"
          title="Stakeholder Attention"
          primaryValue={snapshot.stakeholderAttention.label}
          secondaryValue={snapshot.stakeholderAttention.summary}
          meta={`${snapshot.stakeholderAttention.escalationIndicator} · ${snapshot.stakeholderAttention.discussionIndicator}`}
        />
      </div>
    </div>
  );
}

export default StakeholderIntelligenceSurface;
