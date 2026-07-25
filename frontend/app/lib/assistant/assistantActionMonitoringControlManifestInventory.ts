/** ASSISTANT-9:5 — Validation-Platform-derived Manifest inventories. */
import { AssistantActionMonitoringControlValidation } from "./assistantActionMonitoringControlValidation.ts";
import { AssistantActionMonitoringControlManifestCompatibility } from "./assistantActionMonitoringControlManifestCompatibility.ts";
import { AssistantActionMonitoringControlManifestReadiness } from "./assistantActionMonitoringControlManifestReadiness.ts";

const validation = AssistantActionMonitoringControlValidation;
const platform = validation.platform;
const inventories = platform.inventories;
const totals = platform.inventoryTotals;

export const AssistantActionMonitoringControlManifestSections =
  Object.freeze([
    Object.freeze({
      section: "Foundation Inventory",
      order: 1,
      inventory: inventories.foundation,
    }),
    Object.freeze({
      section: "Registry Inventory",
      order: 2,
      inventory: inventories.registry,
    }),
    Object.freeze({
      section: "Model Inventory",
      order: 3,
      inventory: inventories.domainModels,
    }),
    Object.freeze({
      section: "Relationship Inventory",
      order: 4,
      inventory: inventories.relationships,
    }),
    Object.freeze({
      section: "Capability Inventory",
      order: 5,
      inventory: inventories.capabilities,
    }),
    Object.freeze({
      section: "Contract Inventory",
      order: 6,
      inventory: inventories.contracts,
    }),
    Object.freeze({
      section: "Lifecycle Inventory",
      order: 7,
      inventory: inventories.lifecycle,
    }),
    Object.freeze({
      section: "Policy Inventory",
      order: 8,
      inventory: inventories.policies,
    }),
    Object.freeze({
      section: "Validation Inventory",
      order: 9,
      inventory: Object.freeze({
        categories: inventories.validationCategories,
        rules: inventories.validationRules,
        results: inventories.validationResults,
        status: platform.validationStatus,
        readiness: platform.readiness,
      }),
    }),
    Object.freeze({
      section: "Platform Readiness",
      order: 10,
      inventory: AssistantActionMonitoringControlManifestReadiness,
    }),
  ]);

export const AssistantActionMonitoringControlManifestInventory =
  Object.freeze({
    sections: AssistantActionMonitoringControlManifestSections,
    foundationInventory: inventories.foundation,
    registryInventory: inventories.registry,
    modelInventory: inventories.domainModels,
    relationshipInventory: inventories.relationships,
    capabilityInventory: inventories.capabilities,
    contractInventory: inventories.contracts,
    lifecycleInventory: inventories.lifecycle,
    policyInventory: inventories.policies,
    validationInventory: Object.freeze({
      categories: inventories.validationCategories,
      rules: inventories.validationRules,
      results: inventories.validationResults,
      status: platform.validationStatus,
      readiness: platform.readiness,
    }),
    platformReadinessInventory:
      AssistantActionMonitoringControlManifestReadiness,
    compatibilityInventory:
      AssistantActionMonitoringControlManifestCompatibility,
    totals: Object.freeze({
      validationCategoryCount: totals.validationCategoryCount,
      validationRuleCount: totals.validationRuleCount,
      capabilityCount: totals.capabilityCount,
      contractCount: totals.contractCount,
      modelKindCount: totals.modelKindCount,
      relationshipKindCount: totals.relationshipKindCount,
      lifecycleStateCount: totals.lifecycleStateCount,
      policyCount: totals.policyCount,
    }),
    source: validation,
    sourceValidationPlatform: platform,
    canonicalInventoryRule: "Validation Platform References Only",
    duplicatedDefinitions: false,
    independentlyMaintainedCounts: false,
    recalculatedMetadata: false,
    reconstructedInventories: false,
    metadataOnly: true,
    immutable: true,
  } as const);
