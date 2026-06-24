/**
 * DS-5:3 — Workspace OKR health engine.
 * Health classification only — from DS-5:2 OKR progress profiles.
 *
 * OWNERSHIP RULE
 * DS-5:2 owns all OKR progress calculations.
 * DS-5:3 MUST use getWorkspaceOkrProgressProfile() or getWorkspaceOkrProgressProfiles() ONLY.
 * DS-5:3 MUST NOT recalculate objective or key result progress.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getWorkspaceObjective, getWorkspaceObjectives } from "./workspaceOkrContract.ts";
import {
  getWorkspaceOkrProgressProfile,
  getWorkspaceOkrProgressProfiles,
  type WorkspaceOkrProgressProfile,
  type WorkspaceOkrTrend,
} from "./workspaceOkrProgressEngine.ts";

export const WORKSPACE_OKR_HEALTH_ENGINE_VERSION = "DS-5:3" as const;

export const WORKSPACE_OKR_HEALTH_ENGINE_TAGS = Object.freeze([
  "[DS53_OKR_HEALTH_ENGINE]",
  "[OKR_HEALTH_READY]",
  "[OBJECTIVE_HEALTH_CLASSIFIED]",
  "[OKR_SEVERITY_READY]",
  "[DS54_READY]",
  "[DS_5_3_COMPLETE]",
] as const);

export const NEXORA_OKR_HEALTH_LOG_PREFIX = "[NexoraOkrHealth]" as const;

export const WORKSPACE_OKR_HEALTH_ENGINE_SOURCE = "ds-5:3-okr-health" as const;

export const WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY =
  "nexora.workspaceOkrHealthProfiles.v1" as const;

export const WORKSPACE_OKR_HEALTH_PROGRESS_READ_APIS = Object.freeze([
  "getWorkspaceOkrProgressProfile",
  "getWorkspaceOkrProgressProfiles",
] as const);

export type WorkspaceOkrHealthStatus =
  | "healthy"
  | "watch"
  | "warning"
  | "critical"
  | "unknown";

export type WorkspaceOkrHealthSeverity =
  | "none"
  | "low"
  | "medium"
  | "high"
  | "critical";

export type WorkspaceOkrHealthProfile = Readonly<{
  contractVersion: typeof WORKSPACE_OKR_HEALTH_ENGINE_VERSION;
  workspaceId: WorkspaceId;
  objectiveId: string;
  healthScore: number;
  healthStatus: WorkspaceOkrHealthStatus;
  severity: WorkspaceOkrHealthSeverity;
  healthReason: string;
  progressPercent: number;
  variance: number;
  trend: WorkspaceOkrTrend;
  calculatedAt: string;
  source: typeof WORKSPACE_OKR_HEALTH_ENGINE_SOURCE;
}>;

export type WorkspaceOkrHealthProfileMap = Readonly<Record<string, WorkspaceOkrHealthProfile>>;

export type WorkspaceOkrHealthProfileStore = Readonly<
  Record<WorkspaceId, WorkspaceOkrHealthProfileMap>
>;

export type EvaluateWorkspaceOkrHealthResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  profiles: readonly WorkspaceOkrHealthProfile[];
  created: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = WORKSPACE_OKR_HEALTH_PROFILE_STORAGE_KEY;

let workspaceOkrHealthProfileStore: WorkspaceOkrHealthProfileStore = {};
let workspaceOkrHealthProfileHydrated = false;
let workspaceOkrHealthProfileVersion = 0;

type WorkspaceOkrHealthProfileListener = () => void;

const workspaceOkrHealthProfileListeners = new Set<WorkspaceOkrHealthProfileListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function freezeProfile(profile: WorkspaceOkrHealthProfile): WorkspaceOkrHealthProfile {
  return Object.freeze({ ...profile });
}

function readStorage(): WorkspaceOkrHealthProfileStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceOkrHealthProfileStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceOkrHealthProfileStore));
  } catch {
    // OKR health profiles remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceOkrHealthProfileStore(): void {
  if (workspaceOkrHealthProfileHydrated) return;
  workspaceOkrHealthProfileHydrated = true;
  workspaceOkrHealthProfileStore = readStorage();
}

function notifyWorkspaceOkrHealthProfileListeners(): void {
  workspaceOkrHealthProfileVersion += 1;
  workspaceOkrHealthProfileListeners.forEach((listener) => listener());
}

function commitWorkspaceOkrHealthProfileChange(): void {
  writeStorage();
  notifyWorkspaceOkrHealthProfileListeners();
}

function emitOkrHealthDiagnostic(profile: WorkspaceOkrHealthProfile): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("okrHealthEngine", NEXORA_OKR_HEALTH_LOG_PREFIX, {
    workspaceId: profile.workspaceId,
    objectiveId: profile.objectiveId,
    healthStatus: profile.healthStatus,
    severity: profile.severity,
    healthScore: profile.healthScore,
    trend: profile.trend,
    tags: WORKSPACE_OKR_HEALTH_ENGINE_TAGS,
    phase: "DS-5:3",
  });
}

export function deriveOkrHealthStatus(progressPercent: number | null): WorkspaceOkrHealthStatus {
  if (progressPercent === null || !Number.isFinite(progressPercent)) return "unknown";
  if (progressPercent >= 100) return "healthy";
  if (progressPercent >= 90) return "watch";
  if (progressPercent >= 70) return "warning";
  return "critical";
}

export function deriveOkrHealthSeverity(input: {
  healthStatus: WorkspaceOkrHealthStatus;
  trend: WorkspaceOkrTrend;
}): WorkspaceOkrHealthSeverity {
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

export function calculateOkrHealthScore(baseScore: number | null, trend: WorkspaceOkrTrend): number {
  const normalizedBase = baseScore === null || !Number.isFinite(baseScore) ? 0 : baseScore;
  const trendAdjustment =
    trend === "improving" ? 5 : trend === "stable" ? 0 : trend === "declining" ? -5 : -10;
  return clamp(Math.round(normalizedBase + trendAdjustment), 0, 100);
}

export function buildWorkspaceOkrHealthReason(input: {
  objectiveTitle: string;
  progressProfile: WorkspaceOkrProgressProfile | null;
  healthStatus: WorkspaceOkrHealthStatus;
}): string {
  if (!input.progressProfile || input.healthStatus === "unknown") {
    return "Objective health is unknown because progress data is unavailable.";
  }

  const title = input.objectiveTitle.trim() || "Objective";
  const progress = Math.round(input.progressProfile.progressPercent);
  const trend = input.progressProfile.trend;

  if (input.progressProfile.progressPercent >= 100) {
    return `${title} objective exceeded expected progress.`;
  }

  if (trend === "declining") {
    return `${title} objective reached ${progress}% progress and is declining.`;
  }

  if (input.healthStatus === "warning" || input.healthStatus === "critical") {
    return `${title} objective requires attention.`;
  }

  if (input.healthStatus === "watch") {
    return `${title} objective reached ${progress}% progress and should be watched.`;
  }

  return `${title} objective reached ${progress}% progress and is ${trend}.`;
}

function buildUnknownHealthProfile(input: {
  workspaceId: WorkspaceId;
  objectiveId: string;
  objectiveTitle: string;
  calculatedAt: string;
}): WorkspaceOkrHealthProfile {
  return freezeProfile(
    Object.freeze({
      contractVersion: WORKSPACE_OKR_HEALTH_ENGINE_VERSION,
      workspaceId: input.workspaceId,
      objectiveId: input.objectiveId,
      healthScore: 0,
      healthStatus: "unknown",
      severity: "medium",
      healthReason: buildWorkspaceOkrHealthReason({
        objectiveTitle: input.objectiveTitle,
        progressProfile: null,
        healthStatus: "unknown",
      }),
      progressPercent: 0,
      variance: 0,
      trend: "unknown",
      calculatedAt: input.calculatedAt,
      source: WORKSPACE_OKR_HEALTH_ENGINE_SOURCE,
    })
  );
}

function buildWorkspaceOkrHealthProfile(input: {
  objectiveTitle: string;
  progressProfile: WorkspaceOkrProgressProfile;
  calculatedAt: string;
}): WorkspaceOkrHealthProfile {
  const healthStatus = deriveOkrHealthStatus(input.progressProfile.progressPercent);
  const severity = deriveOkrHealthSeverity({
    healthStatus,
    trend: input.progressProfile.trend,
  });
  const healthScore = calculateOkrHealthScore(
    input.progressProfile.score,
    input.progressProfile.trend
  );
  const healthReason = buildWorkspaceOkrHealthReason({
    objectiveTitle: input.objectiveTitle,
    progressProfile: input.progressProfile,
    healthStatus,
  });

  return freezeProfile(
    Object.freeze({
      contractVersion: WORKSPACE_OKR_HEALTH_ENGINE_VERSION,
      workspaceId: input.progressProfile.workspaceId,
      objectiveId: input.progressProfile.objectiveId,
      healthScore,
      healthStatus,
      severity,
      healthReason,
      progressPercent: input.progressProfile.progressPercent,
      variance: input.progressProfile.variance,
      trend: input.progressProfile.trend,
      calculatedAt: input.calculatedAt,
      source: WORKSPACE_OKR_HEALTH_ENGINE_SOURCE,
    })
  );
}

function readProgressProfilesForWorkspace(
  workspaceId: WorkspaceId
): readonly WorkspaceOkrProgressProfile[] {
  return getWorkspaceOkrProgressProfiles(workspaceId);
}

export function evaluateWorkspaceOkrHealth(
  workspaceId: WorkspaceId
): EvaluateWorkspaceOkrHealthResult {
  hydrateWorkspaceOkrHealthProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      profiles: Object.freeze([]),
      created: false,
      reason: "missing_workspace",
      message: "Provide a workspace before evaluating OKR health.",
    });
  }

  const objectives = getWorkspaceObjectives(trimmedWorkspaceId);
  if (objectives.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      profiles: Object.freeze([]),
      created: false,
      reason: "no_objectives",
      message: "Create workspace objectives before evaluating OKR health.",
    });
  }

  const progressProfiles = readProgressProfilesForWorkspace(trimmedWorkspaceId);
  const progressProfileByObjectiveId = new Map(
    progressProfiles.map((profile) => [profile.objectiveId, profile] as const)
  );
  const calculatedAt = nowIso();

  const profiles = objectives.map((objective) => {
    const progressProfile =
      progressProfileByObjectiveId.get(objective.objectiveId) ??
      getWorkspaceOkrProgressProfile(trimmedWorkspaceId, objective.objectiveId);
    if (!progressProfile) {
      return buildUnknownHealthProfile({
        workspaceId: trimmedWorkspaceId,
        objectiveId: objective.objectiveId,
        objectiveTitle: objective.title,
        calculatedAt,
      });
    }
    return buildWorkspaceOkrHealthProfile({
      objectiveTitle: objective.title,
      progressProfile,
      calculatedAt,
    });
  });

  workspaceOkrHealthProfileStore = Object.freeze({
    ...workspaceOkrHealthProfileStore,
    [trimmedWorkspaceId]: Object.freeze(
      Object.fromEntries(profiles.map((profile) => [profile.objectiveId, profile]))
    ),
  });
  commitWorkspaceOkrHealthProfileChange();
  profiles.forEach(emitOkrHealthDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    profiles: Object.freeze(profiles.map(freezeProfile)),
    created: true,
    reason: "evaluated",
    message: `${profiles.length} OKR health profile${profiles.length === 1 ? "" : "s"} evaluated.`,
  });
}

export function getWorkspaceOkrHealthProfiles(
  workspaceId: WorkspaceId
): readonly WorkspaceOkrHealthProfile[] {
  hydrateWorkspaceOkrHealthProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceOkrHealthProfileStore[trimmedWorkspaceId] ?? {}).map(freezeProfile)
  );
}

export function getWorkspaceOkrHealthProfile(
  workspaceId: WorkspaceId,
  objectiveId: string
): WorkspaceOkrHealthProfile | null {
  hydrateWorkspaceOkrHealthProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedObjectiveId = objectiveId.trim();
  if (!trimmedWorkspaceId || !trimmedObjectiveId) return null;
  const match = workspaceOkrHealthProfileStore[trimmedWorkspaceId]?.[trimmedObjectiveId] ?? null;
  return match ? freezeProfile(match) : null;
}

export function subscribeWorkspaceOkrHealthProfileRegistry(
  listener: WorkspaceOkrHealthProfileListener
): () => void {
  hydrateWorkspaceOkrHealthProfileStore();
  workspaceOkrHealthProfileListeners.add(listener);
  return () => workspaceOkrHealthProfileListeners.delete(listener);
}

export function getWorkspaceOkrHealthProfileRegistryVersion(): number {
  hydrateWorkspaceOkrHealthProfileStore();
  return workspaceOkrHealthProfileVersion;
}

export function resetWorkspaceOkrHealthProfileStoreForTests(): void {
  workspaceOkrHealthProfileStore = {};
  workspaceOkrHealthProfileHydrated = false;
  workspaceOkrHealthProfileVersion = 0;
  workspaceOkrHealthProfileListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceOkrHealthProfileMemoryForTests(): void {
  workspaceOkrHealthProfileStore = {};
  workspaceOkrHealthProfileHydrated = false;
  workspaceOkrHealthProfileVersion = 0;
}

export function resolveWorkspaceOkrHealthProfileForObjective(
  workspaceId: WorkspaceId,
  objectiveId: string
): WorkspaceOkrHealthProfile | null {
  const objective = getWorkspaceObjective(workspaceId, objectiveId);
  if (!objective) return null;
  const progressProfile = getWorkspaceOkrProgressProfile(workspaceId, objectiveId);
  if (!progressProfile) {
    return buildUnknownHealthProfile({
      workspaceId: workspaceId.trim(),
      objectiveId: objective.objectiveId,
      objectiveTitle: objective.title,
      calculatedAt: nowIso(),
    });
  }
  return buildWorkspaceOkrHealthProfile({
    objectiveTitle: objective.title,
    progressProfile,
    calculatedAt: nowIso(),
  });
}
