/**
 * DS-6:2 — Workspace risk detection engine.
 * Detects risks from read-only KPI and OKR health profiles only.
 *
 * OWNERSHIP RULE
 * DS-6:2 detects risks. It does NOT calculate KPI health, OKR health,
 * KPI progress, OKR progress, risk severity, or bind risks to objects.
 * Health data MUST come from getWorkspaceKpiHealthProfiles() and
 * getWorkspaceOkrHealthProfiles() only.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  getWorkspaceKpiHealthProfiles,
  type WorkspaceKpiHealthProfile,
  type WorkspaceKpiHealthStatus,
} from "../kpi/workspaceKpiHealthEngine.ts";
import {
  getWorkspaceOkrHealthProfiles,
  type WorkspaceOkrHealthProfile,
} from "../okr/workspaceOkrHealthEngine.ts";
import { getWorkspaceKpis } from "../kpi/workspaceKpiContract.ts";
import { getWorkspaceObjectives } from "../okr/workspaceOkrContract.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const WORKSPACE_RISK_DETECTION_ENGINE_VERSION = "DS-6:2" as const;

export const WORKSPACE_RISK_DETECTION_ENGINE_TAGS = Object.freeze([
  "[DS62_RISK_DETECTION_ENGINE]",
  "[RISK_DETECTION_READY]",
  "[KPI_RISK_DETECTION_READY]",
  "[OKR_RISK_DETECTION_READY]",
  "[DS63_READY]",
  "[DS_6_2_COMPLETE]",
] as const);

export const NEXORA_RISK_DETECTION_LOG_PREFIX = "[NexoraRiskDetection]" as const;

export const WORKSPACE_RISK_DETECTION_ENGINE_SOURCE = "ds-6:2-risk-detection" as const;

export const WORKSPACE_DETECTED_RISK_STORAGE_KEY = "nexora.workspaceDetectedRisks.v1" as const;

export const WORKSPACE_RISK_DETECTION_HEALTH_READ_APIS = Object.freeze([
  "getWorkspaceKpiHealthProfiles",
  "getWorkspaceOkrHealthProfiles",
] as const);

export type WorkspaceDetectedRiskSource =
  | "kpi"
  | "okr"
  | "relationship"
  | "object"
  | "combined";

export type WorkspaceDetectedRisk = Readonly<{
  detectionId: string;
  workspaceId: WorkspaceId;
  riskId: string;
  title: string;
  description: string;
  riskSource: WorkspaceDetectedRiskSource;
  detectionReason: string;
  confidence: number;
  detectedAt: string;
  source: typeof WORKSPACE_RISK_DETECTION_ENGINE_SOURCE;
}>;

export type WorkspaceDetectedRiskMap = Readonly<Record<string, WorkspaceDetectedRisk>>;

export type WorkspaceDetectedRiskStore = Readonly<
  Record<WorkspaceId, WorkspaceDetectedRiskMap>
>;

export type DetectWorkspaceRisksResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  risks: readonly WorkspaceDetectedRisk[];
  detected: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = WORKSPACE_DETECTED_RISK_STORAGE_KEY;

const DETECTABLE_HEALTH_STATUSES = new Set<WorkspaceKpiHealthStatus>(["warning", "critical"]);

const CONFIDENCE_BY_STATUS: Readonly<Record<"warning" | "critical", number>> = Object.freeze({
  critical: 0.95,
  warning: 0.8,
});

const COMBINED_CONFIDENCE = 1.0;

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "from",
  "into",
  "improve",
  "increase",
  "reduce",
  "objective",
  "kpi",
]);

let workspaceDetectedRiskStore: WorkspaceDetectedRiskStore = {};
let workspaceDetectedRiskHydrated = false;
let workspaceDetectedRiskVersion = 0;

type WorkspaceDetectedRiskListener = () => void;

const workspaceDetectedRiskListeners = new Set<WorkspaceDetectedRiskListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80) || "risk"
  );
}

function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function tokenize(value: string): string[] {
  return value
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length >= 4 && !STOP_WORDS.has(token));
}

function extractPrimaryToken(value: string): string {
  const tokens = tokenize(value);
  if (tokens.length === 0) {
    const fallback = value.trim().split(/\s+/)[0] ?? "Risk";
    return capitalize(fallback);
  }
  return capitalize(tokens[0]);
}

function tokensOverlap(leftToken: string, rightToken: string): boolean {
  if (leftToken === rightToken) return true;
  return leftToken.startsWith(rightToken) || rightToken.startsWith(leftToken);
}

function findSharedToken(left: string, right: string): string | null {
  for (const leftToken of tokenize(left)) {
    for (const rightToken of tokenize(right)) {
      if (tokensOverlap(leftToken, rightToken)) {
        return leftToken.length <= rightToken.length ? leftToken : rightToken;
      }
    }
  }
  return null;
}

function findSharedDetectionLabels(
  kpiName: string,
  objectiveTitle: string
): { kpiLabel: string; objectiveLabel: string } | null {
  for (const leftToken of tokenize(kpiName)) {
    for (const rightToken of tokenize(objectiveTitle)) {
      if (!tokensOverlap(leftToken, rightToken)) continue;
      const kpiWord =
        kpiName
          .trim()
          .split(/\s+/)
          .find((word) => tokenize(word).some((token) => tokensOverlap(token, leftToken))) ??
        leftToken;
      const objectiveWord =
        objectiveTitle
          .trim()
          .split(/\s+/)
          .find((word) => tokenize(word).some((token) => tokensOverlap(token, rightToken))) ??
        rightToken;
      return {
        kpiLabel: capitalize(kpiWord),
        objectiveLabel: capitalize(objectiveWord),
      };
    }
  }
  return null;
}

function confidenceForStatus(status: "warning" | "critical"): number {
  return CONFIDENCE_BY_STATUS[status];
}

function freezeDetectedRisk(risk: WorkspaceDetectedRisk): WorkspaceDetectedRisk {
  return Object.freeze({ ...risk });
}

function readStorage(): WorkspaceDetectedRiskStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceDetectedRiskStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceDetectedRiskStore));
  } catch {
    // Detected risks remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceDetectedRiskStore(): void {
  if (workspaceDetectedRiskHydrated) return;
  workspaceDetectedRiskHydrated = true;
  workspaceDetectedRiskStore = readStorage();
}

function notifyWorkspaceDetectedRiskListeners(): void {
  workspaceDetectedRiskVersion += 1;
  workspaceDetectedRiskListeners.forEach((listener) => listener());
}

function commitWorkspaceDetectedRiskChange(): void {
  writeStorage();
  notifyWorkspaceDetectedRiskListeners();
}

function emitRiskDetectionDiagnostic(input: {
  workspaceId: WorkspaceId;
  riskSource: WorkspaceDetectedRiskSource;
  confidence: number;
  riskCount: number;
}): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("riskDetection", NEXORA_RISK_DETECTION_LOG_PREFIX, {
    workspaceId: input.workspaceId,
    riskSource: input.riskSource,
    confidence: input.confidence,
    riskCount: input.riskCount,
    tags: WORKSPACE_RISK_DETECTION_ENGINE_TAGS,
    phase: "DS-6:2",
  });
}

export function buildKpiDetectedRiskTitle(kpiName: string): string {
  return `${extractPrimaryToken(kpiName)} Quality Risk`;
}

export function buildOkrDetectedRiskTitle(objectiveTitle: string): string {
  if (/market|expansion|growth/i.test(objectiveTitle)) {
    return "Growth Execution Risk";
  }
  return `${extractPrimaryToken(objectiveTitle)} Execution Risk`;
}

export function buildCombinedDetectedRiskTitle(kpiName: string, objectiveTitle: string): string {
  const shared = findSharedToken(kpiName, objectiveTitle);
  if (shared) {
    return `${capitalize(shared)} Failure Risk`;
  }
  return "Strategic Execution Risk";
}

export function buildKpiDetectionReason(
  kpiName: string,
  healthStatus: "warning" | "critical"
): string {
  return `${kpiName.trim() || "KPI"} KPI is ${healthStatus}.`;
}

export function buildOkrDetectionReason(
  objectiveTitle: string,
  healthStatus: "warning" | "critical"
): string {
  return `${objectiveTitle.trim() || "Objective"} objective is ${healthStatus}.`;
}

export function buildCombinedDetectionReason(kpiName: string, objectiveTitle: string): string {
  const shared = findSharedDetectionLabels(kpiName, objectiveTitle);
  if (shared) {
    return `${shared.kpiLabel} KPI and ${shared.objectiveLabel} objective are both critical.`;
  }
  return `${extractPrimaryToken(kpiName)} KPI and ${extractPrimaryToken(objectiveTitle)} objective are both critical.`;
}

function buildDetectionId(parts: readonly string[]): string {
  return parts.map(slugify).join("_");
}

function buildRiskId(parts: readonly string[]): string {
  return ["wrisk_detect", ...parts.map(slugify)].join("_");
}

function buildKpiDetectedRisk(input: {
  workspaceId: WorkspaceId;
  kpiId: string;
  kpiName: string;
  healthStatus: "warning" | "critical";
  detectedAt: string;
}): WorkspaceDetectedRisk {
  const detectionId = buildDetectionId([
    "kpi",
    input.workspaceId,
    input.kpiId,
    input.healthStatus,
  ]);
  return freezeDetectedRisk(
    Object.freeze({
      detectionId,
      workspaceId: input.workspaceId,
      riskId: buildRiskId(["kpi", input.workspaceId, input.kpiId, input.healthStatus]),
      title: buildKpiDetectedRiskTitle(input.kpiName),
      description: `Detected from KPI health status ${input.healthStatus}.`,
      riskSource: "kpi",
      detectionReason: buildKpiDetectionReason(input.kpiName, input.healthStatus),
      confidence: confidenceForStatus(input.healthStatus),
      detectedAt: input.detectedAt,
      source: WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
    })
  );
}

function buildOkrDetectedRisk(input: {
  workspaceId: WorkspaceId;
  objectiveId: string;
  objectiveTitle: string;
  healthStatus: "warning" | "critical";
  detectedAt: string;
}): WorkspaceDetectedRisk {
  const detectionId = buildDetectionId([
    "okr",
    input.workspaceId,
    input.objectiveId,
    input.healthStatus,
  ]);
  return freezeDetectedRisk(
    Object.freeze({
      detectionId,
      workspaceId: input.workspaceId,
      riskId: buildRiskId(["okr", input.workspaceId, input.objectiveId, input.healthStatus]),
      title: buildOkrDetectedRiskTitle(input.objectiveTitle),
      description: `Detected from OKR health status ${input.healthStatus}.`,
      riskSource: "okr",
      detectionReason: buildOkrDetectionReason(input.objectiveTitle, input.healthStatus),
      confidence: confidenceForStatus(input.healthStatus),
      detectedAt: input.detectedAt,
      source: WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
    })
  );
}

function buildCombinedDetectedRisk(input: {
  workspaceId: WorkspaceId;
  kpiId: string;
  objectiveId: string;
  kpiName: string;
  objectiveTitle: string;
  detectedAt: string;
}): WorkspaceDetectedRisk {
  const detectionId = buildDetectionId([
    "combined",
    input.workspaceId,
    input.kpiId,
    input.objectiveId,
  ]);
  return freezeDetectedRisk(
    Object.freeze({
      detectionId,
      workspaceId: input.workspaceId,
      riskId: buildRiskId(["combined", input.workspaceId, input.kpiId, input.objectiveId]),
      title: buildCombinedDetectedRiskTitle(input.kpiName, input.objectiveTitle),
      description: "Detected from concurrent critical KPI and OKR health signals.",
      riskSource: "combined",
      detectionReason: buildCombinedDetectionReason(input.kpiName, input.objectiveTitle),
      confidence: COMBINED_CONFIDENCE,
      detectedAt: input.detectedAt,
      source: WORKSPACE_RISK_DETECTION_ENGINE_SOURCE,
    })
  );
}

function isDetectableHealthStatus(
  status: WorkspaceKpiHealthProfile["healthStatus"]
): status is "warning" | "critical" {
  return DETECTABLE_HEALTH_STATUSES.has(status);
}

function detectFromKpiHealthProfiles(input: {
  workspaceId: WorkspaceId;
  profiles: readonly WorkspaceKpiHealthProfile[];
  kpiNameById: ReadonlyMap<string, string>;
  detectedAt: string;
}): WorkspaceDetectedRisk[] {
  const risks: WorkspaceDetectedRisk[] = [];
  for (const profile of input.profiles) {
    if (!isDetectableHealthStatus(profile.healthStatus)) continue;
    const kpiName = input.kpiNameById.get(profile.kpiId) ?? profile.kpiId;
    risks.push(
      buildKpiDetectedRisk({
        workspaceId: input.workspaceId,
        kpiId: profile.kpiId,
        kpiName,
        healthStatus: profile.healthStatus,
        detectedAt: input.detectedAt,
      })
    );
  }
  return risks;
}

function detectFromOkrHealthProfiles(input: {
  workspaceId: WorkspaceId;
  profiles: readonly WorkspaceOkrHealthProfile[];
  objectiveTitleById: ReadonlyMap<string, string>;
  detectedAt: string;
}): WorkspaceDetectedRisk[] {
  const risks: WorkspaceDetectedRisk[] = [];
  for (const profile of input.profiles) {
    if (!isDetectableHealthStatus(profile.healthStatus)) continue;
    const objectiveTitle = input.objectiveTitleById.get(profile.objectiveId) ?? profile.objectiveId;
    risks.push(
      buildOkrDetectedRisk({
        workspaceId: input.workspaceId,
        objectiveId: profile.objectiveId,
        objectiveTitle,
        healthStatus: profile.healthStatus,
        detectedAt: input.detectedAt,
      })
    );
  }
  return risks;
}

function detectCombinedRisks(input: {
  workspaceId: WorkspaceId;
  kpiProfiles: readonly WorkspaceKpiHealthProfile[];
  okrProfiles: readonly WorkspaceOkrHealthProfile[];
  kpiNameById: ReadonlyMap<string, string>;
  objectiveTitleById: ReadonlyMap<string, string>;
  detectedAt: string;
}): WorkspaceDetectedRisk[] {
  const criticalKpis = input.kpiProfiles.filter((profile) => profile.healthStatus === "critical");
  const criticalOkrs = input.okrProfiles.filter((profile) => profile.healthStatus === "critical");
  if (criticalKpis.length === 0 || criticalOkrs.length === 0) return [];

  const risks: WorkspaceDetectedRisk[] = [];
  for (const kpiProfile of criticalKpis) {
    const kpiName = input.kpiNameById.get(kpiProfile.kpiId) ?? kpiProfile.kpiId;
    for (const okrProfile of criticalOkrs) {
      const objectiveTitle =
        input.objectiveTitleById.get(okrProfile.objectiveId) ?? okrProfile.objectiveId;
      if (!findSharedToken(kpiName, objectiveTitle)) continue;
      risks.push(
        buildCombinedDetectedRisk({
          workspaceId: input.workspaceId,
          kpiId: kpiProfile.kpiId,
          objectiveId: okrProfile.objectiveId,
          kpiName,
          objectiveTitle,
          detectedAt: input.detectedAt,
        })
      );
    }
  }
  return risks;
}

export function detectWorkspaceRisks(workspaceId: WorkspaceId): DetectWorkspaceRisksResult {
  hydrateWorkspaceDetectedRiskStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      risks: Object.freeze([]),
      detected: false,
      reason: "missing_workspace",
      message: "Provide a workspace before detecting risks.",
    });
  }

  const kpiHealthProfiles = getWorkspaceKpiHealthProfiles(trimmedWorkspaceId);
  const okrHealthProfiles = getWorkspaceOkrHealthProfiles(trimmedWorkspaceId);
  const kpiNameById = new Map(getWorkspaceKpis(trimmedWorkspaceId).map((kpi) => [kpi.kpiId, kpi.name]));
  const objectiveTitleById = new Map(
    getWorkspaceObjectives(trimmedWorkspaceId).map((objective) => [
      objective.objectiveId,
      objective.title,
    ])
  );
  const detectedAt = nowIso();

  const kpiRisks = detectFromKpiHealthProfiles({
    workspaceId: trimmedWorkspaceId,
    profiles: kpiHealthProfiles,
    kpiNameById,
    detectedAt,
  });
  const okrRisks = detectFromOkrHealthProfiles({
    workspaceId: trimmedWorkspaceId,
    profiles: okrHealthProfiles,
    objectiveTitleById,
    detectedAt,
  });
  const combinedRisks = detectCombinedRisks({
    workspaceId: trimmedWorkspaceId,
    kpiProfiles: kpiHealthProfiles,
    okrProfiles: okrHealthProfiles,
    kpiNameById,
    objectiveTitleById,
    detectedAt,
  });

  const risks = Object.freeze([...kpiRisks, ...okrRisks, ...combinedRisks]);

  workspaceDetectedRiskStore = Object.freeze({
    ...workspaceDetectedRiskStore,
    [trimmedWorkspaceId]: Object.freeze(
      Object.fromEntries(risks.map((risk) => [risk.detectionId, risk]))
    ),
  });
  commitWorkspaceDetectedRiskChange();

  const riskCountBySource = {
    kpi: kpiRisks.length,
    okr: okrRisks.length,
    combined: combinedRisks.length,
  };
  (["kpi", "okr", "combined"] as const).forEach((riskSource) => {
    const count = riskCountBySource[riskSource];
    if (count === 0) return;
    const sampleConfidence =
      riskSource === "combined"
        ? COMBINED_CONFIDENCE
        : risks.find((risk) => risk.riskSource === riskSource)?.confidence ?? 0;
    emitRiskDetectionDiagnostic({
      workspaceId: trimmedWorkspaceId,
      riskSource,
      confidence: sampleConfidence,
      riskCount: count,
    });
  });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    risks,
    detected: risks.length > 0,
    reason: risks.length > 0 ? "detected" : "no_risks",
    message:
      risks.length > 0
        ? `${risks.length} workspace risk${risks.length === 1 ? "" : "s"} detected.`
        : "No warning or critical health signals found for risk detection.",
  });
}

export function getDetectedWorkspaceRisks(
  workspaceId: WorkspaceId
): readonly WorkspaceDetectedRisk[] {
  hydrateWorkspaceDetectedRiskStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceDetectedRiskStore[trimmedWorkspaceId] ?? {}).map(freezeDetectedRisk)
  );
}

export function getDetectedWorkspaceRisk(
  workspaceId: WorkspaceId,
  detectionId: string
): WorkspaceDetectedRisk | null {
  hydrateWorkspaceDetectedRiskStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDetectionId = detectionId.trim();
  if (!trimmedWorkspaceId || !trimmedDetectionId) return null;
  const match = workspaceDetectedRiskStore[trimmedWorkspaceId]?.[trimmedDetectionId] ?? null;
  return match ? freezeDetectedRisk(match) : null;
}

export function subscribeWorkspaceDetectedRiskRegistry(
  listener: WorkspaceDetectedRiskListener
): () => void {
  hydrateWorkspaceDetectedRiskStore();
  workspaceDetectedRiskListeners.add(listener);
  return () => workspaceDetectedRiskListeners.delete(listener);
}

export function getWorkspaceDetectedRiskRegistryVersion(): number {
  hydrateWorkspaceDetectedRiskStore();
  return workspaceDetectedRiskVersion;
}

export function resetWorkspaceDetectedRiskStoreForTests(): void {
  workspaceDetectedRiskStore = {};
  workspaceDetectedRiskHydrated = false;
  workspaceDetectedRiskVersion = 0;
  workspaceDetectedRiskListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceDetectedRiskMemoryForTests(): void {
  workspaceDetectedRiskStore = {};
  workspaceDetectedRiskHydrated = false;
  workspaceDetectedRiskVersion = 0;
}
