/** ASSISTANT-6:5 — Immutable Manifest summary derived from inventory. */
import { AssistantObjectContextManagementManifestConstants } from "./assistantObjectContextManagementManifest.constants.ts";
import { AssistantObjectContextManagementManifestIdentity } from "./assistantObjectContextManagementManifest.identity.ts";
import { AssistantObjectContextManagementManifestInventory } from "./assistantObjectContextManagementManifest.inventory.ts";
import type { AssistantObjectContextManagementManifestSummaryMetadata } from "./assistantObjectContextManagementManifest.types.ts";

export const AssistantObjectContextManagementManifestSummary:
AssistantObjectContextManagementManifestSummaryMetadata = Object.freeze({
  manifestId: AssistantObjectContextManagementManifestIdentity.id,
  validationStatus:
    AssistantObjectContextManagementManifestInventory.validationInventory
      .results.validationStatus,
  readiness: "ReadyForPlatform",
  architectureCompleteness: "Complete",
  inventoryCompleteness: "Complete",
  validationCompleteness: "Complete",
  consumerReadiness: "Ready",
  platformEligibility: "Eligible",
  publishedInventoryCount:
    AssistantObjectContextManagementManifestConstants.inventoryTotals
      .publishedInventoryCount,
  validationRuleCount:
    AssistantObjectContextManagementManifestConstants.inventoryTotals
      .validationRuleCount,
  validationGateCount:
    AssistantObjectContextManagementManifestConstants.inventoryTotals
      .validationGateCount,
  canonicalInventoryRuleSatisfied: true,
  metadataOnly: true,
  immutable: true,
});
