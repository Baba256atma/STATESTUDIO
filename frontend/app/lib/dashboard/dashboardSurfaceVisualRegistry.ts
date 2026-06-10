/**
 * Phase 3:5 — Per-surface executive visual signal seed bundles.
 * Lightweight placeholder intelligence — not analytics engines.
 */

import type { DashboardAccordionPanelType } from "./dashboardAccordionPanelContract.ts";
import type { DashboardSurfaceVisualBundle } from "./dashboardVisualSignalContract.ts";

function bundle(
  panelType: DashboardAccordionPanelType,
  config: Omit<DashboardSurfaceVisualBundle, "panelType">
): DashboardSurfaceVisualBundle {
  return Object.freeze({ panelType, ...config });
}

export const DASHBOARD_SURFACE_VISUAL_REGISTRY: Readonly<
  Record<DashboardAccordionPanelType, DashboardSurfaceVisualBundle>
> = Object.freeze({
  operational: bundle("operational", {
    impactCard: Object.freeze({
      impactLevel: "moderate",
      direction: "stable",
      confidence: "high",
      timeHorizon: "short_term",
      headline: "Operational posture holding with localized pressure",
    }),
    headerSignals: Object.freeze({
      impactBadge: "moderate",
      trendDirection: "stable",
      summaryValue: "72%",
      confidence: "high",
      delta: Object.freeze({ kind: "delta", label: "Demand", value: "+4.2%", direction: "up" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "trend_line",
        label: "Demand Trend",
        points: [0.42, 0.48, 0.45, 0.52, 0.58, 0.55, 0.62],
        direction: "improving",
      }),
      Object.freeze({
        kind: "trend_line",
        label: "Workload Trend",
        points: [0.68, 0.65, 0.7, 0.72, 0.69, 0.74, 0.71],
        direction: "stable",
      }),
      Object.freeze({
        kind: "micro_bar",
        label: "Operational Pressure",
        values: [0.45, 0.62, 0.58, 0.71, 0.55],
      }),
    ]),
    statusIndicator: "Live",
  }),
  risk: bundle("risk", {
    impactCard: Object.freeze({
      impactLevel: "high",
      direction: "deteriorating",
      confidence: "moderate",
      timeHorizon: "immediate",
      headline: "Risk trajectory elevated — exposure widening",
    }),
    headerSignals: Object.freeze({
      impactBadge: "high",
      trendDirection: "deteriorating",
      summaryValue: "3.8",
      confidence: "moderate",
      delta: Object.freeze({ kind: "delta", label: "Exposure", value: "+12%", direction: "up" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "trend_line",
        label: "Risk Trajectory",
        points: [0.35, 0.4, 0.48, 0.52, 0.61, 0.68, 0.74],
        direction: "deteriorating",
      }),
      Object.freeze({
        kind: "micro_bar",
        label: "Exposure Level",
        values: [0.55, 0.72, 0.68, 0.81],
      }),
    ]),
    statusIndicator: "Monitoring",
  }),
  scenario: bundle("scenario", {
    impactCard: Object.freeze({
      impactLevel: "moderate",
      direction: "improving",
      confidence: "moderate",
      timeHorizon: "mid_term",
      headline: "Preferred scenario gaining separation",
    }),
    headerSignals: Object.freeze({
      impactBadge: "moderate",
      trendDirection: "improving",
      summaryValue: "84",
      confidence: "moderate",
      delta: Object.freeze({ kind: "delta", label: "Score", value: "+7", direction: "up" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "micro_bar",
        label: "Scenario Scores",
        values: [0.72, 0.84, 0.68, 0.59],
      }),
      Object.freeze({
        kind: "micro_bar",
        label: "Scenario Ranking",
        values: [0.9, 0.75, 0.6, 0.45],
      }),
    ]),
    statusIndicator: "Comparing",
  }),
  timeline: bundle("timeline", {
    impactCard: Object.freeze({
      impactLevel: "moderate",
      direction: "stable",
      confidence: "high",
      timeHorizon: "short_term",
      headline: "Milestone pressure contained within window",
    }),
    headerSignals: Object.freeze({
      impactBadge: "moderate",
      trendDirection: "stable",
      summaryValue: "68%",
      confidence: "high",
      delta: Object.freeze({ kind: "delta", label: "Momentum", value: "-3%", direction: "down" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "trend_line",
        label: "Timeline Momentum",
        points: [0.58, 0.55, 0.57, 0.54, 0.56, 0.53, 0.52],
        direction: "stable",
      }),
      Object.freeze({
        kind: "micro_bar",
        label: "Milestone Pressure",
        values: [0.4, 0.55, 0.62, 0.48],
      }),
    ]),
    statusIndicator: "Tracking",
  }),
  war_room: bundle("war_room", {
    impactCard: Object.freeze({
      impactLevel: "critical",
      direction: "deteriorating",
      confidence: "low",
      timeHorizon: "immediate",
      headline: "Threat level elevated — executive attention required",
    }),
    headerSignals: Object.freeze({
      impactBadge: "critical",
      trendDirection: "deteriorating",
      summaryValue: "ALERT",
      confidence: "low",
      delta: Object.freeze({ kind: "delta", label: "Urgency", value: "+18%", direction: "up" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "trend_line",
        label: "Threat Level",
        points: [0.3, 0.42, 0.55, 0.68, 0.78, 0.85, 0.92],
        direction: "deteriorating",
      }),
      Object.freeze({
        kind: "micro_bar",
        label: "Action Urgency",
        values: [0.88, 0.92, 0.76, 0.95],
      }),
    ]),
    statusIndicator: "Standby",
  }),
  decision_guidance: bundle("decision_guidance", {
    impactCard: Object.freeze({
      impactLevel: "high",
      direction: "stable",
      confidence: "moderate",
      timeHorizon: "immediate",
      headline: "Executive decision preparation — advisory, confidence, and context unified",
    }),
    headerSignals: Object.freeze({
      impactBadge: "high",
      trendDirection: "stable",
      summaryValue: "Guiding",
      confidence: "moderate",
      delta: Object.freeze({ kind: "delta", label: "Focus", value: "Active", direction: "up" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "micro_bar",
        label: "Guidance Urgency",
        values: [0.65, 0.78, 0.82, 0.88],
      }),
    ]),
    statusIndicator: "Guiding",
  }),
  governance: bundle("governance", {
    impactCard: Object.freeze({
      impactLevel: "moderate",
      direction: "stable",
      confidence: "moderate",
      timeHorizon: "immediate",
      headline: "Institutional alignment awareness — governance evaluation from decision intelligence",
    }),
    headerSignals: Object.freeze({
      impactBadge: "moderate",
      trendDirection: "stable",
      summaryValue: "Aligned",
      confidence: "moderate",
      delta: Object.freeze({ kind: "delta", label: "Governance", value: "Review", direction: "flat" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "micro_bar",
        label: "Governance Alignment",
        values: [0.72, 0.68, 0.75, 0.7],
      }),
    ]),
    statusIndicator: "Evaluating",
  }),
  strategic_alignment: bundle("strategic_alignment", {
    impactCard: Object.freeze({
      impactLevel: "moderate",
      direction: "stable",
      confidence: "moderate",
      timeHorizon: "mid_term",
      headline: "Institutional direction awareness — strategic alignment from governance and decision context",
    }),
    headerSignals: Object.freeze({
      impactBadge: "moderate",
      trendDirection: "stable",
      summaryValue: "Aligned",
      confidence: "moderate",
      delta: Object.freeze({ kind: "delta", label: "Strategy", value: "Review", direction: "flat" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "micro_bar",
        label: "Strategic Alignment",
        values: [0.74, 0.71, 0.76, 0.73],
      }),
    ]),
    statusIndicator: "Aligning",
  }),
  policy_constraint: bundle("policy_constraint", {
    impactCard: Object.freeze({
      impactLevel: "moderate",
      direction: "stable",
      confidence: "moderate",
      timeHorizon: "immediate",
      headline: "Institutional boundary awareness — policy and constraint evaluation from governance context",
    }),
    headerSignals: Object.freeze({
      impactBadge: "moderate",
      trendDirection: "stable",
      summaryValue: "Within",
      confidence: "moderate",
      delta: Object.freeze({ kind: "delta", label: "Policy", value: "Review", direction: "flat" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "micro_bar",
        label: "Constraint Severity",
        values: [0.35, 0.42, 0.48, 0.44],
      }),
    ]),
    statusIndicator: "Evaluating",
  }),
  stakeholder_intelligence: bundle("stakeholder_intelligence", {
    impactCard: Object.freeze({
      impactLevel: "moderate",
      direction: "stable",
      confidence: "moderate",
      timeHorizon: "immediate",
      headline: "Organizational impact awareness — stakeholder evaluation from institutional context",
    }),
    headerSignals: Object.freeze({
      impactBadge: "moderate",
      trendDirection: "stable",
      summaryValue: "Mapped",
      confidence: "moderate",
      delta: Object.freeze({ kind: "delta", label: "Stakeholders", value: "7", direction: "flat" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "micro_bar",
        label: "Stakeholder Impact",
        values: [0.55, 0.62, 0.58, 0.65],
      }),
    ]),
    statusIndicator: "Mapping",
  }),
  consensus_intelligence: bundle("consensus_intelligence", {
    impactCard: Object.freeze({
      impactLevel: "moderate",
      direction: "stable",
      confidence: "moderate",
      timeHorizon: "immediate",
      headline: "Institutional alignment awareness — consensus evaluation from stakeholder and policy context",
    }),
    headerSignals: Object.freeze({
      impactBadge: "moderate",
      trendDirection: "stable",
      summaryValue: "Evaluating",
      confidence: "moderate",
      delta: Object.freeze({ kind: "delta", label: "Consensus", value: "Review", direction: "flat" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "micro_bar",
        label: "Consensus Level",
        values: [0.62, 0.68, 0.64, 0.71],
      }),
    ]),
    statusIndicator: "Evaluating",
  }),
  institutional_alignment: bundle("institutional_alignment", {
    impactCard: Object.freeze({
      impactLevel: "high",
      direction: "stable",
      confidence: "moderate",
      timeHorizon: "immediate",
      headline: "Executive institutional command center — unified coherence across governance, strategy, and stakeholders",
    }),
    headerSignals: Object.freeze({
      impactBadge: "high",
      trendDirection: "stable",
      summaryValue: "Command",
      confidence: "moderate",
      delta: Object.freeze({ kind: "delta", label: "Institutional", value: "Review", direction: "flat" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "micro_bar",
        label: "Institutional Health",
        values: [0.7, 0.74, 0.72, 0.78],
      }),
    ]),
    statusIndicator: "Command",
  }),
  decision: bundle("decision", {
    impactCard: Object.freeze({
      impactLevel: "moderate",
      direction: "improving",
      confidence: "high",
      timeHorizon: "immediate",
      headline: "Decision council aligned on primary option",
    }),
    headerSignals: Object.freeze({
      impactBadge: "moderate",
      trendDirection: "improving",
      summaryValue: "Ready",
      confidence: "high",
      delta: Object.freeze({ kind: "delta", label: "Options", value: "+2", direction: "up" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "micro_bar",
        label: "Council Alignment",
        values: [0.7, 0.82, 0.78, 0.85],
      }),
    ]),
    statusIndicator: "Ready",
  }),
  executive_summary: bundle("executive_summary", {
    impactCard: Object.freeze({
      impactLevel: "high",
      direction: "stable",
      confidence: "moderate",
      timeHorizon: "mid_term",
      headline: "Strategic direction steady — localized risks emerging",
    }),
    headerSignals: Object.freeze({
      impactBadge: "high",
      trendDirection: "stable",
      summaryValue: "Overall",
      confidence: "moderate",
      delta: Object.freeze({ kind: "delta", label: "Impact", value: "−7%", direction: "down" }),
    }),
    microCharts: Object.freeze([
      Object.freeze({
        kind: "trend_line",
        label: "Strategic Direction",
        points: [0.5, 0.52, 0.51, 0.53, 0.52, 0.54, 0.53],
        direction: "stable",
      }),
    ]),
    statusIndicator: "Overview",
  }),
});

export function getDashboardSurfaceVisualBundle(
  panelType: DashboardAccordionPanelType
): DashboardSurfaceVisualBundle {
  return DASHBOARD_SURFACE_VISUAL_REGISTRY[panelType];
}

export function listDashboardSurfaceVisualPanelTypes(): readonly DashboardAccordionPanelType[] {
  return Object.freeze(Object.keys(DASHBOARD_SURFACE_VISUAL_REGISTRY) as DashboardAccordionPanelType[]);
}
