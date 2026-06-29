/**
 * APP-2:12 — Executive Scenario Dashboard view types.
 * Dashboard projection models — no UI, charts, or rendering artifacts.
 */

import type {
  ScenarioIntelligenceScenarioId,
  ScenarioIntelligenceWorkspaceId,
} from "./scenarioIntelligenceTypes.ts";
import type {
  ExecutiveScenarioDashboardCard,
} from "./executiveScenarioDashboardCards.ts";
import type { ExecutiveScenarioDashboardDiagnostic } from "./executiveScenarioDashboardDiagnostics.ts";

export const EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION = "APP-2/12" as const;

export type ExecutiveScenarioDashboardStatus = "ready" | "partial" | "unavailable";

export type ExecutiveScenarioDashboardIndicatorKind =
  | "overall_status"
  | "priority_level"
  | "conflict_count"
  | "opportunity_count"
  | "critical_dependency_count"
  | "recommendation_count"
  | "diagnostic_status";

export type ExecutiveScenarioDashboardIndicator = Readonly<{
  indicatorId: string;
  kind: ExecutiveScenarioDashboardIndicatorKind;
  label: string;
  value: string;
  readOnly: true;
}>;

export type ExecutiveScenarioDashboardAlertKind =
  | "critical_priority"
  | "critical_conflict"
  | "missing_evidence"
  | "package_outdated"
  | "workspace_mismatch"
  | "stale_refresh"
  | "invalid_selection";

export type ExecutiveScenarioDashboardAlert = Readonly<{
  alertId: string;
  kind: ExecutiveScenarioDashboardAlertKind;
  label: string;
  message: string;
  readOnly: true;
}>;

export type ExecutiveScenarioDashboardView = Readonly<{
  workspaceId: ScenarioIntelligenceWorkspaceId;
  scenarioId: ScenarioIntelligenceScenarioId | null;
  dashboardStatus: ExecutiveScenarioDashboardStatus;
  adapterVersion: typeof EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION;
  executiveHeadline: string;
  executiveSummary: string;
  executiveSummaryCard: ExecutiveScenarioDashboardCard;
  priorityCard: ExecutiveScenarioDashboardCard;
  dependencyCard: ExecutiveScenarioDashboardCard;
  conflictCard: ExecutiveScenarioDashboardCard;
  opportunityCard: ExecutiveScenarioDashboardCard;
  recommendationCard: ExecutiveScenarioDashboardCard;
  riskCard: ExecutiveScenarioDashboardCard;
  kpiCard: ExecutiveScenarioDashboardCard;
  timelineCard: ExecutiveScenarioDashboardCard;
  executiveIndicators: readonly ExecutiveScenarioDashboardIndicator[];
  alerts: readonly ExecutiveScenarioDashboardAlert[];
  diagnostics: readonly ExecutiveScenarioDashboardDiagnostic[];
  generatedAt: string;
  readOnly: true;
}>;

export type ExecutiveScenarioDashboardAdapterRequest = Readonly<{
  workspaceView: import("./executiveScenarioWorkspaceView.ts").ExecutiveScenarioWorkspaceView;
  generatedAt: string;
  workspaceId?: ScenarioIntelligenceWorkspaceId;
}>;

export const EXECUTIVE_SCENARIO_DASHBOARD_INDICATOR_KINDS = Object.freeze([
  "overall_status",
  "priority_level",
  "conflict_count",
  "opportunity_count",
  "critical_dependency_count",
  "recommendation_count",
  "diagnostic_status",
] as const satisfies readonly ExecutiveScenarioDashboardIndicatorKind[]);

export const EXECUTIVE_SCENARIO_DASHBOARD_ALERT_KINDS = Object.freeze([
  "critical_priority",
  "critical_conflict",
  "missing_evidence",
  "package_outdated",
  "workspace_mismatch",
  "stale_refresh",
  "invalid_selection",
] as const satisfies readonly ExecutiveScenarioDashboardAlertKind[]);

export function createExecutiveScenarioDashboardIndicator(
  input: Omit<ExecutiveScenarioDashboardIndicator, "readOnly">
): ExecutiveScenarioDashboardIndicator {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioDashboardAlert(
  input: Omit<ExecutiveScenarioDashboardAlert, "readOnly">
): ExecutiveScenarioDashboardAlert {
  return Object.freeze({ ...input, readOnly: true as const });
}

export function createExecutiveScenarioDashboardView(
  input: Omit<ExecutiveScenarioDashboardView, "readOnly">
): ExecutiveScenarioDashboardView {
  return Object.freeze({
    ...input,
    readOnly: true as const,
  });
}

export function createUnavailableExecutiveScenarioDashboardView(
  workspaceId: ScenarioIntelligenceWorkspaceId,
  generatedAt: string,
  diagnostics: readonly ExecutiveScenarioDashboardDiagnostic[]
): ExecutiveScenarioDashboardView {
  const emptyCard = (cardId: string, kind: ExecutiveScenarioDashboardCard["kind"], title: string) =>
    Object.freeze({
      cardId,
      kind,
      title,
      content: "",
      evidence: Object.freeze([]),
      readOnly: true as const,
    });

  return createExecutiveScenarioDashboardView({
    workspaceId,
    scenarioId: null,
    dashboardStatus: "unavailable",
    adapterVersion: EXECUTIVE_SCENARIO_DASHBOARD_ADAPTER_VERSION,
    executiveHeadline: "Executive dashboard unavailable.",
    executiveSummary: "Workspace view is not available for dashboard projection.",
    executiveSummaryCard: emptyCard("dashboard-card-executive-summary", "executive_summary", "Executive Summary"),
    priorityCard: emptyCard("dashboard-card-priority", "priority", "Priority"),
    dependencyCard: emptyCard("dashboard-card-dependency", "dependency", "Dependencies"),
    conflictCard: emptyCard("dashboard-card-conflict", "conflict", "Conflicts"),
    opportunityCard: emptyCard("dashboard-card-opportunity", "opportunity", "Opportunities"),
    recommendationCard: emptyCard("dashboard-card-recommendation", "recommendation", "Recommendations"),
    riskCard: emptyCard("dashboard-card-risk", "risk", "Risks"),
    kpiCard: emptyCard("dashboard-card-kpi", "kpi", "KPIs"),
    timelineCard: emptyCard("dashboard-card-timeline", "timeline", "Timeline"),
    executiveIndicators: Object.freeze([]),
    alerts: Object.freeze([]),
    diagnostics,
    generatedAt,
  });
}
