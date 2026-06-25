/**
 * INT-1 — Dashboard Intelligence normalization layer.
 * Maps certified DS engine payloads into one predictable dashboard format.
 * No calculations — field mapping and pass-through only.
 */

import type { DashboardKpiSummary } from "../kpi/kpiDashboardIntegrationRuntime.ts";
import type { DashboardOkrSummary } from "../okr/okrDashboardIntegrationRuntime.ts";
import type { DashboardRiskSummary } from "../risk/riskDashboardIntegrationRuntime.ts";
import type { WorkspaceScenarioWorkspaceSummary } from "../scenario/scenarioWorkspaceIntegrationRuntime.ts";
import type {
  DashboardIntelligenceEngineId,
  DashboardIntelligenceMetric,
  DashboardIntelligenceNormalizedPayload,
  DashboardIntelligencePanelId,
  DashboardIntelligenceStatus,
} from "./dashboardIntelligenceContract.ts";
import { DASHBOARD_INTELLIGENCE_SOURCE } from "./dashboardIntelligenceContract.ts";
import type { DashboardIntelligenceEnginePayload } from "./dashboardIntelligenceRouter.ts";

function nowIso(): string {
  return new Date().toISOString();
}

function metric(
  metricId: string,
  label: string,
  value: string | number | boolean | null,
  unit: string | null = null
): DashboardIntelligenceMetric {
  return Object.freeze({ metricId, label, value, unit });
}

function statusFromCount(count: number, reserved = false): DashboardIntelligenceStatus {
  if (reserved) return "reserved";
  if (count > 0) return "ready";
  return "empty";
}

function normalizeKpiSummary(
  panel: DashboardIntelligencePanelId,
  summary: DashboardKpiSummary
): DashboardIntelligenceNormalizedPayload {
  const status = statusFromCount(summary.totalKpis);
  return Object.freeze({
    status,
    confidence: null,
    summary:
      summary.totalKpis > 0
        ? `${summary.totalKpis} KPI(s); overall health ${summary.overallHealthScore}.`
        : "No KPI intelligence available for this workspace.",
    metrics: Object.freeze([
      metric("total_kpis", "Total KPIs", summary.totalKpis),
      metric("healthy_count", "Healthy", summary.healthyCount),
      metric("watch_count", "Watch", summary.watchCount),
      metric("warning_count", "Warning", summary.warningCount),
      metric("critical_count", "Critical", summary.criticalCount),
      metric("overall_health_score", "Overall Health Score", summary.overallHealthScore, "score"),
    ]),
    warnings: Object.freeze(
      summary.criticalCount > 0
        ? [`${summary.criticalCount} critical KPI signal(s) detected.`]
        : []
    ),
    recommendations: Object.freeze(
      summary.highestRiskKpiName
        ? [`Review KPI "${summary.highestRiskKpiName}".`]
        : []
    ),
    timestamp: summary.generatedAt || nowIso(),
    source: "ds4_kpi",
    panel,
  });
}

function normalizeOkrSummary(
  panel: DashboardIntelligencePanelId,
  summary: DashboardOkrSummary
): DashboardIntelligenceNormalizedPayload {
  const status = statusFromCount(summary.totalObjectives);
  return Object.freeze({
    status,
    confidence: null,
    summary:
      summary.totalObjectives > 0
        ? `${summary.totalObjectives} objective(s); overall health ${summary.overallHealthScore}.`
        : "No OKR intelligence available for this workspace.",
    metrics: Object.freeze([
      metric("total_objectives", "Total Objectives", summary.totalObjectives),
      metric("healthy_count", "Healthy", summary.healthyCount),
      metric("watch_count", "Watch", summary.watchCount),
      metric("warning_count", "Warning", summary.warningCount),
      metric("critical_count", "Critical", summary.criticalCount),
      metric("overall_health_score", "Overall Health Score", summary.overallHealthScore, "score"),
    ]),
    warnings: Object.freeze(
      summary.criticalCount > 0
        ? [`${summary.criticalCount} critical objective signal(s) detected.`]
        : []
    ),
    recommendations: Object.freeze(
      summary.highestRiskObjectiveTitle
        ? [`Review objective "${summary.highestRiskObjectiveTitle}".`]
        : []
    ),
    timestamp: summary.generatedAt || nowIso(),
    source: "ds5_okr",
    panel,
  });
}

function normalizeRiskSummary(
  panel: DashboardIntelligencePanelId,
  summary: DashboardRiskSummary
): DashboardIntelligenceNormalizedPayload {
  const status = statusFromCount(summary.totalRisks);
  return Object.freeze({
    status,
    confidence: null,
    summary:
      summary.totalRisks > 0
        ? `${summary.totalRisks} risk(s); overall risk score ${summary.overallRiskScore}.`
        : "No risk intelligence available for this workspace.",
    metrics: Object.freeze([
      metric("total_risks", "Total Risks", summary.totalRisks),
      metric("critical_count", "Critical", summary.criticalCount),
      metric("high_count", "High", summary.highCount),
      metric("medium_count", "Medium", summary.mediumCount),
      metric("low_count", "Low", summary.lowCount),
      metric("overall_risk_score", "Overall Risk Score", summary.overallRiskScore, "score"),
    ]),
    warnings: Object.freeze(
      summary.criticalCount > 0
        ? [`${summary.criticalCount} critical risk signal(s) detected.`]
        : []
    ),
    recommendations: Object.freeze(
      summary.highestPriorityRiskTitle
        ? [`Review risk "${summary.highestPriorityRiskTitle}".`]
        : []
    ),
    timestamp: summary.generatedAt || nowIso(),
    source: "ds6_risk",
    panel,
  });
}

function normalizeScenarioSummary(
  panel: DashboardIntelligencePanelId,
  summary: WorkspaceScenarioWorkspaceSummary
): DashboardIntelligenceNormalizedPayload {
  const status = statusFromCount(summary.totalScenarios);
  return Object.freeze({
    status,
    confidence: null,
    summary:
      summary.totalScenarios > 0
        ? `${summary.totalScenarios} scenario(s); active ${summary.activeCount}.`
        : "No scenario intelligence available for this workspace.",
    metrics: Object.freeze([
      metric("total_scenarios", "Total Scenarios", summary.totalScenarios),
      metric("active_count", "Active", summary.activeCount),
      metric("draft_count", "Draft", summary.draftCount),
      metric("archived_count", "Archived", summary.archivedCount),
      metric(
        "latest_simulation_status",
        "Latest Simulation",
        summary.latestSimulationStatus
      ),
    ]),
    warnings: Object.freeze([]),
    recommendations: Object.freeze(
      summary.latestComparisonSummary ? [summary.latestComparisonSummary] : []
    ),
    timestamp: summary.generatedAt || nowIso(),
    source: "ds7_scenario",
    panel,
  });
}

function normalizeObjects(
  panel: DashboardIntelligencePanelId,
  profiles: readonly unknown[]
): DashboardIntelligenceNormalizedPayload {
  const count = profiles.length;
  return Object.freeze({
    status: statusFromCount(count),
    confidence: null,
    summary: count > 0 ? `${count} object intelligence profile(s) available.` : "No objects in workspace.",
    metrics: Object.freeze([metric("object_count", "Objects", count)]),
    warnings: Object.freeze([]),
    recommendations: Object.freeze([]),
    timestamp: nowIso(),
    source: "ds3_objects",
    panel,
  });
}

function normalizeRelationships(
  panel: DashboardIntelligencePanelId,
  relationships: readonly unknown[]
): DashboardIntelligenceNormalizedPayload {
  const count = relationships.length;
  return Object.freeze({
    status: statusFromCount(count),
    confidence: null,
    summary:
      count > 0 ? `${count} workspace relationship(s) available.` : "No relationships in workspace.",
    metrics: Object.freeze([metric("relationship_count", "Relationships", count)]),
    warnings: Object.freeze([]),
    recommendations: Object.freeze([]),
    timestamp: nowIso(),
    source: "ds3_relationships",
    panel,
  });
}

function normalizeDataSources(
  panel: DashboardIntelligencePanelId,
  sources: readonly unknown[]
): DashboardIntelligenceNormalizedPayload {
  const count = sources.length;
  return Object.freeze({
    status: statusFromCount(count),
    confidence: null,
    summary: count > 0 ? `${count} workspace data source(s) registered.` : "No data sources registered.",
    metrics: Object.freeze([metric("data_source_count", "Data Sources", count)]),
    warnings: Object.freeze([]),
    recommendations: Object.freeze([]),
    timestamp: nowIso(),
    source: "ds_data_sources",
    panel,
  });
}

function normalizeWorkspace(
  panel: DashboardIntelligencePanelId,
  data: unknown
): DashboardIntelligenceNormalizedPayload {
  const record = data as { activeWorkspace?: { workspaceName?: string } | null; registry?: { workspaceCount?: number } };
  const workspaceName = record.activeWorkspace?.workspaceName ?? "Unknown workspace";
  const workspaceCount = record.registry?.workspaceCount ?? 0;
  return Object.freeze({
    status: workspaceCount > 0 ? "ready" : "empty",
    confidence: null,
    summary: `Active workspace: ${workspaceName}.`,
    metrics: Object.freeze([
      metric("workspace_count", "Workspaces", workspaceCount),
      metric("active_workspace", "Active Workspace", workspaceName),
    ]),
    warnings: Object.freeze([]),
    recommendations: Object.freeze([]),
    timestamp: nowIso(),
    source: "ds_workspace",
    panel,
  });
}

function normalizeExecutiveComposite(
  panel: DashboardIntelligencePanelId,
  data: unknown
): DashboardIntelligenceNormalizedPayload {
  const record = data as {
    kpis?: DashboardKpiSummary;
    okrs?: DashboardOkrSummary;
    risks?: DashboardRiskSummary;
    scenarios?: WorkspaceScenarioWorkspaceSummary;
  };
  const kpi = record.kpis;
  const okr = record.okrs;
  const risk = record.risks;
  const scenario = record.scenarios;
  const hasSignals =
    (kpi?.totalKpis ?? 0) > 0 ||
    (okr?.totalObjectives ?? 0) > 0 ||
    (risk?.totalRisks ?? 0) > 0 ||
    (scenario?.totalScenarios ?? 0) > 0;

  return Object.freeze({
    status: hasSignals ? "ready" : "empty",
    confidence: null,
    summary: hasSignals
      ? "Executive summary assembled from certified KPI, OKR, Risk, and Scenario intelligence."
      : "Executive summary has no certified intelligence signals yet.",
    metrics: Object.freeze([
      metric("kpi_total", "KPIs", kpi?.totalKpis ?? 0),
      metric("okr_total", "Objectives", okr?.totalObjectives ?? 0),
      metric("risk_total", "Risks", risk?.totalRisks ?? 0),
      metric("scenario_total", "Scenarios", scenario?.totalScenarios ?? 0),
      metric("kpi_health_score", "KPI Health", kpi?.overallHealthScore ?? 0, "score"),
      metric("okr_health_score", "OKR Health", okr?.overallHealthScore ?? 0, "score"),
      metric("risk_score", "Risk Score", risk?.overallRiskScore ?? 0, "score"),
    ]),
    warnings: Object.freeze(
      [
        (risk?.criticalCount ?? 0) > 0 ? `${risk!.criticalCount} critical risk(s).` : null,
        (kpi?.criticalCount ?? 0) > 0 ? `${kpi!.criticalCount} critical KPI(s).` : null,
      ].filter(Boolean) as string[]
    ),
    recommendations: Object.freeze(
      [
        risk?.highestPriorityRiskTitle
          ? `Review risk "${risk.highestPriorityRiskTitle}".`
          : null,
        scenario?.activeScenarioName
          ? `Review active scenario "${scenario.activeScenarioName}".`
          : null,
      ].filter(Boolean) as string[]
    ),
    timestamp: nowIso(),
    source: "ds_composite_executive",
    panel,
  });
}

function normalizeOperationalComposite(
  panel: DashboardIntelligencePanelId,
  data: unknown
): DashboardIntelligenceNormalizedPayload {
  const record = data as {
    kpis?: DashboardKpiSummary;
    okrs?: DashboardOkrSummary;
    risks?: DashboardRiskSummary;
    objects?: readonly unknown[];
    relationships?: readonly unknown[];
  };
  const objectCount = record.objects?.length ?? 0;
  const relationshipCount = record.relationships?.length ?? 0;
  const hasSignals =
    (record.kpis?.totalKpis ?? 0) > 0 ||
    (record.okrs?.totalObjectives ?? 0) > 0 ||
    (record.risks?.totalRisks ?? 0) > 0 ||
    objectCount > 0 ||
    relationshipCount > 0;

  return Object.freeze({
    status: hasSignals ? "ready" : "empty",
    confidence: null,
    summary: hasSignals
      ? "Operational intelligence assembled from certified workspace signals."
      : "Operational intelligence has no certified signals yet.",
    metrics: Object.freeze([
      metric("object_count", "Objects", objectCount),
      metric("relationship_count", "Relationships", relationshipCount),
      metric("kpi_total", "KPIs", record.kpis?.totalKpis ?? 0),
      metric("okr_total", "Objectives", record.okrs?.totalObjectives ?? 0),
      metric("risk_total", "Risks", record.risks?.totalRisks ?? 0),
    ]),
    warnings: Object.freeze(
      (record.risks?.highCount ?? 0) + (record.risks?.criticalCount ?? 0) > 0
        ? ["Elevated operational risk signals detected."]
        : []
    ),
    recommendations: Object.freeze([]),
    timestamp: nowIso(),
    source: "ds_composite_operational",
    panel,
  });
}

function normalizeReservedTimeline(
  panel: DashboardIntelligencePanelId
): DashboardIntelligenceNormalizedPayload {
  return Object.freeze({
    status: "reserved",
    confidence: null,
    summary: "Timeline intelligence is reserved for a future timeline engine integration.",
    metrics: Object.freeze([]),
    warnings: Object.freeze(["Timeline intelligence is not implemented in INT-1."]),
    recommendations: Object.freeze([]),
    timestamp: nowIso(),
    source: "reserved_timeline",
    panel,
  });
}

export function normalizeDashboardIntelligencePayload(
  payload: DashboardIntelligenceEnginePayload
): DashboardIntelligenceNormalizedPayload {
  switch (payload.engineId) {
    case "ds4_kpi":
      return normalizeKpiSummary(payload.panel, payload.data as DashboardKpiSummary);
    case "ds5_okr":
      return normalizeOkrSummary(payload.panel, payload.data as DashboardOkrSummary);
    case "ds6_risk":
      return normalizeRiskSummary(payload.panel, payload.data as DashboardRiskSummary);
    case "ds7_scenario":
      return normalizeScenarioSummary(payload.panel, payload.data as WorkspaceScenarioWorkspaceSummary);
    case "ds3_objects":
      return normalizeObjects(payload.panel, payload.data as readonly unknown[]);
    case "ds3_relationships":
      return normalizeRelationships(payload.panel, payload.data as readonly unknown[]);
    case "ds_data_sources":
      return normalizeDataSources(payload.panel, payload.data as readonly unknown[]);
    case "ds_workspace":
      return normalizeWorkspace(payload.panel, payload.data);
    case "ds_composite_executive":
      return normalizeExecutiveComposite(payload.panel, payload.data);
    case "ds_composite_operational":
      return normalizeOperationalComposite(payload.panel, payload.data);
    case "reserved_timeline":
    default:
      return normalizeReservedTimeline(payload.panel);
  }
}

export function normalizeDashboardIntelligenceError(input: {
  panel: DashboardIntelligencePanelId;
  engineId: DashboardIntelligenceEngineId;
  message: string;
}): DashboardIntelligenceNormalizedPayload {
  return Object.freeze({
    status: "error",
    confidence: null,
    summary: input.message,
    metrics: Object.freeze([]),
    warnings: Object.freeze([input.message]),
    recommendations: Object.freeze([]),
    timestamp: nowIso(),
    source: input.engineId,
    panel: input.panel,
  });
}
