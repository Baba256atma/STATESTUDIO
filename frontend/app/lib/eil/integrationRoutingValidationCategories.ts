/**
 * EIL-3:4 — Integration Routing Validation Categories.
 *
 * Immutable validation category declarations.
 * Metadata-only. No validation execution.
 *
 * Ownership: owned exclusively by EIL-3:4.
 */

import type {
  RoutingValidationCategory,
  RoutingValidationCategoryId,
} from "./integrationRoutingValidationTypes.ts";

const category = (
  key: RoutingValidationCategoryId,
  canonicalName: string,
  description: string,
  ordinal: number,
): RoutingValidationCategory =>
  Object.freeze({
    categoryId: `EIL-3:4/Category/${key}` as const,
    key,
    canonicalName,
    description,
    ownership: "EIL-3:4" as const,
    ordinal,
    tags: Object.freeze(["category", key.toLowerCase()]),
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen validation categories.
 */
export const IntegrationRoutingValidationCategories: readonly RoutingValidationCategory[] =
  Object.freeze([
    category("Identity", "Identity", "Validate canonical routing identity consistency.", 1),
    category("Namespace", "Namespace", "Validate namespace integrity across routing phases.", 2),
    category("Registry", "Registry", "Validate routing registry completeness metadata.", 3),
    category("DomainModel", "Domain Model", "Validate routing domain model completeness metadata.", 4),
    category("Relationship", "Relationship", "Validate routing relationship consistency metadata.", 5),
    category("Topology", "Topology", "Validate routing topology model integrity metadata.", 6),
    category("Lifecycle", "Lifecycle", "Validate routing lifecycle coverage metadata.", 7),
    category("Dependency", "Dependency", "Validate dependency direction and aggregate-only imports.", 8),
    category("Compatibility", "Compatibility", "Validate routing compatibility declaration metadata.", 9),
    category("Inventory", "Inventory", "Validate inventory derivation metadata.", 10),
    category("Export", "Export", "Validate aggregate export integrity metadata.", 11),
    category("Immutability", "Immutability", "Validate metadata immutability declarations.", 12),
    category("Determinism", "Determinism", "Validate deterministic ordering declarations.", 13),
    category("Readiness", "Readiness", "Validate readiness declaration metadata.", 14),
    category("Architecture", "Architecture", "Validate metadata-only architecture compliance.", 15),
    category("Documentation", "Documentation", "Validate documentation integrity of validation metadata.", 16),
  ]);
