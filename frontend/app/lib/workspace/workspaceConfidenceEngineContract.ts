/**
 * DS-3:4 — Workspace confidence engine.
 * Confidence only — deterministic profile trust scoring from object intelligence signals.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  getObjectIntelligenceProfiles,
  type WorkspaceObjectIntelligenceProfile,
} from "./workspaceObjectIntelligenceContract.ts";
import { getImpactProfiles } from "./workspaceImpactEngineContract.ts";
import { getDependencyProfiles } from "./workspaceDependencyEngineContract.ts";
import { getWorkspaceRelationships } from "./workspaceRelationshipCreationContract.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_CONFIDENCE_ENGINE_VERSION = "DS-3:4" as const;

export const WORKSPACE_CONFIDENCE_ENGINE_TAGS = Object.freeze([
  "[DS34_CONFIDENCE_ENGINE]",
  "[OBJECT_CONFIDENCE_READY]",
  "[CONFIDENCE_SCORE_PERSISTED]",
  "[OBJECT_INTELLIGENCE_TRIAD_READY]",
  "[DS35_READY]",
  "[DS_3_4_COMPLETE]",
] as const);

export const NEXORA_CONFIDENCE_ENGINE_LOG_PREFIX =
  "[NexoraConfidenceEngine]" as const;

export const WORKSPACE_CONFIDENCE_ENGINE_SOURCE = "ds-3:4-confidence" as const;

export type WorkspaceConfidenceLevel = "Low" | "Medium" | "High" | "Very High";

export type WorkspaceConfidenceRecord = Readonly<{
  contractVersion: typeof WORKSPACE_CONFIDENCE_ENGINE_VERSION;
  objectId: string;
  workspaceId: WorkspaceId;
  confidenceScore: number;
  confidenceLevel: WorkspaceConfidenceLevel;
  confidenceReason: string;
  relationshipCoverage: number;
  connectionEvidence: number;
  profileCompleteness: number;
  calculatedAt: string;
  source: typeof WORKSPACE_CONFIDENCE_ENGINE_SOURCE;
}>;

export type WorkspaceConfidenceProfileMap = Readonly<Record<string, WorkspaceConfidenceRecord>>;

export type WorkspaceConfidenceProfileStore = Readonly<
  Record<WorkspaceId, WorkspaceConfidenceProfileMap>
>;

export type CalculateObjectConfidenceResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  confidenceProfiles: readonly WorkspaceConfidenceRecord[];
  created: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = "nexora.workspaceConfidenceProfiles.v1";

let confidenceProfileStore: WorkspaceConfidenceProfileStore = {};
let confidenceProfileHydrated = false;
let confidenceProfileVersion = 0;

type ConfidenceProfileListener = () => void;

const confidenceProfileListeners = new Set<ConfidenceProfileListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function freezeConfidenceProfile(profile: WorkspaceConfidenceRecord): WorkspaceConfidenceRecord {
  return Object.freeze({ ...profile });
}

function readStorage(): WorkspaceConfidenceProfileStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceConfidenceProfileStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(confidenceProfileStore));
  } catch {
    // Confidence profiles remain available in-memory if storage is unavailable.
  }
}

function hydrateConfidenceProfileStore(): void {
  if (confidenceProfileHydrated) return;
  confidenceProfileHydrated = true;
  confidenceProfileStore = readStorage();
}

function notifyConfidenceProfileListeners(): void {
  confidenceProfileVersion += 1;
  confidenceProfileListeners.forEach((listener) => listener());
}

function commitConfidenceProfileChange(): void {
  writeStorage();
  notifyConfidenceProfileListeners();
}

function emitConfidenceDiagnostic(profile: WorkspaceConfidenceRecord): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("confidenceEngine", NEXORA_CONFIDENCE_ENGINE_LOG_PREFIX, {
    workspaceId: profile.workspaceId,
    objectId: profile.objectId,
    confidenceScore: profile.confidenceScore,
    confidenceLevel: profile.confidenceLevel,
    relationshipCoverage: profile.relationshipCoverage,
    connectionEvidence: profile.connectionEvidence,
    profileCompleteness: profile.profileCompleteness,
    tags: WORKSPACE_CONFIDENCE_ENGINE_TAGS,
    phase: "DS-3:4",
  });
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function confidenceLevelForScore(confidenceScore: number): WorkspaceConfidenceLevel {
  if (confidenceScore >= 75) return "Very High";
  if (confidenceScore >= 50) return "High";
  if (confidenceScore >= 25) return "Medium";
  return "Low";
}

function relationshipCoverage(profile: WorkspaceObjectIntelligenceProfile): number {
  if (profile.relationshipCount <= 0) return 0;
  let score = 35;
  if (profile.incomingRelationshipCount > 0) score += 25;
  if (profile.outgoingRelationshipCount > 0) score += 25;
  if (profile.relationshipCount >= 2) score += 15;
  return clampScore(score);
}

function connectionEvidence(profile: WorkspaceObjectIntelligenceProfile): number {
  if (profile.connectedObjectCount <= 0) return 0;
  return clampScore(Math.min(100, profile.connectedObjectCount * 40));
}

function profileCompleteness(profile: WorkspaceObjectIntelligenceProfile): number {
  let score = 0;
  if (profile.objectId.trim()) score += 20;
  if (profile.objectName.trim()) score += 20;
  if (profile.objectType.trim()) score += 20;
  if (profile.originCandidateId?.trim() || profile.originWorkspaceObjectId?.trim()) score += 20;
  if (
    Number.isFinite(profile.relationshipCount) &&
    Number.isFinite(profile.incomingRelationshipCount) &&
    Number.isFinite(profile.outgoingRelationshipCount) &&
    Number.isFinite(profile.connectedObjectCount)
  ) {
    score += 20;
  }
  return clampScore(score);
}

function confidenceReason(input: {
  relationshipCoverage: number;
  connectionEvidence: number;
  profileCompleteness: number;
  confidenceLevel: WorkspaceConfidenceLevel;
}): string {
  const relationshipPhrase =
    input.relationshipCoverage >= 75
      ? "multiple confirmed relationships"
      : input.relationshipCoverage >= 25
        ? "limited relationship evidence"
        : "no confirmed relationship evidence";
  const connectionPhrase =
    input.connectionEvidence >= 75
      ? "high graph connectivity"
      : input.connectionEvidence >= 25
        ? "partial graph connectivity"
        : "minimal graph connectivity";
  const profilePhrase =
    input.profileCompleteness >= 75 ? "complete object profile" : "partial object coverage";
  return `${relationshipPhrase}; ${connectionPhrase}; ${profilePhrase}.`;
}

function confidenceScore(input: {
  relationshipCoverage: number;
  connectionEvidence: number;
  profileCompleteness: number;
}): number {
  return clampScore(
    input.relationshipCoverage * 0.4 +
      input.connectionEvidence * 0.35 +
      input.profileCompleteness * 0.25
  );
}

function buildConfidenceProfile(input: {
  profile: WorkspaceObjectIntelligenceProfile;
  calculatedAt: string;
}): WorkspaceConfidenceRecord {
  const coverage = relationshipCoverage(input.profile);
  const evidence = connectionEvidence(input.profile);
  const completeness = profileCompleteness(input.profile);
  const score = confidenceScore({
    relationshipCoverage: coverage,
    connectionEvidence: evidence,
    profileCompleteness: completeness,
  });
  const level = confidenceLevelForScore(score);
  return freezeConfidenceProfile(
    Object.freeze({
      contractVersion: WORKSPACE_CONFIDENCE_ENGINE_VERSION,
      objectId: input.profile.objectId,
      workspaceId: input.profile.workspaceId,
      confidenceScore: score,
      confidenceLevel: level,
      confidenceReason: confidenceReason({
        relationshipCoverage: coverage,
        connectionEvidence: evidence,
        profileCompleteness: completeness,
        confidenceLevel: level,
      }),
      relationshipCoverage: coverage,
      connectionEvidence: evidence,
      profileCompleteness: completeness,
      calculatedAt: input.calculatedAt,
      source: WORKSPACE_CONFIDENCE_ENGINE_SOURCE,
    })
  );
}

export function calculateObjectConfidence(
  workspaceId: WorkspaceId
): CalculateObjectConfidenceResult {
  hydrateConfidenceProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      confidenceProfiles: Object.freeze([]),
      created: false,
      reason: "missing_workspace",
      message: "Provide a workspace before calculating object confidence.",
    });
  }

  const objectProfiles = getObjectIntelligenceProfiles(trimmedWorkspaceId);
  if (objectProfiles.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      confidenceProfiles: Object.freeze([]),
      created: false,
      reason: "no_object_intelligence_profiles",
      message: "Build object intelligence profiles before calculating confidence.",
    });
  }

  const impactProfileIds = new Set(
    getImpactProfiles(trimmedWorkspaceId).map((profile) => profile.objectId)
  );
  const dependencyProfileIds = new Set(
    getDependencyProfiles(trimmedWorkspaceId).map((profile) => profile.objectId)
  );
  const relationshipObjectIds = new Set(
    getWorkspaceRelationships(trimmedWorkspaceId).flatMap((relationship) => [
      relationship.sourceObjectId,
      relationship.targetObjectId,
    ])
  );
  const eligibleProfiles = objectProfiles.filter((profile) => {
    const impactReady = impactProfileIds.size === 0 || impactProfileIds.has(profile.objectId);
    const dependencyReady =
      dependencyProfileIds.size === 0 || dependencyProfileIds.has(profile.objectId);
    const relationshipReady =
      relationshipObjectIds.size === 0 || relationshipObjectIds.has(profile.objectId);
    return profile.workspaceId === trimmedWorkspaceId && impactReady && dependencyReady && relationshipReady;
  });
  const calculatedAt = nowIso();
  const confidenceProfiles = eligibleProfiles.map((profile) =>
    buildConfidenceProfile({ profile, calculatedAt })
  );

  confidenceProfileStore = Object.freeze({
    ...confidenceProfileStore,
    [trimmedWorkspaceId]: Object.freeze(
      Object.fromEntries(confidenceProfiles.map((profile) => [profile.objectId, profile]))
    ),
  });
  commitConfidenceProfileChange();
  confidenceProfiles.forEach(emitConfidenceDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    confidenceProfiles: Object.freeze(confidenceProfiles.map(freezeConfidenceProfile)),
    created: true,
    reason: "calculated",
    message: `${confidenceProfiles.length} confidence profile${confidenceProfiles.length === 1 ? "" : "s"} calculated.`,
  });
}

export function getConfidenceProfiles(
  workspaceId: WorkspaceId
): readonly WorkspaceConfidenceRecord[] {
  hydrateConfidenceProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(confidenceProfileStore[trimmedWorkspaceId] ?? {}).map(freezeConfidenceProfile)
  );
}

export function getConfidenceProfile(
  workspaceId: WorkspaceId,
  objectId: string
): WorkspaceConfidenceRecord | null {
  hydrateConfidenceProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedObjectId = objectId.trim();
  if (!trimmedWorkspaceId || !trimmedObjectId) return null;
  const match = confidenceProfileStore[trimmedWorkspaceId]?.[trimmedObjectId] ?? null;
  return match ? freezeConfidenceProfile(match) : null;
}

export function subscribeWorkspaceConfidenceProfileRegistry(
  listener: ConfidenceProfileListener
): () => void {
  hydrateConfidenceProfileStore();
  confidenceProfileListeners.add(listener);
  return () => confidenceProfileListeners.delete(listener);
}

export function getWorkspaceConfidenceProfileRegistryVersion(): number {
  hydrateConfidenceProfileStore();
  return confidenceProfileVersion;
}

export function resetWorkspaceConfidenceProfileStoreForTests(): void {
  confidenceProfileStore = {};
  confidenceProfileHydrated = false;
  confidenceProfileVersion = 0;
  confidenceProfileListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
