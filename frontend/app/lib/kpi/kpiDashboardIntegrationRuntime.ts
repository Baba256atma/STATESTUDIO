/**
 * DS-4:6 — Workspace KPI dashboard integration runtime.
 * Read-only aggregation from DS-4 KPI intelligence into existing dashboard surfaces.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getActiveWorkspaceId } from "../workspace/workspaceRegistryStore.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  getWorkspaceKpi,
  getWorkspaceKpis,
  type WorkspaceKpi,
} from "./workspaceKpiContract.ts";
import {
  getWorkspaceKpiHealthProfiles,
  type WorkspaceKpiHealthProfile,
  type WorkspaceKpiHealthStatus,
} from "./workspaceKpiHealthEngine.ts";

export const WORKSPACE_KPI_DASHBOARD_INTEGRATION_VERSION = "DS-4:6" as const;

export const WORKSPACE_KPI_DASHBOARD_INTEGRATION_TAGS = Object.freeze([
  "[DS46_KPI_DASHBOARD_INTEGRATION]",
  "[KPI_VISIBLE_IN_DASHBOARD]",
  "[EXECUTIVE_SUMMARY_EXTENDED]",
  "[NO_NEW_DASHBOARD_CREATED]",
  "[DS47_READY]",
  "[DS_4_6_COMPLETE]",
] as const);

export const NEXORA_KPI_DASHBOARD_LOG_PREFIX = "[NexoraKpiDashboard]" as const;

export type DashboardKpiSummary = Readonly<{
  contractVersion: typeof WORKSPACE_KPI_DASHBOARD_INTEGRATION_VERSION;
  workspaceId: WorkspaceId;
  totalKpis: number;
  healthyCount: number;
  watchCount: number;
  warningCount: number;
  criticalCount: number;
  unknownCount: number;
  overallHealthScore: number;
  highestRiskKpiId: string | null;
  highestRiskKpiName: string | null;
  generatedAt: string;
}>;

export type DashboardKpiListItem = Readonly<{
  kpiId: string;
  kpiName: string;
  healthStatus: WorkspaceKpiHealthStatus;
  healthScore: number;
  progressPercent: number;
  updatedAt: string;
}>;

const EMPTY_DASHBOARD_KPI_SUMMARY: DashboardKpiSummary = Object.freeze({
  contractVersion: WORKSPACE_KPI_DASHBOARD_INTEGRATION_VERSION,
  workspaceId: "",
  totalKpis: 0,
  healthyCount: 0,
  watchCount: 0,
  warningCount: 0,
  criticalCount: 0,
  unknownCount: 0,
  overallHealthScore: 0,
  highestRiskKpiId: null,
  highestRiskKpiName: null,
  generatedAt: "",
});

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeWorkspaceId(workspaceId?: WorkspaceId | null): string {
  return String(workspaceId ?? getActiveWorkspaceId() ?? "").trim();
}

function incrementStatusCount(
  counts: {
    healthyCount: number;
    watchCount: number;
    warningCount: number;
    criticalCount: number;
    unknownCount: number;
  },
  status: WorkspaceKpiHealthStatus | "missing"
): void {
  switch (status) {
    case "healthy":
      counts.healthyCount += 1;
      break;
    case "watch":
      counts.watchCount += 1;
      break;
    case "warning":
      counts.warningCount += 1;
      break;
    case "critical":
      counts.criticalCount += 1;
      break;
    default:
      counts.unknownCount += 1;
  }
}

function buildDashboardKpiListItem(input: {
  kpi: WorkspaceKpi;
  profile: WorkspaceKpiHealthProfile;
}): DashboardKpiListItem {
  return Object.freeze({
    kpiId: input.kpi.kpiId,
    kpiName: input.kpi.name,
    healthStatus: input.profile.healthStatus,
    healthScore: input.profile.healthScore,
    progressPercent: input.profile.progressPercent,
    updatedAt: input.kpi.updatedAt,
  });
}

function resolveHighestRiskKpi(input: {
  kpis: readonly WorkspaceKpi[];
  profiles: readonly WorkspaceKpiHealthProfile[];
}): DashboardKpiListItem | null {
  const profileByKpiId = new Map(input.profiles.map((profile) => [profile.kpiId, profile]));
  let highestRisk: DashboardKpiListItem | null = null;

  for (const kpi of input.kpis) {
    const profile = profileByKpiId.get(kpi.kpiId);
    if (!profile) continue;
    const candidate = buildDashboardKpiListItem({ kpi, profile });
    if (
      !highestRisk ||
      candidate.healthScore < highestRisk.healthScore ||
      (candidate.healthScore === highestRisk.healthScore &&
        candidate.updatedAt.localeCompare(highestRisk.updatedAt) > 0)
    ) {
      highestRisk = candidate;
    }
  }

  return highestRisk;
}

function emitDashboardKpiDiagnostic(summary: DashboardKpiSummary): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("kpiDashboard", NEXORA_KPI_DASHBOARD_LOG_PREFIX, {
    workspaceId: summary.workspaceId,
    totalKpis: summary.totalKpis,
    healthyCount: summary.healthyCount,
    warningCount: summary.warningCount,
    criticalCount: summary.criticalCount,
    overallHealthScore: summary.overallHealthScore,
    tags: WORKSPACE_KPI_DASHBOARD_INTEGRATION_TAGS,
    phase: "DS-4:6",
  });
}

export function buildDashboardKpiSummary(workspaceId: WorkspaceId): DashboardKpiSummary {
  const trimmedWorkspaceId = normalizeWorkspaceId(workspaceId);
  if (!trimmedWorkspaceId) {
    return EMPTY_DASHBOARD_KPI_SUMMARY;
  }

  const kpis = getWorkspaceKpis(trimmedWorkspaceId);
  const profiles = getWorkspaceKpiHealthProfiles(trimmedWorkspaceId);
  const profileByKpiId = new Map(profiles.map((profile) => [profile.kpiId, profile]));

  const counts = {
    healthyCount: 0,
    watchCount: 0,
    warningCount: 0,
    criticalCount: 0,
    unknownCount: 0,
  };

  for (const kpi of kpis) {
    const profile = profileByKpiId.get(kpi.kpiId);
    incrementStatusCount(counts, profile?.healthStatus ?? "missing");
  }

  const overallHealthScore =
    profiles.length > 0
      ? Math.round(
          profiles.reduce((sum, profile) => sum + profile.healthScore, 0) / profiles.length
        )
      : 0;

  const highestRisk = resolveHighestRiskKpi({ kpis, profiles });

  const summary = Object.freeze({
    contractVersion: WORKSPACE_KPI_DASHBOARD_INTEGRATION_VERSION,
    workspaceId: trimmedWorkspaceId,
    totalKpis: kpis.length,
    healthyCount: counts.healthyCount,
    watchCount: counts.watchCount,
    warningCount: counts.warningCount,
    criticalCount: counts.criticalCount,
    unknownCount: counts.unknownCount,
    overallHealthScore,
    highestRiskKpiId: highestRisk?.kpiId ?? null,
    highestRiskKpiName: highestRisk?.kpiName ?? null,
    generatedAt: nowIso(),
  });

  if (summary.totalKpis > 0) {
    emitDashboardKpiDiagnostic(summary);
  }

  return summary;
}

export function getDashboardKpiSummary(workspaceId?: WorkspaceId | null): DashboardKpiSummary {
  return buildDashboardKpiSummary(normalizeWorkspaceId(workspaceId));
}

function listDashboardKpisByStatus(
  workspaceId: WorkspaceId,
  statuses: readonly WorkspaceKpiHealthStatus[]
): readonly DashboardKpiListItem[] {
  const trimmedWorkspaceId = normalizeWorkspaceId(workspaceId);
  if (!trimmedWorkspaceId) return Object.freeze([]);

  const statusSet = new Set(statuses);
  const profiles = getWorkspaceKpiHealthProfiles(trimmedWorkspaceId);
  const items: DashboardKpiListItem[] = [];

  for (const profile of profiles) {
    if (!statusSet.has(profile.healthStatus)) continue;
    const kpi = getWorkspaceKpi(trimmedWorkspaceId, profile.kpiId);
    if (!kpi) continue;
    items.push(buildDashboardKpiListItem({ kpi, profile }));
  }

  return Object.freeze(
    items.sort((left, right) => {
      if (left.healthScore !== right.healthScore) return left.healthScore - right.healthScore;
      return right.updatedAt.localeCompare(left.updatedAt);
    })
  );
}

export function getDashboardCriticalKpis(
  workspaceId?: WorkspaceId | null
): readonly DashboardKpiListItem[] {
  return listDashboardKpisByStatus(normalizeWorkspaceId(workspaceId), ["critical"]);
}

export function getDashboardWarningKpis(
  workspaceId?: WorkspaceId | null
): readonly DashboardKpiListItem[] {
  return listDashboardKpisByStatus(normalizeWorkspaceId(workspaceId), ["warning"]);
}

export function formatDashboardKpiSummaryPrimary(summary: DashboardKpiSummary): string {
  return `KPIs: ${summary.totalKpis}`;
}

export function formatDashboardKpiSummarySecondary(summary: DashboardKpiSummary): string {
  const parts = [
    `Healthy: ${summary.healthyCount}`,
    summary.watchCount > 0 ? `Watch: ${summary.watchCount}` : null,
    `Warning: ${summary.warningCount}`,
    `Critical: ${summary.criticalCount}`,
    `Overall KPI Health: ${summary.overallHealthScore}`,
    summary.highestRiskKpiName ? `Highest Risk: ${summary.highestRiskKpiName}` : null,
  ].filter(Boolean) as string[];

  return parts.join(" · ");
}

export function formatOperationalWorkspaceKpiSignals(input: {
  summary: DashboardKpiSummary;
  criticalKpis: readonly DashboardKpiListItem[];
  warningKpis: readonly DashboardKpiListItem[];
}): string {
  const performers = getWorkspaceKpiHealthProfiles(input.summary.workspaceId)
    .filter((profile) => profile.healthStatus === "healthy")
    .slice(0, 2)
    .map((profile) => getWorkspaceKpi(input.summary.workspaceId, profile.kpiId)?.name)
    .filter(Boolean) as string[];

  const parts = [
    input.criticalKpis.length > 0
      ? `Top KPI Risks: ${input.criticalKpis.slice(0, 2).map((item) => item.kpiName).join(", ")}`
      : null,
    input.warningKpis.length > 0
      ? `Top KPI Warnings: ${input.warningKpis.slice(0, 2).map((item) => item.kpiName).join(", ")}`
      : null,
    performers.length > 0 ? `Top KPI Performers: ${performers.join(", ")}` : null,
  ].filter(Boolean) as string[];

  if (parts.length === 0) {
    return formatDashboardKpiSummarySecondary(input.summary);
  }

  return parts.join(" · ");
}

export function resetDashboardKpiSummaryCacheForTests(): void {
  // Read-only runtime — no cached state to reset.
}
