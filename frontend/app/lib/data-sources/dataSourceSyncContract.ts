/**
 * DS:1:5 — Runtime Synchronization Foundation contract.
 *
 * Manual sync only: no automatic source updates.
 */

import type {
  DataSourceRegistryEntry,
  DataSourceRegistryMutationResult,
} from "./dataSourceRegistryContract.ts";

export const DS_1_5_RUNTIME_SYNC_TAG = "[DS:1:5_RUNTIME_SYNC]" as const;

export type DataSourceSyncState = "healthy" | "warning" | "out_of_sync";

export type DataSourceSyncDisplayLabel = "Healthy" | "Warning" | "Out Of Sync";

export type DataSourceSyncSnapshot = Readonly<{
  sourceId: string;
  syncState: DataSourceSyncState;
  syncLabel: DataSourceSyncDisplayLabel;
  lastSyncAt: string | null;
  manualSyncOnly: true;
  automaticUpdatesEnabled: false;
}>;

export type DataSourceSyncMutationResult = DataSourceRegistryMutationResult & Readonly<{
  sync: DataSourceSyncSnapshot | null;
}>;

export type DataSourceSyncInput = Readonly<{
  sourceId: unknown;
  syncedAt?: unknown;
}>;

export function dataSourceSyncStateLabel(
  state: DataSourceSyncState
): DataSourceSyncDisplayLabel {
  switch (state) {
    case "healthy":
      return "Healthy";
    case "warning":
      return "Warning";
    case "out_of_sync":
      return "Out Of Sync";
  }
}

export function buildDataSourceSyncSnapshot(
  source: DataSourceRegistryEntry,
  syncState: DataSourceSyncState
): DataSourceSyncSnapshot {
  return Object.freeze({
    sourceId: source.sourceId,
    syncState,
    syncLabel: dataSourceSyncStateLabel(syncState),
    lastSyncAt: source.lastSyncAt,
    manualSyncOnly: true,
    automaticUpdatesEnabled: false,
  });
}

