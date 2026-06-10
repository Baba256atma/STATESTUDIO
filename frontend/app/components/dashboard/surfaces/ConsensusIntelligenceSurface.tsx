"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_CONSENSUS_INTELLIGENCE_OWNER } from "../../../lib/dashboard/consensusIntelligence/consensusIntelligenceContract.ts";
import {
  initializeConsensusIntelligenceRuntime,
  resolveConsensusIntelligenceSurface,
} from "../../../lib/dashboard/consensusIntelligence/consensusIntelligenceRuntime.ts";
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

export type ConsensusIntelligenceSurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function ConsensusIntelligenceSurface(
  props: ConsensusIntelligenceSurfaceProps
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
      resolveConsensusIntelligenceSurface({
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
    initializeConsensusIntelligenceRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const consensusChart = model.visualBundle.microCharts.find(
    (chart) => chart.kind === "micro_bar" && chart.label === "Consensus Level"
  );
  const barSignal: DashboardMicroBarSeriesSignal = Object.freeze({
    kind: "micro_bar",
    label: "Consensus Level",
    values:
      consensusChart?.kind === "micro_bar"
        ? consensusChart.values
        : [0.55, 0.62, 0.58, 0.65],
  });

  const activeAlignment = snapshot.alignmentZones.zones.filter((entry) => entry.status === "Aligned");
  const activeDisagreement = snapshot.disagreementZones.zones.filter((entry) => entry.status === "Active");

  return (
    <div
      data-nx="consensus-intelligence-surface"
      data-surface="consensus_intelligence"
      data-owner={CANONICAL_CONSENSUS_INTELLIGENCE_OWNER}
      data-level={snapshot.consensusLevel.level}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Consensus Intelligence Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="consensus-level-card"
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
            Consensus Level
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(
                snapshot.consensusLevel.level === "strong_consensus"
                  ? "improving"
                  : snapshot.consensusLevel.level === "low_consensus"
                    ? "deteriorating"
                    : "stable"
              ),
            }}
          >
            {snapshot.consensusLevel.label}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            {snapshot.consensusLevel.summary}
          </span>
          <span style={{ fontSize: 10, color: dashboardVisualColors.textSoft }}>
            Trend: {snapshot.consensusLevel.trend}
          </span>
        </div>
        <MicroBarSeries signal={barSignal} />
      </div>

      <div
        data-nx="alignment-zones-strip"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: dashboardVisualSpacing.xs,
          padding: `${dashboardVisualSpacing.xs}px 0`,
        }}
      >
        {activeAlignment.map((entry) => (
          <span
            key={entry.zone}
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
        data-nx="consensus-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <AdvisoryDomainCard
          domain="consensus_alignment"
          title="Alignment Zones"
          primaryValue={activeAlignment[0]?.label ?? "Alignment"}
          secondaryValue={snapshot.alignmentZones.summary}
          meta={activeAlignment
            .slice(1, 4)
            .map((entry) => entry.label)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="consensus_disagreement"
          title="Disagreement Zones"
          primaryValue={activeDisagreement[0]?.label ?? "No Active Conflicts"}
          secondaryValue={snapshot.disagreementZones.summary}
          meta={activeDisagreement
            .slice(1, 3)
            .map((entry) => entry.label)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="consensus_convergence"
          title="Stakeholder Convergence"
          primaryValue={snapshot.convergence.label}
          secondaryValue={snapshot.convergence.summary}
          meta={`Trend: ${snapshot.convergence.trend}`}
        />
        <AdvisoryDomainCard
          domain="consensus_divergence"
          title="Stakeholder Divergence"
          primaryValue={snapshot.divergence.label}
          secondaryValue={snapshot.divergence.summary}
          meta={`Trend: ${snapshot.divergence.trend}`}
        />
        <AdvisoryDomainCard
          domain="consensus_tension"
          title="Institutional Tension"
          primaryValue={snapshot.institutionalTension.label}
          secondaryValue={snapshot.institutionalTension.summary}
          meta={snapshot.institutionalTension.visibility}
        />
        <AdvisoryDomainCard
          domain="consensus_confidence"
          title="Consensus Confidence"
          primaryValue={snapshot.consensusConfidence.label}
          secondaryValue={snapshot.consensusConfidence.summary}
          meta={snapshot.consensusConfidence.metadata}
        />
        <AdvisoryDomainCard
          domain="consensus_attention"
          title="Consensus Attention"
          primaryValue={snapshot.consensusAttention.label}
          secondaryValue={snapshot.consensusAttention.summary}
          meta={`${snapshot.consensusAttention.escalationIndicator} · ${snapshot.consensusAttention.discussionIndicator}`}
        />
      </div>
    </div>
  );
}

export default ConsensusIntelligenceSurface;
