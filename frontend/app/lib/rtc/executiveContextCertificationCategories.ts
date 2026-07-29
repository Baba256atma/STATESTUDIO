/**
 * RTC-1:7 — Executive Context Certification Categories.
 *
 * Exactly twelve canonical certification categories.
 * Category identities become part of the public certification contract.
 *
 * Ownership: owned exclusively by RTC-1:7.
 */

/** Canonical certification category name. */
export type ExecutiveContextCertificationCategoryName =
  | "Architecture"
  | "Identity"
  | "Registry"
  | "Model"
  | "Validation"
  | "Manifest"
  | "Platform"
  | "Contracts"
  | "Dependencies"
  | "Quality"
  | "Compatibility"
  | "ReleaseReadiness";

/** Certification category declaration. */
export interface ExecutiveContextCertificationCategoryDeclaration {
  readonly categoryId: `RTC-1:7/Category/${ExecutiveContextCertificationCategoryName}`;
  readonly categoryName: ExecutiveContextCertificationCategoryName;
  readonly description: string;
  readonly order: number;
  readonly removable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

const category = (
  categoryName: ExecutiveContextCertificationCategoryName,
  description: string,
  order: number,
): ExecutiveContextCertificationCategoryDeclaration =>
  Object.freeze({
    categoryId: `RTC-1:7/Category/${categoryName}` as const,
    categoryName,
    description,
    order,
    removable: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/** Exactly twelve certification categories. */
export const ExecutiveContextCertificationCategories = Object.freeze([
  category("Architecture", "Verifies architectural compliance and boundaries.", 1),
  category("Identity", "Verifies unique and immutable Runtime identity.", 2),
  category("Registry", "Verifies Registry integrity and unique identities.", 3),
  category("Model", "Verifies Model structure and ownership integrity.", 4),
  category("Validation", "Verifies Validation integrity and rule baseline.", 5),
  category("Manifest", "Verifies Manifest completeness and baselines.", 6),
  category("Platform", "Verifies Platform service and event contracts.", 7),
  category("Contracts", "Verifies API stability and contract uniqueness.", 8),
  category("Dependencies", "Verifies upstream dependency chain integrity.", 9),
  category("Quality", "Verifies TypeScript, lint, and repository quality.", 10),
  category("Compatibility", "Verifies contract-level consumer compatibility.", 11),
  category(
    "ReleaseReadiness",
    "Verifies release readiness for Freeze progression.",
    12,
  ),
] as const);

export const ExecutiveContextCertificationCategoryNames = Object.freeze([
  "Architecture",
  "Identity",
  "Registry",
  "Model",
  "Validation",
  "Manifest",
  "Platform",
  "Contracts",
  "Dependencies",
  "Quality",
  "Compatibility",
  "ReleaseReadiness",
] as const satisfies readonly ExecutiveContextCertificationCategoryName[]);
