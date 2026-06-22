/**
 * DS-3:3 — Workspace dependency engine.
 * Dependency only — deterministic model reliance scoring from DS-3:1 profiles.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  getObjectIntelligenceProfiles,
  type WorkspaceObjectIntelligenceProfile,
} from "./workspaceObjectIntelligenceContract.ts";
import { getImpactProfiles } from "./workspaceImpactEngineContract.ts";
import { getWorkspaceRelationships } from "./workspaceRelationshipCreationContract.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_DEPENDENCY_ENGINE_VERSION = "DS-3:3" as const;

export const WORKSPACE_DEPENDENCY_ENGINE_TAGS = Object.freeze([
  "[DS33_DEPENDENCY_ENGINE]",
  "[OBJECT_DEPENDENCY_READY]",
  "[DEPENDENCY_SCORE_PERSISTED]",
  "[OBJECT_INTELLIGENCE_EXPANDED]",
  "[DS34_READY]",
  "[DS_3_3_COMPLETE]",
] as const);

export const NEXORA_DEPENDENCY_ENGINE_LOG_PREFIX =
  "[NexoraDependencyEngine]" as const;

export const WORKSPACE_DEPENDENCY_ENGINE_SOURCE = "ds-3:3-dependency" as const;

export type WorkspaceDependencyLevel = "Low" | "Medium" | "High" | "Critical";

export type WorkspaceDependencyRecord = Readonly<{
  contractVersion: typeof WORKSPACE_DEPENDENCY_ENGINE_VERSION;
  objectId: string;
  workspaceId: WorkspaceId;
  dependencyScore: number;
  dependencyLevel: WorkspaceDependencyLevel;
  dependencyReason: string;
  incomingRelationshipCount: number;
  dependentObjectCount: number;
  calculatedAt: string;
  source: typeof WORKSPACE_DEPENDENCY_ENGINE_SOURCE;
}>;

export type WorkspaceDependencyProfileMap = Readonly<
  Record<string, WorkspaceDependencyRecord>
>;

export type WorkspaceDependencyProfileStore = Readonly<
  Record<WorkspaceId, WorkspaceDependencyProfileMap>
>;

export type CalculateObjectDependencyResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  dependencyProfiles: readonly WorkspaceDependencyRecord[];
  created: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = "nexora.workspaceDependencyProfiles.v1";

let dependencyProfileStore: WorkspaceDependencyProfileStore = {};
let dependencyProfileHydrated = false;
let dependencyProfileVersion = 0;

type DependencyProfileListener = () => void;

const dependencyProfileListeners = new Set<DependencyProfileListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function freezeDependencyProfile(
  profile: WorkspaceDependencyRecord
): WorkspaceDependencyRecord {
  return Object.freeze({ ...profile });
}

function readStorage(): WorkspaceDependencyProfileStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceDependencyProfileStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dependencyProfileStore));
  } catch {
    // Dependency profiles remain available in-memory if storage is unavailable.
  }
}

function hydrateDependencyProfileStore(): void {
  if (dependencyProfileHydrated) return;
  dependencyProfileHydrated = true;
  dependencyProfileStore = readStorage();
}

function notifyDependencyProfileListeners(): void {
  dependencyProfileVersion += 1;
  dependencyProfileListeners.forEach((listener) => listener());
}

function commitDependencyProfileChange(): void {
  writeStorage();
  notifyDependencyProfileListeners();
}

function emitDependencyDiagnostic(profile: WorkspaceDependencyRecord): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("dependencyEngine", NEXORA_DEPENDENCY_ENGINE_LOG_PREFIX, {
    workspaceId: profile.workspaceId,
    objectId: profile.objectId,
    dependencyScore: profile.dependencyScore,
    dependencyLevel: profile.dependencyLevel,
    incomingRelationshipCount: profile.incomingRelationshipCount,
    dependentObjectCount: profile.dependentObjectCount,
    tags: WORKSPACE_DEPENDENCY_ENGINE_TAGS,
    phase: "DS-3:3",
  });
}

function normalizeDependencyScore(rawScore: number, maxRawScore: number): number {
  if (!Number.isFinite(rawScore) || rawScore <= 0 || maxRawScore <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((rawScore / maxRawScore) * 100)));
}

function dependencyLevelForScore(dependencyScore: number): WorkspaceDependencyLevel {
  if (dependencyScore >= 75) return "Critical";
  if (dependencyScore >= 50) return "High";
  if (dependencyScore >= 25) return "Medium";
  return "Low";
}

function dependencyReason(input: {
  incomingRelationshipCount: number;
  dependentObjectCount: number;
  dependencyLevel: WorkspaceDependencyLevel;
}): string {
  const incomingWord =
    input.incomingRelationshipCount === 1 ? "incoming relationship" : "incoming relationships";
  const dependentWord =
    input.dependentObjectCount === 1 ? "dependent object" : "dependent objects";
  const reliance =
    input.dependencyLevel === "Critical"
      ? "central dependency hub"
      : input.dependencyLevel === "High"
        ? "broad model reliance"
        : input.dependencyLevel === "Medium"
          ? "moderate model reliance"
          : "limited model reliance";
  return `${input.dependentObjectCount} ${dependentWord}; ${input.incomingRelationshipCount} ${incomingWord}; ${reliance}.`;
}

function rawDependencyScore(input: {
  incomingRelationshipCount: number;
  dependentObjectCount: number;
}): number {
  return input.incomingRelationshipCount * 0.65 + input.dependentObjectCount * 0.35;
}

function dependentObjectCountFor(
  objectId: string,
  relationships: ReturnType<typeof getWorkspaceRelationships>
): number {
  const dependents = new Set<string>();
  relationships.forEach((relationship) => {
    if (relationship.targetObjectId === objectId && relationship.sourceObjectId !== objectId) {
      dependents.add(relationship.sourceObjectId);
    }
  });
  return dependents.size;
}

function buildDependencyProfile(input: {
  profile: WorkspaceObjectIntelligenceProfile;
  dependentObjectCount: number;
  maxRawScore: number;
  calculatedAt: string;
}): WorkspaceDependencyRecord {
  const rawScore = rawDependencyScore({
    incomingRelationshipCount: input.profile.incomingRelationshipCount,
    dependentObjectCount: input.dependentObjectCount,
  });
  const dependencyScore = normalizeDependencyScore(rawScore, input.maxRawScore);
  const dependencyLevel = dependencyLevelForScore(dependencyScore);
  return freezeDependencyProfile(
    Object.freeze({
      contractVersion: WORKSPACE_DEPENDENCY_ENGINE_VERSION,
      objectId: input.profile.objectId,
      workspaceId: input.profile.workspaceId,
      dependencyScore,
      dependencyLevel,
      dependencyReason: dependencyReason({
        incomingRelationshipCount: input.profile.incomingRelationshipCount,
        dependentObjectCount: input.dependentObjectCount,
        dependencyLevel,
      }),
      incomingRelationshipCount: input.profile.incomingRelationshipCount,
      dependentObjectCount: input.dependentObjectCount,
      calculatedAt: input.calculatedAt,
      source: WORKSPACE_DEPENDENCY_ENGINE_SOURCE,
    })
  );
}

export function calculateObjectDependency(
  workspaceId: WorkspaceId
): CalculateObjectDependencyResult {
  hydrateDependencyProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      dependencyProfiles: Object.freeze([]),
      created: false,
      reason: "missing_workspace",
      message: "Provide a workspace before calculating object dependency.",
    });
  }

  const objectProfiles = getObjectIntelligenceProfiles(trimmedWorkspaceId);
  if (objectProfiles.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      dependencyProfiles: Object.freeze([]),
      created: false,
      reason: "no_object_intelligence_profiles",
      message: "Build object intelligence profiles before calculating dependency.",
    });
  }

  const impactProfileIds = new Set(
    getImpactProfiles(trimmedWorkspaceId).map((profile) => profile.objectId)
  );
  const relationships = getWorkspaceRelationships(trimmedWorkspaceId);
  const profileSignals = objectProfiles.map((profile) =>
    Object.freeze({
      profile,
      dependentObjectCount: dependentObjectCountFor(profile.objectId, relationships),
      impactReady: impactProfileIds.size === 0 || impactProfileIds.has(profile.objectId),
    })
  );
  const eligibleSignals = profileSignals.filter((signal) => signal.impactReady);
  const maxRawScore = Math.max(
    0,
    ...eligibleSignals.map((signal) =>
      rawDependencyScore({
        incomingRelationshipCount: signal.profile.incomingRelationshipCount,
        dependentObjectCount: signal.dependentObjectCount,
      })
    )
  );
  const calculatedAt = nowIso();
  const dependencyProfiles = eligibleSignals.map((signal) =>
    buildDependencyProfile({
      profile: signal.profile,
      dependentObjectCount: signal.dependentObjectCount,
      maxRawScore,
      calculatedAt,
    })
  );

  dependencyProfileStore = Object.freeze({
    ...dependencyProfileStore,
    [trimmedWorkspaceId]: Object.freeze(
      Object.fromEntries(dependencyProfiles.map((profile) => [profile.objectId, profile]))
    ),
  });
  commitDependencyProfileChange();
  dependencyProfiles.forEach(emitDependencyDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    dependencyProfiles: Object.freeze(dependencyProfiles.map(freezeDependencyProfile)),
    created: true,
    reason: "calculated",
    message: `${dependencyProfiles.length} dependency profile${dependencyProfiles.length === 1 ? "" : "s"} calculated.`,
  });
}

export function getDependencyProfiles(
  workspaceId: WorkspaceId
): readonly WorkspaceDependencyRecord[] {
  hydrateDependencyProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(dependencyProfileStore[trimmedWorkspaceId] ?? {}).map(freezeDependencyProfile)
  );
}

export function getDependencyProfile(
  workspaceId: WorkspaceId,
  objectId: string
): WorkspaceDependencyRecord | null {
  hydrateDependencyProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedObjectId = objectId.trim();
  if (!trimmedWorkspaceId || !trimmedObjectId) return null;
  const match = dependencyProfileStore[trimmedWorkspaceId]?.[trimmedObjectId] ?? null;
  return match ? freezeDependencyProfile(match) : null;
}

export function subscribeWorkspaceDependencyProfileRegistry(
  listener: DependencyProfileListener
): () => void {
  hydrateDependencyProfileStore();
  dependencyProfileListeners.add(listener);
  return () => dependencyProfileListeners.delete(listener);
}

export function getWorkspaceDependencyProfileRegistryVersion(): number {
  hydrateDependencyProfileStore();
  return dependencyProfileVersion;
}

export function resetWorkspaceDependencyProfileStoreForTests(): void {
  dependencyProfileStore = {};
  dependencyProfileHydrated = false;
  dependencyProfileVersion = 0;
  dependencyProfileListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
