/**
 * DS-5:2 — Workspace OKR progress engine.
 * Calculation only — progress profiles from DS-5:1 objectives and key results.
 *
 * OWNERSHIP RULE
 * DS-5:2 owns all OKR progress calculations.
 * Future consumers (OKR Health, Risk, Scenario, Dashboard, Assistant) must read
 * getWorkspaceOkrProgressProfile() or getWorkspaceOkrProgressProfiles()
 * and MUST NOT recalculate progress.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  getWorkspaceKeyResultsForObjective,
  getWorkspaceObjectives,
  getWorkspaceObjective,
  type WorkspaceKeyResult,
  type WorkspaceObjective,
} from "./workspaceOkrContract.ts";

export const WORKSPACE_OKR_PROGRESS_ENGINE_VERSION = "DS-5:2" as const;

export const WORKSPACE_OKR_PROGRESS_ENGINE_TAGS = Object.freeze([
  "[DS52_OKR_PROGRESS_ENGINE]",
  "[OKR_PROGRESS_READY]",
  "[OBJECTIVE_PROGRESS_CALCULATED]",
  "[KEY_RESULT_PROGRESS_CALCULATED]",
  "[DS53_READY]",
  "[DS_5_2_COMPLETE]",
] as const);

export const NEXORA_OKR_PROGRESS_LOG_PREFIX = "[NexoraOkrProgress]" as const;

export const WORKSPACE_OKR_PROGRESS_ENGINE_SOURCE = "ds-5:2-okr-progress" as const;

export const WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY =
  "nexora.workspaceOkrProgressProfiles.v1" as const;

export const WORKSPACE_OKR_PROGRESS_ENGINE_OWNER = "workspaceOkrProgressEngine" as const;

export const WORKSPACE_OKR_PROGRESS_OWNERSHIP_RULE =
  "DS-5:2 owns all OKR progress calculations." as const;

export const WORKSPACE_OKR_PROGRESS_CONSUMER_READ_APIS = Object.freeze([
  "getWorkspaceOkrProgressProfile",
  "getWorkspaceOkrProgressProfiles",
] as const);

export const WORKSPACE_OKR_PROGRESS_FORBIDDEN_CONSUMER_ACTIONS = Object.freeze([
  "recalculate_objective_progress",
  "recalculate_key_result_progress",
  "duplicate_progress_engine",
] as const);

export const WORKSPACE_OKR_PROGRESS_CONSUMER_LAYERS = Object.freeze([
  "OKR Health",
  "Risk",
  "Scenario",
  "Dashboard",
  "Assistant",
] as const);

export type WorkspaceOkrTrend = "improving" | "stable" | "declining" | "unknown";

export type WorkspaceOkrProgressProfile = Readonly<{
  contractVersion: typeof WORKSPACE_OKR_PROGRESS_ENGINE_VERSION;
  workspaceId: WorkspaceId;
  objectiveId: string;
  progressPercent: number;
  score: number;
  keyResultCount: number;
  completedKeyResults: number;
  variance: number;
  trend: WorkspaceOkrTrend;
  reason: string;
  calculatedAt: string;
  source: typeof WORKSPACE_OKR_PROGRESS_ENGINE_SOURCE;
}>;

export type WorkspaceOkrProgressProfileMap = Readonly<
  Record<string, WorkspaceOkrProgressProfile>
>;

export type WorkspaceOkrProgressProfileStore = Readonly<
  Record<WorkspaceId, WorkspaceOkrProgressProfileMap>
>;

export type CalculateWorkspaceOkrProgressResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  profiles: readonly WorkspaceOkrProgressProfile[];
  created: boolean;
  reason: string;
  message: string;
}>;

export type KeyResultProgressSnapshot = Readonly<{
  keyResultId: string;
  progressPercent: number;
  variance: number;
  completed: boolean;
}>;

const STORAGE_KEY = WORKSPACE_OKR_PROGRESS_PROFILE_STORAGE_KEY;
const MIN_PROGRESS_PERCENT = 0;
const MAX_PROGRESS_PERCENT = 200;
const MIN_SCORE = 0;
const MAX_SCORE = 100;

let workspaceOkrProgressProfileStore: WorkspaceOkrProgressProfileStore = {};
let workspaceOkrProgressProfileHydrated = false;
let workspaceOkrProgressProfileVersion = 0;

type WorkspaceOkrProgressProfileListener = () => void;

const workspaceOkrProgressProfileListeners = new Set<WorkspaceOkrProgressProfileListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function freezeProfile(profile: WorkspaceOkrProgressProfile): WorkspaceOkrProgressProfile {
  return Object.freeze({ ...profile });
}

function readStorage(): WorkspaceOkrProgressProfileStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceOkrProgressProfileStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceOkrProgressProfileStore));
  } catch {
    // OKR progress profiles remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceOkrProgressProfileStore(): void {
  if (workspaceOkrProgressProfileHydrated) return;
  workspaceOkrProgressProfileHydrated = true;
  workspaceOkrProgressProfileStore = readStorage();
}

function notifyWorkspaceOkrProgressProfileListeners(): void {
  workspaceOkrProgressProfileVersion += 1;
  workspaceOkrProgressProfileListeners.forEach((listener) => listener());
}

function commitWorkspaceOkrProgressProfileChange(): void {
  writeStorage();
  notifyWorkspaceOkrProgressProfileListeners();
}

function emitOkrProgressDiagnostic(profile: WorkspaceOkrProgressProfile): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("okrProgressEngine", NEXORA_OKR_PROGRESS_LOG_PREFIX, {
    workspaceId: profile.workspaceId,
    objectiveId: profile.objectiveId,
    progressPercent: profile.progressPercent,
    score: profile.score,
    trend: profile.trend,
    tags: WORKSPACE_OKR_PROGRESS_ENGINE_TAGS,
    phase: "DS-5:2",
  });
}

export function calculateKeyResultProgressPercent(
  currentValue: number,
  targetValue: number
): number | null {
  if (!Number.isFinite(currentValue) || !Number.isFinite(targetValue) || targetValue === 0) {
    return null;
  }
  return clamp((currentValue / targetValue) * 100, MIN_PROGRESS_PERCENT, MAX_PROGRESS_PERCENT);
}

export function calculateOkrScore(progressPercent: number | null): number | null {
  if (progressPercent === null || !Number.isFinite(progressPercent)) return null;
  return clamp(Math.round(progressPercent), MIN_SCORE, MAX_SCORE);
}

export function calculateOkrVariance(currentValue: number, targetValue: number): number | null {
  if (!Number.isFinite(currentValue) || !Number.isFinite(targetValue)) return null;
  return currentValue - targetValue;
}

export function deriveOkrTrend(variance: number | null): WorkspaceOkrTrend {
  if (variance === null || !Number.isFinite(variance)) return "unknown";
  if (variance > 0) return "improving";
  if (variance < 0) return "declining";
  return "stable";
}

export function buildKeyResultProgressSnapshot(
  keyResult: WorkspaceKeyResult
): KeyResultProgressSnapshot {
  const progressPercent =
    calculateKeyResultProgressPercent(keyResult.currentValue, keyResult.targetValue) ?? 0;
  const variance = calculateOkrVariance(keyResult.currentValue, keyResult.targetValue) ?? 0;
  return Object.freeze({
    keyResultId: keyResult.keyResultId,
    progressPercent: Math.round(progressPercent),
    variance,
    completed: progressPercent >= 100,
  });
}

export function buildWorkspaceOkrProgressReason(input: {
  objectiveTitle: string;
  progressPercent: number;
  variance: number;
  keyResultCount: number;
}): string {
  const title = input.objectiveTitle.trim() || "Objective";
  if (input.keyResultCount === 0) {
    return `${title} objective has no key results yet.`;
  }
  if (input.variance > 0 && input.progressPercent >= 100) {
    return `${title} objective exceeded target.`;
  }
  if (input.progressPercent < 70) {
    return `${title} objective is below expected progress.`;
  }
  return `${title} objective reached ${Math.round(input.progressPercent)}% progress.`;
}

function aggregateObjectiveProgress(
  snapshots: readonly KeyResultProgressSnapshot[]
): Readonly<{
  progressPercent: number;
  variance: number;
  completedKeyResults: number;
}> {
  if (snapshots.length === 0) {
    return Object.freeze({
      progressPercent: 0,
      variance: 0,
      completedKeyResults: 0,
    });
  }

  const progressPercent =
    snapshots.reduce((sum, snapshot) => sum + snapshot.progressPercent, 0) / snapshots.length;
  const variance =
    snapshots.reduce((sum, snapshot) => sum + snapshot.variance, 0) / snapshots.length;
  const completedKeyResults = snapshots.filter((snapshot) => snapshot.completed).length;

  return Object.freeze({
    progressPercent: Math.round(progressPercent * 10) / 10,
    variance: Math.round(variance * 100) / 100,
    completedKeyResults,
  });
}

function buildWorkspaceOkrProgressProfile(input: {
  objective: WorkspaceObjective;
  keyResults: readonly WorkspaceKeyResult[];
  calculatedAt: string;
}): WorkspaceOkrProgressProfile {
  const snapshots = input.keyResults.map(buildKeyResultProgressSnapshot);
  const aggregate = aggregateObjectiveProgress(snapshots);
  const score = calculateOkrScore(aggregate.progressPercent) ?? 0;
  const trend = deriveOkrTrend(aggregate.variance);
  const reason = buildWorkspaceOkrProgressReason({
    objectiveTitle: input.objective.title,
    progressPercent: aggregate.progressPercent,
    variance: aggregate.variance,
    keyResultCount: snapshots.length,
  });

  return freezeProfile(
    Object.freeze({
      contractVersion: WORKSPACE_OKR_PROGRESS_ENGINE_VERSION,
      workspaceId: input.objective.workspaceId,
      objectiveId: input.objective.objectiveId,
      progressPercent: Math.round(aggregate.progressPercent),
      score,
      keyResultCount: snapshots.length,
      completedKeyResults: aggregate.completedKeyResults,
      variance: aggregate.variance,
      trend,
      reason,
      calculatedAt: input.calculatedAt,
      source: WORKSPACE_OKR_PROGRESS_ENGINE_SOURCE,
    })
  );
}

export function calculateWorkspaceOkrProgress(
  workspaceId: WorkspaceId
): CalculateWorkspaceOkrProgressResult {
  hydrateWorkspaceOkrProgressProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      profiles: Object.freeze([]),
      created: false,
      reason: "missing_workspace",
      message: "Provide a workspace before calculating OKR progress profiles.",
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
      message: "Create workspace objectives before calculating OKR progress profiles.",
    });
  }

  const calculatedAt = nowIso();
  const profiles = objectives.map((objective) =>
    buildWorkspaceOkrProgressProfile({
      objective,
      keyResults: getWorkspaceKeyResultsForObjective(trimmedWorkspaceId, objective.objectiveId),
      calculatedAt,
    })
  );

  workspaceOkrProgressProfileStore = Object.freeze({
    ...workspaceOkrProgressProfileStore,
    [trimmedWorkspaceId]: Object.freeze(
      Object.fromEntries(profiles.map((profile) => [profile.objectiveId, profile]))
    ),
  });
  commitWorkspaceOkrProgressProfileChange();
  profiles.forEach(emitOkrProgressDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    profiles: Object.freeze(profiles.map(freezeProfile)),
    created: true,
    reason: "calculated",
    message: `${profiles.length} OKR progress profile${profiles.length === 1 ? "" : "s"} calculated.`,
  });
}

export function getWorkspaceOkrProgressProfiles(
  workspaceId: WorkspaceId
): readonly WorkspaceOkrProgressProfile[] {
  hydrateWorkspaceOkrProgressProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceOkrProgressProfileStore[trimmedWorkspaceId] ?? {}).map(freezeProfile)
  );
}

export function getWorkspaceOkrProgressProfile(
  workspaceId: WorkspaceId,
  objectiveId: string
): WorkspaceOkrProgressProfile | null {
  hydrateWorkspaceOkrProgressProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedObjectiveId = objectiveId.trim();
  if (!trimmedWorkspaceId || !trimmedObjectiveId) return null;
  const match = workspaceOkrProgressProfileStore[trimmedWorkspaceId]?.[trimmedObjectiveId] ?? null;
  return match ? freezeProfile(match) : null;
}

export function subscribeWorkspaceOkrProgressProfileRegistry(
  listener: WorkspaceOkrProgressProfileListener
): () => void {
  hydrateWorkspaceOkrProgressProfileStore();
  workspaceOkrProgressProfileListeners.add(listener);
  return () => workspaceOkrProgressProfileListeners.delete(listener);
}

export function getWorkspaceOkrProgressProfileRegistryVersion(): number {
  hydrateWorkspaceOkrProgressProfileStore();
  return workspaceOkrProgressProfileVersion;
}

export function resetWorkspaceOkrProgressProfileStoreForTests(): void {
  workspaceOkrProgressProfileStore = {};
  workspaceOkrProgressProfileHydrated = false;
  workspaceOkrProgressProfileVersion = 0;
  workspaceOkrProgressProfileListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceOkrProgressProfileMemoryForTests(): void {
  workspaceOkrProgressProfileStore = {};
  workspaceOkrProgressProfileHydrated = false;
  workspaceOkrProgressProfileVersion = 0;
}

export function resolveWorkspaceOkrProgressProfileForObjective(
  workspaceId: WorkspaceId,
  objectiveId: string
): WorkspaceOkrProgressProfile | null {
  const objective = getWorkspaceObjective(workspaceId, objectiveId);
  if (!objective) return null;
  return buildWorkspaceOkrProgressProfile({
    objective,
    keyResults: getWorkspaceKeyResultsForObjective(workspaceId, objectiveId),
    calculatedAt: nowIso(),
  });
}
