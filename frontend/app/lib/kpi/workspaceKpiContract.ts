/**
 * DS-4:1 — Workspace KPI intelligence foundation.
 * Foundation only — KPI definitions, profiles, and persistence.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const WORKSPACE_KPI_VERSION = "DS-4:1" as const;

export const WORKSPACE_KPI_TAGS = Object.freeze([
  "[DS41_KPI_FOUNDATION]",
  "[KPI_INTELLIGENCE_FOUNDATION]",
  "[KPI_STORAGE_READY]",
  "[DS42_READY]",
  "[DS_4_1_COMPLETE]",
] as const);

export const NEXORA_WORKSPACE_KPI_LOG_PREFIX = "[NexoraWorkspaceKpi]" as const;

export const WORKSPACE_KPI_SOURCE = "ds-4:1-foundation" as const;

export const WORKSPACE_KPI_STORAGE_KEY = "nexora.workspaceKpis.v1" as const;

export type WorkspaceKpiStatus = "healthy" | "warning" | "critical" | "unknown";

export type WorkspaceKpi = Readonly<{
  contractVersion: typeof WORKSPACE_KPI_VERSION;
  kpiId: string;
  workspaceId: WorkspaceId;
  name: string;
  description: string;
  unit: string;
  targetValue: number;
  currentValue: number;
  status: WorkspaceKpiStatus;
  createdAt: string;
  updatedAt: string;
  source: typeof WORKSPACE_KPI_SOURCE;
}>;

export type WorkspaceKpiMap = Readonly<Record<string, WorkspaceKpi>>;

export type WorkspaceKpiStore = Readonly<Record<WorkspaceId, WorkspaceKpiMap>>;

export type CreateWorkspaceKpiInput = Readonly<{
  workspaceId: WorkspaceId;
  name: string;
  description?: string;
  unit: string;
  targetValue: number;
  currentValue: number;
}>;

export type UpdateWorkspaceKpiInput = Readonly<{
  workspaceId: WorkspaceId;
  kpiId: string;
  name?: string;
  description?: string;
  unit?: string;
  targetValue?: number;
  currentValue?: number;
}>;

export type WorkspaceKpiMutationResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  kpi: WorkspaceKpi | null;
  reason: string;
  message: string;
}>;

export type DeleteWorkspaceKpiResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  kpiId: string | null;
  deleted: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = WORKSPACE_KPI_STORAGE_KEY;
const WARNING_THRESHOLD = 0.85;

let workspaceKpiStore: WorkspaceKpiStore = {};
let workspaceKpiHydrated = false;
let workspaceKpiVersion = 0;

type WorkspaceKpiListener = () => void;

const workspaceKpiListeners = new Set<WorkspaceKpiListener>();

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
      .slice(0, 80) || "kpi"
  );
}

function freezeKpi(kpi: WorkspaceKpi): WorkspaceKpi {
  return Object.freeze({ ...kpi });
}

function readStorage(): WorkspaceKpiStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceKpiStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceKpiStore));
  } catch {
    // KPI records remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceKpiStore(): void {
  if (workspaceKpiHydrated) return;
  workspaceKpiHydrated = true;
  workspaceKpiStore = readStorage();
}

function notifyWorkspaceKpiListeners(): void {
  workspaceKpiVersion += 1;
  workspaceKpiListeners.forEach((listener) => listener());
}

function commitWorkspaceKpiChange(): void {
  writeStorage();
  notifyWorkspaceKpiListeners();
}

function emitWorkspaceKpiDiagnostic(kpi: WorkspaceKpi, action: "created" | "updated" | "deleted"): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("workspaceKpi", NEXORA_WORKSPACE_KPI_LOG_PREFIX, {
    workspaceId: kpi.workspaceId,
    kpiId: kpi.kpiId,
    name: kpi.name,
    status: kpi.status,
    targetValue: kpi.targetValue,
    currentValue: kpi.currentValue,
    action,
    tags: WORKSPACE_KPI_TAGS,
    phase: "DS-4:1",
  });
}

export function deriveWorkspaceKpiStatus(
  currentValue: number,
  targetValue: number
): WorkspaceKpiStatus {
  if (!Number.isFinite(currentValue) || !Number.isFinite(targetValue) || targetValue === 0) {
    return "unknown";
  }
  if (currentValue >= targetValue) return "healthy";
  if (currentValue / targetValue >= WARNING_THRESHOLD) return "warning";
  return "critical";
}

function buildKpiId(workspaceId: WorkspaceId, name: string, createdAt: string): string {
  return ["wkpi", slugify(workspaceId), slugify(name), slugify(createdAt)].join("_");
}

function buildWorkspaceKpi(input: {
  workspaceId: WorkspaceId;
  name: string;
  description: string;
  unit: string;
  targetValue: number;
  currentValue: number;
  createdAt: string;
  updatedAt: string;
}): WorkspaceKpi {
  const status = deriveWorkspaceKpiStatus(input.currentValue, input.targetValue);
  return freezeKpi(
    Object.freeze({
      contractVersion: WORKSPACE_KPI_VERSION,
      kpiId: buildKpiId(input.workspaceId, input.name, input.createdAt),
      workspaceId: input.workspaceId,
      name: input.name,
      description: input.description,
      unit: input.unit,
      targetValue: input.targetValue,
      currentValue: input.currentValue,
      status,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      source: WORKSPACE_KPI_SOURCE,
    })
  );
}

function validateKpiInput(input: {
  name?: string;
  unit?: string;
  targetValue?: number;
  currentValue?: number;
}): string | null {
  if (input.name !== undefined && !input.name.trim()) return "missing_name";
  if (input.unit !== undefined && !input.unit.trim()) return "missing_unit";
  if (input.targetValue !== undefined && !Number.isFinite(input.targetValue)) {
    return "invalid_target_value";
  }
  if (input.currentValue !== undefined && !Number.isFinite(input.currentValue)) {
    return "invalid_current_value";
  }
  return null;
}

export function createWorkspaceKpi(input: CreateWorkspaceKpiInput): WorkspaceKpiMutationResult {
  hydrateWorkspaceKpiStore();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const validationError = validateKpiInput({
    name: input.name,
    unit: input.unit,
    targetValue: input.targetValue,
    currentValue: input.currentValue,
  });
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      kpi: null,
      reason: "missing_workspace",
      message: "Provide a workspace before creating a KPI.",
    });
  }
  if (validationError) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      kpi: null,
      reason: validationError,
      message: "KPI input is invalid.",
    });
  }

  const timestamp = nowIso();
  const kpi = buildWorkspaceKpi({
    workspaceId: trimmedWorkspaceId,
    name: input.name.trim(),
    description: input.description?.trim() ?? "",
    unit: input.unit.trim(),
    targetValue: input.targetValue,
    currentValue: input.currentValue,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const existingMap = workspaceKpiStore[trimmedWorkspaceId] ?? {};
  workspaceKpiStore = Object.freeze({
    ...workspaceKpiStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...existingMap,
      [kpi.kpiId]: kpi,
    }),
  });
  commitWorkspaceKpiChange();
  emitWorkspaceKpiDiagnostic(kpi, "created");

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    kpi,
    reason: "created",
    message: `KPI "${kpi.name}" created.`,
  });
}

export function updateWorkspaceKpi(input: UpdateWorkspaceKpiInput): WorkspaceKpiMutationResult {
  hydrateWorkspaceKpiStore();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const trimmedKpiId = input.kpiId.trim();
  if (!trimmedWorkspaceId || !trimmedKpiId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      kpi: null,
      reason: "missing_identifier",
      message: "Provide workspace and KPI identifiers before updating.",
    });
  }

  const existing = workspaceKpiStore[trimmedWorkspaceId]?.[trimmedKpiId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      kpi: null,
      reason: "kpi_not_found",
      message: "KPI not found for update.",
    });
  }

  const validationError = validateKpiInput({
    name: input.name,
    unit: input.unit,
    targetValue: input.targetValue,
    currentValue: input.currentValue,
  });
  if (validationError) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      kpi: null,
      reason: validationError,
      message: "KPI update input is invalid.",
    });
  }

  const nextTargetValue = input.targetValue ?? existing.targetValue;
  const nextCurrentValue = input.currentValue ?? existing.currentValue;
  const updatedAt = nowIso();
  const kpi = buildWorkspaceKpi({
    workspaceId: trimmedWorkspaceId,
    name: input.name?.trim() ?? existing.name,
    description: input.description?.trim() ?? existing.description,
    unit: input.unit?.trim() ?? existing.unit,
    targetValue: nextTargetValue,
    currentValue: nextCurrentValue,
    createdAt: existing.createdAt,
    updatedAt,
  });

  const nextKpi = freezeKpi(
    Object.freeze({
      ...kpi,
      kpiId: existing.kpiId,
    })
  );

  workspaceKpiStore = Object.freeze({
    ...workspaceKpiStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...(workspaceKpiStore[trimmedWorkspaceId] ?? {}),
      [existing.kpiId]: nextKpi,
    }),
  });
  commitWorkspaceKpiChange();
  emitWorkspaceKpiDiagnostic(nextKpi, "updated");

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    kpi: nextKpi,
    reason: "updated",
    message: `KPI "${nextKpi.name}" updated.`,
  });
}

export function deleteWorkspaceKpi(
  workspaceId: WorkspaceId,
  kpiId: string
): DeleteWorkspaceKpiResult {
  hydrateWorkspaceKpiStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedKpiId = kpiId.trim();
  if (!trimmedWorkspaceId || !trimmedKpiId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      kpiId: trimmedKpiId || null,
      deleted: false,
      reason: "missing_identifier",
      message: "Provide workspace and KPI identifiers before deleting.",
    });
  }

  const existingMap = workspaceKpiStore[trimmedWorkspaceId];
  const existing = existingMap?.[trimmedKpiId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      kpiId: trimmedKpiId,
      deleted: false,
      reason: "kpi_not_found",
      message: "KPI not found for deletion.",
    });
  }

  const nextEntries = Object.entries(existingMap ?? {}).filter(([id]) => id !== trimmedKpiId);
  const nextStore = { ...workspaceKpiStore };
  if (nextEntries.length === 0) {
    delete nextStore[trimmedWorkspaceId];
  } else {
    nextStore[trimmedWorkspaceId] = Object.freeze(Object.fromEntries(nextEntries));
  }
  workspaceKpiStore = Object.freeze(nextStore);
  commitWorkspaceKpiChange();
  emitWorkspaceKpiDiagnostic(existing, "deleted");

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    kpiId: trimmedKpiId,
    deleted: true,
    reason: "deleted",
    message: `KPI "${existing.name}" deleted.`,
  });
}

export function getWorkspaceKpis(workspaceId: WorkspaceId): readonly WorkspaceKpi[] {
  hydrateWorkspaceKpiStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceKpiStore[trimmedWorkspaceId] ?? {}).map(freezeKpi)
  );
}

export function getWorkspaceKpi(
  workspaceId: WorkspaceId,
  kpiId: string
): WorkspaceKpi | null {
  hydrateWorkspaceKpiStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedKpiId = kpiId.trim();
  if (!trimmedWorkspaceId || !trimmedKpiId) return null;
  const match = workspaceKpiStore[trimmedWorkspaceId]?.[trimmedKpiId] ?? null;
  return match ? freezeKpi(match) : null;
}

export function subscribeWorkspaceKpiRegistry(listener: WorkspaceKpiListener): () => void {
  hydrateWorkspaceKpiStore();
  workspaceKpiListeners.add(listener);
  return () => workspaceKpiListeners.delete(listener);
}

export function getWorkspaceKpiRegistryVersion(): number {
  hydrateWorkspaceKpiStore();
  return workspaceKpiVersion;
}

export function resetWorkspaceKpiStoreForTests(): void {
  workspaceKpiStore = {};
  workspaceKpiHydrated = false;
  workspaceKpiVersion = 0;
  workspaceKpiListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceKpiMemoryForTests(): void {
  workspaceKpiStore = {};
  workspaceKpiHydrated = false;
  workspaceKpiVersion = 0;
}
