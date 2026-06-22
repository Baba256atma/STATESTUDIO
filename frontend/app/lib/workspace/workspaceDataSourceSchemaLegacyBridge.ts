/**
 * Legacy DS-1:1 bridge for downstream DS-1:2+ engines that still consume flat schema profiles.
 */

import {
  DATA_SOURCE_SCHEMA_VERSION,
  type DataSourceSchemaColumnType,
  type DataSourceSchemaProfile,
} from "./dataSourceSchemaContract.ts";
import type {
  WorkspaceDataSourceDetectedColumnType,
  WorkspaceDataSourceSchemaProfile,
} from "./workspaceDataSourceSchemaContract.ts";

function mapDetectedTypeToLegacy(
  detectedType: WorkspaceDataSourceDetectedColumnType,
  nullPercentage: number
): DataSourceSchemaColumnType {
  if (nullPercentage >= 100) return "empty";
  switch (detectedType) {
    case "text":
    case "identifier":
      return "string";
    case "number":
    case "currency":
    case "percentage":
      return "number";
    case "date":
      return "date";
    case "boolean":
      return "boolean";
    case "unknown":
    default:
      return "unknown";
  }
}

function findDuplicateColumnNames(columnNames: readonly string[]): readonly string[] {
  const seen = new Map<string, number>();
  for (const name of columnNames) {
    const key = name.trim();
    seen.set(key, (seen.get(key) ?? 0) + 1);
  }
  return Object.freeze(
    [...seen.entries()]
      .filter(([, count]) => count > 1)
      .map(([name]) => name)
  );
}

export function toLegacyDataSourceSchemaProfile(
  schema: WorkspaceDataSourceSchemaProfile
): DataSourceSchemaProfile {
  const columnNames = Object.freeze(schema.columns.map((column) => column.columnName));
  const detectedTypes = Object.freeze(
    schema.columns.map((column) => mapDetectedTypeToLegacy(column.detectedType, column.nullPercentage))
  );
  const emptyColumns = Object.freeze(
    schema.columns.filter((column) => column.nullPercentage >= 100).map((column) => column.columnName)
  );

  return Object.freeze({
    contractVersion: DATA_SOURCE_SCHEMA_VERSION,
    workspaceId: schema.workspaceId,
    dataSourceId: schema.dataSourceId,
    sourceType: "csv",
    fileName: schema.fileName,
    rowCount: schema.rowCount,
    columnCount: schema.columnCount,
    columnNames,
    detectedTypes,
    emptyColumns,
    duplicateColumns: findDuplicateColumnNames(columnNames),
    discoveredAt: schema.discoveredAt,
    updatedAt: schema.updatedAt,
  });
}

export function fromLegacyDataSourceSchemaProfile(
  schema: DataSourceSchemaProfile
): WorkspaceDataSourceSchemaProfile | null {
  if (schema.columnNames.length !== schema.detectedTypes.length) return null;
  const columns = Object.freeze(
    schema.columnNames.map((columnName, index) => {
      const legacyType = schema.detectedTypes[index];
      const detectedType: WorkspaceDataSourceDetectedColumnType =
        legacyType === "string"
          ? "text"
          : legacyType === "number"
            ? "number"
            : legacyType === "boolean"
              ? "boolean"
              : legacyType === "date"
                ? "date"
                : legacyType === "empty"
                  ? "unknown"
                  : "unknown";
      return Object.freeze({
        columnName,
        detectedType,
        uniqueValueCount: 0,
        nullPercentage: legacyType === "empty" ? 100 : 0,
        sampleValues: Object.freeze([] as readonly string[]),
      });
    })
  );

  return Object.freeze({
    contractVersion: "DS-1:1",
    workspaceId: schema.workspaceId,
    dataSourceId: schema.dataSourceId,
    fileName: schema.fileName,
    rowCount: schema.rowCount,
    columnCount: schema.columnCount,
    columns,
    discoveredAt: schema.discoveredAt,
    updatedAt: schema.updatedAt,
  });
}
