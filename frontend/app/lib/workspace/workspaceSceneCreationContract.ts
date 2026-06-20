import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { SceneJson, SceneObject, Vector3Tuple } from "../sceneTypes.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import {
  getSceneHandoff,
  getWorkspaceModel,
  type WorkspaceModel,
  type WorkspaceObject,
} from "./workspaceApprovedModelContract.ts";

export const WORKSPACE_SCENE_CREATION_CONTRACT_VERSION = "NW-B:7" as const;

export type WorkspaceSceneObjectSource = "ApprovedModel";
export type WorkspaceSceneObjectStatus = "scene_ready";

export type WorkspaceSceneObject = SceneObject & {
  objectId: string;
  workspaceId: WorkspaceId;
  modelId: string;
  objectName: string;
  objectType: string;
  source: WorkspaceSceneObjectSource;
  position: Vector3Tuple;
  pos: Vector3Tuple;
  status: WorkspaceSceneObjectStatus;
  confidence: number;
};

export type WorkspaceSceneCreation = {
  contractVersion: typeof WORKSPACE_SCENE_CREATION_CONTRACT_VERSION;
  workspaceId: WorkspaceId;
  modelId: string;
  sceneObjectIds: readonly string[];
  sceneReady: boolean;
  createdAt: string;
  source: WorkspaceSceneObjectSource;
  metadata?: Readonly<Record<string, unknown>>;
};

type WorkspaceSceneListener = () => void;

const SCENE_OBJECT_STORAGE_KEY = "nexora.workspaceSceneObjects.v1";
const SCENE_CREATION_STORAGE_KEY = "nexora.workspaceSceneCreations.v1";

const workspaceSceneListeners = new Set<WorkspaceSceneListener>();

let workspaceSceneObjects: Record<WorkspaceId, readonly WorkspaceSceneObject[]> = {};
let workspaceSceneCreations: Record<WorkspaceId, WorkspaceSceneCreation> = {};
let workspaceSceneHydrated = false;
let workspaceSceneVersion = 0;

function emitSceneCreationDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("sceneCreation", `[SceneCreation] ${message}`, payload);
}

function notifyWorkspaceSceneListeners(): void {
  workspaceSceneVersion += 1;
  workspaceSceneListeners.forEach((listener) => listener());
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
    // Scene creation remains available in-memory if browser storage is unavailable.
  }
}

function hydrateWorkspaceSceneStore(): void {
  if (workspaceSceneHydrated) return;
  workspaceSceneHydrated = true;
  workspaceSceneObjects = readStorage<readonly WorkspaceSceneObject[]>(SCENE_OBJECT_STORAGE_KEY);
  workspaceSceneCreations = readStorage<WorkspaceSceneCreation>(SCENE_CREATION_STORAGE_KEY);
}

function writeAllStorage(): void {
  writeStorage(SCENE_OBJECT_STORAGE_KEY, workspaceSceneObjects);
  writeStorage(SCENE_CREATION_STORAGE_KEY, workspaceSceneCreations);
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function safePlacement(index: number, total: number): Vector3Tuple {
  if (total <= 1) return [0, 0, 0];
  const radius = Math.max(3.2, Math.min(8, total * 0.85));
  const angle = (Math.PI * 2 * index) / total;
  return [
    Number((Math.cos(angle) * radius).toFixed(3)),
    0,
    Number((Math.sin(angle) * radius).toFixed(3)),
  ];
}

function sceneColorForType(objectType: string): string {
  const normalized = objectType.trim().toLowerCase();
  if (normalized.includes("risk")) return "#f87171";
  if (normalized.includes("goal")) return "#38bdf8";
  if (normalized.includes("process")) return "#34d399";
  if (normalized.includes("data")) return "#a78bfa";
  return "#f8fafc";
}

export function adaptApprovedObjectToSceneObject(input: {
  object: WorkspaceObject;
  index: number;
  total: number;
}): WorkspaceSceneObject {
  const position = safePlacement(input.index, input.total);
  return Object.freeze({
    id: input.object.objectId,
    objectId: input.object.objectId,
    workspaceId: input.object.workspaceId,
    modelId: input.object.modelId,
    label: input.object.objectName,
    name: input.object.objectName,
    objectName: input.object.objectName,
    type: input.object.objectType,
    objectType: input.object.objectType,
    source: "ApprovedModel",
    position,
    pos: position,
    status: "scene_ready",
    confidence: input.object.confidence,
    color: sceneColorForType(input.object.objectType),
    scale: 1,
    role: input.object.objectType,
    semantic: Object.freeze({
      display_label: input.object.objectName,
      canonical_name: input.object.objectName,
      role: input.object.objectType,
      source: "ApprovedModel",
    }),
    metadata: Object.freeze({
      phase: "NW-B:7",
      approvedAt: input.object.approvedAt,
      approvedObjectSource: input.object.source,
      createsRelationships: false,
      createsKpis: false,
      createsRisks: false,
      createsScenarios: false,
    }),
  });
}

function buildWorkspaceSceneJson(input: {
  workspaceId: WorkspaceId;
  model: WorkspaceModel;
  objects: readonly WorkspaceSceneObject[];
  creation: WorkspaceSceneCreation;
}): SceneJson {
  return {
    state_vector: {},
    meta: {
      phase: "NW-B:7",
      workspaceId: input.workspaceId,
      modelId: input.model.modelId,
      workspaceSceneCreated: true,
      approvedModelScene: true,
      source: "ApprovedModel",
      sceneCreationContractVersion: WORKSPACE_SCENE_CREATION_CONTRACT_VERSION,
      sceneObjectCount: input.objects.length,
    },
    scene: {
      camera: { autoFrame: true },
      objects: [...input.objects],
      relationships: [],
      loops: [],
      animations: [],
    },
    workspace_model: {
      workspaceId: input.workspaceId,
      modelId: input.model.modelId,
      modelVersion: input.model.modelVersion,
      status: input.model.status,
      sceneCreatedAt: input.creation.createdAt,
    },
  } as SceneJson;
}

export function createWorkspaceSceneFromApprovedModel(input: {
  workspaceId?: WorkspaceId | null;
  createdAt?: string;
} = {}): WorkspaceSceneCreation | null {
  hydrateWorkspaceSceneStore();
  const workspaceId = resolveWorkspaceId(input.workspaceId);
  if (!workspaceId) return null;

  const model = getWorkspaceModel(workspaceId);
  const sceneHandoff = getSceneHandoff(workspaceId);
  if (!model || model.status !== "approved" || sceneHandoff?.sceneReady !== true) return null;

  const existingCreation = workspaceSceneCreations[workspaceId];
  const existingObjects = workspaceSceneObjects[workspaceId] ?? [];
  if (
    existingCreation?.modelId === model.modelId &&
    existingCreation.sceneReady === true &&
    existingObjects.length === model.approvedObjects.length
  ) {
    return existingCreation;
  }

  const createdAt = input.createdAt ?? new Date().toISOString();
  const sceneObjects = Object.freeze(
    model.approvedObjects.map((object, index) =>
      adaptApprovedObjectToSceneObject({
        object,
        index,
        total: model.approvedObjects.length,
      })
    )
  );
  const creation: WorkspaceSceneCreation = Object.freeze({
    contractVersion: WORKSPACE_SCENE_CREATION_CONTRACT_VERSION,
    workspaceId,
    modelId: model.modelId,
    sceneObjectIds: Object.freeze(sceneObjects.map((object) => object.objectId)),
    sceneReady: true,
    createdAt,
    source: "ApprovedModel",
    metadata: Object.freeze({
      phase: "NW-B:7",
      placement: "safe_circular",
      relationshipsCreated: false,
      kpisCreated: false,
      risksCreated: false,
      scenariosCreated: false,
    }),
  });

  workspaceSceneObjects = {
    ...workspaceSceneObjects,
    [workspaceId]: sceneObjects,
  };
  workspaceSceneCreations = {
    ...workspaceSceneCreations,
    [workspaceId]: creation,
  };
  writeAllStorage();
  emitSceneCreationDiagnostic("Scene Creation Complete", {
    Workspace: workspaceId,
    Model: model.modelId,
    "Scene Objects Created": sceneObjects.length,
  });
  notifyWorkspaceSceneListeners();
  return creation;
}

export function getWorkspaceSceneObjects(workspaceId?: WorkspaceId | null): readonly WorkspaceSceneObject[] {
  hydrateWorkspaceSceneStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return [];
  return workspaceSceneObjects[resolvedWorkspaceId] ?? [];
}

export function getWorkspaceSceneCreation(workspaceId?: WorkspaceId | null): WorkspaceSceneCreation | null {
  hydrateWorkspaceSceneStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;
  return workspaceSceneCreations[resolvedWorkspaceId] ?? null;
}

export function getWorkspaceSceneJson(workspaceId?: WorkspaceId | null): SceneJson | null {
  hydrateWorkspaceSceneStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;
  const model = getWorkspaceModel(resolvedWorkspaceId);
  const creation = workspaceSceneCreations[resolvedWorkspaceId];
  const objects = workspaceSceneObjects[resolvedWorkspaceId] ?? [];
  if (!model || !creation || creation.sceneReady !== true || objects.length === 0) return null;
  return buildWorkspaceSceneJson({
    workspaceId: resolvedWorkspaceId,
    model,
    objects,
    creation,
  });
}

export function subscribeWorkspaceScenes(listener: WorkspaceSceneListener): () => void {
  hydrateWorkspaceSceneStore();
  workspaceSceneListeners.add(listener);
  return () => workspaceSceneListeners.delete(listener);
}

export function getWorkspaceSceneVersionSnapshot(): number {
  hydrateWorkspaceSceneStore();
  return workspaceSceneVersion;
}

export function resetWorkspaceScenesForTests(): void {
  workspaceSceneObjects = {};
  workspaceSceneCreations = {};
  workspaceSceneHydrated = true;
  workspaceSceneVersion = 0;
  workspaceSceneListeners.clear();
}
