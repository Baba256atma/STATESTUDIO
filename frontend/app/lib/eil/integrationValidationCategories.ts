/**
 * EIL-1:4 — Integration Validation Categories.
 *
 * Immutable validation category declarations.
 * Metadata-only. No validation execution.
 *
 * Ownership: owned exclusively by EIL-1:4.
 */

import type {
  IntegrationValidationCategory,
  IntegrationValidationCategoryId,
} from "./integrationValidationTypes.ts";

const category = (
  key: IntegrationValidationCategoryId,
  canonicalName: string,
  description: string,
  ordinal: number,
): IntegrationValidationCategory =>
  Object.freeze({
    categoryId: `EIL-1:4/Category/${key}` as const,
    key,
    canonicalName,
    description,
    ownership: "EIL-1:4" as const,
    ordinal,
    tags: Object.freeze(["category", key.toLowerCase()]),
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen validation categories.
 */
export const IntegrationValidationCategories: readonly IntegrationValidationCategory[] =
  Object.freeze([
    category("Identity", "Identity", "Validate canonical identity consistency.", 1),
    category("Namespace", "Namespace", "Validate namespace consistency across phases.", 2),
    category("Dependency", "Dependency", "Validate dependency direction and aggregate-only imports.", 3),
    category("Registry", "Registry", "Validate registry completeness metadata.", 4),
    category("Model", "Model", "Validate model completeness metadata.", 5),
    category("Contract", "Contract", "Validate contract integrity metadata.", 6),
    category("Capability", "Capability", "Validate capability coverage metadata.", 7),
    category("Responsibility", "Responsibility", "Validate responsibility coverage metadata.", 8),
    category("Topology", "Topology", "Validate topology consistency metadata.", 9),
    category("Lifecycle", "Lifecycle", "Validate lifecycle consistency metadata.", 10),
    category("Compatibility", "Compatibility", "Validate compatibility declaration metadata.", 11),
    category("Boundary", "Boundary", "Validate boundary preservation metadata.", 12),
    category("Inventory", "Inventory", "Validate inventory derivation metadata.", 13),
    category("Export", "Export", "Validate export integrity metadata.", 14),
    category("Immutability", "Immutability", "Validate metadata immutability declarations.", 15),
    category("Determinism", "Determinism", "Validate deterministic ordering declarations.", 16),
  ]);
