/** ASSISTANT-9:6 — Manifest-derived Platform inventory metadata. */
import { AssistantActionMonitoringControlManifest } from "./assistantActionMonitoringControlManifest.ts";
import { AssistantActionMonitoringControlPlatformCompatibilitySummary } from "./assistantActionMonitoringControlPlatformCompatibility.ts";
import { AssistantActionMonitoringControlPlatformGuarantees } from "./assistantActionMonitoringControlPlatformGuarantees.ts";
import { AssistantActionMonitoringControlPlatformReadiness } from "./assistantActionMonitoringControlPlatformMetadata.ts";

const manifest = AssistantActionMonitoringControlManifest;
const inventory = manifest.inventory;
const totals = inventory.totals;

export const AssistantActionMonitoringControlPlatformInventory =
  Object.freeze({
    foundationInventory: inventory.foundationInventory,
    registryInventory: inventory.registryInventory,
    modelInventory: inventory.modelInventory,
    relationshipInventory: inventory.relationshipInventory,
    capabilityInventory: inventory.capabilityInventory,
    contractInventory: inventory.contractInventory,
    lifecycleInventory: inventory.lifecycleInventory,
    policyInventory: inventory.policyInventory,
    validationInventory: inventory.validationInventory,
    manifestInventory: inventory,
    totals: Object.freeze({
      foundationCount: [inventory.foundationInventory].length,
      registryCount: [inventory.registryInventory].length,
      modelKindCount: totals.modelKindCount,
      relationshipKindCount: totals.relationshipKindCount,
      validationCategoryCount: totals.validationCategoryCount,
      validationRuleCount: totals.validationRuleCount,
      capabilityCount: totals.capabilityCount,
      contractCount: totals.contractCount,
      lifecycleStateCount: totals.lifecycleStateCount,
      policyCount: totals.policyCount,
    }),
    guaranteeCount: AssistantActionMonitoringControlPlatformGuarantees.length,
    compatibilityCount:
      AssistantActionMonitoringControlPlatformCompatibilitySummary
        .declarations.length,
    readiness: AssistantActionMonitoringControlPlatformReadiness,
    sourceManifest: manifest.identity,
    canonicalInventoryRule: "Manifest References Only",
    duplicatedDefinitions: false,
    independentlyMaintainedCounts: false,
    recalculatedMetadata: false,
    reconstructedInventories: false,
    metadataOnly: true,
    immutable: true,
  } as const);
