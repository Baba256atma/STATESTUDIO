/**
 * DS-1:1 — Workspace data source schema discovery contract.
 * Schema intelligence only — no objects, relationships, KPIs, or scene writes.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const WORKSPACE_DATA_SOURCE_SCHEMA_VERSION = "DS-1:1" as const;

export const WORKSPACE_DATA_SOURCE_SCHEMA_TAGS = Object.freeze([
  "[DS11]",
  "[SCHEMA_DISCOVERY]",
] as const);

export const NEXORA_SCHEMA_DISCOVERY_LOG_PREFIX = "[NexoraSchemaDiscovery]" as const;

export type WorkspaceDataSourceSchemaStore = Readonly<
  Record<WorkspaceId, Readonly<Record<string, WorkspaceDataSourceSchemaProfile>>>
>;

export const WORKSPACE_DATA_SOURCE_SCHEMA_SAMPLE_VALUE_LIMIT = 5 as const;

export type WorkspaceDataSourceDetectedColumnType =
  | "text"
  | "number"
  | "currency"
  | "percentage"
  | "date"
  | "boolean"
  | "identifier"
  | "unknown";

export type WorkspaceDataSourceColumnSchema = Readonly<{
  columnName: string;
  detectedType: WorkspaceDataSourceDetectedColumnType;
  uniqueValueCount: number;
  nullPercentage: number;
  sampleValues: readonly string[];
}>;

export type WorkspaceDataSourceSchemaProfile = Readonly<{
  contractVersion: typeof WORKSPACE_DATA_SOURCE_SCHEMA_VERSION;
  dataSourceId: string;
  workspaceId: WorkspaceId;
  fileName: string;
  rowCount: number;
  columnCount: number;
  columns: readonly WorkspaceDataSourceColumnSchema[];
  discoveredAt: string;
  updatedAt: string;
}>;

export type WorkspaceDataSourceSchemaDiscoveryInput = Readonly<{
  workspaceId: WorkspaceId;
  dataSourceId: string;
  fileName: string;
  csvText: string;
  discoveredAt?: string;
}>;

export type WorkspaceDataSourceSchemaMutationResult = Readonly<{
  success: boolean;
  schema: WorkspaceDataSourceSchemaProfile | null;
  reason: string;
  created: boolean;
}>;

export type WorkspaceDataSourceSchemaRegistrySnapshot = Readonly<{
  contractVersion: typeof WORKSPACE_DATA_SOURCE_SCHEMA_VERSION;
  updatedAt: string | null;
  byWorkspace: Readonly<Record<WorkspaceId, readonly WorkspaceDataSourceSchemaProfile[]>>;
}>;

export function workspaceDataSourceSchemaProfileIsComplete(
  schema: WorkspaceDataSourceSchemaProfile | null | undefined
): schema is WorkspaceDataSourceSchemaProfile {
  if (!schema || typeof schema !== "object") return false;
  if (schema.contractVersion !== WORKSPACE_DATA_SOURCE_SCHEMA_VERSION) return false;
  if (typeof schema.workspaceId !== "string" || !schema.workspaceId.trim()) return false;
  if (typeof schema.dataSourceId !== "string" || !schema.dataSourceId.trim()) return false;
  if (typeof schema.fileName !== "string" || !schema.fileName.trim()) return false;
  if (!Number.isFinite(schema.rowCount) || schema.rowCount < 0) return false;
  if (!Number.isFinite(schema.columnCount) || schema.columnCount < 0) return false;
  if (!Array.isArray(schema.columns) || schema.columns.length !== schema.columnCount) return false;
  return schema.columns.every(
    (column) =>
      typeof column.columnName === "string" &&
      column.columnName.trim().length > 0 &&
      typeof column.detectedType === "string" &&
      Number.isFinite(column.uniqueValueCount) &&
      column.uniqueValueCount >= 0 &&
      Number.isFinite(column.nullPercentage) &&
      column.nullPercentage >= 0 &&
      column.nullPercentage <= 100 &&
      Array.isArray(column.sampleValues)
  );
}
