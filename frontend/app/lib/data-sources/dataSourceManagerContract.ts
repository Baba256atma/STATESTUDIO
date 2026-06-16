/**
 * DS:1:3 — Executive Data Source Manager contract.
 *
 * Registry management only: no object creation, scenario generation, or AI analysis.
 */

import type {
  DataSourceRegistryEntry,
  DataSourceRegistryMutationResult,
  DataSourceStatus,
  DataSourceType,
} from "./dataSourceRegistryContract.ts";
import type {
  DataSourceSyncDisplayLabel,
  DataSourceSyncState,
} from "./dataSourceSyncContract.ts";

export const DS_1_3_DATA_SOURCE_MANAGER_TAG =
  "[DS:1:3_DATA_SOURCE_MANAGER]" as const;

export type DataSourceManagerAction = "view" | "refresh" | "delete";

export type DataSourceManagerRow = Readonly<{
  sourceId: string;
  sourceName: string;
  typeLabel: string;
  statusLabel: string;
  syncState: DataSourceSyncState;
  syncLabel: DataSourceSyncDisplayLabel;
  recordsLabel: string;
  lastSyncLabel: string;
  sourceType: DataSourceType;
  sourceStatus: DataSourceStatus;
  recordCount: number;
  lastSyncAt: string | null;
}>;

export type DataSourceManagerSnapshot = Readonly<{
  rows: readonly DataSourceManagerRow[];
  selectedSource: DataSourceRegistryEntry | null;
  sourceCount: number;
}>;

export type DataSourceManagerActionResult = DataSourceRegistryMutationResult & Readonly<{
  action: DataSourceManagerAction;
  snapshot: DataSourceManagerSnapshot;
}>;

