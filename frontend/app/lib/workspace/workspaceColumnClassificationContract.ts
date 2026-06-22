/**
 * DS-1:2 — Workspace column classification contract.
 * Classifies schema columns into business roles only — no objects, scene, or KPI writes.
 */

import type { WorkspaceId } from "./workspaceRegistryContract.ts";
import type { WorkspaceDataSourceDetectedColumnType } from "./workspaceDataSourceSchemaContract.ts";

export const WORKSPACE_COLUMN_CLASSIFICATION_VERSION = "DS-1:2" as const;

export const WORKSPACE_COLUMN_CLASSIFICATION_TAGS = Object.freeze([
  "[DS12_COLUMN_CLASSIFICATION]",
  "[COLUMN_BUSINESS_ROLE_READY]",
  "[COLUMN_CLASSIFICATION_PERSISTED]",
  "[WORKSPACE_COLUMN_ISOLATION]",
  "[DS13_READY]",
  "[DS_1_2_COMPLETE]",
] as const);

export const NEXORA_COLUMN_CLASSIFICATION_LOG_PREFIX = "[NexoraColumnClassification]" as const;

export const WORKSPACE_COLUMN_CLASSIFICATION_SOURCE = "ds-1:1-schema" as const;

export type ColumnBusinessRole =
  | "Identifier"
  | "Name"
  | "Metric"
  | "Currency"
  | "Percentage"
  | "Date"
  | "Category"
  | "Status"
  | "Boolean"
  | "Quantity"
  | "Location"
  | "Text"
  | "Unknown";

export type WorkspaceColumnClassificationSource = typeof WORKSPACE_COLUMN_CLASSIFICATION_SOURCE;

export type WorkspaceColumnClassification = Readonly<{
  workspaceId: WorkspaceId;
  dataSourceId: string;
  columnName: string;
  detectedType: WorkspaceDataSourceDetectedColumnType;
  businessRole: ColumnBusinessRole;
  confidence: number;
  reason: string;
  classifiedAt: string;
  source: WorkspaceColumnClassificationSource;
}>;

export type WorkspaceColumnClassificationMap = Readonly<
  Record<string, WorkspaceColumnClassification>
>;

export type WorkspaceDataSourceColumnClassificationProfile = Readonly<{
  contractVersion: typeof WORKSPACE_COLUMN_CLASSIFICATION_VERSION;
  workspaceId: WorkspaceId;
  dataSourceId: string;
  fileName: string;
  columns: WorkspaceColumnClassificationMap;
  classifiedAt: string;
  updatedAt: string;
}>;

export type WorkspaceColumnClassificationStore = Readonly<
  Record<WorkspaceId, Readonly<Record<string, WorkspaceDataSourceColumnClassificationProfile>>>
>;

export type ClassifyDataSourceColumnsResult = Readonly<{
  success: boolean;
  classifications: readonly WorkspaceColumnClassification[];
  reason: string;
  created: boolean;
}>;

export const WORKSPACE_COLUMN_BUSINESS_ROLES: readonly ColumnBusinessRole[] = Object.freeze([
  "Identifier",
  "Name",
  "Metric",
  "Currency",
  "Percentage",
  "Date",
  "Category",
  "Status",
  "Boolean",
  "Quantity",
  "Location",
  "Text",
  "Unknown",
]);

export function workspaceColumnClassificationIsComplete(
  classification: WorkspaceColumnClassification | null | undefined
): classification is WorkspaceColumnClassification {
  if (!classification || typeof classification !== "object") return false;
  if (typeof classification.workspaceId !== "string" || !classification.workspaceId.trim()) return false;
  if (typeof classification.dataSourceId !== "string" || !classification.dataSourceId.trim()) return false;
  if (typeof classification.columnName !== "string" || !classification.columnName.trim()) return false;
  if (!WORKSPACE_COLUMN_BUSINESS_ROLES.includes(classification.businessRole)) return false;
  if (!Number.isFinite(classification.confidence) || classification.confidence < 0 || classification.confidence > 1) {
    return false;
  }
  if (typeof classification.reason !== "string" || !classification.reason.trim()) return false;
  if (typeof classification.classifiedAt !== "string" || !classification.classifiedAt.trim()) return false;
  return classification.source === WORKSPACE_COLUMN_CLASSIFICATION_SOURCE;
}

export function workspaceDataSourceColumnClassificationProfileIsComplete(
  profile: WorkspaceDataSourceColumnClassificationProfile | null | undefined
): profile is WorkspaceDataSourceColumnClassificationProfile {
  if (!profile || typeof profile !== "object") return false;
  if (profile.contractVersion !== WORKSPACE_COLUMN_CLASSIFICATION_VERSION) return false;
  if (typeof profile.workspaceId !== "string" || !profile.workspaceId.trim()) return false;
  if (typeof profile.dataSourceId !== "string" || !profile.dataSourceId.trim()) return false;
  if (typeof profile.fileName !== "string" || !profile.fileName.trim()) return false;
  if (!profile.columns || typeof profile.columns !== "object") return false;
  return Object.values(profile.columns).every(workspaceColumnClassificationIsComplete);
}
