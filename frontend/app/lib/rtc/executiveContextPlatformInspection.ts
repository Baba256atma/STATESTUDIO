/**
 * RTC-1:6 — Executive Context Platform Inspection.
 *
 * Runtime diagnostics contracts. Inspection never modifies Runtime.
 *
 * Ownership: owned exclusively by RTC-1:6.
 */

/** Canonical inspection category name. */
export type ExecutiveContextPlatformInspectionCategoryName =
  | "RuntimeIdentity"
  | "PlatformVersion"
  | "ActiveContext"
  | "SnapshotCount"
  | "ValidationStatus"
  | "RuntimeStatus"
  | "PlatformReadiness";

/** Inspection category declaration. */
export interface ExecutiveContextPlatformInspectionCategory {
  readonly categoryId:
    `RTC-1:6/Inspection/${ExecutiveContextPlatformInspectionCategoryName}`;
  readonly categoryName: ExecutiveContextPlatformInspectionCategoryName;
  readonly description: string;
  readonly order: number;
  readonly modifiesRuntime: false;
  readonly readOnly: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const category = (
  categoryName: ExecutiveContextPlatformInspectionCategoryName,
  description: string,
  order: number,
): ExecutiveContextPlatformInspectionCategory =>
  Object.freeze({
    categoryId: `RTC-1:6/Inspection/${categoryName}` as const,
    categoryName,
    description,
    order,
    modifiesRuntime: false as const,
    readOnly: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly seven inspection categories. */
export const ExecutiveContextPlatformInspectionCategories = Object.freeze([
  category(
    "RuntimeIdentity",
    "Inspect Runtime identity metadata.",
    1,
  ),
  category(
    "PlatformVersion",
    "Inspect Platform version metadata.",
    2,
  ),
  category(
    "ActiveContext",
    "Inspect the active Executive Context identity.",
    3,
  ),
  category(
    "SnapshotCount",
    "Inspect registered snapshot count metadata.",
    4,
  ),
  category(
    "ValidationStatus",
    "Inspect validation completeness status.",
    5,
  ),
  category(
    "RuntimeStatus",
    "Inspect Runtime status metadata.",
    6,
  ),
  category(
    "PlatformReadiness",
    "Inspect Platform readiness metadata.",
    7,
  ),
] as const);

export const ExecutiveContextPlatformInspectionCategoryNames = Object.freeze([
  "RuntimeIdentity",
  "PlatformVersion",
  "ActiveContext",
  "SnapshotCount",
  "ValidationStatus",
  "RuntimeStatus",
  "PlatformReadiness",
] as const satisfies readonly ExecutiveContextPlatformInspectionCategoryName[]);

/** Inspection platform catalogue. */
export const ExecutiveContextPlatformInspection = Object.freeze({
  inspectionId: "RTC-1:6/InspectionPlatform",
  categories: ExecutiveContextPlatformInspectionCategories,
  categoryCount: ExecutiveContextPlatformInspectionCategories.length,
  modifiesRuntime: false as const,
  readOnly: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
} as const);
