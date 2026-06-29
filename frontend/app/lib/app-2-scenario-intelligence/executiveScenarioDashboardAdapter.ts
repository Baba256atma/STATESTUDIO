/**
 * APP-2:12 — Executive Scenario Dashboard Adapter.
 * Dashboard projection from ExecutiveScenarioWorkspaceView only.
 */

import type { ExecutiveScenarioWorkspaceView } from "./executiveScenarioWorkspaceView.ts";
import {
  createExecutiveScenarioDashboardCard,
  createExecutiveScenarioDashboardCardEvidence,
  EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS,
  mapSummarySourceToDashboardEvidenceSource,
  type ExecutiveScenarioDashboardCard,
  type ExecutiveScenarioDashboardCardEvidence,
} from "./executiveScenarioDashboardCards.ts";
import {
  createExecutiveScenarioDashboardAlert,
  createExecutiveScenarioDashboardIndicator,
  createExecutiveScenarioDashboardView,
  createUnavailableExecutiveScenarioDashboardView,
  type ExecutiveScenarioDashboardAdapterRequest,
  type ExecutiveScenarioDashboardAlert,
  type ExecutiveScenarioDashboardIndicator,
  type ExecutiveScenarioDashboardStatus,
  type ExecutiveScenarioDashboardView,
  EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION,
} from "./executiveScenarioDashboardView.ts";
import {
  createExecutiveScenarioDashboardDiagnostic,
  type ExecutiveScenarioDashboardDiagnostic,
} from "./executiveScenarioDashboardDiagnostics.ts";

export {
  EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION,
  type ExecutiveScenarioDashboardAdapterRequest,
  type ExecutiveScenarioDashboardView,
};

export const EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES = Object.freeze({
  readOnly: true,
  consumesWorkspaceViewOnly: true,
  generatesIntelligence: false,
  analyzesData: false,
  executesRecommendations: false,
  modifiesScenarios: false,
  modifiesWorkspace: false,
  noUi: true,
  noReact: true,
  noCharts: true,
  noLlm: true,
  noMl: true,
  noGlobalCache: true,
  workspaceIsolated: true,
  deterministic: true,
  projectsOnly: true,
} as const);

export const EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_MANIFEST = Object.freeze({
  stageId: "APP-2/12",
  title: "Executive Scenario Dashboard Adapter",
  goal: "Single read-only dashboard integration boundary for APP-2.",
  adapterVersion: EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION,
  workspaceAdapterModified: false,
  contractModified: false,
} as const);

function extractFirstNumber(text: string): string {
  const match = text.match(/(\d+)/);
  return match?.[1] ?? "0";
}

function extractCriticalCount(text: string): string {
  const match = text.match(/(\d+)\s+critical/i);
  return match?.[1] ?? "0";
}

function resolveDashboardStatus(
  view: ExecutiveScenarioWorkspaceView,
  diagnostics: readonly ExecutiveScenarioDashboardDiagnostic[]
): ExecutiveScenarioDashboardStatus {
  if (diagnostics.some((entry) => entry.severity === "error") || view.status === "unavailable") {
    return "unavailable";
  }
  if (view.status === "partial" || diagnostics.some((entry) => entry.severity === "warning")) {
    return "partial";
  }
  return "ready";
}

function validateWorkspaceViewForDashboard(
  view: ExecutiveScenarioWorkspaceView,
  workspaceId: string | undefined,
  generatedAt: string
): readonly ExecutiveScenarioDashboardDiagnostic[] {
  const diagnostics: ExecutiveScenarioDashboardDiagnostic[] = [];

  if (!view.readOnly) {
    diagnostics.push(
      createExecutiveScenarioDashboardDiagnostic(
        "missing_workspace_view",
        "ExecutiveScenarioWorkspaceView must be read-only.",
        generatedAt
      )
    );
  }
  if (view.adapterVersion !== "APP-2/10") {
    diagnostics.push(
      createExecutiveScenarioDashboardDiagnostic(
        "adapter_failure",
        "ExecutiveScenarioWorkspaceView adapter version mismatch.",
        generatedAt
      )
    );
  }
  if (workspaceId !== undefined && view.workspaceId !== workspaceId.trim()) {
    diagnostics.push(
      createExecutiveScenarioDashboardDiagnostic(
        "adapter_failure",
        "Workspace view workspace ID does not match request.",
        generatedAt,
        Object.freeze({ requestedWorkspaceId: workspaceId, viewWorkspaceId: view.workspaceId })
      )
    );
  }
  if (view.summary === null) {
    diagnostics.push(
      createExecutiveScenarioDashboardDiagnostic(
        "missing_summary",
        "ExecutiveScenarioSummary not available in workspace view.",
        generatedAt
      )
    );
  }
  if (view.recommendationPortfolio === null) {
    diagnostics.push(
      createExecutiveScenarioDashboardDiagnostic(
        "missing_recommendation_portfolio",
        "ExecutiveRecommendationPortfolio not available in workspace view.",
        generatedAt
      )
    );
  }

  return Object.freeze(diagnostics);
}

function collectCardEvidence(
  view: ExecutiveScenarioWorkspaceView,
  sources: readonly string[],
  startIndex: number
): readonly ExecutiveScenarioDashboardCardEvidence[] {
  const evidence: ExecutiveScenarioDashboardCardEvidence[] = [];
  let index = startIndex;

  if (view.summary !== null) {
    for (const entry of view.summary.supportingEvidence) {
      if (sources.includes(entry.source) || sources.includes(entry.section)) {
        evidence.push(
          createExecutiveScenarioDashboardCardEvidence({
            evidenceRefId: `dashboard-evidence-${index++}`,
            source: mapSummarySourceToDashboardEvidenceSource(entry.source),
            sourceRef: entry.sourceRef,
            summary: entry.summary,
          })
        );
      }
    }
  }

  if (view.recommendationPortfolio !== null && sources.includes("recommendation_portfolio")) {
    for (const entry of view.recommendationPortfolio.evidence) {
      evidence.push(
        createExecutiveScenarioDashboardCardEvidence({
          evidenceRefId: `dashboard-evidence-${index++}`,
          source: "recommendation_portfolio",
          sourceRef: entry.sourceRef,
          summary: entry.summary,
        })
      );
    }
  }

  return Object.freeze(evidence);
}

function buildDashboardCards(
  view: ExecutiveScenarioWorkspaceView
): Readonly<{
  executiveSummaryCard: ExecutiveScenarioDashboardCard;
  priorityCard: ExecutiveScenarioDashboardCard;
  dependencyCard: ExecutiveScenarioDashboardCard;
  conflictCard: ExecutiveScenarioDashboardCard;
  opportunityCard: ExecutiveScenarioDashboardCard;
  recommendationCard: ExecutiveScenarioDashboardCard;
  riskCard: ExecutiveScenarioDashboardCard;
  kpiCard: ExecutiveScenarioDashboardCard;
  timelineCard: ExecutiveScenarioDashboardCard;
}> {
  const summary = view.summary;
  const portfolio = view.recommendationPortfolio;

  const headline = summary?.executiveHeadline ?? "";
  const situation = summary?.situationBrief ?? "";

  const recommendationContent =
    portfolio === null
      ? ""
      : `${portfolio.recommendations.length} recommendation option(s). Focus: ${portfolio.recommendedFocus}.`;

  return Object.freeze({
    executiveSummaryCard: createExecutiveScenarioDashboardCard({
      cardId: EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS.executiveSummary,
      kind: "executive_summary",
      title: "Executive Summary",
      content: `${headline} ${situation}`.trim(),
      evidence: collectCardEvidence(view, ["summary"], 0),
    }),
    priorityCard: createExecutiveScenarioDashboardCard({
      cardId: EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS.priority,
      kind: "priority",
      title: "Priority",
      content: summary?.prioritySummary ?? "",
      evidence: collectCardEvidence(view, ["priority", "prioritySummary"], 10),
    }),
    dependencyCard: createExecutiveScenarioDashboardCard({
      cardId: EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS.dependency,
      kind: "dependency",
      title: "Dependencies",
      content: summary?.dependencySummary ?? "",
      evidence: collectCardEvidence(view, ["dependency_graph", "dependencySummary"], 20),
    }),
    conflictCard: createExecutiveScenarioDashboardCard({
      cardId: EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS.conflict,
      kind: "conflict",
      title: "Conflicts",
      content: summary?.conflictSummary ?? "",
      evidence: collectCardEvidence(view, ["conflict_graph", "conflictSummary"], 30),
    }),
    opportunityCard: createExecutiveScenarioDashboardCard({
      cardId: EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS.opportunity,
      kind: "opportunity",
      title: "Opportunities",
      content: summary?.opportunitySummary ?? "",
      evidence: collectCardEvidence(view, ["opportunity_graph", "opportunitySummary"], 40),
    }),
    recommendationCard: createExecutiveScenarioDashboardCard({
      cardId: EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS.recommendation,
      kind: "recommendation",
      title: "Recommendations",
      content: recommendationContent,
      evidence: collectCardEvidence(view, ["recommendation_portfolio"], 50),
    }),
    riskCard: createExecutiveScenarioDashboardCard({
      cardId: EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS.risk,
      kind: "risk",
      title: "Risks",
      content: summary?.riskSummary ?? "",
      evidence: collectCardEvidence(view, ["risk", "riskSummary"], 60),
    }),
    kpiCard: createExecutiveScenarioDashboardCard({
      cardId: EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS.kpi,
      kind: "kpi",
      title: "KPIs",
      content: summary?.kpiSummary ?? "",
      evidence: collectCardEvidence(view, ["kpi", "kpiSummary"], 70),
    }),
    timelineCard: createExecutiveScenarioDashboardCard({
      cardId: EXECUTIVE_SCENARIO_DASHBOARD_CARD_IDS.timeline,
      kind: "timeline",
      title: "Timeline",
      content: summary?.timelineSummary ?? "",
      evidence: collectCardEvidence(view, ["timeline", "executive_time", "timelineSummary"], 80),
    }),
  });
}

function buildExecutiveIndicators(
  view: ExecutiveScenarioWorkspaceView,
  diagnostics: readonly ExecutiveScenarioDashboardDiagnostic[]
): readonly ExecutiveScenarioDashboardIndicator[] {
  const summary = view.summary;
  const portfolio = view.recommendationPortfolio;

  return Object.freeze([
    createExecutiveScenarioDashboardIndicator({
      indicatorId: "indicator-overall-status",
      kind: "overall_status",
      label: "Overall Status",
      value: view.status,
    }),
    createExecutiveScenarioDashboardIndicator({
      indicatorId: "indicator-priority-level",
      kind: "priority_level",
      label: "Priority Level",
      value: summary?.prioritySummary.split(".")[0] ?? "unknown",
    }),
    createExecutiveScenarioDashboardIndicator({
      indicatorId: "indicator-conflict-count",
      kind: "conflict_count",
      label: "Conflict Count",
      value: extractFirstNumber(summary?.conflictSummary ?? "0"),
    }),
    createExecutiveScenarioDashboardIndicator({
      indicatorId: "indicator-opportunity-count",
      kind: "opportunity_count",
      label: "Opportunity Count",
      value: extractFirstNumber(summary?.opportunitySummary ?? "0"),
    }),
    createExecutiveScenarioDashboardIndicator({
      indicatorId: "indicator-critical-dependency-count",
      kind: "critical_dependency_count",
      label: "Critical Dependency Count",
      value: extractCriticalCount(summary?.dependencySummary ?? "0"),
    }),
    createExecutiveScenarioDashboardIndicator({
      indicatorId: "indicator-recommendation-count",
      kind: "recommendation_count",
      label: "Recommendation Count",
      value: String(portfolio?.recommendations.length ?? 0),
    }),
    createExecutiveScenarioDashboardIndicator({
      indicatorId: "indicator-diagnostic-status",
      kind: "diagnostic_status",
      label: "Diagnostic Status",
      value: diagnostics.some((entry) => entry.severity === "error")
        ? "error"
        : diagnostics.some((entry) => entry.severity === "warning")
          ? "warning"
          : "clear",
    }),
  ]);
}

function buildDashboardAlerts(
  view: ExecutiveScenarioWorkspaceView,
  cards: ReturnType<typeof buildDashboardCards>
): readonly ExecutiveScenarioDashboardAlert[] {
  const alerts: ExecutiveScenarioDashboardAlert[] = [];
  const summary = view.summary;

  if (summary?.prioritySummary.includes("critical")) {
    alerts.push(
      createExecutiveScenarioDashboardAlert({
        alertId: "alert-critical-priority",
        kind: "critical_priority",
        label: "Critical Priority",
        message: summary.prioritySummary,
      })
    );
  }
  if (summary?.conflictSummary.toLowerCase().includes("critical")) {
    alerts.push(
      createExecutiveScenarioDashboardAlert({
        alertId: "alert-critical-conflict",
        kind: "critical_conflict",
        label: "Critical Conflict",
        message: summary.conflictSummary,
      })
    );
  }

  const allEvidence = [
    ...cards.executiveSummaryCard.evidence,
    ...cards.priorityCard.evidence,
    ...cards.recommendationCard.evidence,
  ];
  if (allEvidence.length === 0) {
    alerts.push(
      createExecutiveScenarioDashboardAlert({
        alertId: "alert-missing-evidence",
        kind: "missing_evidence",
        label: "Missing Evidence",
        message: "Dashboard cards lack supporting evidence references.",
      })
    );
  }

  if (view.refreshState === "stale") {
    alerts.push(
      createExecutiveScenarioDashboardAlert({
        alertId: "alert-stale-refresh",
        kind: "stale_refresh",
        label: "Stale Refresh",
        message: "Workspace package refresh state is stale.",
      })
    );
  }

  if (view.selectionState === "invalid") {
    alerts.push(
      createExecutiveScenarioDashboardAlert({
        alertId: "alert-invalid-selection",
        kind: "invalid_selection",
        label: "Invalid Selection",
        message: "Active scenario selection is invalid.",
      })
    );
  }

  return Object.freeze(alerts);
}

export function adaptExecutiveScenarioWorkspaceViewToDashboardView(
  request: ExecutiveScenarioDashboardAdapterRequest
): ExecutiveScenarioDashboardView {
  const { workspaceView, generatedAt, workspaceId } = request;

  const validationDiagnostics = validateWorkspaceViewForDashboard(
    workspaceView,
    workspaceId,
    generatedAt
  );
  const hasBlockingError = validationDiagnostics.some((entry) => entry.severity === "error");

  if (hasBlockingError) {
    return createUnavailableExecutiveScenarioDashboardView(
      workspaceView.workspaceId,
      generatedAt,
      validationDiagnostics
    );
  }

  const cards = buildDashboardCards(workspaceView);
  const diagnostics = [...validationDiagnostics];

  const cardEntries = Object.values(cards);
  if (cardEntries.some((card) => card.content.length === 0)) {
    diagnostics.push(
      createExecutiveScenarioDashboardDiagnostic(
        "missing_card",
        "One or more dashboard cards have empty content.",
        generatedAt
      )
    );
  }

  const executiveIndicators = buildExecutiveIndicators(workspaceView, Object.freeze(diagnostics));
  const alerts = buildDashboardAlerts(workspaceView, cards);

  if (executiveIndicators.some((entry) => entry.value === "unknown")) {
    diagnostics.push(
      createExecutiveScenarioDashboardDiagnostic(
        "invalid_indicator",
        "One or more executive indicators could not be resolved.",
        generatedAt
      )
    );
  }

  if (alerts.length === 0 && workspaceView.status === "partial") {
    diagnostics.push(
      createExecutiveScenarioDashboardDiagnostic(
        "invalid_alert",
        "Partial workspace status without dashboard alerts.",
        generatedAt
      )
    );
  }

  const summary = workspaceView.summary;
  const dashboardStatus = resolveDashboardStatus(workspaceView, Object.freeze(diagnostics));

  return createExecutiveScenarioDashboardView({
    workspaceId: workspaceView.workspaceId,
    scenarioId: workspaceView.scenarioId,
    dashboardStatus,
    adapterVersion: EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION,
    executiveHeadline: summary?.executiveHeadline ?? "",
    executiveSummary: summary?.situationBrief ?? "",
    ...cards,
    executiveIndicators,
    alerts,
    diagnostics: Object.freeze(diagnostics),
    generatedAt,
  });
}

export const ExecutiveScenarioDashboardAdapter = Object.freeze({
  adaptExecutiveScenarioWorkspaceViewToDashboardView,
  rules: EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_RULES,
  manifest: EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_MANIFEST,
  version: EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION,
});
