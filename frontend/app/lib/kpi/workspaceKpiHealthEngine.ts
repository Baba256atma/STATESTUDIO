/**
 * DS-4:3 — Workspace KPI health engine.
 * Health classification only — from DS-4:2 KPI calculation profiles.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getWorkspaceKpis, type WorkspaceKpi } from "./workspaceKpiContract.ts";
import {
  getWorkspaceKpiProfile,
  getWorkspaceKpiProfiles,
  type WorkspaceKpiProfile,
  type WorkspaceKpiTrend,
} from "./workspaceKpiCalculationEngine.ts";

export const WORKSPACE_KPI_HEALTH_ENGINE_VERSION = "DS-4:3" as const;

export const WORKSPACE_KPI_HEALTH_ENGINE_TAGS = Object.freeze([
  "[DS43_KPI_HEALTH_ENGINE]",
  "[KPI_HEALTH_PROFILES_READY]",
  "[KPI_STATUS_CLASSIFIED]",
  "[KPI_SEVERITY_READY]",
  "[DS44_READY]",
  "[DS_4_3_COMPLETE]",
] as const);

export const NEXORA_KPI_HEALTH_LOG_PREFIX = "[NexoraKpiHealth]" as const;

export const WORKSPACE_KPI_HEALTH_ENGINE_SOURCE = "ds-4:3-kpi-health" as const;

export const WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY =
  "nexora.workspaceKpiHealthProfiles.v1" as const;

export type WorkspaceKpiHealthStatus =
  | "healthy"
  | "watch"
  | "warning"
  | "critical"
  | "unknown";

export type WorkspaceKpiHealthSeverity =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type WorkspaceKpiHealthProfile = Readonly<{
  contractVersion: typeof WORKSPACE_KPI_HEALTH_ENGINE_VERSION;
  workspaceId: WorkspaceId;
  kpiId: string;
  healthScore: number;
  healthStatus: WorkspaceKpiHealthStatus;
  severity: WorkspaceKpiHealthSeverity;
  healthReason: string;
  progressPercent: number;
  variance: number;
  trend: WorkspaceKpiTrend;
  calculatedAt: string;
  source: typeof WORKSPACE_KPI_HEALTH_ENGINE_SOURCE;
}>;

export type WorkspaceKpiHealthProfileMap = Readonly<Record<string, WorkspaceKpiHealthProfile>>;

export type WorkspaceKpiHealthProfileStore = Readonly<
  Record<WorkspaceId, WorkspaceKpiHealthProfileMap>
>;

export type EvaluateWorkspaceKpiHealthResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  profiles: readonly WorkspaceKpiHealthProfile[];
  created: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = WORKSPACE_KPI_HEALTH_PROFILE_STORAGE_KEY;

let workspaceKpiHealthProfileStore: WorkspaceKpiHealthProfileStore = {};
let workspaceKpiHealthProfileHydrated = false;
let workspaceKpiHealthProfileVersion = 0;

type WorkspaceKpiHealthProfileListener = () => void;

const workspaceKpiHealthProfileListeners = new Set<WorkspaceKpiHealthProfileListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function freezeProfile(profile: WorkspaceKpiHealthProfile): WorkspaceKpiHealthProfile {
  return Object.freeze({ ...profile });
}

function readStorage(): WorkspaceKpiHealthProfileStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceKpiHealthProfileStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceKpiHealthProfileStore));
  } catch {
    // KPI health profiles remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceKpiHealthProfileStore(): void {
  if (workspaceKpiHealthProfileHydrated) return;
  workspaceKpiHealthProfileHydrated = true;
  workspaceKpiHealthProfileStore = readStorage();
}

function notifyWorkspaceKpiHealthProfileListeners(): void {
  workspaceKpiHealthProfileVersion += 1;
  workspaceKpiHealthProfileListeners.forEach((listener) => listener());
}

function commitWorkspaceKpiHealthProfileChange(): void {
  writeStorage();
  notifyWorkspaceKpiHealthProfileListeners();
}

function emitKpiHealthDiagnostic(profile: WorkspaceKpiHealthProfile): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("kpiHealthEngine", NEXORA_KPI_HEALTH_LOG_PREFIX, {
    workspaceId: profile.workspaceId,
    kpiId: profile.kpiId,
    healthStatus: profile.healthStatus,
    severity: profile.severity,
    healthScore: profile.healthScore,
    progressPercent: profile.progressPercent,
    trend: profile.trend,
    tags: WORKSPACE_KPI_HEALTH_ENGINE_TAGS,
    phase: "DS-4:3",
  });
}

export function deriveKpiHealthStatus(progressPercent: number | null): WorkspaceKpiHealthStatus {
  if (progressPercent === null || !Number.isFinite(progressPercent)) return "unknown";
  if (progressPercent >= 100) return "healthy";
  if (progressPercent >= 90) return "watch";
  if (progressPercent >= 70) return "warning";
  return "critical";
}

export function deriveKpiHealthSeverity(input: {
  healthStatus: WorkspaceKpiHealthStatus;
  trend: WorkspaceKpiTrend;
}): WorkspaceKpiHealthSeverity {
  if (input.healthStatus === "unknown") return "medium";
  if (input.healthStatus === "healthy") return "none";
  if (input.healthStatus === "watch") return "low";
  if (input.healthStatus === "critical") {
    return input.trend === "declining" ? "critical" : "high";
  }
  if (input.healthStatus === "warning") {
    return input.trend === "declining" ? "high" : "medium";
  }
  return "medium";
}

export function calculateKpiHealthScore(
  baseScore: number | null,
  trend: WorkspaceKpiTrend
): number {
  const normalizedBase = baseScore === null || !Number.isFinite(baseScore) ? 0 : baseScore;
  const trendAdjustment =
    trend === "improving" ? 5 : trend === "stable" ? 0 : trend === "declining" ? -5 : -10;
  return clamp(Math.round(normalizedBase + trendAdjustment), 0, 100);
}

export function buildWorkspaceKpiHealthReason(input: {
  kpiName: string;
  calculationProfile: WorkspaceKpiProfile | null;
  healthStatus: WorkspaceKpiHealthStatus;
}): string {
  if (!input.calculationProfile || input.healthStatus === "unknown") {
    return "KPI health is unknown because calculation data is missing.";
  }

  const name = input.kpiName.trim() || "KPI";
  const progress = Math.round(input.calculationProfile.progressPercent);
  const trend = input.calculationProfile.trend;

  if (input.calculationProfile.progressPercent >= 100) {
    if (trend === "improving") return `${name} exceeded target and is improving.`;
    if (trend === "declining") return `${name} exceeded target and is declining.`;
    if (trend === "stable") return `${name} exceeded target and is stable.`;
    return `${name} exceeded target.`;
  }

  if (trend === "declining") {
    return `${name} is at ${progress}% of target and declining.`;
  }

  if (input.healthStatus === "warning" || input.healthStatus === "critical") {
    return `${name} is below target and needs attention.`;
  }

  if (input.healthStatus === "watch") {
    return `${name} is at ${progress}% of target and should be watched.`;
  }

  return `${name} is at ${progress}% of target and ${trend}.`;
}

function buildUnknownHealthProfile(input: {
  kpi: WorkspaceKpi;
  calculatedAt: string;
}): WorkspaceKpiHealthProfile {
  return freezeProfile(
    Object.freeze({
      contractVersion: WORKSPACE_KPI_HEALTH_ENGINE_VERSION,
      workspaceId: input.kpi.workspaceId,
      kpiId: input.kpi.kpiId,
      healthScore: 0,
      healthStatus: "unknown",
      severity: "medium",
      healthReason: buildWorkspaceKpiHealthReason({
        kpiName: input.kpi.name,
        calculationProfile: null,
        healthStatus: "unknown",
      }),
      progressPercent: 0,
      variance: 0,
      trend: "unknown",
      calculatedAt: input.calculatedAt,
      source: WORKSPACE_KPI_HEALTH_ENGINE_SOURCE,
    })
  );
}

function buildWorkspaceKpiHealthProfile(input: {
  kpi: WorkspaceKpi;
  calculationProfile: WorkspaceKpiProfile;
  calculatedAt: string;
}): WorkspaceKpiHealthProfile {
  const healthStatus = deriveKpiHealthStatus(input.calculationProfile.progressPercent);
  const severity = deriveKpiHealthSeverity({
    healthStatus,
    trend: input.calculationProfile.trend,
  });
  const healthScore = calculateKpiHealthScore(
    input.calculationProfile.score,
    input.calculationProfile.trend
  );
  const healthReason = buildWorkspaceKpiHealthReason({
    kpiName: input.kpi.name,
    calculationProfile: input.calculationProfile,
    healthStatus,
  });

  return freezeProfile(
    Object.freeze({
      contractVersion: WORKSPACE_KPI_HEALTH_ENGINE_VERSION,
      workspaceId: input.kpi.workspaceId,
      kpiId: input.kpi.kpiId,
      healthScore,
      healthStatus,
      severity,
      healthReason,
      progressPercent: input.calculationProfile.progressPercent,
      variance: input.calculationProfile.variance,
      trend: input.calculationProfile.trend,
      calculatedAt: input.calculatedAt,
      source: WORKSPACE_KPI_HEALTH_ENGINE_SOURCE,
    })
  );
}

export function evaluateWorkspaceKpiHealth(
  workspaceId: WorkspaceId
): EvaluateWorkspaceKpiHealthResult {
  hydrateWorkspaceKpiHealthProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      profiles: Object.freeze([]),
      created: false,
      reason: "missing_workspace",
      message: "Provide a workspace before evaluating KPI health.",
    });
  }

  const kpis = getWorkspaceKpis(trimmedWorkspaceId);
  if (kpis.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      profiles: Object.freeze([]),
      created: false,
      reason: "no_kpis",
      message: "Create workspace KPIs before evaluating KPI health.",
    });
  }

  const calculationProfiles = getWorkspaceKpiProfiles(trimmedWorkspaceId);
  const calculationProfileById = new Map(
    calculationProfiles.map((profile) => [profile.kpiId, profile] as const)
  );
  const calculatedAt = nowIso();

  const profiles = kpis.map((kpi) => {
    const calculationProfile = calculationProfileById.get(kpi.kpiId) ?? null;
    if (!calculationProfile) {
      return buildUnknownHealthProfile({ kpi, calculatedAt });
    }
    return buildWorkspaceKpiHealthProfile({
      kpi,
      calculationProfile,
      calculatedAt,
    });
  });

  workspaceKpiHealthProfileStore = Object.freeze({
    ...workspaceKpiHealthProfileStore,
    [trimmedWorkspaceId]: Object.freeze(
      Object.fromEntries(profiles.map((profile) => [profile.kpiId, profile]))
    ),
  });
  commitWorkspaceKpiHealthProfileChange();
  profiles.forEach(emitKpiHealthDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    profiles: Object.freeze(profiles.map(freezeProfile)),
    created: true,
    reason: "evaluated",
    message: `${profiles.length} KPI health profile${profiles.length === 1 ? "" : "s"} evaluated.`,
  });
}

export function getWorkspaceKpiHealthProfiles(
  workspaceId: WorkspaceId
): readonly WorkspaceKpiHealthProfile[] {
  hydrateWorkspaceKpiHealthProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceKpiHealthProfileStore[trimmedWorkspaceId] ?? {}).map(freezeProfile)
  );
}

export function getWorkspaceKpiHealthProfile(
  workspaceId: WorkspaceId,
  kpiId: string
): WorkspaceKpiHealthProfile | null {
  hydrateWorkspaceKpiHealthProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedKpiId = kpiId.trim();
  if (!trimmedWorkspaceId || !trimmedKpiId) return null;
  const match = workspaceKpiHealthProfileStore[trimmedWorkspaceId]?.[trimmedKpiId] ?? null;
  return match ? freezeProfile(match) : null;
}

export function subscribeWorkspaceKpiHealthProfileRegistry(
  listener: WorkspaceKpiHealthProfileListener
): () => void {
  hydrateWorkspaceKpiHealthProfileStore();
  workspaceKpiHealthProfileListeners.add(listener);
  return () => workspaceKpiHealthProfileListeners.delete(listener);
}

export function getWorkspaceKpiHealthProfileRegistryVersion(): number {
  hydrateWorkspaceKpiHealthProfileStore();
  return workspaceKpiHealthProfileVersion;
}

export function resetWorkspaceKpiHealthProfileStoreForTests(): void {
  workspaceKpiHealthProfileStore = {};
  workspaceKpiHealthProfileHydrated = false;
  workspaceKpiHealthProfileVersion = 0;
  workspaceKpiHealthProfileListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceKpiHealthProfileMemoryForTests(): void {
  workspaceKpiHealthProfileStore = {};
  workspaceKpiHealthProfileHydrated = false;
  workspaceKpiHealthProfileVersion = 0;
}

export function resolveWorkspaceKpiHealthProfileForKpi(
  workspaceId: WorkspaceId,
  kpiId: string
): WorkspaceKpiHealthProfile | null {
  const kpi = getWorkspaceKpis(workspaceId).find((entry) => entry.kpiId === kpiId) ?? null;
  const calculationProfile = getWorkspaceKpiProfile(workspaceId, kpiId);
  if (!kpi) return null;
  if (!calculationProfile) {
    return buildUnknownHealthProfile({ kpi, calculatedAt: nowIso() });
  }
  return buildWorkspaceKpiHealthProfile({
    kpi,
    calculationProfile,
    calculatedAt: nowIso(),
  });
}
