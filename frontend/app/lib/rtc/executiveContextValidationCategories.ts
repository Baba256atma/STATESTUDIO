/**
 * RTC-1:4 — Executive Context Validation Categories.
 *
 * Ten canonical validation categories in fixed execution order.
 * Future phases may extend categories but may not remove them.
 *
 * Ownership: owned exclusively by RTC-1:4.
 */

/** Canonical validation category names. */
export type ExecutiveContextValidationCategoryName =
  | "Identity"
  | "Structure"
  | "Ownership"
  | "References"
  | "Lifecycle"
  | "Workspace"
  | "Timeline"
  | "Focus"
  | "Metadata"
  | "Integrity";

/** Category declaration with deterministic execution order. */
export interface ExecutiveContextValidationCategoryDeclaration {
  readonly categoryId: `RTC-1:4/Category/${ExecutiveContextValidationCategoryName}`;
  readonly categoryName: ExecutiveContextValidationCategoryName;
  readonly description: string;
  readonly executionOrder: number;
  readonly removable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const category = (
  categoryName: ExecutiveContextValidationCategoryName,
  description: string,
  executionOrder: number,
): ExecutiveContextValidationCategoryDeclaration =>
  Object.freeze({
    categoryId: `RTC-1:4/Category/${categoryName}` as const,
    categoryName,
    description,
    executionOrder,
    removable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Fixed validation execution order.
 * Identity → Structure → Ownership → References → Lifecycle →
 * Workspace → Timeline → Focus → Metadata → Integrity
 */
export const ExecutiveContextValidationCategories = Object.freeze([
  category("Identity", "Validates context and entity identities.", 1),
  category("Structure", "Validates root structure and required entities.", 2),
  category("Ownership", "Validates hierarchical ownership integrity.", 3),
  category("References", "Validates immutable cross-entity references.", 4),
  category("Lifecycle", "Validates lifecycle state consistency.", 5),
  category("Workspace", "Validates active workspace consistency.", 6),
  category("Timeline", "Validates timeline entity consistency.", 7),
  category("Focus", "Validates executive focus consistency.", 8),
  category("Metadata", "Validates runtime metadata completeness.", 9),
  category("Integrity", "Validates global runtime integrity invariants.", 10),
] as const);

export const ExecutiveContextValidationCategoryNames = Object.freeze([
  "Identity",
  "Structure",
  "Ownership",
  "References",
  "Lifecycle",
  "Workspace",
  "Timeline",
  "Focus",
  "Metadata",
  "Integrity",
] as const satisfies readonly ExecutiveContextValidationCategoryName[]);

/** Fixed execution sequence — order must not change. */
export const ExecutiveContextValidationExecutionOrder =
  ExecutiveContextValidationCategoryNames;
