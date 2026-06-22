import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const DATA_SOURCE_SCHEMA_VERSION = "DS-1:1" as const;

export const DATA_SOURCE_SCHEMA_TAGS = Object.freeze([
  "[DS11]",
  "[SCHEMA_DISCOVERY]",
] as const);

export type DataSourceSchemaSourceType = "csv";

export type DataSourceSchemaColumnType =
  | "string"
  | "number"
  | "boolean"
  | "date"
  | "empty"
  | "unknown";

export type DataSourceSchemaProfile = Readonly<{
  contractVersion: typeof DATA_SOURCE_SCHEMA_VERSION;
  workspaceId: WorkspaceId;
  dataSourceId: string;
  sourceType: DataSourceSchemaSourceType;
  fileName: string;
  rowCount: number;
  columnCount: number;
  columnNames: readonly string[];
  detectedTypes: readonly DataSourceSchemaColumnType[];
  emptyColumns: readonly string[];
  duplicateColumns: readonly string[];
  discoveredAt: string;
  updatedAt: string;
}>;

export type DataSourceSchemaContract = Readonly<{
  contractVersion: typeof DATA_SOURCE_SCHEMA_VERSION;
  supportedSourceTypes: readonly DataSourceSchemaSourceType[];
  profileFields: readonly [
    "fileName",
    "rowCount",
    "columnCount",
    "columnNames",
    "detectedTypes",
    "emptyColumns",
    "duplicateColumns",
  ];
}>;

export const DATA_SOURCE_SCHEMA_CONTRACT: DataSourceSchemaContract = Object.freeze({
  contractVersion: DATA_SOURCE_SCHEMA_VERSION,
  supportedSourceTypes: Object.freeze(["csv"] as const),
  profileFields: Object.freeze([
    "fileName",
    "rowCount",
    "columnCount",
    "columnNames",
    "detectedTypes",
    "emptyColumns",
    "duplicateColumns",
  ] as const),
});

export type DataSourceSchemaMutationResult = Readonly<{
  success: boolean;
  schema: DataSourceSchemaProfile | null;
  reason: string;
  created: boolean;
}>;

export function dataSourceSchemaProfileIsComplete(
  schema: DataSourceSchemaProfile | null | undefined
): schema is DataSourceSchemaProfile {
  if (!schema || typeof schema !== "object") return false;
  return (
    schema.contractVersion === DATA_SOURCE_SCHEMA_VERSION &&
    typeof schema.workspaceId === "string" &&
    schema.workspaceId.trim().length > 0 &&
    typeof schema.dataSourceId === "string" &&
    schema.dataSourceId.trim().length > 0 &&
    typeof schema.fileName === "string" &&
    typeof schema.rowCount === "number" &&
    typeof schema.columnCount === "number" &&
    Array.isArray(schema.columnNames) &&
    Array.isArray(schema.detectedTypes) &&
    Array.isArray(schema.emptyColumns) &&
    Array.isArray(schema.duplicateColumns) &&
    schema.columnNames.length === schema.detectedTypes.length
  );
}
