/**
 * Legacy column classification facade — delegates to DS-1:2 workspace modules.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import type { DataSourceSchemaColumnType, DataSourceSchemaProfile } from "./dataSourceSchemaContract.ts";
import {
  COLUMN_CLASSIFICATION_BUSINESS_MEANINGS,
  COLUMN_CLASSIFICATION_CONTRACT,
  COLUMN_CLASSIFICATION_TAGS,
  COLUMN_CLASSIFICATION_VERSION,
  columnClassificationProfileIsComplete,
  resolveColumnBusinessMeaning,
  type ColumnClassificationConfidence,
  type ColumnClassificationEntry,
  type ColumnClassificationKind,
  type ColumnClassificationMutationResult,
  type WorkspaceColumnClassificationProfile,
} from "./columnClassificationContract.ts";
import {
  WORKSPACE_COLUMN_CLASSIFICATION_TAGS,
  WORKSPACE_COLUMN_CLASSIFICATION_VERSION,
} from "./workspaceColumnClassificationContract.ts";
import {
  classifyColumnFromSchemaColumn,
  classifyDataSourceColumns,
  getColumnClassification,
  getColumnClassifications,
  getWorkspaceColumnClassificationProfile as readWorkspaceColumnClassificationProfile,
  listWorkspaceColumnClassificationProfiles as listWorkspaceColumnClassificationProfilesFromStore,
  persistWorkspaceDataSourceColumnClassificationProfile,
  removeWorkspaceColumnClassificationProfile as removeWorkspaceColumnClassificationProfileFromStore,
  resetWorkspaceColumnClassificationStoreForTests,
} from "./workspaceColumnClassificationEngine.ts";
import {
  toLegacyColumnClassificationEntry,
  toLegacyColumnClassificationMutationResult,
  toLegacyWorkspaceColumnClassificationProfile,
} from "./workspaceColumnClassificationLegacyBridge.ts";
import type { WorkspaceDataSourceDetectedColumnType } from "./workspaceDataSourceSchemaContract.ts";

export {
  COLUMN_CLASSIFICATION_BUSINESS_MEANINGS,
  COLUMN_CLASSIFICATION_CONTRACT,
  COLUMN_CLASSIFICATION_TAGS,
  COLUMN_CLASSIFICATION_VERSION,
  columnClassificationProfileIsComplete,
  resolveColumnBusinessMeaning,
};

export { classifyDataSourceColumns, getColumnClassification, getColumnClassifications };

type ColumnClassificationListener = () => void;

const columnClassificationListeners = new Set<ColumnClassificationListener>();

function nowIso(): string {
  return new Date().toISOString();
}

function mapLegacyDetectedType(
  detectedType?: DataSourceSchemaColumnType
): WorkspaceDataSourceDetectedColumnType {
  switch (detectedType) {
    case "string":
      return "text";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "date":
      return "date";
    case "empty":
    case "unknown":
    default:
      return "unknown";
  }
}

export function classifyColumn(input: {
  columnName: string;
  detectedType?: DataSourceSchemaColumnType;
}): ColumnClassificationEntry {
  const classification = classifyColumnFromSchemaColumn({
    workspaceId: "legacy_classification_workspace",
    dataSourceId: "legacy_classification_source",
    column: Object.freeze({
      columnName: input.columnName,
      detectedType: mapLegacyDetectedType(input.detectedType),
      uniqueValueCount: 0,
      nullPercentage: input.detectedType === "empty" ? 100 : 0,
      sampleValues: Object.freeze([]),
    }),
  });
  return toLegacyColumnClassificationEntry(classification);
}

export function classifySchemaColumns(
  schema: DataSourceSchemaProfile
): readonly ColumnClassificationEntry[] {
  return Object.freeze(
    schema.columnNames.map((columnName, index) =>
      classifyColumn({
        columnName,
        detectedType: schema.detectedTypes[index],
      })
    )
  );
}

export function subscribeWorkspaceColumnClassificationRegistry(
  listener: ColumnClassificationListener
): () => void {
  columnClassificationListeners.add(listener);
  return () => columnClassificationListeners.delete(listener);
}

export function getWorkspaceColumnClassificationRegistryVersion(): number {
  return 0;
}

export function listWorkspaceColumnClassificationProfiles(
  workspaceId?: WorkspaceId | null
): readonly WorkspaceColumnClassificationProfile[] {
  return listWorkspaceColumnClassificationProfilesFromStore(workspaceId).map(
    toLegacyWorkspaceColumnClassificationProfile
  );
}

export function getWorkspaceColumnClassificationProfile(
  workspaceId: WorkspaceId,
  dataSourceId: string
): WorkspaceColumnClassificationProfile | null {
  const profile = readWorkspaceColumnClassificationProfile(workspaceId, dataSourceId);
  return profile ? toLegacyWorkspaceColumnClassificationProfile(profile) : null;
}

function buildProfileFromLegacySchema(
  schema: DataSourceSchemaProfile,
  classifiedAt?: string
) {
  const timestamp = classifiedAt ?? nowIso();
  const columns: Record<string, ReturnType<typeof classifyColumnFromSchemaColumn>> = {};
  for (let index = 0; index < schema.columnNames.length; index += 1) {
    const columnName = schema.columnNames[index] ?? "";
    columns[columnName] = classifyColumnFromSchemaColumn({
      workspaceId: schema.workspaceId,
      dataSourceId: schema.dataSourceId,
      column: Object.freeze({
        columnName,
        detectedType: mapLegacyDetectedType(schema.detectedTypes[index]),
        uniqueValueCount: 0,
        nullPercentage: schema.detectedTypes[index] === "empty" ? 100 : 0,
        sampleValues: Object.freeze([]),
      }),
      classifiedAt: timestamp,
    });
  }

  return Object.freeze({
    contractVersion: WORKSPACE_COLUMN_CLASSIFICATION_VERSION,
    workspaceId: schema.workspaceId,
    dataSourceId: schema.dataSourceId,
    fileName: schema.fileName,
    columns: Object.freeze(columns),
    classifiedAt: timestamp,
    updatedAt: timestamp,
  });
}

export function saveWorkspaceColumnClassificationProfile(
  profile: WorkspaceColumnClassificationProfile
): ColumnClassificationMutationResult {
  const timestamp = profile.updatedAt || nowIso();
  const columns: Record<string, ReturnType<typeof classifyColumnFromSchemaColumn>> = {};
  for (const entry of profile.columns) {
    columns[entry.columnName] = classifyColumnFromSchemaColumn({
      workspaceId: profile.workspaceId,
      dataSourceId: profile.dataSourceId,
      column: Object.freeze({
        columnName: entry.columnName,
        detectedType: "unknown",
        uniqueValueCount: 0,
        nullPercentage: 0,
        sampleValues: Object.freeze([]),
      }),
      classifiedAt: timestamp,
    });
  }

  const result = persistWorkspaceDataSourceColumnClassificationProfile(
    Object.freeze({
      contractVersion: WORKSPACE_COLUMN_CLASSIFICATION_VERSION,
      workspaceId: profile.workspaceId,
      dataSourceId: profile.dataSourceId,
      fileName: profile.fileName,
      columns: Object.freeze(columns),
      classifiedAt: profile.classifiedAt,
      updatedAt: timestamp,
    })
  );

  const saved = readWorkspaceColumnClassificationProfile(profile.workspaceId, profile.dataSourceId);
  return toLegacyColumnClassificationMutationResult({
    success: result.success,
    profile: saved,
    reason: result.reason,
    created: result.created,
  });
}

export function classifyAndSaveWorkspaceColumnsFromSchema(
  schema: DataSourceSchemaProfile,
  classifiedAt?: string
): ColumnClassificationMutationResult {
  const ds11Result = classifyDataSourceColumns(schema.workspaceId, schema.dataSourceId);
  if (ds11Result.success) {
    const profile = readWorkspaceColumnClassificationProfile(schema.workspaceId, schema.dataSourceId);
    return toLegacyColumnClassificationMutationResult({
      success: true,
      profile,
      reason: ds11Result.reason,
      created: ds11Result.created,
    });
  }

  const fallbackResult = persistWorkspaceDataSourceColumnClassificationProfile(
    buildProfileFromLegacySchema(schema, classifiedAt)
  );
  const profile = readWorkspaceColumnClassificationProfile(schema.workspaceId, schema.dataSourceId);
  return toLegacyColumnClassificationMutationResult({
    success: fallbackResult.success,
    profile,
    reason: fallbackResult.success ? "classified_from_legacy_schema" : fallbackResult.reason,
    created: fallbackResult.created,
  });
}

export function removeWorkspaceColumnClassificationProfile(
  workspaceId: WorkspaceId,
  dataSourceId: string
): ColumnClassificationMutationResult {
  const existing = readWorkspaceColumnClassificationProfile(workspaceId, dataSourceId);
  const result = removeWorkspaceColumnClassificationProfileFromStore(workspaceId, dataSourceId);
  return toLegacyColumnClassificationMutationResult({
    success: result.success,
    profile: existing,
    reason: result.reason,
    created: false,
  });
}

export function resetWorkspaceColumnClassificationForTests(): void {
  resetWorkspaceColumnClassificationStoreForTests();
  columnClassificationListeners.clear();
}

export type {
  ColumnClassificationConfidence,
  ColumnClassificationEntry,
  ColumnClassificationKind,
  ColumnClassificationMutationResult,
  WorkspaceColumnClassificationProfile,
};
