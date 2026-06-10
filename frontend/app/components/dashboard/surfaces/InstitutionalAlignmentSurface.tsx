"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER } from "../../../lib/dashboard/institutionalAlignment/institutionalAlignmentContract.ts";
import {
  initializeInstitutionalAlignmentRuntime,
  resolveInstitutionalAlignmentSurface,
} from "../../../lib/dashboard/institutionalAlignment/institutionalAlignmentRuntime.ts";
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

export type InstitutionalAlignmentSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function InstitutionalAlignmentSurface(
  props: InstitutionalAlignmentSurfaceProps
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
      resolveInstitutionalAlignmentSurface({
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
    initializeInstitutionalAlignmentRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const healthChart = model.visualBundle.microCharts.find(
    (chart) => chart.kind === "micro_bar" && chart.label === "Institutional Health"
  );
  const barSignal: DashboardMicroBarSeriesSignal = Object.freeze({
    kind: "micro_bar",
    label: "Institutional Health",
    values:
      healthChart?.kind === "micro_bar"
        ? healthChart.values
        : [0.68, 0.72, 0.7, 0.75],
  });

  return (
    <div
      data-nx="institutional-alignment-surface"
      data-surface="institutional_alignment"
      data-owner={CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER}
      data-health={snapshot.institutionalHealth.level}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Institutional Alignment Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="institutional-health-card"
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
            Institutional Health
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(
                snapshot.institutionalHealth.level === "strong_alignment"
                  ? "improving"
                  : snapshot.institutionalHealth.level === "institutional_risk"
                    ? "deteriorating"
                    : "stable"
              ),
            }}
          >
            {snapshot.institutionalHealth.label}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            {snapshot.institutionalHealth.summary}
          </span>
          <span style={{ fontSize: 10, color: dashboardVisualColors.textSoft }}>
            Trend: {snapshot.institutionalHealth.trend}
          </span>
        </div>
        <MicroBarSeries signal={barSignal} />
      </div>

      <div
        data-nx="institutional-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <AdvisoryDomainCard
          domain="institutional_governance"
          title="Governance Status"
          primaryValue={snapshot.governanceStatus.label}
          secondaryValue={snapshot.governanceStatus.summary}
          meta={`${snapshot.governanceStatus.alert} · ${snapshot.governanceStatus.visibility}`}
        />
        <AdvisoryDomainCard
          domain="institutional_strategic"
          title="Strategic Alignment Status"
          primaryValue={snapshot.strategicAlignmentStatus.label}
          secondaryValue={snapshot.strategicAlignmentStatus.summary}
          meta={`${snapshot.strategicAlignmentStatus.concern} · ${snapshot.strategicAlignmentStatus.visibility}`}
        />
        <AdvisoryDomainCard
          domain="institutional_policy"
          title="Policy & Constraint Status"
          primaryValue={snapshot.policyStatus.label}
          secondaryValue={snapshot.policyStatus.summary}
          meta={`${snapshot.policyStatus.policyVisibility} · ${snapshot.policyStatus.constraintVisibility}`}
        />
        <AdvisoryDomainCard
          domain="institutional_stakeholder"
          title="Stakeholder Status"
          primaryValue={snapshot.stakeholderStatus.label}
          secondaryValue={snapshot.stakeholderStatus.summary}
          meta={`${snapshot.stakeholderStatus.supportVisibility} · ${snapshot.stakeholderStatus.tensionVisibility}`}
        />
        <AdvisoryDomainCard
          domain="institutional_consensus"
          title="Consensus Status"
          primaryValue={snapshot.consensusStatus.label}
          secondaryValue={snapshot.consensusStatus.summary}
          meta={`${snapshot.consensusStatus.convergenceVisibility} · ${snapshot.consensusStatus.divergenceVisibility}`}
        />
        <AdvisoryDomainCard
          domain="institutional_attention"
          title="Institutional Attention"
          primaryValue={snapshot.institutionalAttention.label}
          secondaryValue={snapshot.institutionalAttention.summary}
          meta={`${snapshot.institutionalAttention.escalationIndicator} · ${snapshot.institutionalAttention.discussionIndicator}`}
        />
      </div>
    </div>
  );
}

export default InstitutionalAlignmentSurface;
