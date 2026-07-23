/**
 * EIL-7:4 — Integration Governance Validation Inventory.
 *
 * Dynamically derived inventory over categories, rules, and gates.
 * Canonical inventory source for later phases. Metadata-only.
 *
 * Ownership: owned exclusively by EIL-7:4.
 */

import { IntegrationGovernanceValidationCategories } from "./integrationGovernanceValidationCategories.ts";
import { IntegrationGovernanceValidationGates } from "./integrationGovernanceValidationGates.ts";
import { IntegrationGovernanceValidationRules } from "./integrationGovernanceValidationRules.ts";

/**
 * Dynamically derived Validation inventory.
 */
export const IntegrationGovernanceValidationInventory = Object.freeze({
  inventoryId: "EIL-7:4/Inventory" as const,
  categoryCount: IntegrationGovernanceValidationCategories.length,
  ruleCount: IntegrationGovernanceValidationRules.length,
  gateCount: IntegrationGovernanceValidationGates.length,
  totalValidationInventory:
    IntegrationGovernanceValidationCategories.length +
    IntegrationGovernanceValidationRules.length +
    IntegrationGovernanceValidationGates.length,
  countsDerivedFromCollections: true as const,
  canonicalInventorySource: true as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
