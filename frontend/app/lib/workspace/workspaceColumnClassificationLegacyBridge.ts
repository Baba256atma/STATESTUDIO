/**
 * Legacy DS-1:2 bridge for DS-1:3 candidate discovery and certification harnesses.
 */

import type {
  ColumnClassificationConfidence,
  ColumnClassificationEntry,
  ColumnClassificationKind,
  ColumnClassificationMutationResult,
  WorkspaceColumnClassificationProfile,
} from "./columnClassificationContract.ts";
import { COLUMN_CLASSIFICATION_VERSION } from "./columnClassificationContract.ts";
import type {
  ColumnBusinessRole,
  WorkspaceColumnClassification,
  WorkspaceDataSourceColumnClassificationProfile,
} from "./workspaceColumnClassificationContract.ts";

function mapBusinessRoleToLegacyKind(role: ColumnBusinessRole): ColumnClassificationKind {
  switch (role) {
    case "Identifier":
      return "identifier";
    case "Name":
      return "name";
    case "Metric":
    case "Currency":
    case "Percentage":
    case "Quantity":
      return "metric";
    case "Date":
      return "date";
    case "Category":
    case "Location":
      return "category";
    case "Status":
    case "Boolean":
      return "status";
    case "Text":
    case "Unknown":
    default:
      return "unknown";
  }
}

function mapConfidenceToLegacy(confidence: number): ColumnClassificationConfidence {
  if (confidence >= 0.8) return "high";
  if (confidence >= 0.5) return "medium";
  return "low";
}

function resolveLegacyBusinessMeaning(kind: ColumnClassificationKind): string {
  switch (kind) {
    case "identifier":
      return "Entity Identifier";
    case "name":
      return "Entity Name";
    case "metric":
      return "Metric";
    case "category":
      return "Category";
    case "date":
      return "Time";
    case "status":
      return "Status";
    case "unknown":
    default:
      return "Unknown";
  }
}

export function toLegacyColumnClassificationEntry(
  classification: WorkspaceColumnClassification
): ColumnClassificationEntry {
  const kind = mapBusinessRoleToLegacyKind(classification.businessRole);
  return Object.freeze({
    columnName: classification.columnName,
    classification: kind,
    businessMeaning: resolveLegacyBusinessMeaning(kind),
    confidence: mapConfidenceToLegacy(classification.confidence),
    signals: Object.freeze([classification.reason]),
  });
}

export function toLegacyWorkspaceColumnClassificationProfile(
  profile: WorkspaceDataSourceColumnClassificationProfile
): WorkspaceColumnClassificationProfile {
  return Object.freeze({
    contractVersion: COLUMN_CLASSIFICATION_VERSION,
    workspaceId: profile.workspaceId,
    dataSourceId: profile.dataSourceId,
    fileName: profile.fileName,
    columns: Object.freeze(
      Object.values(profile.columns).map((classification) =>
        toLegacyColumnClassificationEntry(classification)
      )
    ),
    classifiedAt: profile.classifiedAt,
    updatedAt: profile.updatedAt,
  });
}

export function toLegacyColumnClassificationMutationResult(input: {
  success: boolean;
  profile: WorkspaceDataSourceColumnClassificationProfile | null;
  reason: string;
  created: boolean;
}): ColumnClassificationMutationResult {
  return Object.freeze({
    success: input.success,
    profile: input.profile ? toLegacyWorkspaceColumnClassificationProfile(input.profile) : null,
    reason: input.reason,
    created: input.created,
  });
}
