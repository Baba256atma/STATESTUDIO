/**
 * EX-1:4 — Executive Stage Validation Categories.
 *
 * Ten canonical validation categories in fixed execution order.
 * Future phases may extend categories but may not remove them.
 *
 * Ownership: owned exclusively by EX-1:4.
 */

/** Canonical validation category names. */
export type ExecutiveStageValidationCategoryName =
  | "Identity"
  | "Structure"
  | "Layers"
  | "Objects"
  | "Relationships"
  | "Focus"
  | "Interactions"
  | "Runtime Binding"
  | "Metadata"
  | "Integrity";

/** Category declaration with deterministic execution order. */
export interface ExecutiveStageValidationCategoryDeclaration {
  readonly categoryId: string;
  readonly categoryName: ExecutiveStageValidationCategoryName;
  readonly description: string;
  readonly executionOrder: number;
  readonly removable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const category = (
  categoryName: ExecutiveStageValidationCategoryName,
  description: string,
  executionOrder: number,
): ExecutiveStageValidationCategoryDeclaration =>
  Object.freeze({
    categoryId: `EX-1:4/Category/${categoryName.replace(/\s+/g, "")}`,
    categoryName,
    description,
    executionOrder,
    removable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Fixed validation execution order.
 * Identity → Structure → Layers → Objects → Relationships →
 * Focus → Interactions → Runtime Binding → Metadata → Integrity
 */
export const ExecutiveStageValidationCategories = Object.freeze([
  category("Identity", "Validates Stage and entity identities.", 1),
  category("Structure", "Validates root structure and required entities.", 2),
  category("Layers", "Validates canonical layer presence and order.", 3),
  category("Objects", "Validates Stage object identities and references.", 4),
  category(
    "Relationships",
    "Validates visual relationship structure and types.",
    5,
  ),
  category("Focus", "Validates executive focus consistency.", 6),
  category(
    "Interactions",
    "Validates registered interaction boundaries.",
    7,
  ),
  category(
    "Runtime Binding",
    "Validates immutable Runtime reference bindings.",
    8,
  ),
  category("Metadata", "Validates Stage metadata completeness.", 9),
  category("Integrity", "Validates global Stage integrity invariants.", 10),
] as const);

export const ExecutiveStageValidationCategoryNames = Object.freeze([
  "Identity",
  "Structure",
  "Layers",
  "Objects",
  "Relationships",
  "Focus",
  "Interactions",
  "Runtime Binding",
  "Metadata",
  "Integrity",
] as const satisfies readonly ExecutiveStageValidationCategoryName[]);

/** Fixed execution sequence — order must not change. */
export const ExecutiveStageValidationExecutionOrder =
  ExecutiveStageValidationCategoryNames;
