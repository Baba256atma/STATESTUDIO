/**
 * DS-4:2 — Workspace KPI calculation engine.
 * Calculation only — KPI profiles from DS-4:1 definitions.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import { getDependencyProfiles } from "../workspace/workspaceDependencyEngineContract.ts";
import { getImpactProfiles } from "../workspace/workspaceImpactEngineContract.ts";
import { getObjectIntelligenceProfiles } from "../workspace/workspaceObjectIntelligenceContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  getWorkspaceKpi,
  getWorkspaceKpis,
  type WorkspaceKpi,
} from "./workspaceKpiContract.ts";

export const WORKSPACE_KPI_CALCULATION_ENGINE_VERSION = "DS-4:2" as const;

export const WORKSPACE_KPI_CALCULATION_ENGINE_TAGS = Object.freeze([
  "[DS42_KPI_CALCULATION_ENGINE]",
  "[KPI_PROFILES_READY]",
  "[KPI_PROGRESS_CALCULATED]",
  "[KPI_VARIANCE_CALCULATED]",
  "[KPI_TREND_READY]",
  "[DS43_READY]",
  "[DS_4_2_COMPLETE]",
] as const);

export const NEXORA_KPI_CALCULATION_ENGINE_LOG_PREFIX =
  "[NexoraKpiCalculationEngine]" as const;

export const WORKSPACE_KPI_CALCULATION_ENGINE_SOURCE = "ds-4:2-calculation" as const;

export const WORKSPACE_KPI_PROFILE_STORAGE_KEY = "nexora.workspaceKpiProfiles.v1" as const;

export type WorkspaceKpiTrend = "improving" | "stable" | "declining" | "unknown";

export type WorkspaceKpiProfile = Readonly<{
  contractVersion: typeof WORKSPACE_KPI_CALCULATION_ENGINE_VERSION;
  workspaceId: WorkspaceId;
  kpiId: string;
  score: number;
  progressPercent: number;
  variance: number;
  trend: WorkspaceKpiTrend;
  calculatedAt: string;
  reason: string;
  source: typeof WORKSPACE_KPI_CALCULATION_ENGINE_SOURCE;
}>;

export type WorkspaceKpiProfileMap = Readonly<Record<string, WorkspaceKpiProfile>>;

export type WorkspaceKpiProfileStore = Readonly<Record<WorkspaceId, WorkspaceKpiProfileMap>>;

export type WorkspaceKpiIntelligenceContext = Readonly<{
  objectIntelligenceCount: number;
  impactProfileCount: number;
  dependencyProfileCount: number;
}>;

export type CalculateWorkspaceKpisResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  profiles: readonly WorkspaceKpiProfile[];
  created: boolean;
  reason: string;
  message: string;
  intelligenceContext: WorkspaceKpiIntelligenceContext | null;
}>;

const STORAGE_KEY = WORKSPACE_KPI_PROFILE_STORAGE_KEY;
const MIN_PROGRESS_PERCENT = 0;
const MAX_PROGRESS_PERCENT = 200;
const MIN_SCORE = 0;
const MAX_SCORE = 100;

let workspaceKpiProfileStore: WorkspaceKpiProfileStore = {};
let workspaceKpiProfileHydrated = false;
let workspaceKpiProfileVersion = 0;

type WorkspaceKpiProfileListener = () => void;

const workspaceKpiProfileListeners = new Set<WorkspaceKpiProfileListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function freezeProfile(profile: WorkspaceKpiProfile): WorkspaceKpiProfile {
  return Object.freeze({ ...profile });
}

function readStorage(): WorkspaceKpiProfileStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceKpiProfileStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceKpiProfileStore));
  } catch {
    // KPI profiles remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceKpiProfileStore(): void {
  if (workspaceKpiProfileHydrated) return;
  workspaceKpiProfileHydrated = true;
  workspaceKpiProfileStore = readStorage();
}

function notifyWorkspaceKpiProfileListeners(): void {
  workspaceKpiProfileVersion += 1;
  workspaceKpiProfileListeners.forEach((listener) => listener());
}

function commitWorkspaceKpiProfileChange(): void {
  writeStorage();
  notifyWorkspaceKpiProfileListeners();
}

function emitKpiCalculationDiagnostic(profile: WorkspaceKpiProfile): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("kpiCalculationEngine", NEXORA_KPI_CALCULATION_ENGINE_LOG_PREFIX, {
    workspaceId: profile.workspaceId,
    kpiId: profile.kpiId,
    score: profile.score,
    progressPercent: profile.progressPercent,
    variance: profile.variance,
    trend: profile.trend,
    tags: WORKSPACE_KPI_CALCULATION_ENGINE_TAGS,
    phase: "DS-4:2",
  });
}

export function readWorkspaceKpiIntelligenceContext(
  workspaceId: WorkspaceId
): WorkspaceKpiIntelligenceContext {
  const trimmedWorkspaceId = workspaceId.trim();
  return Object.freeze({
    objectIntelligenceCount: getObjectIntelligenceProfiles(trimmedWorkspaceId).length,
    impactProfileCount: getImpactProfiles(trimmedWorkspaceId).length,
    dependencyProfileCount: getDependencyProfiles(trimmedWorkspaceId).length,
  });
}

export function calculateKpiProgressPercent(
  currentValue: number,
  targetValue: number
): number | null {
  if (!Number.isFinite(currentValue) || !Number.isFinite(targetValue) || targetValue === 0) {
    return null;
  }
  return clamp((currentValue / targetValue) * 100, MIN_PROGRESS_PERCENT, MAX_PROGRESS_PERCENT);
}

export function calculateKpiScore(progressPercent: number | null): number | null {
  if (progressPercent === null || !Number.isFinite(progressPercent)) return null;
  return clamp(Math.round(progressPercent), MIN_SCORE, MAX_SCORE);
}

export function calculateKpiVariance(currentValue: number, targetValue: number): number | null {
  if (!Number.isFinite(currentValue) || !Number.isFinite(targetValue)) return null;
  return currentValue - targetValue;
}

export function deriveKpiTrend(variance: number | null): WorkspaceKpiTrend {
  if (variance === null || !Number.isFinite(variance)) return "unknown";
  if (variance > 0) return "improving";
  if (variance < 0) return "declining";
  return "stable";
}

export function buildWorkspaceKpiProfileReason(input: {
  name: string;
  progressPercent: number | null;
  variance: number | null;
}): string {
  const name = input.name.trim() || "KPI";
  if (input.variance === null || input.progressPercent === null) {
    return `${name} trend unavailable.`;
  }
  if (input.variance > 0) {
    return `${name} exceeded target.`;
  }
  if (input.variance === 0) {
    return `${name} reached target.`;
  }
  return `${name} reached ${Math.round(input.progressPercent)}% of target.`;
}

function buildWorkspaceKpiProfile(kpi: WorkspaceKpi, calculatedAt: string): WorkspaceKpiProfile {
  const progressPercent = calculateKpiProgressPercent(kpi.currentValue, kpi.targetValue);
  const variance = calculateKpiVariance(kpi.currentValue, kpi.targetValue);
  const score = calculateKpiScore(progressPercent) ?? 0;
  const trend = deriveKpiTrend(variance);
  const reason = buildWorkspaceKpiProfileReason({
    name: kpi.name,
    progressPercent,
    variance,
  });

  return freezeProfile(
    Object.freeze({
      contractVersion: WORKSPACE_KPI_CALCULATION_ENGINE_VERSION,
      workspaceId: kpi.workspaceId,
      kpiId: kpi.kpiId,
      score,
      progressPercent: progressPercent === null ? 0 : Math.round(progressPercent),
      variance: variance ?? 0,
      trend,
      calculatedAt,
      reason,
      source: WORKSPACE_KPI_CALCULATION_ENGINE_SOURCE,
    })
  );
}

export function calculateWorkspaceKpis(workspaceId: WorkspaceId): CalculateWorkspaceKpisResult {
  hydrateWorkspaceKpiProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      profiles: Object.freeze([]),
      created: false,
      reason: "missing_workspace",
      message: "Provide a workspace before calculating KPI profiles.",
      intelligenceContext: null,
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
      message: "Create workspace KPIs before calculating KPI profiles.",
      intelligenceContext: readWorkspaceKpiIntelligenceContext(trimmedWorkspaceId),
    });
  }

  const calculatedAt = nowIso();
  const intelligenceContext = readWorkspaceKpiIntelligenceContext(trimmedWorkspaceId);
  const profiles = kpis.map((kpi) => buildWorkspaceKpiProfile(kpi, calculatedAt));

  workspaceKpiProfileStore = Object.freeze({
    ...workspaceKpiProfileStore,
    [trimmedWorkspaceId]: Object.freeze(
      Object.fromEntries(profiles.map((profile) => [profile.kpiId, profile]))
    ),
  });
  commitWorkspaceKpiProfileChange();
  profiles.forEach(emitKpiCalculationDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    profiles: Object.freeze(profiles.map(freezeProfile)),
    created: true,
    reason: "calculated",
    message: `${profiles.length} KPI profile${profiles.length === 1 ? "" : "s"} calculated.`,
    intelligenceContext,
  });
}

export function getWorkspaceKpiProfiles(
  workspaceId: WorkspaceId
): readonly WorkspaceKpiProfile[] {
  hydrateWorkspaceKpiProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceKpiProfileStore[trimmedWorkspaceId] ?? {}).map(freezeProfile)
  );
}

export function getWorkspaceKpiProfile(
  workspaceId: WorkspaceId,
  kpiId: string
): WorkspaceKpiProfile | null {
  hydrateWorkspaceKpiProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedKpiId = kpiId.trim();
  if (!trimmedWorkspaceId || !trimmedKpiId) return null;
  const match = workspaceKpiProfileStore[trimmedWorkspaceId]?.[trimmedKpiId] ?? null;
  return match ? freezeProfile(match) : null;
}

export function subscribeWorkspaceKpiProfileRegistry(
  listener: WorkspaceKpiProfileListener
): () => void {
  hydrateWorkspaceKpiProfileStore();
  workspaceKpiProfileListeners.add(listener);
  return () => workspaceKpiProfileListeners.delete(listener);
}

export function getWorkspaceKpiProfileRegistryVersion(): number {
  hydrateWorkspaceKpiProfileStore();
  return workspaceKpiProfileVersion;
}

export function resetWorkspaceKpiProfileStoreForTests(): void {
  workspaceKpiProfileStore = {};
  workspaceKpiProfileHydrated = false;
  workspaceKpiProfileVersion = 0;
  workspaceKpiProfileListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceKpiProfileMemoryForTests(): void {
  workspaceKpiProfileStore = {};
  workspaceKpiProfileHydrated = false;
  workspaceKpiProfileVersion = 0;
}

export function resolveWorkspaceKpiProfileForKpi(
  workspaceId: WorkspaceId,
  kpiId: string
): WorkspaceKpiProfile | null {
  const kpi = getWorkspaceKpi(workspaceId, kpiId);
  if (!kpi) return null;
  return buildWorkspaceKpiProfile(kpi, nowIso());
}
