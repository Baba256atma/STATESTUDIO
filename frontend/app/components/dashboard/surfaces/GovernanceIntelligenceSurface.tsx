"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER } from "../../../lib/dashboard/governanceIntelligence/governanceIntelligenceContract.ts";
import {
  initializeGovernanceIntelligenceRuntime,
  resolveGovernanceIntelligenceSurface,
} from "../../../lib/dashboard/governanceIntelligence/governanceIntelligenceRuntime.ts";
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

export type GovernanceIntelligenceSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function GovernanceIntelligenceSurface(
  props: GovernanceIntelligenceSurfaceProps
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
      resolveGovernanceIntelligenceSurface({
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
    initializeGovernanceIntelligenceRuntime({
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
    (chart) => chart.kind === "micro_bar" && chart.label === "Governance Alignment"
  );
  const barSignal: DashboardMicroBarSeriesSignal = Object.freeze({
    kind: "micro_bar",
    label: "Governance Alignment",
    values:
      alignmentChart?.kind === "micro_bar"
        ? alignmentChart.values
        : snapshot.constraintAwareness.constraints.map((_, index) => 1 / (index + 1)),
  });

  return (
    <div
      data-nx="governance-intelligence-surface"
      data-surface="governance"
      data-owner={CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER}
      data-alignment={snapshot.governanceAlignment.alignment}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Governance Intelligence Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="governance-alignment-card"
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
            Governance Alignment
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(
                snapshot.governanceAlignment.alignment === "aligned"
                  ? "improving"
                  : snapshot.governanceAlignment.alignment === "potential_misalignment"
                    ? "deteriorating"
                    : "stable"
              ),
            }}
          >
            {snapshot.governanceAlignment.label}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            {snapshot.governanceAlignment.summary}
          </span>
          <span style={{ fontSize: 10, color: dashboardVisualColors.textSoft }}>
            Trend: {snapshot.governanceAlignment.trend}
          </span>
        </div>
        <MicroBarSeries signal={barSignal} />
      </div>

      <div
        data-nx="governance-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <AdvisoryDomainCard
          domain="policy_awareness"
          title="Policy Awareness"
          primaryValue={snapshot.policyAwareness.considerations[0]?.label ?? "Policy scan"}
          secondaryValue={snapshot.policyAwareness.summary}
          meta={`${snapshot.policyAwareness.reviewStatus} · ${snapshot.policyAwareness.conflictIndicator}`}
        />
        <AdvisoryDomainCard
          domain="constraint_awareness"
          title="Constraint Awareness"
          primaryValue={snapshot.constraintAwareness.constraints[0]?.label ?? "Constraints"}
          secondaryValue={snapshot.constraintAwareness.summary}
          meta={snapshot.constraintAwareness.constraints
            .slice(1, 3)
            .map((entry) => entry.label)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="stakeholder_impact"
          title="Stakeholder Impact"
          primaryValue={snapshot.stakeholderImpact.stakeholders[0]?.label ?? "Stakeholders"}
          secondaryValue={snapshot.stakeholderImpact.summary}
          meta={snapshot.stakeholderImpact.stakeholders
            .slice(1, 3)
            .map((entry) => entry.group.replace("_", " "))
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="accountability_context"
          title="Accountability Context"
          primaryValue={snapshot.accountabilityContext.entries[0]?.label ?? "Ownership"}
          secondaryValue={snapshot.accountabilityContext.summary}
          meta={snapshot.accountabilityContext.entries
            .slice(1, 3)
            .map((entry) => entry.value)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="governance_attention"
          title="Governance Attention"
          primaryValue={snapshot.governanceAttention.label}
          secondaryValue={snapshot.governanceAttention.summary}
          meta={`${snapshot.governanceAttention.reviewStatus} · ${snapshot.governanceAttention.escalationStatus}`}
        />
      </div>
    </div>
  );
}

export default GovernanceIntelligenceSurface;
