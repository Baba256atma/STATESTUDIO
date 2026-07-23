/**
 * EIL-8:4 — Executive Integration Suite Validation Inventory.
 *
 * Dynamically derived inventory over categories, rules, and gates.
 * Model inventory referenced exclusively from Model aggregate.
 * Canonical inventory source for later phases. Metadata-only.
 *
 * Ownership: owned exclusively by EIL-8:4.
 */

import { ExecutiveIntegrationSuiteModel } from "./executiveIntegrationSuiteModel.ts";
import { ExecutiveIntegrationSuiteValidationCategories } from "./executiveIntegrationSuiteValidationCategories.ts";
import { ExecutiveIntegrationSuiteValidationGates } from "./executiveIntegrationSuiteValidationGates.ts";
import { ExecutiveIntegrationSuiteValidationRules } from "./executiveIntegrationSuiteValidationRules.ts";

/**
 * Dynamically derived Validation inventory.
 */
export const ExecutiveIntegrationSuiteValidationInventory = Object.freeze({
  inventoryId: "EIL-8:4/Inventory" as const,
  categoryCount: ExecutiveIntegrationSuiteValidationCategories.length,
  ruleCount: ExecutiveIntegrationSuiteValidationRules.length,
  gateCount: ExecutiveIntegrationSuiteValidationGates.length,
  totalValidationInventory:
    ExecutiveIntegrationSuiteValidationCategories.length +
    ExecutiveIntegrationSuiteValidationRules.length +
    ExecutiveIntegrationSuiteValidationGates.length,
  modelInventory: ExecutiveIntegrationSuiteModel.inventory,
  modelTotalInstanceCount:
    ExecutiveIntegrationSuiteModel.inventory.totalModelInstanceCount,
  countsDerivedFromCollections: true as const,
  hardcodedTotals: false as const,
  canonicalInventorySource: true as const,
  modelReferencesExclusive: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
