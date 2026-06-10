"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER } from "../../../lib/dashboard/policyConstraintIntelligence/policyConstraintIntelligenceContract.ts";
import {
  initializePolicyConstraintIntelligenceRuntime,
  resolvePolicyConstraintIntelligenceSurface,
} from "../../../lib/dashboard/policyConstraintIntelligence/policyConstraintIntelligenceRuntime.ts";
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

export type PolicyConstraintIntelligenceSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function PolicyConstraintIntelligenceSurface(
  props: PolicyConstraintIntelligenceSurfaceProps
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
      resolvePolicyConstraintIntelligenceSurface({
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
    initializePolicyConstraintIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const severityChart = model.visualBundle.microCharts.find(
    (chart) => chart.kind === "micro_bar" && chart.label === "Constraint Severity"
  );
  const barSignal: DashboardMicroBarSeriesSignal = Object.freeze({
    kind: "micro_bar",
    label: "Constraint Severity",
    values:
      severityChart?.kind === "micro_bar"
        ? severityChart.values
        : snapshot.resourceConstraints.constraints.map((_, index) => 1 / (index + 1)),
  });

  return (
    <div
      data-nx="policy-constraint-intelligence-surface"
      data-surface="policy_constraint"
      data-owner={CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER}
      data-alignment={snapshot.policyAlignment.alignment}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Policy & Constraint Intelligence Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="policy-alignment-card"
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
            Policy Alignment
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(
                snapshot.policyAlignment.alignment === "aligned"
                  ? "improving"
                  : snapshot.policyAlignment.alignment === "potential_conflict"
                    ? "deteriorating"
                    : "stable"
              ),
            }}
          >
            {snapshot.policyAlignment.label}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            {snapshot.policyAlignment.summary}
          </span>
          <span style={{ fontSize: 10, color: dashboardVisualColors.textSoft }}>
            Trend: {snapshot.policyAlignment.trend}
          </span>
        </div>
        <MicroBarSeries signal={barSignal} />
      </div>

      <div
        data-nx="policy-constraint-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <AdvisoryDomainCard
          domain="policy_impact"
          title="Policy Impact"
          primaryValue={snapshot.policyImpact.label}
          secondaryValue={snapshot.policyImpact.summary}
          meta={snapshot.policyImpact.affectedPolicies
            .slice(0, 2)
            .map((entry) => entry.label.split(" ").pop())
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="resource_constraints"
          title="Resource Constraints"
          primaryValue={snapshot.resourceConstraints.constraints[0]?.label ?? "Resources"}
          secondaryValue={snapshot.resourceConstraints.summary}
          meta={snapshot.resourceConstraints.constraints
            .slice(1, 3)
            .map((entry) => entry.label)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="operational_constraints"
          title="Operational Constraints"
          primaryValue={snapshot.operationalConstraints.constraints[0]?.label ?? "Operations"}
          secondaryValue={snapshot.operationalConstraints.summary}
          meta={snapshot.operationalConstraints.constraints
            .slice(1, 3)
            .map((entry) => entry.readiness)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="governance_constraints"
          title="Governance Constraints"
          primaryValue={snapshot.governanceConstraints.constraints[0]?.label ?? "Governance"}
          secondaryValue={snapshot.governanceConstraints.summary}
          meta={snapshot.governanceConstraints.constraints
            .slice(1, 3)
            .map((entry) => entry.requirement)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="constraint_severity"
          title="Constraint Severity"
          primaryValue={snapshot.constraintSeverity.label}
          secondaryValue={snapshot.constraintSeverity.summary}
          meta={`Trend: ${snapshot.constraintSeverity.trend}`}
        />
        <AdvisoryDomainCard
          domain="policy_attention"
          title="Policy Attention"
          primaryValue={snapshot.policyAttention.label}
          secondaryValue={snapshot.policyAttention.summary}
          meta={`${snapshot.policyAttention.escalationIndicator} · ${snapshot.policyAttention.reviewIndicator}`}
        />
      </div>
    </div>
  );
}

export default PolicyConstraintIntelligenceSurface;
