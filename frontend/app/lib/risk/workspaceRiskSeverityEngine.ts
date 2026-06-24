/**
 * DS-6:3 — Workspace risk severity engine.
 * Severity classification only — from DS-6:2 detected risks.
 *
 * OWNERSHIP RULE
 * DS-6:2 owns risk detection.
 * DS-6:3 MUST use getDetectedWorkspaceRisks() ONLY.
 * DS-6:3 MUST NOT detect risks, create risks, or calculate KPI/OKR health or progress.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import {
  getDetectedWorkspaceRisks,
  type WorkspaceDetectedRisk,
} from "./workspaceRiskDetectionEngine.ts";

export const WORKSPACE_RISK_SEVERITY_ENGINE_VERSION = "DS-6:3" as const;

export const WORKSPACE_RISK_SEVERITY_ENGINE_TAGS = Object.freeze([
  "[DS63_RISK_SEVERITY_ENGINE]",
  "[RISK_SEVERITY_READY]",
  "[RISK_PRIORITY_READY]",
  "[RISK_SCORING_READY]",
  "[DS64_READY]",
  "[DS_6_3_COMPLETE]",
] as const);

export const NEXORA_RISK_SEVERITY_LOG_PREFIX = "[NexoraRiskSeverity]" as const;

export const WORKSPACE_RISK_SEVERITY_ENGINE_SOURCE = "ds-6:3-risk-severity" as const;

export const WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY =
  "nexora.workspaceRiskSeverityProfiles.v1" as const;

export const WORKSPACE_RISK_SEVERITY_DETECTION_READ_APIS = Object.freeze([
  "getDetectedWorkspaceRisks",
] as const);

export type WorkspaceRiskSeverityLevel = "low" | "medium" | "high" | "critical";

export type WorkspaceRiskPriorityLevel = "p1" | "p2" | "p3" | "p4";

export type WorkspaceRiskSeverityProfile = Readonly<{
  contractVersion: typeof WORKSPACE_RISK_SEVERITY_ENGINE_VERSION;
  workspaceId: WorkspaceId;
  detectionId: string;
  riskId: string;
  severityScore: number;
  severityLevel: WorkspaceRiskSeverityLevel;
  priority: WorkspaceRiskPriorityLevel;
  severityReason: string;
  evaluatedAt: string;
  source: typeof WORKSPACE_RISK_SEVERITY_ENGINE_SOURCE;
}>;

export type WorkspaceRiskSeverityProfileMap = Readonly<
  Record<string, WorkspaceRiskSeverityProfile>
>;

export type WorkspaceRiskSeverityProfileStore = Readonly<
  Record<WorkspaceId, WorkspaceRiskSeverityProfileMap>
>;

export type EvaluateWorkspaceRiskSeverityResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  profiles: readonly WorkspaceRiskSeverityProfile[];
  evaluated: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = WORKSPACE_RISK_SEVERITY_PROFILE_STORAGE_KEY;

const COMBINED_ESCALATION = 5;
const STRATEGIC_ESCALATION = 5;
const MAX_SEVERITY_SCORE = 100;

let workspaceRiskSeverityProfileStore: WorkspaceRiskSeverityProfileStore = {};
let workspaceRiskSeverityProfileHydrated = false;
let workspaceRiskSeverityProfileVersion = 0;

type WorkspaceRiskSeverityProfileListener = () => void;

const workspaceRiskSeverityProfileListeners = new Set<WorkspaceRiskSeverityProfileListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function freezeProfile(profile: WorkspaceRiskSeverityProfile): WorkspaceRiskSeverityProfile {
  return Object.freeze({ ...profile });
}

function readStorage(): WorkspaceRiskSeverityProfileStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceRiskSeverityProfileStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceRiskSeverityProfileStore));
  } catch {
    // Severity profiles remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceRiskSeverityProfileStore(): void {
  if (workspaceRiskSeverityProfileHydrated) return;
  workspaceRiskSeverityProfileHydrated = true;
  workspaceRiskSeverityProfileStore = readStorage();
}

function notifyWorkspaceRiskSeverityProfileListeners(): void {
  workspaceRiskSeverityProfileVersion += 1;
  workspaceRiskSeverityProfileListeners.forEach((listener) => listener());
}

function commitWorkspaceRiskSeverityProfileChange(): void {
  writeStorage();
  notifyWorkspaceRiskSeverityProfileListeners();
}

function emitRiskSeverityDiagnostic(profile: WorkspaceRiskSeverityProfile): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("riskSeverity", NEXORA_RISK_SEVERITY_LOG_PREFIX, {
    workspaceId: profile.workspaceId,
    riskId: profile.riskId,
    severityScore: profile.severityScore,
    severityLevel: profile.severityLevel,
    priority: profile.priority,
    tags: WORKSPACE_RISK_SEVERITY_ENGINE_TAGS,
    phase: "DS-6:3",
  });
}

export function deriveRiskPriority(confidence: number): WorkspaceRiskPriorityLevel {
  if (confidence >= 0.95) return "p1";
  if (confidence >= 0.8) return "p2";
  if (confidence >= 0.65) return "p3";
  return "p4";
}

export function deriveBaseSeverityScore(confidence: number): number {
  if (confidence >= 0.95) return 95;
  if (confidence >= 0.8) return 80;
  if (confidence >= 0.65) return 65;
  return 50;
}

export function isStrategicDetectedRisk(detectedRisk: WorkspaceDetectedRisk): boolean {
  const title = detectedRisk.title.trim().toLowerCase();
  if (title.includes("strategic")) return true;
  return /strategic execution risk/i.test(detectedRisk.title);
}

export function applyRiskSeverityEscalations(input: {
  detectedRisk: WorkspaceDetectedRisk;
  baseScore: number;
}): number {
  let score = input.baseScore;
  if (input.detectedRisk.riskSource === "combined") {
    score += COMBINED_ESCALATION;
  }
  if (isStrategicDetectedRisk(input.detectedRisk)) {
    score += STRATEGIC_ESCALATION;
  }
  return clamp(score, 0, MAX_SEVERITY_SCORE);
}

export function deriveRiskSeverityLevel(
  severityScore: number
): WorkspaceRiskSeverityLevel {
  if (severityScore >= 95) return "critical";
  if (severityScore >= 80) return "high";
  if (severityScore >= 65) return "medium";
  return "low";
}

export function buildWorkspaceRiskSeverityReason(input: {
  detectedRisk: WorkspaceDetectedRisk;
  severityLevel: WorkspaceRiskSeverityLevel;
}): string {
  const title = input.detectedRisk.title.trim() || "Detected risk";
  if (
    input.detectedRisk.riskSource === "combined" &&
    /strategic execution risk/i.test(title)
  ) {
    return `${title} combines KPI and OKR failures.`;
  }
  return `${title} has ${input.severityLevel} confidence.`;
}

export function calculateRiskSeverityScore(detectedRisk: WorkspaceDetectedRisk): number {
  const baseScore = deriveBaseSeverityScore(detectedRisk.confidence);
  return applyRiskSeverityEscalations({ detectedRisk, baseScore });
}

function buildWorkspaceRiskSeverityProfile(input: {
  detectedRisk: WorkspaceDetectedRisk;
  evaluatedAt: string;
}): WorkspaceRiskSeverityProfile {
  const severityScore = calculateRiskSeverityScore(input.detectedRisk);
  const severityLevel = deriveRiskSeverityLevel(severityScore);
  const priority = deriveRiskPriority(input.detectedRisk.confidence);
  const severityReason = buildWorkspaceRiskSeverityReason({
    detectedRisk: input.detectedRisk,
    severityLevel,
  });

  return freezeProfile(
    Object.freeze({
      contractVersion: WORKSPACE_RISK_SEVERITY_ENGINE_VERSION,
      workspaceId: input.detectedRisk.workspaceId,
      detectionId: input.detectedRisk.detectionId,
      riskId: input.detectedRisk.riskId,
      severityScore,
      severityLevel,
      priority,
      severityReason,
      evaluatedAt: input.evaluatedAt,
      source: WORKSPACE_RISK_SEVERITY_ENGINE_SOURCE,
    })
  );
}

export function evaluateWorkspaceRiskSeverity(
  workspaceId: WorkspaceId
): EvaluateWorkspaceRiskSeverityResult {
  hydrateWorkspaceRiskSeverityProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      profiles: Object.freeze([]),
      evaluated: false,
      reason: "missing_workspace",
      message: "Provide a workspace before evaluating risk severity.",
    });
  }

  const detectedRisks = getDetectedWorkspaceRisks(trimmedWorkspaceId);
  if (detectedRisks.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      profiles: Object.freeze([]),
      evaluated: false,
      reason: "no_detected_risks",
      message: "Detect workspace risks before evaluating severity.",
    });
  }

  const evaluatedAt = nowIso();
  const profiles = detectedRisks.map((detectedRisk) =>
    buildWorkspaceRiskSeverityProfile({ detectedRisk, evaluatedAt })
  );

  workspaceRiskSeverityProfileStore = Object.freeze({
    ...workspaceRiskSeverityProfileStore,
    [trimmedWorkspaceId]: Object.freeze(
      Object.fromEntries(profiles.map((profile) => [profile.detectionId, profile]))
    ),
  });
  commitWorkspaceRiskSeverityProfileChange();
  profiles.forEach(emitRiskSeverityDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    profiles: Object.freeze(profiles.map(freezeProfile)),
    evaluated: true,
    reason: "evaluated",
    message: `${profiles.length} risk severity profile${profiles.length === 1 ? "" : "s"} evaluated.`,
  });
}

export function getWorkspaceRiskSeverityProfiles(
  workspaceId: WorkspaceId
): readonly WorkspaceRiskSeverityProfile[] {
  hydrateWorkspaceRiskSeverityProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceRiskSeverityProfileStore[trimmedWorkspaceId] ?? {}).map(freezeProfile)
  );
}

export function getWorkspaceRiskSeverityProfile(
  workspaceId: WorkspaceId,
  detectionId: string
): WorkspaceRiskSeverityProfile | null {
  hydrateWorkspaceRiskSeverityProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDetectionId = detectionId.trim();
  if (!trimmedWorkspaceId || !trimmedDetectionId) return null;
  const match =
    workspaceRiskSeverityProfileStore[trimmedWorkspaceId]?.[trimmedDetectionId] ?? null;
  return match ? freezeProfile(match) : null;
}

export function subscribeWorkspaceRiskSeverityProfileRegistry(
  listener: WorkspaceRiskSeverityProfileListener
): () => void {
  hydrateWorkspaceRiskSeverityProfileStore();
  workspaceRiskSeverityProfileListeners.add(listener);
  return () => workspaceRiskSeverityProfileListeners.delete(listener);
}

export function getWorkspaceRiskSeverityProfileRegistryVersion(): number {
  hydrateWorkspaceRiskSeverityProfileStore();
  return workspaceRiskSeverityProfileVersion;
}

export function resetWorkspaceRiskSeverityProfileStoreForTests(): void {
  workspaceRiskSeverityProfileStore = {};
  workspaceRiskSeverityProfileHydrated = false;
  workspaceRiskSeverityProfileVersion = 0;
  workspaceRiskSeverityProfileListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceRiskSeverityProfileMemoryForTests(): void {
  workspaceRiskSeverityProfileStore = {};
  workspaceRiskSeverityProfileHydrated = false;
  workspaceRiskSeverityProfileVersion = 0;
}
