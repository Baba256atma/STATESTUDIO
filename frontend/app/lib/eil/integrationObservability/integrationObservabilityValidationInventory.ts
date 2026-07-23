/**
 * EIL-6:4 — Integration Observability Validation Inventory.
 *
 * Dynamically derived inventory over categories, rules, and gates.
 * Metadata-only. No synthetic entries.
 *
 * Ownership: owned exclusively by EIL-6:4.
 */

import { IntegrationObservabilityValidationCategories } from "./integrationObservabilityValidationCategories.ts";
import { IntegrationObservabilityValidationGates } from "./integrationObservabilityValidationGates.ts";
import { IntegrationObservabilityValidationRules } from "./integrationObservabilityValidationRules.ts";

/**
 * Dynamically derived Validation inventory.
 */
export const IntegrationObservabilityValidationInventory = Object.freeze({
  inventoryId: "EIL-6:4/Inventory" as const,
  categoryCount: IntegrationObservabilityValidationCategories.length,
  ruleCount: IntegrationObservabilityValidationRules.length,
  gateCount: IntegrationObservabilityValidationGates.length,
  totalValidationInventory:
    IntegrationObservabilityValidationCategories.length +
    IntegrationObservabilityValidationRules.length +
    IntegrationObservabilityValidationGates.length,
  countsDerivedFromCollections: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
