/**
 * EX-1:8 — Executive Stage Extensions.
 *
 * Approved extension categories. Canonical identities must remain unchanged.
 *
 * Ownership: owned exclusively by EX-1:8.
 */

/** Extension category name. */
export type ExecutiveStageExtensionCategoryName =
  | "Object Types"
  | "Overlay Types"
  | "Interaction Types"
  | "Relationship Types"
  | "Metadata Fields"
  | "Visual States"
  | "Viewport Features"
  | "Future Stage Modules";

/** Extension category declaration. */
export interface ExecutiveStageExtensionCategory {
  readonly extensionId: string;
  readonly name: ExecutiveStageExtensionCategoryName;
  readonly order: number;
  readonly existingIdentitiesRemainStable: true;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const extension = (
  name: ExecutiveStageExtensionCategoryName,
  order: number,
): ExecutiveStageExtensionCategory =>
  Object.freeze({
    extensionId: `EX-1:8/Extension/${String(order).padStart(2, "0")}`,
    name,
    order,
    existingIdentitiesRemainStable: true as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly eight approved extension categories. */
export const ExecutiveStageExtensionCategories = Object.freeze([
  extension("Object Types", 1),
  extension("Overlay Types", 2),
  extension("Interaction Types", 3),
  extension("Relationship Types", 4),
  extension("Metadata Fields", 5),
  extension("Visual States", 6),
  extension("Viewport Features", 7),
  extension("Future Stage Modules", 8),
] as const);

export const ExecutiveStageExtensionCategoryNames = Object.freeze([
  "Object Types",
  "Overlay Types",
  "Interaction Types",
  "Relationship Types",
  "Metadata Fields",
  "Visual States",
  "Viewport Features",
  "Future Stage Modules",
] as const satisfies readonly ExecutiveStageExtensionCategoryName[]);

/** Extension policy for the frozen release. */
export const ExecutiveStageFreezeExtensionPolicy = Object.freeze({
  policyId: "EX-1:8/ExtensionPolicy",
  categories: ExecutiveStageExtensionCategories,
  categoryNames: ExecutiveStageExtensionCategoryNames,
  categoryCount: ExecutiveStageExtensionCategories.length,
  notAllowed: Object.freeze([
    "changing canonical identities",
    "removing public contracts",
    "renaming frozen exports",
    "altering architectural ordering",
    "reordering canonical layers",
  ] as const),
  existingIdentitiesRemainStable: true as const,
  metadataOnly: true as const,
  immutable: true as const,
} as const);
