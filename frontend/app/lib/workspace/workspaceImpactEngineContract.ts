/**
 * DS-3:2 — Workspace impact engine.
 * Impact only — deterministic object impact scoring from DS-3:1 profiles.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import {
  getObjectIntelligenceProfiles,
  type WorkspaceObjectIntelligenceProfile,
} from "./workspaceObjectIntelligenceContract.ts";
import { getWorkspaceRelationships } from "./workspaceRelationshipCreationContract.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_IMPACT_ENGINE_VERSION = "DS-3:2" as const;

export const WORKSPACE_IMPACT_ENGINE_TAGS = Object.freeze([
  "[DS32_IMPACT_ENGINE]",
  "[OBJECT_IMPACT_READY]",
  "[IMPACT_SCORE_PERSISTED]",
  "[OBJECT_INTELLIGENCE_EXPANDED]",
  "[DS33_READY]",
  "[DS_3_2_COMPLETE]",
] as const);

export const NEXORA_IMPACT_ENGINE_LOG_PREFIX = "[NexoraImpactEngine]" as const;

export const WORKSPACE_IMPACT_ENGINE_SOURCE = "ds-3:2-impact" as const;

export type WorkspaceImpactLevel = "Low" | "Medium" | "High" | "Critical";

export type WorkspaceImpactRecord = Readonly<{
  contractVersion: typeof WORKSPACE_IMPACT_ENGINE_VERSION;
  objectId: string;
  workspaceId: WorkspaceId;
  impactScore: number;
  impactLevel: WorkspaceImpactLevel;
  impactReason: string;
  relationshipCount: number;
  connectedObjectCount: number;
  calculatedAt: string;
  source: typeof WORKSPACE_IMPACT_ENGINE_SOURCE;
}>;

export type WorkspaceImpactProfileMap = Readonly<Record<string, WorkspaceImpactRecord>>;

export type WorkspaceImpactProfileStore = Readonly<Record<WorkspaceId, WorkspaceImpactProfileMap>>;

export type CalculateObjectImpactResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  impactProfiles: readonly WorkspaceImpactRecord[];
  created: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = "nexora.workspaceImpactProfiles.v1";

let impactProfileStore: WorkspaceImpactProfileStore = {};
let impactProfileHydrated = false;
let impactProfileVersion = 0;

type ImpactProfileListener = () => void;

const impactProfileListeners = new Set<ImpactProfileListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function freezeImpactProfile(profile: WorkspaceImpactRecord): WorkspaceImpactRecord {
  return Object.freeze({ ...profile });
}

function readStorage(): WorkspaceImpactProfileStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceImpactProfileStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(impactProfileStore));
  } catch {
    // Impact profiles remain available in-memory if storage is unavailable.
  }
}

function hydrateImpactProfileStore(): void {
  if (impactProfileHydrated) return;
  impactProfileHydrated = true;
  impactProfileStore = readStorage();
}

function notifyImpactProfileListeners(): void {
  impactProfileVersion += 1;
  impactProfileListeners.forEach((listener) => listener());
}

function commitImpactProfileChange(): void {
  writeStorage();
  notifyImpactProfileListeners();
}

function emitImpactDiagnostic(profile: WorkspaceImpactRecord): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("impactEngine", NEXORA_IMPACT_ENGINE_LOG_PREFIX, {
    workspaceId: profile.workspaceId,
    objectId: profile.objectId,
    impactScore: profile.impactScore,
    impactLevel: profile.impactLevel,
    relationshipCount: profile.relationshipCount,
    connectedObjectCount: profile.connectedObjectCount,
    tags: WORKSPACE_IMPACT_ENGINE_TAGS,
    phase: "DS-3:2",
  });
}

function normalizeImpactScore(rawScore: number, maxRawScore: number): number {
  if (!Number.isFinite(rawScore) || rawScore <= 0 || maxRawScore <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((rawScore / maxRawScore) * 100)));
}

function impactLevelForScore(impactScore: number): WorkspaceImpactLevel {
  if (impactScore >= 75) return "Critical";
  if (impactScore >= 50) return "High";
  if (impactScore >= 25) return "Medium";
  return "Low";
}

function impactReason(input: {
  relationshipCount: number;
  connectedObjectCount: number;
  impactLevel: WorkspaceImpactLevel;
}): string {
  const relationshipWord = input.relationshipCount === 1 ? "relationship" : "relationships";
  const objectWord = input.connectedObjectCount === 1 ? "connected object" : "connected objects";
  const influence =
    input.impactLevel === "Critical"
      ? "central model position"
      : input.impactLevel === "High"
        ? "broad model influence"
        : input.impactLevel === "Medium"
          ? "moderate influence"
          : "limited influence";
  return `${input.relationshipCount} ${relationshipWord}; ${input.connectedObjectCount} ${objectWord}; ${influence}.`;
}

function rawImpactScore(profile: WorkspaceObjectIntelligenceProfile): number {
  return profile.relationshipCount * 0.6 + profile.connectedObjectCount * 0.4;
}

function buildImpactProfile(input: {
  profile: WorkspaceObjectIntelligenceProfile;
  maxRawScore: number;
  calculatedAt: string;
}): WorkspaceImpactRecord {
  const impactScore = normalizeImpactScore(rawImpactScore(input.profile), input.maxRawScore);
  const impactLevel = impactLevelForScore(impactScore);
  return freezeImpactProfile(
    Object.freeze({
      contractVersion: WORKSPACE_IMPACT_ENGINE_VERSION,
      objectId: input.profile.objectId,
      workspaceId: input.profile.workspaceId,
      impactScore,
      impactLevel,
      impactReason: impactReason({
        relationshipCount: input.profile.relationshipCount,
        connectedObjectCount: input.profile.connectedObjectCount,
        impactLevel,
      }),
      relationshipCount: input.profile.relationshipCount,
      connectedObjectCount: input.profile.connectedObjectCount,
      calculatedAt: input.calculatedAt,
      source: WORKSPACE_IMPACT_ENGINE_SOURCE,
    })
  );
}

export function calculateObjectImpact(workspaceId: WorkspaceId): CalculateObjectImpactResult {
  hydrateImpactProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      impactProfiles: Object.freeze([]),
      created: false,
      reason: "missing_workspace",
      message: "Provide a workspace before calculating object impact.",
    });
  }

  const objectProfiles = getObjectIntelligenceProfiles(trimmedWorkspaceId);
  if (objectProfiles.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      impactProfiles: Object.freeze([]),
      created: false,
      reason: "no_object_intelligence_profiles",
      message: "Build object intelligence profiles before calculating impact.",
    });
  }

  const relationshipObjectIds = new Set(
    getWorkspaceRelationships(trimmedWorkspaceId).flatMap((relationship) => [
      relationship.sourceObjectId,
      relationship.targetObjectId,
    ])
  );
  const profileIds = new Set(objectProfiles.map((profile) => profile.objectId));
  const filteredProfiles = objectProfiles.filter(
    (profile) => profileIds.has(profile.objectId) && (relationshipObjectIds.size === 0 || profile.workspaceId === trimmedWorkspaceId)
  );
  const maxRawScore = Math.max(0, ...filteredProfiles.map(rawImpactScore));
  const calculatedAt = nowIso();
  const impactProfiles = filteredProfiles.map((profile) =>
    buildImpactProfile({ profile, maxRawScore, calculatedAt })
  );

  impactProfileStore = Object.freeze({
    ...impactProfileStore,
    [trimmedWorkspaceId]: Object.freeze(
      Object.fromEntries(impactProfiles.map((profile) => [profile.objectId, profile]))
    ),
  });
  commitImpactProfileChange();
  impactProfiles.forEach(emitImpactDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    impactProfiles: Object.freeze(impactProfiles.map(freezeImpactProfile)),
    created: true,
    reason: "calculated",
    message: `${impactProfiles.length} impact profile${impactProfiles.length === 1 ? "" : "s"} calculated.`,
  });
}

export function getImpactProfiles(workspaceId: WorkspaceId): readonly WorkspaceImpactRecord[] {
  hydrateImpactProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(impactProfileStore[trimmedWorkspaceId] ?? {}).map(freezeImpactProfile)
  );
}

export function getImpactProfile(
  workspaceId: WorkspaceId,
  objectId: string
): WorkspaceImpactRecord | null {
  hydrateImpactProfileStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedObjectId = objectId.trim();
  if (!trimmedWorkspaceId || !trimmedObjectId) return null;
  const match = impactProfileStore[trimmedWorkspaceId]?.[trimmedObjectId] ?? null;
  return match ? freezeImpactProfile(match) : null;
}

export function subscribeWorkspaceImpactProfileRegistry(
  listener: ImpactProfileListener
): () => void {
  hydrateImpactProfileStore();
  impactProfileListeners.add(listener);
  return () => impactProfileListeners.delete(listener);
}

export function getWorkspaceImpactProfileRegistryVersion(): number {
  hydrateImpactProfileStore();
  return impactProfileVersion;
}

export function resetWorkspaceImpactProfileStoreForTests(): void {
  impactProfileStore = {};
  impactProfileHydrated = false;
  impactProfileVersion = 0;
  impactProfileListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
