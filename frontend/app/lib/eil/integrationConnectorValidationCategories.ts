/**
 * EIL-2:4 — Integration Connector Validation Categories.
 *
 * Immutable validation category declarations.
 * Metadata-only. No validation execution.
 *
 * Ownership: owned exclusively by EIL-2:4.
 */

import type {
  IntegrationConnectorValidationCategory,
  IntegrationConnectorValidationCategoryId,
} from "./integrationConnectorValidationTypes.ts";

const category = (
  key: IntegrationConnectorValidationCategoryId,
  canonicalName: string,
  description: string,
  ordinal: number,
): IntegrationConnectorValidationCategory =>
  Object.freeze({
    categoryId: `EIL-2:4/Category/${key}` as const,
    key,
    canonicalName,
    description,
    ownership: "EIL-2:4" as const,
    ordinal,
    tags: Object.freeze(["category", key.toLowerCase()]),
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

/**
 * Exactly sixteen validation categories.
 */
export const IntegrationConnectorValidationCategories: readonly IntegrationConnectorValidationCategory[] =
  Object.freeze([
    category("Identity", "Identity", "Validate canonical connector identity consistency.", 1),
    category("Namespace", "Namespace", "Validate namespace integrity across connector phases.", 2),
    category("Registry", "Registry", "Validate connector registry completeness metadata.", 3),
    category("DomainModel", "Domain Model", "Validate connector domain model completeness metadata.", 4),
    category("EndpointModel", "Endpoint Model", "Validate connector endpoint model integrity metadata.", 5),
    category("ProtocolModel", "Protocol Model", "Validate connector protocol model integrity metadata.", 6),
    category("Relationship", "Relationship", "Validate connector relationship consistency metadata.", 7),
    category("Dependency", "Dependency", "Validate dependency direction and aggregate-only imports.", 8),
    category("Compatibility", "Compatibility", "Validate connector compatibility declaration metadata.", 9),
    category("Lifecycle", "Lifecycle", "Validate connector lifecycle coverage metadata.", 10),
    category("Inventory", "Inventory", "Validate inventory derivation metadata.", 11),
    category("Export", "Export", "Validate aggregate export integrity metadata.", 12),
    category("Immutability", "Immutability", "Validate metadata immutability declarations.", 13),
    category("Determinism", "Determinism", "Validate deterministic ordering declarations.", 14),
    category("Readiness", "Readiness", "Validate readiness declaration metadata.", 15),
    category("Architecture", "Architecture", "Validate metadata-only architecture compliance.", 16),
  ]);
