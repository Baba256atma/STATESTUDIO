import type { DataSourceRegistryEntry } from "./dataSourceRegistryContract.ts";
import {
  listDataSources,
  removeDataSource,
} from "./dataSourceRegistryRuntime.ts";
import type {
  DataSourceManagerActionResult,
  DataSourceManagerRow,
  DataSourceManagerSnapshot,
} from "./dataSourceManagerContract.ts";
import {
  refreshSource,
  resolveDataSourceSyncState,
} from "./dataSourceSyncRuntime.ts";

const SOURCE_TYPE_LABELS = Object.freeze({
  csv: "CSV",
  excel: "Excel",
  json: "JSON",
  manual_entry: "Manual Entry",
  future_api_connector: "Future API Connector",
});

const SOURCE_STATUS_LABELS = Object.freeze({
  registered: "Registered",
  active: "Active",
  inactive: "Inactive",
  error: "Error",
});

function formatRecords(recordCount: number): string {
  return new Intl.NumberFormat("en-US").format(recordCount);
}

function formatLastSync(lastSyncAt: string | null): string {
  if (!lastSyncAt) return "Never";
  const time = Date.parse(lastSyncAt);
  if (!Number.isFinite(time)) return "Never";
  return new Date(time).toISOString();
}

function toManagerRow(source: DataSourceRegistryEntry): DataSourceManagerRow {
  const sync = resolveDataSourceSyncState(source);
  return Object.freeze({
    sourceId: source.sourceId,
    sourceName: source.sourceName,
    typeLabel: SOURCE_TYPE_LABELS[source.sourceType],
    statusLabel: SOURCE_STATUS_LABELS[source.sourceStatus],
    syncState: sync.syncState,
    syncLabel: sync.syncLabel,
    recordsLabel: formatRecords(source.recordCount),
    lastSyncLabel: formatLastSync(source.lastSyncAt),
    sourceType: source.sourceType,
    sourceStatus: source.sourceStatus,
    recordCount: source.recordCount,
    lastSyncAt: source.lastSyncAt,
  });
}

export function buildDataSourceManagerSnapshot(
  selectedSourceId?: unknown
): DataSourceManagerSnapshot {
  const sourceId = typeof selectedSourceId === "string" ? selectedSourceId.trim() : "";
  const sources = listDataSources();
  const selectedSource = sourceId
    ? sources.find((source) => source.sourceId === sourceId) ?? null
    : null;

  return Object.freeze({
    rows: Object.freeze(sources.map(toManagerRow)),
    selectedSource,
    sourceCount: sources.length,
  });
}

export function viewDataSource(sourceIdInput: unknown): DataSourceManagerActionResult {
  const sourceId = typeof sourceIdInput === "string" ? sourceIdInput.trim() : "";
  const snapshot = buildDataSourceManagerSnapshot(sourceId);
  if (!sourceId) {
    return Object.freeze({
      success: false,
      source: null,
      reason: "missing_source_id",
      action: "view",
      snapshot,
    });
  }
  if (!snapshot.selectedSource) {
    return Object.freeze({
      success: false,
      source: null,
      reason: "source_not_found",
      action: "view",
      snapshot,
    });
  }
  return Object.freeze({
    success: true,
    source: snapshot.selectedSource,
    reason: "viewed",
    action: "view",
    snapshot,
  });
}

export function refreshDataSource(sourceIdInput: unknown): DataSourceManagerActionResult {
  const result = refreshSource(sourceIdInput);
  return Object.freeze({
    ...result,
    reason: result.success ? "refreshed" : result.reason,
    action: "refresh",
    snapshot: buildDataSourceManagerSnapshot(result.source?.sourceId),
  });
}

export function deleteDataSource(sourceIdInput: unknown): DataSourceManagerActionResult {
  const result = removeDataSource(sourceIdInput);
  return Object.freeze({
    ...result,
    reason: result.success ? "deleted" : result.reason,
    action: "delete",
    snapshot: buildDataSourceManagerSnapshot(),
  });
}

