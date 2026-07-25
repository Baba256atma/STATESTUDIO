/** ASSISTANT-8:6 — Manifest-derived Platform inventory metadata. */
import { ExecutiveActionExecutionManifest } from "./executiveActionExecutionManifest.ts";
import { ExecutionPlatformCapabilities } from "./executionPlatformCapabilities.ts";
import { ExecutionPlatformCompatibility } from "./executionPlatformCompatibility.ts";
import { ExecutionPlatformExtensions } from "./executionPlatformExtensions.ts";
import { ExecutionPlatformGuarantees } from "./executionPlatformGuarantees.ts";
import { ExecutionPlatformReadiness } from "./executionPlatformMetadata.ts";

const manifest = ExecutiveActionExecutionManifest;

export const ExecutionPlatformInventory = Object.freeze({
  sourceManifest: manifest.identity,
  manifestInventory: manifest.inventory,
  manifestTotals: manifest.inventory.totals,
  capabilityCount: ExecutionPlatformCapabilities.length,
  guaranteeCount: ExecutionPlatformGuarantees.length,
  extensionCount: ExecutionPlatformExtensions.length,
  validationTotals: Object.freeze({
    categoryCount: manifest.inventory.totals.validationCategoryCount,
    ruleCount: manifest.inventory.totals.validationRuleCount,
    gateCount: manifest.inventory.totals.validationGateCount,
  }),
  inventoryTotals: manifest.inventory.totals,
  relationshipTotals: Object.freeze({
    relationshipModelCount:
      manifest.inventory.totals.relationshipModelCount,
  }),
  readiness: ExecutionPlatformReadiness,
  compatibility: ExecutionPlatformCompatibility,
  publishedInventoryCount: manifest.summary.publishedInventoryCount,
  canonicalCompositionRule: "Manifest References Only",
  duplicatedDefinitions: false,
  independentlyMaintainedCounts: false,
  recalculatedMetadata: false,
  reconstructedInventories: false,
  metadataOnly: true,
  immutable: true,
} as const);
