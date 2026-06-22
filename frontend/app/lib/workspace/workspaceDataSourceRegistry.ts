import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import { guardWorkspaceDataSourceAccess } from "./workspaceDataSourceIsolationGuard.ts";

export const WORKSPACE_DATA_SOURCE_REGISTRY_VERSION = "NW-B:9-1" as const;

export const WORKSPACE_DATA_SOURCE_REGISTRY_TAGS = Object.freeze([
  "NWB91",
  "WORKSPACE_DATASOURCE_REGISTRY",
  "WORKSPACE_DATA_FOUNDATION",
] as const);

export type WorkspaceDataSourceType = "csv" | "excel" | "api" | "database";

export type WorkspaceDataSourceStatus = "empty" | "connected" | "processing" | "error";

export type WorkspaceDataSourceMetadata = Readonly<{
  fileName?: string;
  fileSize?: number;
  rowCount?: number;
  columnCount?: number;
  uploadTime?: string;
  csvText?: string;
}>;

export type WorkspaceDataSource = Readonly<{
  contractVersion: typeof WORKSPACE_DATA_SOURCE_REGISTRY_VERSION;
  dataSourceId: string;
  workspaceId: WorkspaceId;
  name: string;
  type: WorkspaceDataSourceType;
  status: WorkspaceDataSourceStatus;
  createdAt: string;
  updatedAt: string;
  metadata?: WorkspaceDataSourceMetadata;
}>;

export type RegisterWorkspaceDataSourceInput = Readonly<{
  workspaceId?: WorkspaceId | null;
  dataSourceId?: string;
  name: string;
  type: WorkspaceDataSourceType;
  status?: WorkspaceDataSourceStatus;
  createdAt?: string;
  updatedAt?: string;
  metadata?: WorkspaceDataSourceMetadata;
}>;

export type UpdateWorkspaceDataSourceInput = Readonly<{
  workspaceId: WorkspaceId;
  dataSourceId: string;
  name?: string;
  type?: WorkspaceDataSourceType;
  status?: WorkspaceDataSourceStatus;
  updatedAt?: string;
  metadata?: WorkspaceDataSourceMetadata;
}>;

export type WorkspaceDataSourceMutationResult = Readonly<{
  success: boolean;
  dataSource: WorkspaceDataSource | null;
  reason: string;
}>;

export type WorkspaceDataSourceRegistrySnapshot = Readonly<{
  contractVersion: typeof WORKSPACE_DATA_SOURCE_REGISTRY_VERSION;
  updatedAt: string | null;
  byWorkspace: Readonly<Record<WorkspaceId, readonly WorkspaceDataSource[]>>;
}>;

type WorkspaceDataSourceListener = () => void;

const STORAGE_KEY = "nexora.workspaceDataSources.v1";

const DATA_SOURCE_TYPES = new Set<WorkspaceDataSourceType>(["csv", "excel", "api", "database"]);
const DATA_SOURCE_STATUSES = new Set<WorkspaceDataSourceStatus>([
  "empty",
  "connected",
  "processing",
  "error",
]);

const workspaceDataSourceListeners = new Set<WorkspaceDataSourceListener>();

let workspaceDataSources: Record<WorkspaceId, readonly WorkspaceDataSource[]> = {};
let workspaceDataSourceHydrated = false;
let workspaceDataSourceVersion = 0;
let registryUpdatedAt: string | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function emitWorkspaceDataSourceDiagnostic(
  message: "Registered" | "Updated" | "Removed",
  payload?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("workspaceDataSource", `[WorkspaceDataSource] ${message}`, {
    ...payload,
    tags: WORKSPACE_DATA_SOURCE_REGISTRY_TAGS,
  });
}

function notifyWorkspaceDataSourceListeners(): void {
  workspaceDataSourceVersion += 1;
  workspaceDataSourceListeners.forEach((listener) => listener());
}

function readStorage(): Record<WorkspaceId, readonly WorkspaceDataSource[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, readonly WorkspaceDataSource[]>;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceDataSources));
  } catch {
    // Registry remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceDataSourceStore(): void {
  if (workspaceDataSourceHydrated) return;
  workspaceDataSourceHydrated = true;
  workspaceDataSources = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function normalizeTimestamp(value: string | undefined, fallback: string): string {
  if (!value?.trim()) return fallback;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : fallback;
}

export function isWorkspaceDataSourceType(value: unknown): value is WorkspaceDataSourceType {
  return typeof value === "string" && DATA_SOURCE_TYPES.has(value.trim().toLowerCase() as WorkspaceDataSourceType);
}

export function isWorkspaceDataSourceStatus(value: unknown): value is WorkspaceDataSourceStatus {
  return typeof value === "string" && DATA_SOURCE_STATUSES.has(value.trim().toLowerCase() as WorkspaceDataSourceStatus);
}

export function buildWorkspaceDataSourceId(input: {
  workspaceId: WorkspaceId;
  name: string;
  type: WorkspaceDataSourceType;
  createdAt: string;
}): string {
  const namePart = input.name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 48) || "source";
  const timePart = String(Date.parse(input.createdAt) || Date.now());
  return `wds_${input.workspaceId}_${input.type}_${namePart}_${timePart}`;
}

function freezeDataSource(dataSource: WorkspaceDataSource): WorkspaceDataSource {
  return Object.freeze({ ...dataSource });
}

function commitRegistryChange(timestamp = nowIso()): void {
  registryUpdatedAt = timestamp;
  writeStorage();
  notifyWorkspaceDataSourceListeners();
}

export function subscribeWorkspaceDataSourceRegistry(listener: WorkspaceDataSourceListener): () => void {
  hydrateWorkspaceDataSourceStore();
  workspaceDataSourceListeners.add(listener);
  return () => workspaceDataSourceListeners.delete(listener);
}

export function getWorkspaceDataSourceRegistryVersion(): number {
  hydrateWorkspaceDataSourceStore();
  return workspaceDataSourceVersion;
}

export function getWorkspaceDataSourceRegistrySnapshot(): WorkspaceDataSourceRegistrySnapshot {
  hydrateWorkspaceDataSourceStore();
  return Object.freeze({
    contractVersion: WORKSPACE_DATA_SOURCE_REGISTRY_VERSION,
    updatedAt: registryUpdatedAt,
    byWorkspace: Object.freeze({ ...workspaceDataSources }),
  });
}

export function listWorkspaceDataSources(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceDataSource[] {
  hydrateWorkspaceDataSourceStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return Object.freeze([]);
  return Object.freeze((workspaceDataSources[resolvedWorkspaceId] ?? []).map(freezeDataSource));
}

export function getActiveWorkspaceDataSources(): readonly WorkspaceDataSource[] {
  return listWorkspaceDataSources(getActiveWorkspace()?.workspaceId ?? null);
}

export function getWorkspaceDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSource | null {
  hydrateWorkspaceDataSourceStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedId) return null;
  const sources = workspaceDataSources[trimmedWorkspaceId] ?? [];
  const match = sources.find((source) => source.dataSourceId === trimmedId) ?? null;
  if (!match) return null;

  const guard = guardWorkspaceDataSourceAccess({
    action: "read",
    workspaceId: trimmedWorkspaceId,
    dataSource: match,
    dataSourceId: trimmedId,
  });
  if (!guard.allowed) return null;

  return freezeDataSource(match);
}

export function registerWorkspaceDataSource(
  input: RegisterWorkspaceDataSourceInput
): WorkspaceDataSourceMutationResult {
  hydrateWorkspaceDataSourceStore();

  const workspaceId = resolveWorkspaceId(input.workspaceId);
  const name = input.name.trim();
  if (!workspaceId) {
    return Object.freeze({ success: false, dataSource: null, reason: "missing_workspace_id" });
  }
  if (!name) {
    return Object.freeze({ success: false, dataSource: null, reason: "missing_name" });
  }
  if (!isWorkspaceDataSourceType(input.type)) {
    return Object.freeze({ success: false, dataSource: null, reason: "invalid_type" });
  }

  const importGuard = guardWorkspaceDataSourceAccess({
    action: "import",
    workspaceId,
  });
  if (!importGuard.allowed) {
    return Object.freeze({ success: false, dataSource: null, reason: importGuard.reason });
  }

  const createdAt = normalizeTimestamp(input.createdAt, nowIso());
  const updatedAt = normalizeTimestamp(input.updatedAt, createdAt);
  const explicitId = input.dataSourceId?.trim();
  const dataSourceId =
    explicitId ||
    buildWorkspaceDataSourceId({
      workspaceId,
      name,
      type: input.type,
      createdAt,
    });

  const existing = workspaceDataSources[workspaceId] ?? [];
  if (existing.some((source) => source.dataSourceId === dataSourceId)) {
    return Object.freeze({ success: false, dataSource: null, reason: "duplicate_data_source" });
  }

  const dataSource = freezeDataSource(
    Object.freeze({
      contractVersion: WORKSPACE_DATA_SOURCE_REGISTRY_VERSION,
      dataSourceId,
      workspaceId,
      name,
      type: input.type,
      status: isWorkspaceDataSourceStatus(input.status) ? input.status : "empty",
      createdAt,
      updatedAt,
      ...(input.metadata ? { metadata: Object.freeze({ ...input.metadata }) } : {}),
    })
  );

  workspaceDataSources = {
    ...workspaceDataSources,
    [workspaceId]: Object.freeze([...existing, dataSource]),
  };
  commitRegistryChange(updatedAt);
  emitWorkspaceDataSourceDiagnostic("Registered", {
    workspaceId,
    dataSourceId: dataSource.dataSourceId,
    name: dataSource.name,
    type: dataSource.type,
    status: dataSource.status,
  });

  return Object.freeze({ success: true, dataSource, reason: "registered" });
}

export function updateWorkspaceDataSource(
  input: UpdateWorkspaceDataSourceInput
): WorkspaceDataSourceMutationResult {
  hydrateWorkspaceDataSourceStore();

  const workspaceId = input.workspaceId.trim();
  const dataSourceId = input.dataSourceId.trim();
  if (!workspaceId || !dataSourceId) {
    return Object.freeze({ success: false, dataSource: null, reason: "missing_identifier" });
  }

  const existing = workspaceDataSources[workspaceId] ?? [];
  const current = existing.find((source) => source.dataSourceId === dataSourceId) ?? null;
  if (!current) {
    return Object.freeze({ success: false, dataSource: null, reason: "data_source_not_found" });
  }

  const updateGuard = guardWorkspaceDataSourceAccess({
    action: "update",
    workspaceId,
    dataSource: current,
    dataSourceId,
  });
  if (!updateGuard.allowed) {
    return Object.freeze({ success: false, dataSource: null, reason: updateGuard.reason });
  }

  if (input.type !== undefined && !isWorkspaceDataSourceType(input.type)) {
    return Object.freeze({ success: false, dataSource: null, reason: "invalid_type" });
  }
  if (input.status !== undefined && !isWorkspaceDataSourceStatus(input.status)) {
    return Object.freeze({ success: false, dataSource: null, reason: "invalid_status" });
  }

  const updatedAt = normalizeTimestamp(input.updatedAt, nowIso());
  const next = freezeDataSource(
    Object.freeze({
      ...current,
      name: input.name?.trim() ? input.name.trim() : current.name,
      type: input.type ?? current.type,
      status: input.status ?? current.status,
      updatedAt,
      metadata:
        input.metadata !== undefined
          ? Object.freeze({ ...input.metadata })
          : current.metadata,
    })
  );

  workspaceDataSources = {
    ...workspaceDataSources,
    [workspaceId]: Object.freeze(existing.map((source) => (source.dataSourceId === dataSourceId ? next : source))),
  };
  commitRegistryChange(updatedAt);
  emitWorkspaceDataSourceDiagnostic("Updated", {
    workspaceId,
    dataSourceId: next.dataSourceId,
    name: next.name,
    type: next.type,
    status: next.status,
  });

  return Object.freeze({ success: true, dataSource: next, reason: "updated" });
}

export function removeWorkspaceDataSource(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSourceMutationResult {
  hydrateWorkspaceDataSourceStore();

  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) {
    return Object.freeze({ success: false, dataSource: null, reason: "missing_identifier" });
  }

  const existing = workspaceDataSources[trimmedWorkspaceId] ?? [];
  const current = existing.find((source) => source.dataSourceId === trimmedDataSourceId) ?? null;
  if (!current) {
    return Object.freeze({ success: false, dataSource: null, reason: "data_source_not_found" });
  }

  const deleteGuard = guardWorkspaceDataSourceAccess({
    action: "delete",
    workspaceId: trimmedWorkspaceId,
    dataSource: current,
    dataSourceId: trimmedDataSourceId,
  });
  if (!deleteGuard.allowed) {
    return Object.freeze({ success: false, dataSource: null, reason: deleteGuard.reason });
  }

  const remaining = existing.filter((source) => source.dataSourceId !== trimmedDataSourceId);
  workspaceDataSources = {
    ...workspaceDataSources,
    [trimmedWorkspaceId]: Object.freeze(remaining),
  };
  commitRegistryChange();
  emitWorkspaceDataSourceDiagnostic("Removed", {
    workspaceId: trimmedWorkspaceId,
    dataSourceId: current.dataSourceId,
    name: current.name,
  });

  return Object.freeze({ success: true, dataSource: current, reason: "removed" });
}

export function resetWorkspaceDataSourcesForTests(): void {
  workspaceDataSources = {};
  workspaceDataSourceHydrated = false;
  workspaceDataSourceVersion = 0;
  registryUpdatedAt = null;
  workspaceDataSourceListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test cleanup best effort only.
    }
  }
}
