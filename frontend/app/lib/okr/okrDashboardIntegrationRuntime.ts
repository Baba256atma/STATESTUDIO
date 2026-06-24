/**
 * DS-5:6 — Workspace OKR dashboard integration runtime.
 * Read-only aggregation from DS-5 OKR intelligence into existing dashboard surfaces.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getActiveWorkspaceId } from "../workspace/workspaceRegistryStore.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  getWorkspaceObjective,
  getWorkspaceObjectives,
  type WorkspaceObjective,
} from "./workspaceOkrContract.ts";
import {
  getWorkspaceOkrHealthProfiles,
  type WorkspaceOkrHealthProfile,
  type WorkspaceOkrHealthStatus,
} from "./workspaceOkrHealthEngine.ts";

export const WORKSPACE_OKR_DASHBOARD_INTEGRATION_VERSION = "DS-5:6" as const;

export const WORKSPACE_OKR_DASHBOARD_INTEGRATION_TAGS = Object.freeze([
  "[DS56_OKR_DASHBOARD_INTEGRATION]",
  "[OKR_VISIBLE_IN_DASHBOARD]",
  "[EXECUTIVE_SUMMARY_EXTENDED]",
  "[STRATEGIC_HEALTH_VISIBLE]",
  "[DS57_READY]",
  "[DS_5_6_COMPLETE]",
] as const);

export const NEXORA_OKR_DASHBOARD_LOG_PREFIX = "[NexoraOkrDashboard]" as const;

export type DashboardOkrSummary = Readonly<{
  contractVersion: typeof WORKSPACE_OKR_DASHBOARD_INTEGRATION_VERSION;
  workspaceId: WorkspaceId;
  totalObjectives: number;
  healthyCount: number;
  watchCount: number;
  warningCount: number;
  criticalCount: number;
  unknownCount: number;
  overallHealthScore: number;
  highestRiskObjectiveId: string | null;
  highestRiskObjectiveTitle: string | null;
  generatedAt: string;
}>;

export type DashboardOkrListItem = Readonly<{
  objectiveId: string;
  objectiveTitle: string;
  healthStatus: WorkspaceOkrHealthStatus;
  healthScore: number;
  progressPercent: number;
  updatedAt: string;
}>;

const EMPTY_DASHBOARD_OKR_SUMMARY: DashboardOkrSummary = Object.freeze({
  contractVersion: WORKSPACE_OKR_DASHBOARD_INTEGRATION_VERSION,
  workspaceId: "",
  totalObjectives: 0,
  healthyCount: 0,
  watchCount: 0,
  warningCount: 0,
  criticalCount: 0,
  unknownCount: 0,
  overallHealthScore: 0,
  highestRiskObjectiveId: null,
  highestRiskObjectiveTitle: null,
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
  status: WorkspaceOkrHealthStatus | "missing"
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

function buildDashboardOkrListItem(input: {
  objective: WorkspaceObjective;
  profile: WorkspaceOkrHealthProfile;
}): DashboardOkrListItem {
  return Object.freeze({
    objectiveId: input.objective.objectiveId,
    objectiveTitle: input.objective.title,
    healthStatus: input.profile.healthStatus,
    healthScore: input.profile.healthScore,
    progressPercent: input.profile.progressPercent,
    updatedAt: input.objective.updatedAt,
  });
}

function resolveHighestRiskObjective(input: {
  objectives: readonly WorkspaceObjective[];
  profiles: readonly WorkspaceOkrHealthProfile[];
}): DashboardOkrListItem | null {
  const profileByObjectiveId = new Map(
    input.profiles.map((profile) => [profile.objectiveId, profile])
  );
  let highestRisk: DashboardOkrListItem | null = null;

  for (const objective of input.objectives) {
    const profile = profileByObjectiveId.get(objective.objectiveId);
    if (!profile) continue;
    const candidate = buildDashboardOkrListItem({ objective, profile });
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

function emitDashboardOkrDiagnostic(summary: DashboardOkrSummary): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("okrDashboard", NEXORA_OKR_DASHBOARD_LOG_PREFIX, {
    workspaceId: summary.workspaceId,
    totalObjectives: summary.totalObjectives,
    overallHealthScore: summary.overallHealthScore,
    criticalCount: summary.criticalCount,
    highestRiskObjectiveId: summary.highestRiskObjectiveId,
    tags: WORKSPACE_OKR_DASHBOARD_INTEGRATION_TAGS,
    phase: "DS-5:6",
  });
}

export function buildDashboardOkrSummary(workspaceId: WorkspaceId): DashboardOkrSummary {
  const trimmedWorkspaceId = normalizeWorkspaceId(workspaceId);
  if (!trimmedWorkspaceId) {
    return EMPTY_DASHBOARD_OKR_SUMMARY;
  }

  const objectives = getWorkspaceObjectives(trimmedWorkspaceId);
  const profiles = getWorkspaceOkrHealthProfiles(trimmedWorkspaceId);
  const profileByObjectiveId = new Map(
    profiles.map((profile) => [profile.objectiveId, profile])
  );

  const counts = {
    healthyCount: 0,
    watchCount: 0,
    warningCount: 0,
    criticalCount: 0,
    unknownCount: 0,
  };

  for (const objective of objectives) {
    const profile = profileByObjectiveId.get(objective.objectiveId);
    incrementStatusCount(counts, profile?.healthStatus ?? "missing");
  }

  const overallHealthScore =
    profiles.length > 0
      ? Math.round(
          profiles.reduce((sum, profile) => sum + profile.healthScore, 0) / profiles.length
        )
      : 0;

  const highestRisk = resolveHighestRiskObjective({ objectives, profiles });

  const summary = Object.freeze({
    contractVersion: WORKSPACE_OKR_DASHBOARD_INTEGRATION_VERSION,
    workspaceId: trimmedWorkspaceId,
    totalObjectives: objectives.length,
    healthyCount: counts.healthyCount,
    watchCount: counts.watchCount,
    warningCount: counts.warningCount,
    criticalCount: counts.criticalCount,
    unknownCount: counts.unknownCount,
    overallHealthScore,
    highestRiskObjectiveId: highestRisk?.objectiveId ?? null,
    highestRiskObjectiveTitle: highestRisk?.objectiveTitle ?? null,
    generatedAt: nowIso(),
  });

  if (summary.totalObjectives > 0) {
    emitDashboardOkrDiagnostic(summary);
  }

  return summary;
}

export function getDashboardOkrSummary(workspaceId?: WorkspaceId | null): DashboardOkrSummary {
  return buildDashboardOkrSummary(normalizeWorkspaceId(workspaceId));
}

function listDashboardObjectivesByStatus(
  workspaceId: WorkspaceId,
  statuses: readonly WorkspaceOkrHealthStatus[]
): readonly DashboardOkrListItem[] {
  const trimmedWorkspaceId = normalizeWorkspaceId(workspaceId);
  if (!trimmedWorkspaceId) return Object.freeze([]);

  const statusSet = new Set(statuses);
  const profiles = getWorkspaceOkrHealthProfiles(trimmedWorkspaceId);
  const items: DashboardOkrListItem[] = [];

  for (const profile of profiles) {
    if (!statusSet.has(profile.healthStatus)) continue;
    const objective = getWorkspaceObjective(trimmedWorkspaceId, profile.objectiveId);
    if (!objective) continue;
    items.push(buildDashboardOkrListItem({ objective, profile }));
  }

  return Object.freeze(
    items.sort((left, right) => {
      if (left.healthScore !== right.healthScore) return left.healthScore - right.healthScore;
      return right.updatedAt.localeCompare(left.updatedAt);
    })
  );
}

export function getDashboardCriticalObjectives(
  workspaceId?: WorkspaceId | null
): readonly DashboardOkrListItem[] {
  return listDashboardObjectivesByStatus(normalizeWorkspaceId(workspaceId), ["critical"]);
}

export function getDashboardWarningObjectives(
  workspaceId?: WorkspaceId | null
): readonly DashboardOkrListItem[] {
  return listDashboardObjectivesByStatus(normalizeWorkspaceId(workspaceId), ["warning"]);
}

export function formatDashboardOkrSummaryPrimary(summary: DashboardOkrSummary): string {
  return `Objectives: ${summary.totalObjectives}`;
}

export function formatDashboardOkrSummarySecondary(summary: DashboardOkrSummary): string {
  const parts = [
    `Healthy: ${summary.healthyCount}`,
    summary.watchCount > 0 ? `Watch: ${summary.watchCount}` : null,
    `Warning: ${summary.warningCount}`,
    `Critical: ${summary.criticalCount}`,
    `Overall Strategic Health: ${summary.overallHealthScore}`,
    summary.highestRiskObjectiveTitle
      ? `Highest Risk Objective: ${summary.highestRiskObjectiveTitle}`
      : null,
  ].filter(Boolean) as string[];

  return parts.join(" · ");
}

export function formatOperationalWorkspaceOkrSignals(input: {
  summary: DashboardOkrSummary;
  criticalObjectives: readonly DashboardOkrListItem[];
  warningObjectives: readonly DashboardOkrListItem[];
}): string {
  const performers = getWorkspaceOkrHealthProfiles(input.summary.workspaceId)
    .filter((profile) => profile.healthStatus === "healthy")
    .slice(0, 2)
    .map((profile) => getWorkspaceObjective(input.summary.workspaceId, profile.objectiveId)?.title)
    .filter(Boolean) as string[];

  const parts = [
    input.criticalObjectives.length > 0
      ? `Top Strategic Risks: ${input.criticalObjectives.slice(0, 2).map((item) => item.objectiveTitle).join(", ")}`
      : null,
    input.warningObjectives.length > 0
      ? `Top Warning Objectives: ${input.warningObjectives.slice(0, 2).map((item) => item.objectiveTitle).join(", ")}`
      : null,
    performers.length > 0 ? `Top Performing Objectives: ${performers.join(", ")}` : null,
  ].filter(Boolean) as string[];

  if (parts.length === 0) {
    return formatDashboardOkrSummarySecondary(input.summary);
  }

  return parts.join(" · ");
}

export function resetDashboardOkrSummaryCacheForTests(): void {
  // Read-only runtime — no cached state to reset.
}
