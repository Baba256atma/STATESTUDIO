import {
  normalizeDataSourceTimestamp,
  type DataSourceRegistryEntry,
} from "./dataSourceRegistryContract.ts";
import { listDataSources, updateDataSource } from "./dataSourceRegistryRuntime.ts";
import {
  buildDataSourceSyncSnapshot,
  type DataSourceSyncInput,
  type DataSourceSyncMutationResult,
  type DataSourceSyncSnapshot,
} from "./dataSourceSyncContract.ts";

function nowIso(): string {
  return new Date().toISOString();
}

function normalizeSourceId(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function findSource(sourceIdInput: unknown): DataSourceRegistryEntry | null {
  const sourceId = normalizeSourceId(sourceIdInput);
  if (!sourceId) return null;
  return listDataSources().find((source) => source.sourceId === sourceId) ?? null;
}

export function resolveDataSourceSyncState(
  source: DataSourceRegistryEntry
): DataSourceSyncSnapshot {
  if (source.sourceStatus === "error" || source.sourceStatus === "inactive") {
    return buildDataSourceSyncSnapshot(source, "out_of_sync");
  }
  if (!source.lastSyncAt) {
    return buildDataSourceSyncSnapshot(source, "warning");
  }
  return buildDataSourceSyncSnapshot(source, "healthy");
}

function mutationResult(input: {
  success: boolean;
  source: DataSourceRegistryEntry | null;
  reason: string;
}): DataSourceSyncMutationResult {
  return Object.freeze({
    ...input,
    sync: input.source ? resolveDataSourceSyncState(input.source) : null,
  });
}

export function syncDataSource(input: DataSourceSyncInput): DataSourceSyncMutationResult {
  const sourceId = normalizeSourceId(input.sourceId);
  if (!sourceId) {
    return mutationResult({ success: false, source: null, reason: "missing_source_id" });
  }

  const timestamp = normalizeDataSourceTimestamp(input.syncedAt, nowIso());
  const result = updateDataSource({
    sourceId,
    sourceStatus: "active",
    updatedAt: timestamp,
    lastSyncAt: timestamp,
  });

  return mutationResult({
    success: result.success,
    source: result.source,
    reason: result.success ? "synced" : result.reason,
  });
}

export function markSourceStale(sourceIdInput: unknown): DataSourceSyncMutationResult {
  const sourceId = normalizeSourceId(sourceIdInput);
  if (!sourceId) {
    return mutationResult({ success: false, source: null, reason: "missing_source_id" });
  }

  const existing = findSource(sourceId);
  if (!existing) {
    return mutationResult({ success: false, source: null, reason: "source_not_found" });
  }

  const result = updateDataSource({
    sourceId,
    sourceStatus: "inactive",
    updatedAt: nowIso(),
  });

  return mutationResult({
    success: result.success,
    source: result.source,
    reason: result.success ? "marked_stale" : result.reason,
  });
}

export function refreshSource(sourceIdInput: unknown): DataSourceSyncMutationResult {
  return syncDataSource({ sourceId: sourceIdInput });
}

