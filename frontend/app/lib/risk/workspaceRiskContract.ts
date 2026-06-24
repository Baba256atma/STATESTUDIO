/**
 * DS-6:1 — Workspace risk intelligence foundation.
 * Foundation only — risk definitions, registry, and persistence.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const WORKSPACE_RISK_VERSION = "DS-6:1" as const;

export const WORKSPACE_RISK_TAGS = Object.freeze([
  "[DS61_RISK_FOUNDATION]",
  "[RISK_INTELLIGENCE_FOUNDATION]",
  "[RISK_STORAGE_READY]",
  "[RISK_CRUD_READY]",
  "[DS62_READY]",
  "[DS_6_1_COMPLETE]",
] as const);

export const NEXORA_RISK_FOUNDATION_LOG_PREFIX = "[NexoraRiskFoundation]" as const;

export const WORKSPACE_RISK_SOURCE = "ds-6:1-foundation" as const;

export const WORKSPACE_RISK_STORAGE_KEY = "nexora.workspaceRisks.v1" as const;

export type WorkspaceRiskStatus = "active" | "monitoring" | "resolved" | "archived";

export type WorkspaceRiskCategory =
  | "operational"
  | "financial"
  | "strategic"
  | "resource"
  | "market"
  | "technology"
  | "custom";

export type WorkspaceRisk = Readonly<{
  contractVersion: typeof WORKSPACE_RISK_VERSION;
  riskId: string;
  workspaceId: WorkspaceId;
  title: string;
  description: string;
  status: WorkspaceRiskStatus;
  category: WorkspaceRiskCategory;
  createdAt: string;
  updatedAt: string;
  source: typeof WORKSPACE_RISK_SOURCE;
}>;

export type WorkspaceRiskMap = Readonly<Record<string, WorkspaceRisk>>;

export type WorkspaceRiskStore = Readonly<Record<WorkspaceId, WorkspaceRiskMap>>;

export type CreateWorkspaceRiskInput = Readonly<{
  workspaceId: WorkspaceId;
  title: string;
  description?: string;
  status?: WorkspaceRiskStatus;
  category?: WorkspaceRiskCategory;
}>;

export type UpdateWorkspaceRiskInput = Readonly<{
  workspaceId: WorkspaceId;
  riskId: string;
  title?: string;
  description?: string;
  status?: WorkspaceRiskStatus;
  category?: WorkspaceRiskCategory;
}>;

export type WorkspaceRiskMutationResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  risk: WorkspaceRisk | null;
  reason: string;
  message: string;
}>;

export type DeleteWorkspaceRiskResult = Readonly<{
  success: boolean;
  workspaceId: WorkspaceId | null;
  riskId: string | null;
  deleted: boolean;
  reason: string;
  message: string;
}>;

const STORAGE_KEY = WORKSPACE_RISK_STORAGE_KEY;

const RISK_STATUSES = new Set<WorkspaceRiskStatus>([
  "active",
  "monitoring",
  "resolved",
  "archived",
]);

const RISK_CATEGORIES = new Set<WorkspaceRiskCategory>([
  "operational",
  "financial",
  "strategic",
  "resource",
  "market",
  "technology",
  "custom",
]);

let workspaceRiskStore: WorkspaceRiskStore = {};
let workspaceRiskHydrated = false;
let workspaceRiskVersion = 0;

type WorkspaceRiskListener = () => void;

const workspaceRiskListeners = new Set<WorkspaceRiskListener>();

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

function freezeRisk(risk: WorkspaceRisk): WorkspaceRisk {
  return Object.freeze({ ...risk });
}

function readStorage(): WorkspaceRiskStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return Object.freeze(parsed as WorkspaceRiskStore);
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceRiskStore));
  } catch {
    // Risk records remain available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceRiskStore(): void {
  if (workspaceRiskHydrated) return;
  workspaceRiskHydrated = true;
  workspaceRiskStore = readStorage();
}

function notifyWorkspaceRiskListeners(): void {
  workspaceRiskVersion += 1;
  workspaceRiskListeners.forEach((listener) => listener());
}

function commitWorkspaceRiskChange(): void {
  writeStorage();
  notifyWorkspaceRiskListeners();
}

function emitRiskDiagnostic(risk: WorkspaceRisk, action: "created" | "updated" | "deleted"): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("riskFoundation", NEXORA_RISK_FOUNDATION_LOG_PREFIX, {
    workspaceId: risk.workspaceId,
    riskId: risk.riskId,
    action,
    tags: WORKSPACE_RISK_TAGS,
    phase: "DS-6:1",
  });
}

function buildRiskId(workspaceId: WorkspaceId, title: string, createdAt: string): string {
  return ["wrisk", slugify(workspaceId), slugify(title), slugify(createdAt)].join("_");
}

function buildWorkspaceRisk(input: {
  workspaceId: WorkspaceId;
  title: string;
  description: string;
  status: WorkspaceRiskStatus;
  category: WorkspaceRiskCategory;
  createdAt: string;
  updatedAt: string;
  riskId?: string;
}): WorkspaceRisk {
  return freezeRisk(
    Object.freeze({
      contractVersion: WORKSPACE_RISK_VERSION,
      riskId: input.riskId ?? buildRiskId(input.workspaceId, input.title, input.createdAt),
      workspaceId: input.workspaceId,
      title: input.title,
      description: input.description,
      status: input.status,
      category: input.category,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      source: WORKSPACE_RISK_SOURCE,
    })
  );
}

function validateRiskInput(input: {
  title?: string;
  status?: WorkspaceRiskStatus;
  category?: WorkspaceRiskCategory;
}): string | null {
  if (input.title !== undefined && !input.title.trim()) return "missing_title";
  if (input.status !== undefined && !RISK_STATUSES.has(input.status)) return "invalid_status";
  if (input.category !== undefined && !RISK_CATEGORIES.has(input.category)) return "invalid_category";
  return null;
}

export function createWorkspaceRisk(input: CreateWorkspaceRiskInput): WorkspaceRiskMutationResult {
  hydrateWorkspaceRiskStore();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const validationError = validateRiskInput({
    title: input.title,
    status: input.status,
    category: input.category,
  });
  if (!trimmedWorkspaceId) {
    return Object.freeze({
      success: false,
      workspaceId: null,
      risk: null,
      reason: "missing_workspace",
      message: "Provide a workspace before creating a risk.",
    });
  }
  if (validationError) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      risk: null,
      reason: validationError,
      message: "Risk input is invalid.",
    });
  }

  const timestamp = nowIso();
  const risk = buildWorkspaceRisk({
    workspaceId: trimmedWorkspaceId,
    title: input.title.trim(),
    description: input.description?.trim() ?? "",
    status: input.status ?? "active",
    category: input.category ?? "custom",
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  const existingMap = workspaceRiskStore[trimmedWorkspaceId] ?? {};
  workspaceRiskStore = Object.freeze({
    ...workspaceRiskStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...existingMap,
      [risk.riskId]: risk,
    }),
  });
  commitWorkspaceRiskChange();
  emitRiskDiagnostic(risk, "created");

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    risk,
    reason: "created",
    message: `Risk "${risk.title}" created.`,
  });
}

export function updateWorkspaceRisk(input: UpdateWorkspaceRiskInput): WorkspaceRiskMutationResult {
  hydrateWorkspaceRiskStore();
  const trimmedWorkspaceId = input.workspaceId.trim();
  const trimmedRiskId = input.riskId.trim();
  if (!trimmedWorkspaceId || !trimmedRiskId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      risk: null,
      reason: "missing_identifier",
      message: "Provide workspace and risk identifiers before updating.",
    });
  }

  const existing = workspaceRiskStore[trimmedWorkspaceId]?.[trimmedRiskId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      risk: null,
      reason: "risk_not_found",
      message: "Risk not found for update.",
    });
  }

  const validationError = validateRiskInput({
    title: input.title,
    status: input.status,
    category: input.category,
  });
  if (validationError) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      risk: null,
      reason: validationError,
      message: "Risk update input is invalid.",
    });
  }

  const updatedAt = nowIso();
  const risk = freezeRisk(
    Object.freeze({
      ...buildWorkspaceRisk({
        workspaceId: trimmedWorkspaceId,
        title: input.title?.trim() ?? existing.title,
        description: input.description?.trim() ?? existing.description,
        status: input.status ?? existing.status,
        category: input.category ?? existing.category,
        createdAt: existing.createdAt,
        updatedAt,
        riskId: existing.riskId,
      }),
    })
  );

  workspaceRiskStore = Object.freeze({
    ...workspaceRiskStore,
    [trimmedWorkspaceId]: Object.freeze({
      ...(workspaceRiskStore[trimmedWorkspaceId] ?? {}),
      [existing.riskId]: risk,
    }),
  });
  commitWorkspaceRiskChange();
  emitRiskDiagnostic(risk, "updated");

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    risk,
    reason: "updated",
    message: `Risk "${risk.title}" updated.`,
  });
}

export function deleteWorkspaceRisk(
  workspaceId: WorkspaceId,
  riskId: string
): DeleteWorkspaceRiskResult {
  hydrateWorkspaceRiskStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedRiskId = riskId.trim();
  if (!trimmedWorkspaceId || !trimmedRiskId) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId || null,
      riskId: trimmedRiskId || null,
      deleted: false,
      reason: "missing_identifier",
      message: "Provide workspace and risk identifiers before deleting.",
    });
  }

  const existingMap = workspaceRiskStore[trimmedWorkspaceId];
  const existing = existingMap?.[trimmedRiskId] ?? null;
  if (!existing) {
    return Object.freeze({
      success: false,
      workspaceId: trimmedWorkspaceId,
      riskId: trimmedRiskId,
      deleted: false,
      reason: "risk_not_found",
      message: "Risk not found for deletion.",
    });
  }

  const nextEntries = Object.entries(existingMap ?? {}).filter(([id]) => id !== trimmedRiskId);
  const nextStore = { ...workspaceRiskStore };
  if (nextEntries.length === 0) {
    delete nextStore[trimmedWorkspaceId];
  } else {
    nextStore[trimmedWorkspaceId] = Object.freeze(Object.fromEntries(nextEntries));
  }
  workspaceRiskStore = Object.freeze(nextStore);
  commitWorkspaceRiskChange();
  emitRiskDiagnostic(existing, "deleted");

  return Object.freeze({
    success: true,
    workspaceId: trimmedWorkspaceId,
    riskId: trimmedRiskId,
    deleted: true,
    reason: "deleted",
    message: `Risk "${existing.title}" deleted.`,
  });
}

export function getWorkspaceRisks(workspaceId: WorkspaceId): readonly WorkspaceRisk[] {
  hydrateWorkspaceRiskStore();
  const trimmedWorkspaceId = workspaceId.trim();
  if (!trimmedWorkspaceId) return Object.freeze([]);
  return Object.freeze(
    Object.values(workspaceRiskStore[trimmedWorkspaceId] ?? {}).map(freezeRisk)
  );
}

export function getWorkspaceRisk(
  workspaceId: WorkspaceId,
  riskId: string
): WorkspaceRisk | null {
  hydrateWorkspaceRiskStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedRiskId = riskId.trim();
  if (!trimmedWorkspaceId || !trimmedRiskId) return null;
  const match = workspaceRiskStore[trimmedWorkspaceId]?.[trimmedRiskId] ?? null;
  return match ? freezeRisk(match) : null;
}

export function subscribeWorkspaceRiskRegistry(listener: WorkspaceRiskListener): () => void {
  hydrateWorkspaceRiskStore();
  workspaceRiskListeners.add(listener);
  return () => workspaceRiskListeners.delete(listener);
}

export function getWorkspaceRiskRegistryVersion(): number {
  hydrateWorkspaceRiskStore();
  return workspaceRiskVersion;
}

export function resetWorkspaceRiskStoreForTests(): void {
  workspaceRiskStore = {};
  workspaceRiskHydrated = false;
  workspaceRiskVersion = 0;
  workspaceRiskListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}

export function resetWorkspaceRiskMemoryForTests(): void {
  workspaceRiskStore = {};
  workspaceRiskHydrated = false;
  workspaceRiskVersion = 0;
}
