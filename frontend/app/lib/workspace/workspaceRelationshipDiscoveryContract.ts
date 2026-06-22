import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { NexoraRelationship, NexoraRelationshipType } from "../relationships/relationshipTypes.ts";
import type { SceneJson } from "../sceneTypes.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import { getWorkspaceGoals } from "./workspaceGoalContract.ts";
import { getWorkspaceModel, type WorkspaceModel } from "./workspaceApprovedModelContract.ts";
import { getWorkspaceSituation } from "./workspaceSituationContract.ts";
import {
  getWorkspaceSceneCreation,
  getWorkspaceSceneJson,
  getWorkspaceSceneVersionSnapshot,
} from "./workspaceSceneCreationContract.ts";
import {
  generateWorkspaceRelationshipCandidates,
  type GeneratedWorkspaceRelationshipCandidate,
  type WorkspaceRelationshipType,
} from "./workspaceRelationshipDiscoveryRules.ts";
import {
  logRelationshipSceneJsonCacheHit,
  logRelationshipSceneJsonCacheMiss,
  logRelationshipSceneJsonCacheUpdated,
} from "../scene/relationshipSceneJsonCacheDevLog.ts";
import {
  logRelationshipAdaptationCacheHit,
  logRelationshipAdaptationCacheMiss,
  logRelationshipAdaptationsAdapted,
} from "../scene/relationshipAdaptationCacheDevLog.ts";

export type { WorkspaceRelationshipType } from "./workspaceRelationshipDiscoveryRules.ts";

export const WORKSPACE_RELATIONSHIP_DISCOVERY_CONTRACT_VERSION = "NW-B:8-1" as const;

export const WORKSPACE_RELATIONSHIP_DISCOVERY_TAGS = Object.freeze([
  "NWB81_RELATIONSHIP_DISCOVERY",
  "WORKSPACE_RELATIONSHIPS_CREATED",
  "RELATIONSHIP_INTELLIGENCE_FOUNDATION",
  "NW_B8_COMPLETE",
]);

export type WorkspaceDiscoveredRelationship = {
  contractVersion: typeof WORKSPACE_RELATIONSHIP_DISCOVERY_CONTRACT_VERSION;
  relationshipId: string;
  workspaceId: WorkspaceId;
  modelId: string;
  sourceObjectId: string;
  targetObjectId: string;
  sourceObjectName: string;
  targetObjectName: string;
  relationshipType: WorkspaceRelationshipType;
  confidence: number;
  reason: string;
  createdAt: string;
  metadata?: Readonly<Record<string, unknown>>;
};

export type WorkspaceRelationshipDiscovery = {
  contractVersion: typeof WORKSPACE_RELATIONSHIP_DISCOVERY_CONTRACT_VERSION;
  workspaceId: WorkspaceId;
  modelId: string;
  relationshipIds: readonly string[];
  relationshipsCreated: boolean;
  createdAt: string;
  metadata?: Readonly<Record<string, unknown>>;
};

type WorkspaceRelationshipListener = () => void;

const RELATIONSHIP_STORAGE_KEY = "nexora.workspaceDiscoveredRelationships.v1";
const DISCOVERY_STORAGE_KEY = "nexora.workspaceRelationshipDiscoveries.v1";

const workspaceRelationshipListeners = new Set<WorkspaceRelationshipListener>();

let workspaceDiscoveredRelationships: Record<WorkspaceId, readonly WorkspaceDiscoveredRelationship[]> = {};
let workspaceRelationshipDiscoveries: Record<WorkspaceId, WorkspaceRelationshipDiscovery> = {};
let workspaceRelationshipHydrated = false;
let workspaceRelationshipVersion = 0;

type WorkspaceSceneJsonWithRelationshipsCacheEntry = Readonly<{
  cacheKey: string;
  sceneJson: SceneJson;
}>;

let workspaceSceneJsonWithRelationshipsCache: Record<
  WorkspaceId,
  WorkspaceSceneJsonWithRelationshipsCacheEntry
> = {};

type WorkspaceAdaptedRelationshipsCacheEntry = Readonly<{
  cacheKey: string;
  relationships: readonly NexoraRelationship[];
}>;

let workspaceAdaptedRelationshipsCache: Record<
  WorkspaceId,
  WorkspaceAdaptedRelationshipsCacheEntry
> = {};

function emitRelationshipDiscoveryDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("relationshipDiscovery", `[RelationshipDiscovery] ${message}`, {
    ...payload,
    tags: WORKSPACE_RELATIONSHIP_DISCOVERY_TAGS,
  });
}

function notifyWorkspaceRelationshipListeners(): void {
  workspaceRelationshipVersion += 1;
  workspaceRelationshipListeners.forEach((listener) => listener());
}

function readStorage<T>(storageKey: string): Record<WorkspaceId, T> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, T>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeStorage(storageKey: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Relationship discovery remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceRelationshipStore(): void {
  if (workspaceRelationshipHydrated) return;
  workspaceRelationshipHydrated = true;
  workspaceDiscoveredRelationships = readStorage<readonly WorkspaceDiscoveredRelationship[]>(RELATIONSHIP_STORAGE_KEY);
  workspaceRelationshipDiscoveries = readStorage<WorkspaceRelationshipDiscovery>(DISCOVERY_STORAGE_KEY);
}

function writeAllStorage(): void {
  writeStorage(RELATIONSHIP_STORAGE_KEY, workspaceDiscoveredRelationships);
  writeStorage(DISCOVERY_STORAGE_KEY, workspaceRelationshipDiscoveries);
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function mapWorkspaceRelationshipTypeToNexora(type: WorkspaceRelationshipType): NexoraRelationshipType {
  switch (type) {
    case "depends_on":
      return "dependency";
    case "feeds":
      return "flow";
    case "constrains":
      return "blocks";
    case "influences":
      return "influences";
    case "supports":
      return "supports";
    default:
      return "dependency";
  }
}

function buildRelationshipId(
  sourceObjectId: string,
  targetObjectId: string,
  relationshipType: WorkspaceRelationshipType
): string {
  return `rel_${slugify(sourceObjectId)}_${slugify(targetObjectId)}_${relationshipType}`;
}

function candidateToRelationship(
  workspaceId: WorkspaceId,
  model: WorkspaceModel,
  candidate: GeneratedWorkspaceRelationshipCandidate,
  createdAt: string
): WorkspaceDiscoveredRelationship {
  return Object.freeze({
    contractVersion: WORKSPACE_RELATIONSHIP_DISCOVERY_CONTRACT_VERSION,
    relationshipId: buildRelationshipId(
      candidate.sourceObjectId,
      candidate.targetObjectId,
      candidate.relationshipType
    ),
    workspaceId,
    modelId: model.modelId,
    sourceObjectId: candidate.sourceObjectId,
    targetObjectId: candidate.targetObjectId,
    sourceObjectName: candidate.sourceObjectName,
    targetObjectName: candidate.targetObjectName,
    relationshipType: candidate.relationshipType,
    confidence: Number(candidate.confidence.toFixed(2)),
    reason: candidate.reason,
    createdAt,
    metadata: Object.freeze({
      ruleId: candidate.ruleId,
      phase: "NW-B:8-1",
    }),
  });
}

export function adaptDiscoveredRelationshipToNexoraRelationship(
  relationship: WorkspaceDiscoveredRelationship
): NexoraRelationship {
  return Object.freeze({
    id: relationship.relationshipId,
    sourceId: relationship.sourceObjectId,
    targetId: relationship.targetObjectId,
    type: mapWorkspaceRelationshipTypeToNexora(relationship.relationshipType),
    direction: "uni",
    createdAt: relationship.createdAt,
    metadata: Object.freeze({
      confidence: relationship.confidence,
      reason: relationship.reason,
      workspaceRelationshipType: relationship.relationshipType,
      sourceObjectName: relationship.sourceObjectName,
      targetObjectName: relationship.targetObjectName,
      workspaceId: relationship.workspaceId,
      modelId: relationship.modelId,
      phase: "NW-B:8-1",
    }),
  });
}

export function generateWorkspaceDiscoveredRelationships(input: {
  model: WorkspaceModel;
  situationText: string;
  goals: readonly import("./workspaceGoalContract.ts").WorkspaceGoal[];
  createdAt?: string;
}): readonly WorkspaceDiscoveredRelationship[] {
  const createdAt = input.createdAt ?? new Date().toISOString();
  const candidates = generateWorkspaceRelationshipCandidates({
    domainId: input.model.domainId,
    situationText: input.situationText,
    goals: input.goals,
    objects: input.model.approvedObjects,
  });

  return Object.freeze(
    candidates.map((candidate) =>
      candidateToRelationship(input.model.workspaceId, input.model, candidate, createdAt)
    )
  );
}

export function createWorkspaceRelationshipsFromApprovedModel(input: {
  workspaceId?: WorkspaceId | null;
  createdAt?: string;
} = {}): WorkspaceRelationshipDiscovery | null {
  hydrateWorkspaceRelationshipStore();
  const workspaceId = resolveWorkspaceId(input.workspaceId);
  if (!workspaceId) return null;

  const model = getWorkspaceModel(workspaceId);
  const sceneCreation = getWorkspaceSceneCreation(workspaceId);
  if (!model || model.status !== "approved" || sceneCreation?.sceneReady !== true) return null;

  const existingDiscovery = workspaceRelationshipDiscoveries[workspaceId];
  const existingRelationships = workspaceDiscoveredRelationships[workspaceId] ?? [];
  if (
    existingDiscovery?.modelId === model.modelId &&
    existingDiscovery.relationshipsCreated === true &&
    String(existingDiscovery.metadata?.objectCount ?? "") === String(model.approvedObjects.length)
  ) {
    return existingDiscovery;
  }

  const createdAt = input.createdAt ?? new Date().toISOString();
  const situationText = getWorkspaceSituation(workspaceId)?.situationText ?? "";
  const goals = getWorkspaceGoals(workspaceId);
  const generated = generateWorkspaceDiscoveredRelationships({
    model,
    situationText,
    goals,
    createdAt,
  });

  const previousIds = new Set(existingRelationships.map((relationship) => relationship.relationshipId));
  const nextIds = new Set(generated.map((relationship) => relationship.relationshipId));

  for (const relationship of generated) {
    if (!previousIds.has(relationship.relationshipId)) {
      emitRelationshipDiscoveryDiagnostic("Relationship Added", {
        relationshipId: relationship.relationshipId,
        sourceObjectId: relationship.sourceObjectId,
        targetObjectId: relationship.targetObjectId,
        relationshipType: relationship.relationshipType,
      });
    }
  }

  for (const relationship of existingRelationships) {
    if (!nextIds.has(relationship.relationshipId)) {
      emitRelationshipDiscoveryDiagnostic("Relationship Removed", {
        relationshipId: relationship.relationshipId,
        sourceObjectId: relationship.sourceObjectId,
        targetObjectId: relationship.targetObjectId,
      });
    }
  }

  const discovery: WorkspaceRelationshipDiscovery = Object.freeze({
    contractVersion: WORKSPACE_RELATIONSHIP_DISCOVERY_CONTRACT_VERSION,
    workspaceId,
    modelId: model.modelId,
    relationshipIds: Object.freeze(generated.map((relationship) => relationship.relationshipId)),
    relationshipsCreated: generated.length > 0,
    createdAt,
    metadata: Object.freeze({
      phase: "NW-B:8-1",
      objectCount: model.approvedObjects.length,
      relationshipCount: generated.length,
      domainId: model.domainId,
      kpisCreated: false,
      risksCreated: false,
      scenariosCreated: false,
    }),
  });

  workspaceDiscoveredRelationships = {
    ...workspaceDiscoveredRelationships,
    [workspaceId]: generated,
  };
  workspaceRelationshipDiscoveries = {
    ...workspaceRelationshipDiscoveries,
    [workspaceId]: discovery,
  };
  writeAllStorage();

  emitRelationshipDiscoveryDiagnostic("Relationships Generated", {
    Workspace: workspaceId,
    Model: model.modelId,
    Objects: model.approvedObjects.length,
    Relationships: generated.length,
  });
  notifyWorkspaceRelationshipListeners();
  return discovery;
}

export function getWorkspaceDiscoveredRelationships(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceDiscoveredRelationship[] {
  hydrateWorkspaceRelationshipStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return [];
  return workspaceDiscoveredRelationships[resolvedWorkspaceId] ?? [];
}

export function getWorkspaceRelationshipDiscovery(
  workspaceId?: WorkspaceId | null
): WorkspaceRelationshipDiscovery | null {
  hydrateWorkspaceRelationshipStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;
  return workspaceRelationshipDiscoveries[resolvedWorkspaceId] ?? null;
}

function buildRelationshipIdsSignature(
  relationships: readonly WorkspaceDiscoveredRelationship[]
): string {
  if (relationships.length === 0) return "none";
  return relationships
    .map((relationship) => relationship.relationshipId)
    .sort()
    .join("|");
}

function buildBaseSceneIdentity(baseScene: SceneJson): string {
  const objects = baseScene.scene?.objects ?? [];
  const objectIds = objects
    .map((object) => {
      const record = object as { id?: string; objectId?: string; name?: string };
      return record.objectId ?? record.id ?? record.name ?? "";
    })
    .join("|");
  return [
    String(baseScene.meta?.workspaceId ?? ""),
    String(baseScene.meta?.phase ?? ""),
    String(baseScene.meta?.modelId ?? ""),
    String(objects.length),
    objectIds,
  ].join(":");
}

export function buildRelationshipAdaptationCacheKey(input: {
  workspaceId: WorkspaceId;
  relationshipVersion: number;
  relationships: readonly WorkspaceDiscoveredRelationship[];
}): string {
  return [
    input.workspaceId,
    String(input.relationshipVersion),
    buildRelationshipIdsSignature(input.relationships),
  ].join("::");
}

export function getWorkspaceAdaptedNexoraRelationships(
  workspaceId?: WorkspaceId | null
): readonly NexoraRelationship[] {
  hydrateWorkspaceRelationshipStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return Object.freeze([]);

  const relationships = getWorkspaceDiscoveredRelationships(resolvedWorkspaceId);
  const cacheKey = buildRelationshipAdaptationCacheKey({
    workspaceId: resolvedWorkspaceId,
    relationshipVersion: workspaceRelationshipVersion,
    relationships,
  });

  const cached = workspaceAdaptedRelationshipsCache[resolvedWorkspaceId];
  if (cached?.cacheKey === cacheKey) {
    logRelationshipAdaptationCacheHit(resolvedWorkspaceId);
    return cached.relationships;
  }

  logRelationshipAdaptationCacheMiss(resolvedWorkspaceId);

  const adapted = Object.freeze(
    relationships.map(adaptDiscoveredRelationshipToNexoraRelationship)
  );

  workspaceAdaptedRelationshipsCache = {
    ...workspaceAdaptedRelationshipsCache,
    [resolvedWorkspaceId]: Object.freeze({
      cacheKey,
      relationships: adapted,
    }),
  };

  logRelationshipAdaptationsAdapted(resolvedWorkspaceId, adapted.length);
  return adapted;
}

export function buildWorkspaceSceneJsonWithRelationshipsCacheKey(input: {
  workspaceId: WorkspaceId;
  baseScene: SceneJson;
  baseSceneVersion: number;
  relationshipVersion: number;
  relationships: readonly WorkspaceDiscoveredRelationship[];
  modelId: string | null;
}): string {
  return [
    input.workspaceId,
    String(input.baseSceneVersion),
    buildBaseSceneIdentity(input.baseScene),
    String(input.relationshipVersion),
    buildRelationshipIdsSignature(input.relationships),
    input.modelId ?? "none",
  ].join("::");
}

function buildWorkspaceSceneJsonWithRelationships(input: {
  baseScene: SceneJson;
  nexoraRelationships: readonly NexoraRelationship[];
  discovery: WorkspaceRelationshipDiscovery | null;
}): SceneJson {
  return Object.freeze({
    ...input.baseScene,
    meta: Object.freeze({
      ...(input.baseScene.meta ?? {}),
      relationshipsCreated: input.discovery?.relationshipsCreated === true,
      relationshipCount: input.nexoraRelationships.length,
      relationshipDiscoveryContractVersion: WORKSPACE_RELATIONSHIP_DISCOVERY_CONTRACT_VERSION,
    }),
    scene: Object.freeze({
      ...input.baseScene.scene,
      relationships: input.nexoraRelationships,
    }),
  }) as SceneJson;
}

export function getWorkspaceSceneJsonWithRelationships(workspaceId?: WorkspaceId | null): SceneJson | null {
  hydrateWorkspaceRelationshipStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;

  const baseScene = getWorkspaceSceneJson(resolvedWorkspaceId);
  if (!baseScene) return null;

  const relationships = getWorkspaceDiscoveredRelationships(resolvedWorkspaceId);
  const discovery = getWorkspaceRelationshipDiscovery(resolvedWorkspaceId);
  const modelId = discovery?.modelId ?? getWorkspaceModel(resolvedWorkspaceId)?.modelId ?? null;
  const cacheKey = buildWorkspaceSceneJsonWithRelationshipsCacheKey({
    workspaceId: resolvedWorkspaceId,
    baseScene,
    baseSceneVersion: getWorkspaceSceneVersionSnapshot(),
    relationshipVersion: workspaceRelationshipVersion,
    relationships,
    modelId,
  });

  const cached = workspaceSceneJsonWithRelationshipsCache[resolvedWorkspaceId];
  if (cached?.cacheKey === cacheKey) {
    logRelationshipSceneJsonCacheHit(resolvedWorkspaceId);
    return cached.sceneJson;
  }

  logRelationshipSceneJsonCacheMiss(resolvedWorkspaceId);

  const nexoraRelationships = getWorkspaceAdaptedNexoraRelationships(resolvedWorkspaceId);
  const sceneJson = buildWorkspaceSceneJsonWithRelationships({
    baseScene,
    nexoraRelationships,
    discovery,
  });

  workspaceSceneJsonWithRelationshipsCache = {
    ...workspaceSceneJsonWithRelationshipsCache,
    [resolvedWorkspaceId]: Object.freeze({
      cacheKey,
      sceneJson,
    }),
  };

  logRelationshipSceneJsonCacheUpdated(resolvedWorkspaceId);
  return sceneJson;
}

export function subscribeWorkspaceRelationships(listener: WorkspaceRelationshipListener): () => void {
  hydrateWorkspaceRelationshipStore();
  workspaceRelationshipListeners.add(listener);
  return () => workspaceRelationshipListeners.delete(listener);
}

export function getWorkspaceRelationshipVersionSnapshot(): number {
  hydrateWorkspaceRelationshipStore();
  return workspaceRelationshipVersion;
}

export function resetWorkspaceRelationshipsForTests(): void {
  workspaceDiscoveredRelationships = {};
  workspaceRelationshipDiscoveries = {};
  workspaceSceneJsonWithRelationshipsCache = {};
  workspaceAdaptedRelationshipsCache = {};
  workspaceRelationshipHydrated = true;
  workspaceRelationshipVersion = 0;
  workspaceRelationshipListeners.clear();
}
