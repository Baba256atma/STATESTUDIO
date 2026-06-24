/**
 * DS-5:1 — Workspace OKR intelligence foundation.
 * Foundation only — objective and key result definitions with persistence.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const WORKSPACE_OKR_VERSION = "DS-5:1" as const;

export const WORKSPACE_OKR_TAGS = Object.freeze([
  "[DS51_OKR_FOUNDATION]",
  "[OKR_INTELLIGENCE_FOUNDATION]",
  "[OBJECTIVES_READY]",
  "[KEY_RESULTS_READY]",
  "[OKR_STORAGE_READY]",
  "[DS52_READY]",
  "[DS_5_1_COMPLETE]",
] as const);

export const NEXORA_OKR_FOUNDATION_LOG_PREFIX = "[NexoraOkrFoundation]" as const;

export const WORKSPACE_OKR_SOURCE = "ds-5:1-foundation" as const;

export const WORKSPACE_OBJECTIVE_STORAGE_KEY = "nexora.workspaceObjectives.v1" as const;

export const WORKSPACE_KEY_RESULT_STORAGE_KEY = "nexora.workspaceKeyResults.v1" as const;

export type WorkspaceObjectiveStatus = "active" | "paused" | "completed" | "archived";

export type WorkspaceObjective = Readonly<{
  contractVersion: typeof WORKSPACE_OKR_VERSION;
  objectiveId: string;
  workspaceId: WorkspaceId;
  title: string;
  description: string;
  status: WorkspaceObjectiveStatus;
  createdAt: string;
  updatedAt: string;
  source: typeof WORKSPACE_OKR_SOURCE;
}>;

export type WorkspaceKeyResult = Readonly<{
  contractVersion: typeof WORKSPACE_OKR_VERSION;
  keyResultId: string;
  objectiveId: string;
  workspaceId: WorkspaceId;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
  source: typeof WORKSPACE_OKR_SOURCE;
}>;

export type WorkspaceObjectiveMap = Readonly<Record<string, WorkspaceObjective>>;

export type WorkspaceKeyResultMap = Readonly<Record<string, WorkspaceKeyResult>>;

export type WorkspaceObjectiveStore = Readonly<Record<WorkspaceId, WorkspaceObjectiveMap>>;

export type WorkspaceKeyResultStore = Readonly<Record<WorkspaceId, WorkspaceKeyResultMap>>;

export type CreateWorkspaceObjectiveInput = Readonly<{
  workspaceId: WorkspaceId;
  title: string;
  description?: string;
  status?: WorkspaceObjectiveStatus;
}>;

export type UpdateWorkspaceObjectiveInput = Readonly<{
  workspaceId: WorkspaceId;
  objectiveId: string;
  title?: string;
  description?: string;
  status?: WorkspaceObjectiveStatus;
}>;

export type CreateWorkspaceKeyResultInput = Readonly<{
  workspaceId: WorkspaceId;
  objectiveId: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  unit: string;
}>;

export type UpdateWorkspaceKeyResultInput = Readonly<{
  workspaceId: WorkspaceId;
  keyResultId: string;
  title?: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
}>;

export type WorkspaceObjectiveMutationResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  objective: WorkspaceObjective | null;
  reason: string;
  message: string;
}>;

export type DeleteWorkspaceObjectiveResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  objectiveId: string | null;
  deleted: boolean;
  reason: string;
  message: string;
}>;

export type WorkspaceKeyResultMutationResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  keyResult: WorkspaceKeyResult | null;
  reason: string;
  message: string;
}>;

export type DeleteWorkspaceKeyResultResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  keyResultId: string | null;
  deleted: boolean;
  reason: string;
  message: string;
}>;

const OBJECTIVE_STORAGE_KEY = WORKSPACE_OBJECTIVE_STORAGE_KEY;
const KEY_RESULT_STORAGE_KEY = WORKSPACE_KEY_RESULT_STORAGE_KEY;

const OBJECTIVE_STATUSES = new Set<WorkspaceObjectiveStatus>([
  "active",
  "paused",
  "completed",
  "archived",
]);

let workspaceObjectiveStore: WorkspaceObjectiveStore = {};
let workspaceKeyResultStore: WorkspaceKeyResultStore = {};
let workspaceObjectiveHydrated = false;
let workspaceKeyResultHydrated = false;
let workspaceOkrVersion = 0;

type WorkspaceOkrListener = () => void;

const workspaceOkrListeners = new Set<WorkspaceOkrListener>();

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
      .slice(0, 80) || "okr"
  );
}

function freezeObjective(objective: WorkspaceObjective): WorkspaceObjective {
  return Object.freeze({ ...objective });
}

function freezeKeyResult(keyResult: WorkspaceKeyResult): WorkspaceKeyResult {
  return Object.freeze({ ...keyResult });
}

function readObjectiveStorage(): WorkspaceObjectiveStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(OBJECTIVE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceObjectiveStore);
  } catch {
    return {};
  }
}

function readKeyResultStorage(): WorkspaceKeyResultStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY_RESULT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceKeyResultStore);
  } catch {
    return {};
  }
}

function writeObjectiveStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(OBJECTIVE_STORAGE_KEY, JSON.stringify(workspaceObjectiveStore));
  } catch {
    // Objective records remain available in-memory if storage is unavailable.
  }
}

function writeKeyResultStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY_RESULT_STORAGE_KEY, JSON.stringify(workspaceKeyResultStore));
  } catch {
    // Key result records remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceObjectiveStore(): void {
  if (workspaceObjectiveHydrated) return;
  workspaceObjectiveHydrated = true;
  workspaceObjectiveStore = readObjectiveStorage();
}

function hydrateWorkspaceKeyResultStore(): void {
  if (workspaceKeyResultHydrated) return;
  workspaceKeyResultHydrated = true;
  workspaceKeyResultStore = readKeyResultStorage();
}

function hydrateWorkspaceOkrStores(): void {
  hydrateWorkspaceObjectiveStore();
  hydrateWorkspaceKeyResultStore();
}

function notifyWorkspaceOkrListeners(): void {
  workspaceOkrVersion += 1;
  workspaceOkrListeners.forEach((listener) => listener());
}

function commitWorkspaceOkrChange(): void {
  writeObjectiveStorage();
  writeKeyResultStorage();
  notifyWorkspaceOkrListeners();
}

function emitOkrDiagnostic(input: {
  workspaceId: WorkspaceId;
  objectiveId?: string | null;
  keyResultId?: string | null;
  action: "created" | "updated" | "deleted";
}): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("okrFoundation", NEXORA_OKR_FOUNDATION_LOG_PREFIX, {
    workspaceId: input.workspaceId,
    objectiveId: input.objectiveId ?? null,
    keyResultId: input.keyResultId ?? null,
    action: input.action,
    tags: WORKSPACE_OKR_TAGS,
    phase: "DS-5:1",
  });
}

function buildObjectiveId(workspaceId: WorkspaceId, title: string, createdAt: string): string {
  return ["wobj", slugify(workspaceId), slugify(title), slugify(createdAt)].join("_");
}

function buildKeyResultId(
  workspaceId: WorkspaceId,
  objectiveId: string,
  title: string,
  createdAt: string
): string {
  return ["wkr", slugify(workspaceId), slugify(objectiveId), slugify(title), slugify(createdAt)].join("_");
}

function buildWorkspaceObjective(input: {
  workspaceId: WorkspaceId;
  title: string;
  description: string;
  status: WorkspaceObjectiveStatus;
  createdAt: string;
  updatedAt: string;
  objectiveId?: string;
}): WorkspaceObjective {
  return freezeObjective(
    Object.freeze({
      contractVersion: WORKSPACE_OKR_VERSION,
      objectiveId:
        input.objectiveId ??
        buildObjectiveId(input.workspaceId, input.title, input.createdAt),
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description,
      status: input.status,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      source: WORKSPACE_OKR_SOURCE,
    })
  );
}

function buildWorkspaceKeyResult(input: {
  workspaceId: WorkspaceId;
  objectiveId: string;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  createdAt: string;
  updatedAt: string;
  keyResultId?: string;
}): WorkspaceKeyResult {
  return freezeKeyResult(
    Object.freeze({
      contractVersion: WORKSPACE_OKR_VERSION,
      keyResultId:
        input.keyResultId ??
        buildKeyResultId(input.workspaceId, input.objectiveId, input.title, input.createdAt),
      objectiveId: input.objectiveId,
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description,
      targetValue: input.targetValue,
      currentValue: input.currentValue,
      unit: input.unit,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      source: WORKSPACE_OKR_SOURCE,
    })
  );
}

function validateObjectiveInput(input: {
  title?: string;
  status?: WorkspaceObjectiveStatus;
}): string | null {
  if (input.title !== undefined && !input.title.trim()) return "missing_title";
  if (input.status !== undefined && !OBJECTIVE_STATUSES.has(input.status)) return "invalid_status";
  return null;
}

function validateKeyResultInput(input: {
  title?: string;
  unit?: string;
  targetValue?: number;
  currentValue?: number;
}): string | null {
  if (input.title !== undefined && !input.title.trim()) return "missing_title";
  if (input.unit !== undefined && !input.unit.trim()) return "missing_unit";
  if (input.targetValue !== undefined && !Number.isFinite(input.targetValue)) {
    return "invalid_target_value";
  }
  if (input.currentValue !== undefined && !Number.isFinite(input.currentValue)) {
    return "invalid_current_value";
  }
  return null;
}

function removeKeyResultsForObjective(workspaceId: WorkspaceId, objectiveId: string): void {
  const existingMap = workspaceKeyResultStore[workspaceId] ?? {};
  const nextEntries = Object.entries(existingMap).filter(
    ([, keyResult]) => keyResult.objectiveId !== objectiveId
  );
  const nextStore = { ...workspaceKeyResultStore };
  if (nextEntries.length === 0) {
    delete nextStore[workspaceId];
  } else {
    nextStore[workspaceId] = Object.freeze(Object.fromEntries(nextEntries));
  }
  workspaceKeyResultStore = Object.freeze(nextStore);
}

export function createWorkspaceObjective(
  input: CreateWorkspaceObjectiveInput
): WorkspaceObjectiveMutationResult {
  hydrateWorkspaceOkrStores();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const validationError = validateObjectiveInput({
    title: input.title,
    status: input.status,
  });
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      objective: null,
      reason: "missing_workspace",
      message: "Provide a workspace before creating an objective.",
    });
  }
  if (validationError) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      objective: null,
      reason: validationError,
      message: "Objective input is invalid.",
    });
  }

  const timestamp = nowIso();
  const objective = buildWorkspaceObjective({
    workspaceId: trimmedWorkspaceId,
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    status: input.status ?? "active",
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const existingMap = workspaceObjectiveStore[trimmedWorkspaceId] ?? {};
  workspaceObjectiveStore = Object.freeze({
    ...workspaceObjectiveStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...existingMap,
      [objective.objectiveId]: objective,
    }),
  });
  commitWorkspaceOkrChange();
  emitOkrDiagnostic({
    workspaceId: trimmedWorkspaceId,
    objectiveId: objective.objectiveId,
    action: "created",
  });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    objective,
    reason: "created",
    message: `Objective "${objective.title}" created.`,
  });
}

export function updateWorkspaceObjective(
  input: UpdateWorkspaceObjectiveInput
): WorkspaceObjectiveMutationResult {
  hydrateWorkspaceOkrStores();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const trimmedObjectiveId = input.objectiveId.trim();
  if (!trimmedWorkspaceId || !trimmedObjectiveId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      objective: null,
      reason: "missing_identifier",
      message: "Provide workspace and objective identifiers before updating.",
    });
  }

  const existing = workspaceObjectiveStore[trimmedWorkspaceId]?.[trimmedObjectiveId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      objective: null,
      reason: "objective_not_found",
      message: "Objective not found for update.",
    });
  }

  const validationError = validateObjectiveInput({
    title: input.title,
    status: input.status,
  });
  if (validationError) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      objective: null,
      reason: validationError,
      message: "Objective update input is invalid.",
    });
  }

  const updatedAt = nowIso();
  const objective = freezeObjective(
    Object.freeze({
      ...existing,
      title: input.title?.trim() ?? existing.title,
      description: input.description?.trim() ?? existing.description,
      status: input.status ?? existing.status,
      updatedAt,
    })
  );

  workspaceObjectiveStore = Object.freeze({
    ...workspaceObjectiveStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...(workspaceObjectiveStore[trimmedWorkspaceId] ?? {}),
      [existing.objectiveId]: objective,
    }),
  });
  commitWorkspaceOkrChange();
  emitOkrDiagnostic({
    workspaceId: trimmedWorkspaceId,
    objectiveId: objective.objectiveId,
    action: "updated",
  });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    objective,
    reason: "updated",
    message: `Objective "${objective.title}" updated.`,
  });
}

export function deleteWorkspaceObjective(
  workspaceId: WorkspaceId,
  objectiveId: string
): DeleteWorkspaceObjectiveResult {
  hydrateWorkspaceOkrStores();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedObjectiveId = objectiveId.trim();
  if (!trimmedWorkspaceId || !trimmedObjectiveId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      objectiveId: trimmedObjectiveId || null,
      deleted: false,
      reason: "missing_identifier",
      message: "Provide workspace and objective identifiers before deleting.",
    });
  }

  const existingMap = workspaceObjectiveStore[trimmedWorkspaceId];
  const existing = existingMap?.[trimmedObjectiveId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      objectiveId: trimmedObjectiveId,
      deleted: false,
      reason: "objective_not_found",
      message: "Objective not found for deletion.",
    });
  }

  const nextObjectiveEntries = Object.entries(existingMap ?? {}).filter(
    ([id]) => id !== trimmedObjectiveId
  );
  const nextObjectiveStore = { ...workspaceObjectiveStore };
  if (nextObjectiveEntries.length === 0) {
    delete nextObjectiveStore[trimmedWorkspaceId];
  } else {
    nextObjectiveStore[trimmedWorkspaceId] = Object.freeze(Object.fromEntries(nextObjectiveEntries));
  }
  workspaceObjectiveStore = Object.freeze(nextObjectiveStore);
  removeKeyResultsForObjective(trimmedWorkspaceId, trimmedObjectiveId);
  commitWorkspaceOkrChange();
  emitOkrDiagnostic({
    workspaceId: trimmedWorkspaceId,
    objectiveId: trimmedObjectiveId,
    action: "deleted",
  });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    objectiveId: trimmedObjectiveId,
    deleted: true,
    reason: "deleted",
    message: `Objective "${existing.title}" deleted.`,
  });
}

export function getWorkspaceObjectives(workspaceId: WorkspaceId): readonly WorkspaceObjective[] {
  hydrateWorkspaceObjectiveStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceObjectiveStore[trimmedWorkspaceId] ?? {}).map(freezeObjective)
  );
}

export function getWorkspaceObjective(
  workspaceId: WorkspaceId,
  objectiveId: string
): WorkspaceObjective | null {
  hydrateWorkspaceObjectiveStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedObjectiveId = objectiveId.trim();
  if (!trimmedWorkspaceId || !trimmedObjectiveId) return null;
  const match = workspaceObjectiveStore[trimmedWorkspaceId]?.[trimmedObjectiveId] ?? null;
  return match ? freezeObjective(match) : null;
}

export function createWorkspaceKeyResult(
  input: CreateWorkspaceKeyResultInput
): WorkspaceKeyResultMutationResult {
  hydrateWorkspaceOkrStores();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const trimmedObjectiveId = input.objectiveId.trim();
  const validationError = validateKeyResultInput({
    title: input.title,
    unit: input.unit,
    targetValue: input.targetValue,
    currentValue: input.currentValue,
  });

  if (!trimmedWorkspaceId || !trimmedObjectiveId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      keyResult: null,
      reason: "missing_identifier",
      message: "Provide workspace and objective identifiers before creating a key result.",
    });
  }

  const objective = getWorkspaceObjective(trimmedWorkspaceId, trimmedObjectiveId);
  if (!objective) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      keyResult: null,
      reason: "objective_not_found",
      message: "Objective not found for key result creation.",
    });
  }

  if (validationError) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      keyResult: null,
      reason: validationError,
      message: "Key result input is invalid.",
    });
  }

  const timestamp = nowIso();
  const keyResult = buildWorkspaceKeyResult({
    workspaceId: trimmedWorkspaceId,
    objectiveId: trimmedObjectiveId,
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    targetValue: input.targetValue,
    currentValue: input.currentValue,
    unit: input.unit.trim(),
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const existingMap = workspaceKeyResultStore[trimmedWorkspaceId] ?? {};
  workspaceKeyResultStore = Object.freeze({
    ...workspaceKeyResultStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...existingMap,
      [keyResult.keyResultId]: keyResult,
    }),
  });
  commitWorkspaceOkrChange();
  emitOkrDiagnostic({
    workspaceId: trimmedWorkspaceId,
    objectiveId: trimmedObjectiveId,
    keyResultId: keyResult.keyResultId,
    action: "created",
  });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    keyResult,
    reason: "created",
    message: `Key result "${keyResult.title}" created.`,
  });
}

export function updateWorkspaceKeyResult(
  input: UpdateWorkspaceKeyResultInput
): WorkspaceKeyResultMutationResult {
  hydrateWorkspaceOkrStores();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const trimmedKeyResultId = input.keyResultId.trim();
  if (!trimmedWorkspaceId || !trimmedKeyResultId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      keyResult: null,
      reason: "missing_identifier",
      message: "Provide workspace and key result identifiers before updating.",
    });
  }

  const existing = workspaceKeyResultStore[trimmedWorkspaceId]?.[trimmedKeyResultId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      keyResult: null,
      reason: "key_result_not_found",
      message: "Key result not found for update.",
    });
  }

  const validationError = validateKeyResultInput({
    title: input.title,
    unit: input.unit,
    targetValue: input.targetValue,
    currentValue: input.currentValue,
  });
  if (validationError) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      keyResult: null,
      reason: validationError,
      message: "Key result update input is invalid.",
    });
  }

  const updatedAt = nowIso();
  const keyResult = freezeKeyResult(
    Object.freeze({
      ...existing,
      title: input.title?.trim() ?? existing.title,
      description: input.description?.trim() ?? existing.description,
      targetValue: input.targetValue ?? existing.targetValue,
      currentValue: input.currentValue ?? existing.currentValue,
      unit: input.unit?.trim() ?? existing.unit,
      updatedAt,
    })
  );

  workspaceKeyResultStore = Object.freeze({
    ...workspaceKeyResultStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...(workspaceKeyResultStore[trimmedWorkspaceId] ?? {}),
      [existing.keyResultId]: keyResult,
    }),
  });
  commitWorkspaceOkrChange();
  emitOkrDiagnostic({
    workspaceId: trimmedWorkspaceId,
    objectiveId: keyResult.objectiveId,
    keyResultId: keyResult.keyResultId,
    action: "updated",
  });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    keyResult,
    reason: "updated",
    message: `Key result "${keyResult.title}" updated.`,
  });
}

export function deleteWorkspaceKeyResult(
  workspaceId: WorkspaceId,
  keyResultId: string
): DeleteWorkspaceKeyResultResult {
  hydrateWorkspaceOkrStores();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedKeyResultId = keyResultId.trim();
  if (!trimmedWorkspaceId || !trimmedKeyResultId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      keyResultId: trimmedKeyResultId || null,
      deleted: false,
      reason: "missing_identifier",
      message: "Provide workspace and key result identifiers before deleting.",
    });
  }

  const existingMap = workspaceKeyResultStore[trimmedWorkspaceId];
  const existing = existingMap?.[trimmedKeyResultId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      keyResultId: trimmedKeyResultId,
      deleted: false,
      reason: "key_result_not_found",
      message: "Key result not found for deletion.",
    });
  }

  const nextEntries = Object.entries(existingMap ?? {}).filter(([id]) => id !== trimmedKeyResultId);
  const nextStore = { ...workspaceKeyResultStore };
  if (nextEntries.length === 0) {
    delete nextStore[trimmedWorkspaceId];
  } else {
    nextStore[trimmedWorkspaceId] = Object.freeze(Object.fromEntries(nextEntries));
  }
  workspaceKeyResultStore = Object.freeze(nextStore);
  commitWorkspaceOkrChange();
  emitOkrDiagnostic({
    workspaceId: trimmedWorkspaceId,
    objectiveId: existing.objectiveId,
    keyResultId: trimmedKeyResultId,
    action: "deleted",
  });

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    keyResultId: trimmedKeyResultId,
    deleted: true,
    reason: "deleted",
    message: `Key result "${existing.title}" deleted.`,
  });
}

export function getWorkspaceKeyResults(workspaceId: WorkspaceId): readonly WorkspaceKeyResult[] {
  hydrateWorkspaceKeyResultStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceKeyResultStore[trimmedWorkspaceId] ?? {}).map(freezeKeyResult)
  );
}

export function getWorkspaceKeyResult(
  workspaceId: WorkspaceId,
  keyResultId: string
): WorkspaceKeyResult | null {
  hydrateWorkspaceKeyResultStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedKeyResultId = keyResultId.trim();
  if (!trimmedWorkspaceId || !trimmedKeyResultId) return null;
  const match = workspaceKeyResultStore[trimmedWorkspaceId]?.[trimmedKeyResultId] ?? null;
  return match ? freezeKeyResult(match) : null;
}

export function getWorkspaceKeyResultsForObjective(
  workspaceId: WorkspaceId,
  objectiveId: string
): readonly WorkspaceKeyResult[] {
  const trimmedObjectiveId = objectiveId.trim();
  return Object.freeze(
    getWorkspaceKeyResults(workspaceId).filter(
      (keyResult) => keyResult.objectiveId === trimmedObjectiveId
    )
  );
}

export function subscribeWorkspaceOkrRegistry(listener: WorkspaceOkrListener): () => void {
  hydrateWorkspaceOkrStores();
  workspaceOkrListeners.add(listener);
  return () => workspaceOkrListeners.delete(listener);
}

export function getWorkspaceOkrRegistryVersion(): number {
  hydrateWorkspaceOkrStores();
  return workspaceOkrVersion;
}

export function resetWorkspaceOkrStoreForTests(): void {
  workspaceObjectiveStore = {};
  workspaceKeyResultStore = {};
  workspaceObjectiveHydrated = false;
  workspaceKeyResultHydrated = false;
  workspaceOkrVersion = 0;
  workspaceOkrListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(OBJECTIVE_STORAGE_KEY);
      window.localStorage.removeItem(KEY_RESULT_STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceOkrMemoryForTests(): void {
  workspaceObjectiveStore = {};
  workspaceKeyResultStore = {};
  workspaceObjectiveHydrated = false;
  workspaceKeyResultHydrated = false;
  workspaceOkrVersion = 0;
}
