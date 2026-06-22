import type { WorkspaceId } from "./workspaceRegistryContract.ts";

export const COLUMN_CLASSIFICATION_VERSION = "DS-1:2" as const;

export { WORKSPACE_COLUMN_CLASSIFICATION_TAGS as COLUMN_CLASSIFICATION_TAGS } from "./workspaceColumnClassificationContract.ts";

export type ColumnClassificationKind =
  | "identifier"
  | "name"
  | "metric"
  | "category"
  | "date"
  | "status"
  | "unknown";

export type ColumnClassificationConfidence = "high" | "medium" | "low";

export type ColumnClassificationEntry = Readonly<{
  columnName: string;
  classification: ColumnClassificationKind;
  businessMeaning: string;
  confidence: ColumnClassificationConfidence;
  signals: readonly string[];
}>;

export type WorkspaceColumnClassificationProfile = Readonly<{
  contractVersion: typeof COLUMN_CLASSIFICATION_VERSION;
  workspaceId: WorkspaceId;
  dataSourceId: string;
  fileName: string;
  columns: readonly ColumnClassificationEntry[];
  classifiedAt: string;
  updatedAt: string;
}>;

export type ColumnClassificationContract = Readonly<{
  contractVersion: typeof COLUMN_CLASSIFICATION_VERSION;
  classificationTypes: readonly ColumnClassificationKind[];
  businessMeanings: Readonly<Record<ColumnClassificationKind, string>>;
}>;

export const COLUMN_CLASSIFICATION_BUSINESS_MEANINGS: Readonly<
  Record<ColumnClassificationKind, string>
> = Object.freeze({
  identifier: "Entity Identifier",
  name: "Entity Name",
  metric: "Metric",
  category: "Category",
  date: "Time",
  status: "Status",
  unknown: "Unknown",
});

export const COLUMN_CLASSIFICATION_CONTRACT: ColumnClassificationContract = Object.freeze({
  contractVersion: COLUMN_CLASSIFICATION_VERSION,
  classificationTypes: Object.freeze([
    "identifier",
    "name",
    "metric",
    "category",
    "date",
    "status",
    "unknown",
  ] as const),
  businessMeanings: COLUMN_CLASSIFICATION_BUSINESS_MEANINGS,
});

export type ColumnClassificationMutationResult = Readonly<{
  success: boolean;
  profile: WorkspaceColumnClassificationProfile | null;
  reason: string;
  created: boolean;
}>;

export function columnClassificationProfileIsComplete(
  profile: WorkspaceColumnClassificationProfile | null | undefined
): profile is WorkspaceColumnClassificationProfile {
  if (!profile || typeof profile !== "object") return false;
  return (
    profile.contractVersion === COLUMN_CLASSIFICATION_VERSION &&
    typeof profile.workspaceId === "string" &&
    profile.workspaceId.trim().length > 0 &&
    typeof profile.dataSourceId === "string" &&
    profile.dataSourceId.trim().length > 0 &&
    typeof profile.fileName === "string" &&
    Array.isArray(profile.columns) &&
    profile.columns.every(
      (entry) =>
        typeof entry.columnName === "string" &&
        COLUMN_CLASSIFICATION_CONTRACT.classificationTypes.includes(entry.classification) &&
        typeof entry.businessMeaning === "string"
    )
  );
}

export function resolveColumnBusinessMeaning(
  classification: ColumnClassificationKind
): string {
  return COLUMN_CLASSIFICATION_BUSINESS_MEANINGS[classification];
}
