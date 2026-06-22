/**
 * DS-1:1 — Workspace-scoped schema resolver and registry.
 * Read data sources only through workspaceDataSourceResolver.ts.
 * Schema profiles only — no scene, object, relationship, or dashboard mutations.
 */

import { devDiagnosticLog } from "../runtime/diagnosticSwitch.ts";
import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import { getActiveWorkspace } from "./workspaceRegistryStore.ts";
import {
  guardWorkspaceDataSourceAccess,
  type WorkspaceDataSourceIsolationGuardResult,
} from "./workspaceDataSourceIsolationGuard.ts";
import { resolveWorkspaceDataSource } from "./workspaceDataSourceResolver.ts";
import {
  NEXORA_SCHEMA_DISCOVERY_LOG_PREFIX,
  WORKSPACE_DATA_SOURCE_SCHEMA_TAGS,
  workspaceDataSourceSchemaProfileIsComplete,
  type WorkspaceDataSourceSchemaDiscoveryInput,
  type WorkspaceDataSourceSchemaMutationResult,
  type WorkspaceDataSourceSchemaProfile,
  type WorkspaceDataSourceSchemaRegistrySnapshot,
  type WorkspaceDataSourceSchemaStore,
} from "./workspaceDataSourceSchemaContract.ts";
import { discoverWorkspaceCsvSchema } from "./workspaceDataSourceSchemaDiscovery.ts";

const STORAGE_KEY = "nexora.workspaceDataSourceSchemas.v2";

type WorkspaceDataSourceSchemaListener = () => void;
type WorkspaceSchemaMap = Readonly<Record<string, WorkspaceDataSourceSchemaProfile>>;

const workspaceSchemaListeners = new Set<WorkspaceDataSourceSchemaListener>();

let workspaceSchemas: WorkspaceDataSourceSchemaStore = {};
let workspaceSchemaHydrated = false;
let workspaceSchemaVersion = 0;
let schemaUpdatedAt: string | null = null;

function nowIso(): string {
  return new Date().toISOString();
}

function emitSchemaResolverDiagnostic(
  message: string,
  payload: Readonly<{
    workspaceId: string;
    dataSourceId: string;
    rowCount?: number;
    columnCount?: number;
  }> & Record<string, unknown>
): void {
  if (process.env.NODE_ENV === "production") return;
  devDiagnosticLog("schemaDiscovery", `${NEXORA_SCHEMA_DISCOVERY_LOG_PREFIX} ${message}`, {
    ...payload,
    tags: WORKSPACE_DATA_SOURCE_SCHEMA_TAGS,
    phase: "DS-1:1",
  });
}

function notifyWorkspaceSchemaListeners(): void {
  workspaceSchemaVersion += 1;
  workspaceSchemaListeners.forEach((listener) => listener());
}

function normalizeStoredSchemas(
  raw: unknown
): WorkspaceDataSourceSchemaStore {
  if (!raw || typeof raw !== "object") return {};

  const normalized: Record<WorkspaceId, WorkspaceSchemaMap> = {};
  for (const [workspaceId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (Array.isArray(value)) {
      const map: Record<string, WorkspaceDataSourceSchemaProfile> = {};
      for (const entry of value) {
        if (entry && typeof entry === "object" && typeof entry.dataSourceId === "string") {
          map[entry.dataSourceId] = entry as WorkspaceDataSourceSchemaProfile;
        }
      }
      normalized[workspaceId] = Object.freeze(map);
      continue;
    }
    if (value && typeof value === "object") {
      normalized[workspaceId] = Object.freeze({ ...(value as Record<string, WorkspaceDataSourceSchemaProfile>) });
    }
  }
  return Object.freeze(normalized);
}

function readStorage(): WorkspaceDataSourceSchemaStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return normalizeStoredSchemas(JSON.parse(raw));
  } catch {
    return {};
  }
}

function writeStorage(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceSchemas));
  } catch {
    // Registry remains available in-memory if storage is unavailable.
  }
}

function hydrateWorkspaceSchemaStore(): void {
  if (workspaceSchemaHydrated) return;
  workspaceSchemaHydrated = true;
  workspaceSchemas = readStorage();
}

function resolveWorkspaceId(workspaceId?: WorkspaceId | null): WorkspaceId | null {
  const explicit = workspaceId?.trim();
  if (explicit) return explicit;
  return getActiveWorkspace()?.workspaceId ?? null;
}

function freezeSchema(schema: WorkspaceDataSourceSchemaProfile): WorkspaceDataSourceSchemaProfile {
  return Object.freeze({
    ...schema,
    columns: Object.freeze(
      schema.columns.map((column) =>
        Object.freeze({ ...column, sampleValues: Object.freeze([...column.sampleValues]) })
      )
    ),
  });
}

function getWorkspaceSchemaMap(workspaceId: WorkspaceId): WorkspaceSchemaMap {
  return workspaceSchemas[workspaceId] ?? Object.freeze({});
}

function listSchemasForWorkspace(workspaceId: WorkspaceId): readonly WorkspaceDataSourceSchemaProfile[] {
  return Object.freeze(Object.values(getWorkspaceSchemaMap(workspaceId)).map(freezeSchema));
}

function commitSchemaChange(timestamp = nowIso()): void {
  schemaUpdatedAt = timestamp;
  writeStorage();
  notifyWorkspaceSchemaListeners();
}

function denySchemaMutation(reason: string): WorkspaceDataSourceSchemaMutationResult {
  emitSchemaResolverDiagnostic("Access Denied", {
    workspaceId: "unknown",
    dataSourceId: "unknown",
    reason,
  });
  return Object.freeze({
    success: false,
    schema: null,
    reason,
    created: false,
  });
}

function guardSchemaRegistryRead(
  workspaceId: WorkspaceId,
  dataSourceId?: string | null
): WorkspaceDataSourceIsolationGuardResult {
  const trimmedDataSourceId = dataSourceId?.trim() ?? null;
  if (!trimmedDataSourceId) {
    return guardWorkspaceDataSourceAccess({
      action: "read",
      workspaceId,
    });
  }

  const dataSource = resolveWorkspaceDataSource(workspaceId, trimmedDataSourceId);
  if (dataSource) {
    return guardWorkspaceDataSourceAccess({
      action: "read",
      workspaceId,
      dataSource,
      dataSourceId: trimmedDataSourceId,
    });
  }

  return guardWorkspaceDataSourceAccess({
    action: "read",
    workspaceId,
  });
}

function guardSchemaRegistryWrite(
  workspaceId: WorkspaceId,
  dataSourceId: string,
  isCreate: boolean
): WorkspaceDataSourceIsolationGuardResult {
  const dataSource = resolveWorkspaceDataSource(workspaceId, dataSourceId);
  if (dataSource) {
    return guardWorkspaceDataSourceAccess({
      action: isCreate ? "import" : "update",
      workspaceId,
      dataSource,
      dataSourceId,
    });
  }

  return guardWorkspaceDataSourceAccess({
    action: "import",
    workspaceId,
    dataSourceId,
  });
}

function guardSchemaRegistryDelete(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSourceIsolationGuardResult {
  const dataSource = resolveWorkspaceDataSource(workspaceId, dataSourceId);
  if (dataSource) {
    return guardWorkspaceDataSourceAccess({
      action: "delete",
      workspaceId,
      dataSource,
      dataSourceId,
    });
  }

  return guardWorkspaceDataSourceAccess({
    action: "import",
    workspaceId,
    dataSourceId,
  });
}

export function subscribeWorkspaceDataSourceSchemaRegistry(
  listener: WorkspaceDataSourceSchemaListener
): () => void {
  hydrateWorkspaceSchemaStore();
  workspaceSchemaListeners.add(listener);
  return () => workspaceSchemaListeners.delete(listener);
}

export function getWorkspaceDataSourceSchemaRegistryVersion(): number {
  hydrateWorkspaceSchemaStore();
  return workspaceSchemaVersion;
}

export function getWorkspaceDataSourceSchemaRegistryUpdatedAt(): string | null {
  hydrateWorkspaceSchemaStore();
  return schemaUpdatedAt;
}

export function getWorkspaceDataSourceSchemaRegistrySnapshot(): WorkspaceDataSourceSchemaRegistrySnapshot {
  hydrateWorkspaceSchemaStore();
  const byWorkspace: Record<WorkspaceId, readonly WorkspaceDataSourceSchemaProfile[]> = {};
  for (const [workspaceId, schemaMap] of Object.entries(workspaceSchemas)) {
    byWorkspace[workspaceId] = Object.freeze(Object.values(schemaMap).map(freezeSchema));
  }
  return Object.freeze({
    contractVersion: "DS-1:1",
    updatedAt: schemaUpdatedAt,
    byWorkspace: Object.freeze(byWorkspace),
  });
}

export function resolveWorkspaceDataSourceSchemas(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceDataSourceSchemaProfile[] {
  hydrateWorkspaceSchemaStore();
  const resolvedWorkspaceId = resolveWorkspaceId(workspaceId);
  if (!resolvedWorkspaceId) return Object.freeze([]);

  const guard = guardSchemaRegistryRead(resolvedWorkspaceId);
  if (!guard.allowed) return Object.freeze([]);

  return listSchemasForWorkspace(resolvedWorkspaceId);
}

export function resolveWorkspaceDataSourceSchema(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSourceSchemaProfile | null {
  return getDataSourceSchema(workspaceId, dataSourceId);
}

export function getDataSourceSchema(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSourceSchemaProfile | null {
  hydrateWorkspaceSchemaStore();
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) return null;

  const guard = guardSchemaRegistryRead(trimmedWorkspaceId, trimmedDataSourceId);
  if (!guard.allowed) return null;

  const match = getWorkspaceSchemaMap(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  return match ? freezeSchema(match) : null;
}

export function discoverDataSourceSchema(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSourceSchemaMutationResult {
  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: "missing_identifier",
      created: false,
    });
  }

  const dataSource = resolveWorkspaceDataSource(trimmedWorkspaceId, trimmedDataSourceId);
  if (!dataSource) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: "data_source_not_found",
      created: false,
    });
  }

  if (dataSource.type !== "csv") {
    return Object.freeze({
      success: false,
      schema: null,
      reason: "unsupported_source_type",
      created: false,
    });
  }

  const csvText = dataSource.metadata?.csvText;
  if (!csvText?.trim()) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: "missing_csv_content",
      created: false,
    });
  }

  return discoverAndSaveWorkspaceDataSourceSchema({
    workspaceId: trimmedWorkspaceId,
    dataSourceId: trimmedDataSourceId,
    fileName: dataSource.metadata?.fileName ?? dataSource.name,
    csvText,
    discoveredAt: dataSource.metadata?.uploadTime ?? dataSource.updatedAt,
  });
}

export function saveWorkspaceDataSourceSchemaProfile(
  schema: WorkspaceDataSourceSchemaProfile
): WorkspaceDataSourceSchemaMutationResult {
  hydrateWorkspaceSchemaStore();

  if (!workspaceDataSourceSchemaProfileIsComplete(schema)) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: "invalid_schema_profile",
      created: false,
    });
  }

  const workspaceId = schema.workspaceId.trim();
  const dataSourceId = schema.dataSourceId.trim();
  const current = getWorkspaceSchemaMap(workspaceId)[dataSourceId] ?? null;
  const writeGuard = guardSchemaRegistryWrite(workspaceId, dataSourceId, !current);
  if (!writeGuard.allowed) {
    return denySchemaMutation(writeGuard.reason);
  }

  const nextSchema = freezeSchema(
    Object.freeze({
      ...schema,
      workspaceId,
      dataSourceId,
      discoveredAt: current?.discoveredAt ?? schema.discoveredAt,
      updatedAt: schema.updatedAt || nowIso(),
    })
  );

  workspaceSchemas = Object.freeze({
    ...workspaceSchemas,
    [workspaceId]: Object.freeze({
      ...getWorkspaceSchemaMap(workspaceId),
      [dataSourceId]: nextSchema,
    }),
  });
  commitSchemaChange(nextSchema.updatedAt);

  emitSchemaResolverDiagnostic(current ? "Schema Updated" : "Schema Stored", {
    workspaceId,
    dataSourceId,
    rowCount: nextSchema.rowCount,
    columnCount: nextSchema.columnCount,
    fileName: nextSchema.fileName,
  });

  return Object.freeze({
    success: true,
    schema: nextSchema,
    reason: current ? "updated" : "created",
    created: !current,
  });
}

export function discoverAndSaveWorkspaceDataSourceSchema(
  input: WorkspaceDataSourceSchemaDiscoveryInput
): WorkspaceDataSourceSchemaMutationResult {
  const workspaceId = input.workspaceId.trim();
  const importGuard = guardWorkspaceDataSourceAccess({
    action: "import",
    workspaceId,
  });
  if (!importGuard.allowed) {
    return denySchemaMutation(importGuard.reason);
  }

  try {
    const schema = discoverWorkspaceCsvSchema(input);
    return saveWorkspaceDataSourceSchemaProfile(schema);
  } catch (error) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: error instanceof Error ? error.message : "schema_discovery_failed",
      created: false,
    });
  }
}

export function removeWorkspaceDataSourceSchemaProfile(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceDataSourceSchemaMutationResult {
  hydrateWorkspaceSchemaStore();

  const trimmedWorkspaceId = workspaceId.trim();
  const trimmedDataSourceId = dataSourceId.trim();
  if (!trimmedWorkspaceId || !trimmedDataSourceId) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: "missing_identifier",
      created: false,
    });
  }

  const deleteGuard = guardSchemaRegistryDelete(trimmedWorkspaceId, trimmedDataSourceId);
  if (!deleteGuard.allowed) {
    return denySchemaMutation(deleteGuard.reason);
  }

  const current = getWorkspaceSchemaMap(trimmedWorkspaceId)[trimmedDataSourceId] ?? null;
  if (!current) {
    return Object.freeze({
      success: false,
      schema: null,
      reason: "schema_not_found",
      created: false,
    });
  }

  const { [trimmedDataSourceId]: _removed, ...remaining } = getWorkspaceSchemaMap(trimmedWorkspaceId);
  workspaceSchemas = Object.freeze({
    ...workspaceSchemas,
    [trimmedWorkspaceId]: Object.freeze(remaining),
  });
  commitSchemaChange();
  emitSchemaResolverDiagnostic("Schema Removed", {
    workspaceId: trimmedWorkspaceId,
    dataSourceId: trimmedDataSourceId,
    rowCount: current.rowCount,
    columnCount: current.columnCount,
    fileName: current.fileName,
  });

  return Object.freeze({
    success: true,
    schema: freezeSchema(current),
    reason: "removed",
    created: false,
  });
}

export function resetWorkspaceDataSourceSchemaRegistryForTests(): void {
  workspaceSchemas = {};
  workspaceSchemaHydrated = false;
  workspaceSchemaVersion = 0;
  schemaUpdatedAt = null;
  workspaceSchemaListeners.clear();
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem("nexora.workspaceDataSourceSchemas.v1");
    } catch {
      // Test cleanup best effort only.
    }
  }
}
