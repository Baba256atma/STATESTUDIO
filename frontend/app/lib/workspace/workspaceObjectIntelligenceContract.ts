/**
 * DS-3:1 — Workspace object intelligence foundation.
 * Foundation only — relationship metrics, identity preservation, and persistence.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceCreatedObject } from "./workspaceObjectCreationContract.ts";
import { getWorkspaceCreatedObjects } from "./workspaceObjectCreationPipeline.ts";
import {
  getWorkspaceRelationships,
  type WorkspaceRelationship,
} from "./workspaceRelationshipCreationContract.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_OBJECT_INTELLIGENCE_VERSION = "DS-3:1" as const;

export const WORKSPACE_OBJECT_INTELLIGENCE_TAGS = Object.freeze([
  "[DS31_OBJECT_INTELLIGENCE]",
  "[OBJECT_INTELLIGENCE_FOUNDATION]",
  "[OBJECT_PROFILE_PERSISTED]",
  "[OBJECT_RELATIONSHIP_METRICS_READY]",
  "[DS32_READY]",
  "[DS_3_1_COMPLETE]",
] as const);

export const NEXORA_OBJECT_INTELLIGENCE_LOG_PREFIX =
  "[NexoraObjectIntelligence]" as const;

export const WORKSPACE_OBJECT_INTELLIGENCE_SOURCE = "ds-3:1-foundation" as const;

export type WorkspaceObjectIntelligenceStatus = "ready";

export type WorkspaceObjectIntelligenceProfile = Readonly<{
  contractVersion: typeof WORKSPACE_OBJECT_INTELLIGENCE_VERSION;
  objectId: string;
  workspaceId: WorkspaceId;
  objectName: string;
  objectType: string;
  originCandidateId: string | null;
  originWorkspaceObjectId: string | null;
  relationshipCount: number;
  incomingRelationshipCount: number;
  outgoingRelationshipCount: number;
  connectedObjectCount: number;
  intelligenceStatus: WorkspaceObjectIntelligenceStatus;
  createdAt: string;
  updatedAt: string;
  source: typeof WORKSPACE_OBJECT_INTELLIGENCE_SOURCE;
}>;

export type WorkspaceObjectIntelligenceProfileMap = Readonly<
  Record<string, WorkspaceObjectIntelligenceProfile>
>;

export type WorkspaceObjectIntelligenceStore = Readonly<
  Record<WorkspaceId, WorkspaceObjectIntelligenceProfileMap>
>;

export type BuildObjectIntelligenceProfilesResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  profiles: readonly WorkspaceObjectIntelligenceProfile[];
  created: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = "nexora.workspaceObjectIntelligenceProfiles.v1";

let objectIntelligenceStore: WorkspaceObjectIntelligenceStore = {};
let objectIntelligenceHydrated = false;
let objectIntelligenceVersion = 0;

type ObjectIntelligenceListener = () => void;

const objectIntelligenceListeners = new Set<ObjectIntelligenceListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function freezeProfile(
  profile: WorkspaceObjectIntelligenceProfile
): WorkspaceObjectIntelligenceProfile {
  return Object.freeze({ ...profile });
}

function readStorage(): WorkspaceObjectIntelligenceStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceObjectIntelligenceStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(objectIntelligenceStore));
  } catch {
    // Object intelligence remains available in-memory if storage is unavailable.
  }
}

function hydrateObjectIntelligenceStore(): void {
  if (objectIntelligenceHydrated) return;
  objectIntelligenceHydrated = true;
  objectIntelligenceStore = readStorage();
}

function notifyObjectIntelligenceListeners(): void {
  objectIntelligenceVersion += 1;
  objectIntelligenceListeners.forEach((listener) => listener());
}

function commitObjectIntelligenceChange(): void {
  writeStorage();
  notifyObjectIntelligenceListeners();
}

function emitObjectIntelligenceDiagnostic(
  profile: WorkspaceObjectIntelligenceProfile
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("objectIntelligence", NEXORA_OBJECT_INTELLIGENCE_LOG_PREFIX, {
    workspaceId: profile.workspaceId,
    objectId: profile.objectId,
    relationshipCount: profile.relationshipCount,
    incomingRelationshipCount: profile.incomingRelationshipCount,
    outgoingRelationshipCount: profile.outgoingRelationshipCount,
    connectedObjectCount: profile.connectedObjectCount,
    tags: WORKSPACE_OBJECT_INTELLIGENCE_TAGS,
    phase: "DS-3:1",
  });
}

function objectRelationships(
  objectId: string,
  relationships: readonly WorkspaceRelationship[]
): readonly WorkspaceRelationship[] {
  return Object.freeze(
    relationships.filter(
      (relationship) =>
        relationship.sourceObjectId === objectId || relationship.targetObjectId === objectId
    )
  );
}

function buildProfile(input: {
  object: WorkspaceCreatedObject;
  relationships: readonly WorkspaceRelationship[];
  previous?: WorkspaceObjectIntelligenceProfile;
  timestamp: string;
}): WorkspaceObjectIntelligenceProfile {
  const relationships = objectRelationships(input.object.objectId, input.relationships);
  const incomingRelationshipCount = relationships.filter(
    (relationship) => relationship.targetObjectId === input.object.objectId
  ).length;
  const outgoingRelationshipCount = relationships.filter(
    (relationship) => relationship.sourceObjectId === input.object.objectId
  ).length;
  const connectedObjects = new Set<string>();
  relationships.forEach((relationship) => {
    if (relationship.sourceObjectId !== input.object.objectId) {
      connectedObjects.add(relationship.sourceObjectId);
    }
    if (relationship.targetObjectId !== input.object.objectId) {
      connectedObjects.add(relationship.targetObjectId);
    }
  });

  return freezeProfile(
    Object.freeze({
      contractVersion: WORKSPACE_OBJECT_INTELLIGENCE_VERSION,
      objectId: input.object.objectId,
      workspaceId: input.object.workspaceId,
      objectName: input.object.objectName,
      objectType: input.object.objectType,
      originCandidateId: input.object.originCandidateId ?? null,
      originWorkspaceObjectId: input.object.objectId,
      relationshipCount: relationships.length,
      incomingRelationshipCount,
      outgoingRelationshipCount,
      connectedObjectCount: connectedObjects.size,
      intelligenceStatus: "ready",
      createdAt: input.previous?.createdAt ?? input.timestamp,
      updatedAt: input.timestamp,
      source: WORKSPACE_OBJECT_INTELLIGENCE_SOURCE,
    })
  );
}

export function buildObjectIntelligenceProfiles(
  workspaceId: WorkspaceId
): BuildObjectIntelligenceProfilesResult {
  hydrateObjectIntelligenceStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      profiles: Object.freeze([]),
      created: false,
      reason: "missing_workspace",
      message: "Provide a workspace before building object intelligence profiles.",
    });
  }

  const objects = getWorkspaceCreatedObjects(trimmedWorkspaceId);
  if (objects.length === 0) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      profiles: Object.freeze([]),
      created: false,
      reason: "no_workspace_objects",
      message: "Create workspace objects before building object intelligence profiles.",
    });
  }

  const relationships = getWorkspaceRelationships(trimmedWorkspaceId);
  const previousMap = objectIntelligenceStore[trimmedWorkspaceId] ?? Object.freeze({});
  const timestamp = nowIso();
  const profiles = objects.map((object) =>
    buildProfile({
      object,
      relationships,
      previous: previousMap[object.objectId],
      timestamp,
    })
  );

  objectIntelligenceStore = Object.freeze({
    ...objectIntelligenceStore,
    [trimmedWorkspaceId]: Object.freeze(
      Object.fromEntries(profiles.map((profile) => [profile.objectId, profile]))
    ),
  });
  commitObjectIntelligenceChange();
  profiles.forEach(emitObjectIntelligenceDiagnostic);

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    profiles: Object.freeze(profiles.map(freezeProfile)),
    created: true,
    reason: "built",
    message: `${profiles.length} object intelligence profile${profiles.length === 1 ? "" : "s"} built.`,
  });
}

export function getObjectIntelligenceProfiles(
  workspaceId: WorkspaceId
): readonly WorkspaceObjectIntelligenceProfile[] {
  hydrateObjectIntelligenceStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(objectIntelligenceStore[trimmedWorkspaceId] ?? {}).map(freezeProfile)
  );
}

export function getObjectIntelligenceProfile(
  workspaceId: WorkspaceId,
  objectId: string
): WorkspaceObjectIntelligenceProfile | null {
  hydrateObjectIntelligenceStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedObjectId = objectId.trim();
  if (!trimmedWorkspaceId || !trimmedObjectId) return null;
  const match = objectIntelligenceStore[trimmedWorkspaceId]?.[trimmedObjectId] ?? null;
  return match ? freezeProfile(match) : null;
}

export function subscribeWorkspaceObjectIntelligenceRegistry(
  listener: ObjectIntelligenceListener
): () => void {
  hydrateObjectIntelligenceStore();
  objectIntelligenceListeners.add(listener);
  return () => objectIntelligenceListeners.delete(listener);
}

export function getWorkspaceObjectIntelligenceRegistryVersion(): number {
  hydrateObjectIntelligenceStore();
  return objectIntelligenceVersion;
}

export function resetWorkspaceObjectIntelligenceStoreForTests(): void {
  objectIntelligenceStore = {};
  objectIntelligenceHydrated = false;
  objectIntelligenceVersion = 0;
  objectIntelligenceListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
