"use client";

import React, { useEffect, useMemo } from "react";
import type { DashboardContext } from "../../../lib/ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "../../../lib/dashboard/dashboardContextTypes.ts";
import { CANONICAL_EXECUTIVE_ADVISORY_OWNER } from "../../../lib/dashboard/executiveAdvisory/executiveAdvisoryContract.ts";
import {
  initializeExecutiveAdvisoryRuntime,
  resolveExecutiveAdvisorySurface,
} from "../../../lib/dashboard/executiveAdvisory/executiveAdvisoryRuntime.ts";
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
import { buildConfidenceVisualSummary } from "../../../lib/dashboard/executiveAdvisory/confidence/advisoryConfidenceVisual.ts";
import { AdvisoryExplainabilitySection } from "./AdvisoryExplainabilitySection.tsx";

export type ExecutiveAdvisorySurfaceProps = {
  dashboardContext: DashboardContext;
  normalizedContext?: NormalizedDashboardContext | null;
  selectedObjectId?: string | null;
  selectedObjectLabel?: string | null;
  objectsInScene?: number;
  timelineActive?: boolean;
};

export function ExecutiveAdvisorySurface(props: ExecutiveAdvisorySurfaceProps): React.ReactElement {
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
      resolveExecutiveAdvisorySurface({
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
    initializeExecutiveAdvisoryRuntime({
      dashboardContext,
      normalizedContext,
      selectedObjectId,
      selectedObjectLabel,
      objectsInScene,
      timelineActive,
    });
  }, [dashboardContext, normalizedContext?.id, selectedObjectId, timelineActive]);

  const { snapshot } = model;
  const confidenceVisual = useMemo(
    () => buildConfidenceVisualSummary(model.confidenceEvaluation),
    [model.confidenceEvaluation]
  );
  const alignmentChart = model.visualBundle.microCharts.find(
    (chart) => chart.kind === "micro_bar" && chart.label === "Council Alignment"
  );
  const barSignal: DashboardMicroBarSeriesSignal = Object.freeze({
    kind: "micro_bar",
    label: "Priority Ranking",
    values:
      alignmentChart?.kind === "micro_bar"
        ? alignmentChart.values
        : snapshot.prioritySignals.signals.map((entry) => 1 / entry.rank),
  });

  return (
    <div
      data-nx="executive-advisory-surface"
      data-surface="decision"
      data-owner={CANONICAL_EXECUTIVE_ADVISORY_OWNER}
      data-focus={snapshot.focus.focus}
      style={dashboardVisualPanelStyle()}
    >
      <div style={{ ...dashboardVisualTypography.microLabel, color: dashboardVisualColors.textSoft }}>
        Executive Advisory Surface
      </div>

      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: dashboardVisualColors.text }}>
        {model.headline}
      </h2>

      <ExecutiveImpactCard signal={model.visualBundle.impactCard} />

      <div
        data-nx="advisory-focus-card"
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
            Advisory Focus
          </span>
          <span
            style={{
              ...dashboardVisualTypography.summaryValue,
              color: resolveDirectionColor(
                snapshot.focus.focus === "decision_recommended" ? "deteriorating" : "stable"
              ),
            }}
          >
            {snapshot.focus.label}
          </span>
          <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
            {snapshot.focus.summary}
          </span>
          <span style={{ fontSize: 10, color: dashboardVisualColors.textSoft }}>
            Urgency: {snapshot.focus.urgency} · Attention: {snapshot.focus.attentionLevel}
          </span>
        </div>
        <MicroBarSeries signal={barSignal} />
      </div>

      <div
        data-nx="advisory-domain-cards"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: dashboardVisualSpacing.md,
        }}
      >
        <AdvisoryDomainCard
          domain="priority_signals"
          title="Priority Signals"
          primaryValue={snapshot.prioritySignals.topPriority}
          secondaryValue={snapshot.prioritySignals.summary}
          meta={snapshot.prioritySignals.signals
            .slice(0, 2)
            .map((entry) => entry.label)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="advisory_narrative"
          title="Advisory Narrative"
          primaryValue={snapshot.narrative.situationSummary}
          secondaryValue={snapshot.narrative.executiveBriefing}
          meta={snapshot.narrative.contextSummary}
        />
        <AdvisoryDomainCard
          domain="guidance_candidates"
          title="Guidance Candidates"
          primaryValue={snapshot.guidanceCandidates.candidates[0]?.label ?? "Review guidance"}
          secondaryValue={snapshot.guidanceCandidates.summary}
          meta={snapshot.guidanceCandidates.candidates
            .slice(1)
            .map((entry) => entry.label)
            .join(" · ")}
        />
        <AdvisoryDomainCard
          domain="advisory_confidence"
          title="Advisory Confidence"
          primaryValue={snapshot.confidence.label}
          secondaryValue={snapshot.confidence.explanation}
          meta={`Trend: ${snapshot.confidence.trend}`}
        />
      </div>

      <div
        data-nx="advisory-confidence-visual"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: dashboardVisualSpacing.sm,
          padding: dashboardVisualSpacing.sm,
          borderRadius: 8,
          border: `1px solid ${dashboardVisualColors.border}`,
          background: dashboardVisualColors.surface,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: dashboardVisualSpacing.sm }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 8px",
              borderRadius: 999,
              color: confidenceVisual.badge.color,
              background: confidenceVisual.badge.background,
            }}
          >
            {confidenceVisual.badge.label}
          </span>
          <span style={{ fontSize: 10, color: confidenceVisual.trendColor }}>
            Trend: {confidenceVisual.trend}
          </span>
        </div>
        <span style={{ ...dashboardVisualTypography.cardMeta, color: dashboardVisualColors.muted }}>
          {confidenceVisual.executiveSummary}
        </span>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: dashboardVisualSpacing.xs,
          }}
        >
          {confidenceVisual.domainIndicators.map((indicator) => (
            <span
              key={indicator.domain}
              style={{ fontSize: 10, color: dashboardVisualColors.textSoft }}
              title={indicator.summary}
            >
              {indicator.label}
            </span>
          ))}
        </div>
      </div>

      <AdvisoryExplainabilitySection explanationBundle={model.explanationBundle} />

      <div
        data-nx="war-room-advisory-bridge"
        style={{
          fontSize: 10,
          color: dashboardVisualColors.textSoft,
          padding: dashboardVisualSpacing.sm,
          borderRadius: 6,
          border: `1px dashed ${dashboardVisualColors.border}`,
        }}
      >
        War Room bridge: {snapshot.warRoomContextBridge}
      </div>
    </div>
  );
}

export default ExecutiveAdvisorySurface;
