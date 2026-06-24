/**
 * DS-6:6 — Workspace risk dashboard integration runtime.
 * Read-only aggregation from DS-6 risk intelligence into existing dashboard surfaces.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getObjectIntelligenceProfiles } from "../workspace/workspaceObjectIntelligenceContract.ts";
import { getActiveWorkspaceId } from "../workspace/workspaceRegistryStore.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getDetectedWorkspaceRisks } from "./workspaceRiskDetectionEngine.ts";
import { getRiskObjectBindings } from "./workspaceRiskObjectBinding.ts";
import {
  getWorkspaceRiskSeverityProfiles,
  type WorkspaceRiskPriorityLevel,
  type WorkspaceRiskSeverityLevel,
  type WorkspaceRiskSeverityProfile,
} from "./workspaceRiskSeverityEngine.ts";

export const WORKSPACE_RISK_DASHBOARD_INTEGRATION_VERSION = "DS-6:6" as const;

export const WORKSPACE_RISK_DASHBOARD_INTEGRATION_TAGS = Object.freeze([
  "[DS66_RISK_DASHBOARD_INTEGRATION]",
  "[RISK_VISIBLE_IN_DASHBOARD]",
  "[EXECUTIVE_SUMMARY_EXTENDED]",
  "[RISK_EXPOSURE_VISIBLE]",
  "[DS67_READY]",
  "[DS_6_6_COMPLETE]",
] as const);

export const NEXORA_RISK_DASHBOARD_LOG_PREFIX = "[NexoraRiskDashboard]" as const;

export type DashboardRiskSummary = Readonly<{
  contractVersion: typeof WORKSPACE_RISK_DASHBOARD_INTEGRATION_VERSION;
  workspaceId: WorkspaceId;
  totalRisks: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  overallRiskScore: number;
  highestPriorityRiskId: string | null;
  highestPriorityRiskTitle: string | null;
  mostExposedObjectId: string | null;
  mostExposedObjectName: string | null;
  generatedAt: string;
}>;

export type DashboardRiskListItem = Readonly<{
  riskId: string;
  detectionId: string;
  riskTitle: string;
  severityLevel: WorkspaceRiskSeverityLevel;
  severityScore: number;
  priority: WorkspaceRiskPriorityLevel;
  evaluatedAt: string;
}>;

export type DashboardExposedObjectItem = Readonly<{
  objectId: string;
  objectName: string;
  bindingCount: number;
  combinedRiskScore: number;
}>;

const EMPTY_DASHBOARD_RISK_SUMMARY: DashboardRiskSummary = Object.freeze({
  contractVersion: WORKSPACE_RISK_DASHBOARD_INTEGRATION_VERSION,
  workspaceId: "",
  totalRisks: 0,
  criticalCount: 0,
  highCount: 0,
  mediumCount: 0,
  lowCount: 0,
  overallRiskScore: 0,
  highestPriorityRiskId: null,
  highestPriorityRiskTitle: null,
  mostExposedObjectId: null,
  mostExposedObjectName: null,
  generatedAt: "",
});

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeWorkspaceId(workspaceId?: WorkspaceId | null): string {
  return String(workspaceId ?? getActiveWorkspaceId() ?? "").trim();
}

function incrementSeverityCount(
  counts: {
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
  },
  level: WorkspaceRiskSeverityLevel
): void {
  switch (level) {
    case "critical":
      counts.criticalCount += 1;
      break;
    case "high":
      counts.highCount += 1;
      break;
    case "medium":
      counts.mediumCount += 1;
      break;
    default:
      counts.lowCount += 1;
  }
}

function resolveRiskTitle(input: {
  riskId: string;
  detectedTitle: string | null;
}): string {
  if (input.detectedTitle?.trim()) return input.detectedTitle.trim();
  return input.riskId
    .replace(/^wrisk_detect_/, "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildDashboardRiskListItem(input: {
  profile: WorkspaceRiskSeverityProfile;
  detectedTitle: string | null;
}): DashboardRiskListItem {
  return Object.freeze({
    riskId: input.profile.riskId,
    detectionId: input.profile.detectionId,
    riskTitle: resolveRiskTitle({
      riskId: input.profile.riskId,
      detectedTitle: input.detectedTitle,
    }),
    severityLevel: input.profile.severityLevel,
    severityScore: input.profile.severityScore,
    priority: input.profile.priority,
    evaluatedAt: input.profile.evaluatedAt,
  });
}

function resolveHighestPriorityRisk(input: {
  profiles: readonly WorkspaceRiskSeverityProfile[];
  detectedTitleByRiskId: ReadonlyMap<string, string>;
}): DashboardRiskListItem | null {
  let highest: DashboardRiskListItem | null = null;

  for (const profile of input.profiles) {
    const candidate = buildDashboardRiskListItem({
      profile,
      detectedTitle: input.detectedTitleByRiskId.get(profile.riskId) ?? null,
    });
    if (
      !highest ||
      candidate.severityScore > highest.severityScore ||
      (candidate.severityScore === highest.severityScore &&
        candidate.evaluatedAt.localeCompare(highest.evaluatedAt) > 0)
    ) {
      highest = candidate;
    }
  }

  return highest;
}

function resolveMostExposedObject(input: {
  workspaceId: WorkspaceId;
  severityByRiskId: ReadonlyMap<string, WorkspaceRiskSeverityProfile>;
}): { objectId: string | null; objectName: string | null } {
  const bindings = getRiskObjectBindings(input.workspaceId);
  if (bindings.length === 0) {
    return { objectId: null, objectName: null };
  }

  const objectProfiles = getObjectIntelligenceProfiles(input.workspaceId);
  const objectNameById = new Map(
    objectProfiles.map((profile) => [profile.objectId, profile.objectName])
  );

  const exposureByObjectId = new Map<string, { bindingCount: number; combinedRiskScore: number }>();
  for (const binding of bindings) {
    const existing = exposureByObjectId.get(binding.objectId) ?? {
      bindingCount: 0,
      combinedRiskScore: 0,
    };
    const severityScore = input.severityByRiskId.get(binding.riskId)?.severityScore ?? 0;
    exposureByObjectId.set(binding.objectId, {
      bindingCount: existing.bindingCount + 1,
      combinedRiskScore: existing.combinedRiskScore + severityScore,
    });
  }

  let mostExposed: DashboardExposedObjectItem | null = null;
  for (const [objectId, exposure] of exposureByObjectId.entries()) {
    const candidate = Object.freeze({
      objectId,
      objectName: objectNameById.get(objectId) ?? objectId,
      bindingCount: exposure.bindingCount,
      combinedRiskScore: exposure.combinedRiskScore,
    });
    if (
      !mostExposed ||
      candidate.bindingCount > mostExposed.bindingCount ||
      (candidate.bindingCount === mostExposed.bindingCount &&
        candidate.combinedRiskScore > mostExposed.combinedRiskScore)
    ) {
      mostExposed = candidate;
    }
  }

  return {
    objectId: mostExposed?.objectId ?? null,
    objectName: mostExposed?.objectName ?? null,
  };
}

function emitDashboardRiskDiagnostic(summary: DashboardRiskSummary): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("riskDashboard", NEXORA_RISK_DASHBOARD_LOG_PREFIX, {
    workspaceId: summary.workspaceId,
    riskCount: summary.totalRisks,
    criticalCount: summary.criticalCount,
    overallRiskScore: summary.overallRiskScore,
    highestPriorityRiskId: summary.highestPriorityRiskId,
    mostExposedObjectId: summary.mostExposedObjectId,
    tags: WORKSPACE_RISK_DASHBOARD_INTEGRATION_TAGS,
    phase: "DS-6:6",
  });
}

export function buildDashboardRiskSummary(workspaceId: WorkspaceId): DashboardRiskSummary {
  const trimmedWorkspaceId = normalizeWorkspaceId(workspaceId);
  if (!trimmedWorkspaceId) {
    return EMPTY_DASHBOARD_RISK_SUMMARY;
  }

  const detectedRisks = getDetectedWorkspaceRisks(trimmedWorkspaceId);
  const profiles = getWorkspaceRiskSeverityProfiles(trimmedWorkspaceId);
  const detectedTitleByRiskId = new Map(
    detectedRisks.map((risk) => [risk.riskId, risk.title] as const)
  );
  const severityByRiskId = new Map(profiles.map((profile) => [profile.riskId, profile] as const));

  const counts = {
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 0,
  };

  for (const profile of profiles) {
    incrementSeverityCount(counts, profile.severityLevel);
  }

  const overallRiskScore =
    profiles.length > 0
      ? Math.round(
          profiles.reduce((sum, profile) => sum + profile.severityScore, 0) / profiles.length
        )
      : 0;

  const highestPriority = resolveHighestPriorityRisk({
    profiles,
    detectedTitleByRiskId,
  });
  const mostExposed = resolveMostExposedObject({
    workspaceId: trimmedWorkspaceId,
    severityByRiskId,
  });

  const summary = Object.freeze({
    contractVersion: WORKSPACE_RISK_DASHBOARD_INTEGRATION_VERSION,
    workspaceId: trimmedWorkspaceId,
    totalRisks: detectedRisks.length,
    criticalCount: counts.criticalCount,
    highCount: counts.highCount,
    mediumCount: counts.mediumCount,
    lowCount: counts.lowCount,
    overallRiskScore,
    highestPriorityRiskId: highestPriority?.riskId ?? null,
    highestPriorityRiskTitle: highestPriority?.riskTitle ?? null,
    mostExposedObjectId: mostExposed.objectId,
    mostExposedObjectName: mostExposed.objectName,
    generatedAt: nowIso(),
  });

  if (summary.totalRisks > 0) {
    emitDashboardRiskDiagnostic(summary);
  }

  return summary;
}

export function getDashboardRiskSummary(workspaceId?: WorkspaceId | null): DashboardRiskSummary {
  return buildDashboardRiskSummary(normalizeWorkspaceId(workspaceId));
}

function listDashboardRisksBySeverity(
  workspaceId: WorkspaceId,
  levels: readonly WorkspaceRiskSeverityLevel[]
): readonly DashboardRiskListItem[] {
  const trimmedWorkspaceId = normalizeWorkspaceId(workspaceId);
  if (!trimmedWorkspaceId) return Object.freeze([]);

  const levelSet = new Set(levels);
  const detectedRisks = getDetectedWorkspaceRisks(trimmedWorkspaceId);
  const detectedTitleByRiskId = new Map(
    detectedRisks.map((risk) => [risk.riskId, risk.title] as const)
  );
  const items: DashboardRiskListItem[] = [];

  for (const profile of getWorkspaceRiskSeverityProfiles(trimmedWorkspaceId)) {
    if (!levelSet.has(profile.severityLevel)) continue;
    items.push(
      buildDashboardRiskListItem({
        profile,
        detectedTitle: detectedTitleByRiskId.get(profile.riskId) ?? null,
      })
    );
  }

  return Object.freeze(
    items.sort((left, right) => {
      if (left.severityScore !== right.severityScore) {
        return right.severityScore - left.severityScore;
      }
      return right.evaluatedAt.localeCompare(left.evaluatedAt);
    })
  );
}

export function getDashboardCriticalRisks(
  workspaceId?: WorkspaceId | null
): readonly DashboardRiskListItem[] {
  return listDashboardRisksBySeverity(normalizeWorkspaceId(workspaceId), ["critical"]);
}

export function getDashboardHighRisks(
  workspaceId?: WorkspaceId | null
): readonly DashboardRiskListItem[] {
  return listDashboardRisksBySeverity(normalizeWorkspaceId(workspaceId), ["high"]);
}

export function getDashboardExposedObjects(
  workspaceId?: WorkspaceId | null
): readonly DashboardExposedObjectItem[] {
  const trimmedWorkspaceId = normalizeWorkspaceId(workspaceId);
  if (!trimmedWorkspaceId) return Object.freeze([]);

  const profiles = getWorkspaceRiskSeverityProfiles(trimmedWorkspaceId);
  const severityByRiskId = new Map(profiles.map((profile) => [profile.riskId, profile] as const));
  const bindings = getRiskObjectBindings(trimmedWorkspaceId);
  const objectProfiles = getObjectIntelligenceProfiles(trimmedWorkspaceId);
  const objectNameById = new Map(
    objectProfiles.map((profile) => [profile.objectId, profile.objectName])
  );

  const exposureByObjectId = new Map<string, { bindingCount: number; combinedRiskScore: number }>();
  for (const binding of bindings) {
    const existing = exposureByObjectId.get(binding.objectId) ?? {
      bindingCount: 0,
      combinedRiskScore: 0,
    };
    const severityScore = severityByRiskId.get(binding.riskId)?.severityScore ?? 0;
    exposureByObjectId.set(binding.objectId, {
      bindingCount: existing.bindingCount + 1,
      combinedRiskScore: existing.combinedRiskScore + severityScore,
    });
  }

  return Object.freeze(
    [...exposureByObjectId.entries()]
      .map(([objectId, exposure]) =>
        Object.freeze({
          objectId,
          objectName: objectNameById.get(objectId) ?? objectId,
          bindingCount: exposure.bindingCount,
          combinedRiskScore: exposure.combinedRiskScore,
        })
      )
      .sort((left, right) => {
        if (left.bindingCount !== right.bindingCount) {
          return right.bindingCount - left.bindingCount;
        }
        return right.combinedRiskScore - left.combinedRiskScore;
      })
  );
}

export function formatDashboardRiskSummaryPrimary(summary: DashboardRiskSummary): string {
  return `Total Risks: ${summary.totalRisks}`;
}

export function formatDashboardRiskSummarySecondary(summary: DashboardRiskSummary): string {
  const parts = [
    `Critical: ${summary.criticalCount}`,
    `High: ${summary.highCount}`,
    summary.mediumCount > 0 ? `Medium: ${summary.mediumCount}` : null,
    summary.lowCount > 0 ? `Low: ${summary.lowCount}` : null,
    `Overall Risk Score: ${summary.overallRiskScore}`,
    summary.highestPriorityRiskTitle
      ? `Highest Priority Risk: ${summary.highestPriorityRiskTitle}`
      : null,
    summary.mostExposedObjectName
      ? `Most Exposed Object: ${summary.mostExposedObjectName}`
      : null,
  ].filter(Boolean) as string[];

  return parts.join(" · ");
}

export function formatOperationalWorkspaceRiskSignals(input: {
  summary: DashboardRiskSummary;
  criticalRisks: readonly DashboardRiskListItem[];
  highRisks: readonly DashboardRiskListItem[];
  exposedObjects: readonly DashboardExposedObjectItem[];
}): string {
  const parts = [
    input.criticalRisks.length > 0
      ? `Top Critical Risks: ${input.criticalRisks.slice(0, 2).map((item) => item.riskTitle).join(", ")}`
      : null,
    input.exposedObjects.length > 0
      ? `Top Exposed Objects: ${input.exposedObjects.slice(0, 2).map((item) => item.objectName).join(", ")}`
      : null,
    input.highRisks.length > 0
      ? `Top Emerging Risks: ${input.highRisks.slice(0, 2).map((item) => item.riskTitle).join(", ")}`
      : null,
  ].filter(Boolean) as string[];

  if (parts.length === 0) {
    return formatDashboardRiskSummarySecondary(input.summary);
  }

  return parts.join(" · ");
}

export function resetDashboardRiskSummaryCacheForTests(): void {
  // Read-only runtime — no cached state to reset.
}
