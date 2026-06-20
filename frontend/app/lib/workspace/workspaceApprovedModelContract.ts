import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import type { WorkspaceDomainId } from "./workspaceDomainContract.ts";
import {
  approveWorkspaceDraftModel,
  type WorkspaceDraftModel,
  type WorkspaceDraftObject,
  type WorkspaceDraftObjectSource,
} from "./workspaceDraftModelContract.ts";

export const WORKSPACE_MODEL_CONTRACT_VERSION = "NW-B:6" as const;
export const SCENE_HANDOFF_CONTRACT_VERSION = "NW-B:6" as const;

export type WorkspaceModelStatus = "draft" | "approved";
export type WorkspaceObjectSource = WorkspaceDraftObjectSource;

export type WorkspaceObject = {
  workspaceId: WorkspaceId;
  modelId: string;
  objectId: string;
  objectName: string;
  objectType: string;
  confidence: number;
  source: WorkspaceObjectSource;
  approvedAt: string;
  metadata?: Record<string, unknown>;
};

export type WorkspaceModel = {
  contractVersion: typeof WORKSPACE_MODEL_CONTRACT_VERSION;
  workspaceId: WorkspaceId;
  modelId: string;
  domainId: WorkspaceDomainId;
  situationId: string;
  goalIds: readonly string[];
  approvedAt: string;
  modelVersion: number;
  status: WorkspaceModelStatus;
  approvedObjects: readonly WorkspaceObject[];
  sourceDraftVersion: number;
  metadata?: Record<string, unknown>;
};

export type SceneHandoff = {
  contractVersion: typeof SCENE_HANDOFF_CONTRACT_VERSION;
  workspaceId: WorkspaceId;
  modelId: string;
  approvedObjectIds: readonly string[];
  sceneReady: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

type WorkspaceModelListener = () => void;

const MODEL_STORAGE_KEY = "nexora.workspaceModels.v1";
const OBJECT_STORAGE_KEY = "nexora.workspaceObjectRegistry.v1";
const SCENE_HANDOFF_STORAGE_KEY = "nexora.sceneHandoffs.v1";
const workspaceModelListeners = new Set<WorkspaceModelListener>();

let workspaceModels: Record<WorkspaceId, WorkspaceModel> = {};
let workspaceObjectRegistry: Record<WorkspaceId, readonly WorkspaceObject[]> = {};
let sceneHandoffs: Record<WorkspaceId, SceneHandoff> = {};
let modelStoreHydrated = false;
let workspaceModelVersion = 0;

function emitModelApprovalDiagnostic(message: string, payload?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("modelApproval", `[ModelApproval] ${message}`, payload);
}

function notifyWorkspaceModelListeners(): void {
  workspaceModelVersion += 1;
  workspaceModelListeners.forEach((listener) => listener());
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
    // Approved model state remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceModelStore(): void {
  if (modelStoreHydrated) return;
  modelStoreHydrated = true;
  workspaceModels = readStorage<WorkspaceModel>(MODEL_STORAGE_KEY);
  workspaceObjectRegistry = readStorage<readonly WorkspaceObject[]>(OBJECT_STORAGE_KEY);
  sceneHandoffs = readStorage<SceneHandoff>(SCENE_HANDOFF_STORAGE_KEY);
}

function writeAllStorage(): void {
  writeStorage(MODEL_STORAGE_KEY, workspaceModels);
  writeStorage(OBJECT_STORAGE_KEY, workspaceObjectRegistry);
  writeStorage(SCENE_HANDOFF_STORAGE_KEY, sceneHandoffs);
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function slugify(value: string): string {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "workspace_model";
}

function modelIdForDraft(draft: WorkspaceDraftModel): string {
  return `model_${slugify(draft.workspaceId)}_v1`;
}

function promoteDraftObject(input: {
  workspaceId: WorkspaceId;
  modelId: string;
  approvedAt: string;
  object: WorkspaceDraftObject;
}): WorkspaceObject {
  return Object.freeze({
    workspaceId: input.workspaceId,
    modelId: input.modelId,
    objectId: input.object.objectId,
    objectName: input.object.objectName,
    objectType: input.object.objectType,
    confidence: input.object.confidence,
    source: input.object.source,
    approvedAt: input.approvedAt,
    metadata: Object.freeze({
      phase: "NW-B:6",
      promotedFrom: "draft_object",
    }),
  });
}

export function approveWorkspaceModelFromDraft(input: {
  draft: WorkspaceDraftModel;
  approvedAt?: string;
}): {
  model: WorkspaceModel;
  objects: readonly WorkspaceObject[];
  sceneHandoff: SceneHandoff;
} {
  hydrateWorkspaceModelStore();
  const approvedAt = input.approvedAt ?? new Date().toISOString();
  const modelId = modelIdForDraft(input.draft);
  const approvedObjects = Object.freeze(
    input.draft.objects.map((object) =>
      promoteDraftObject({
        workspaceId: input.draft.workspaceId,
        modelId,
        approvedAt,
        object,
      })
    )
  );
  const model: WorkspaceModel = Object.freeze({
    contractVersion: WORKSPACE_MODEL_CONTRACT_VERSION,
    workspaceId: input.draft.workspaceId,
    modelId,
    domainId: input.draft.domainId,
    situationId: input.draft.situationId,
    goalIds: Object.freeze([...input.draft.goalIds]),
    approvedAt,
    modelVersion: 1,
    status: "approved",
    approvedObjects,
    sourceDraftVersion: input.draft.draftVersion,
    metadata: Object.freeze({
      phase: "NW-B:6",
      revisionReadyFor: ["draft_v2", "draft_v3", "model_evolution"],
    }),
  });
  const sceneHandoff: SceneHandoff = Object.freeze({
    contractVersion: SCENE_HANDOFF_CONTRACT_VERSION,
    workspaceId: input.draft.workspaceId,
    modelId,
    approvedObjectIds: Object.freeze(approvedObjects.map((object) => object.objectId)),
    sceneReady: true,
    createdAt: approvedAt,
    metadata: Object.freeze({
      phase: "NW-B:6",
      next: "NW-B:7 Scene Creation",
      createsTopology: false,
    }),
  });

  workspaceModels = {
    ...workspaceModels,
    [input.draft.workspaceId]: model,
  };
  workspaceObjectRegistry = {
    ...workspaceObjectRegistry,
    [input.draft.workspaceId]: approvedObjects,
  };
  sceneHandoffs = {
    ...sceneHandoffs,
    [input.draft.workspaceId]: sceneHandoff,
  };
  writeAllStorage();
  approveWorkspaceDraftModel(input.draft.workspaceId);
  emitModelApprovalDiagnostic("Draft Approved", {
    Workspace: input.draft.workspaceId,
    "Objects Promoted": approvedObjects.length,
    "Model Version": "v1",
  });
  emitModelApprovalDiagnostic("Scene Handoff Ready", {
    Workspace: input.draft.workspaceId,
    modelId,
    sceneReady: true,
  });
  notifyWorkspaceModelListeners();

  return { model, objects: approvedObjects, sceneHandoff };
}

export function subscribeWorkspaceModels(listener: WorkspaceModelListener): () => void {
  hydrateWorkspaceModelStore();
  workspaceModelListeners.add(listener);
  return () => workspaceModelListeners.delete(listener);
}

export function getWorkspaceModelVersionSnapshot(): number {
  hydrateWorkspaceModelStore();
  return workspaceModelVersion;
}

export function getWorkspaceModel(workspaceId?: WorkspaceId | null): WorkspaceModel | null {
  hydrateWorkspaceModelStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;
  return workspaceModels[resolvedWorkspaceId] ?? null;
}

export function getWorkspaceObjects(workspaceId?: WorkspaceId | null): readonly WorkspaceObject[] {
  hydrateWorkspaceModelStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return [];
  return workspaceObjectRegistry[resolvedWorkspaceId] ?? [];
}

export function getSceneHandoff(workspaceId?: WorkspaceId | null): SceneHandoff | null {
  hydrateWorkspaceModelStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return null;
  return sceneHandoffs[resolvedWorkspaceId] ?? null;
}

export function getWorkspaceModelSnapshot(): Readonly<Record<WorkspaceId, WorkspaceModel>> {
  hydrateWorkspaceModelStore();
  return Object.freeze({ ...workspaceModels });
}

export function resetWorkspaceModelsForTests(): void {
  workspaceModels = {};
  workspaceObjectRegistry = {};
  sceneHandoffs = {};
  modelStoreHydrated = true;
  workspaceModelVersion = 0;
  workspaceModelListeners.clear();
}

