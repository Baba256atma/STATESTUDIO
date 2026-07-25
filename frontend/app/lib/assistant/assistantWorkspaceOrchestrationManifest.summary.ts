/** ASSISTANT-5:5 — Immutable Manifest summary derived from inventory. */
import { AssistantWorkspaceOrchestrationManifestConstants } from "./assistantWorkspaceOrchestrationManifest.constants.ts";
import { AssistantWorkspaceOrchestrationManifestIdentity } from "./assistantWorkspaceOrchestrationManifest.identity.ts";
import { AssistantWorkspaceOrchestrationManifestInventory } from "./assistantWorkspaceOrchestrationManifest.inventory.ts";
import type { AssistantWorkspaceOrchestrationManifestSummaryMetadata } from "./assistantWorkspaceOrchestrationManifest.types.ts";

export const AssistantWorkspaceOrchestrationManifestSummary:
AssistantWorkspaceOrchestrationManifestSummaryMetadata = Object.freeze({
  manifestId: AssistantWorkspaceOrchestrationManifestIdentity.id,
  validationStatus:
    AssistantWorkspaceOrchestrationManifestInventory.validationInventory
      .results.validationStatus,
  readiness: "ReadyForPlatform",
  architectureCompleteness: "Complete",
  inventoryCompleteness: "Complete",
  validationCompleteness: "Complete",
  consumerReadiness: "Ready",
  platformEligibility: "Eligible",
  publishedInventoryCount:
    AssistantWorkspaceOrchestrationManifestConstants.inventoryTotals
      .publishedInventoryCount,
  validationRuleCount:
    AssistantWorkspaceOrchestrationManifestConstants.inventoryTotals
      .validationRuleCount,
  validationGateCount:
    AssistantWorkspaceOrchestrationManifestConstants.inventoryTotals
      .validationGateCount,
  canonicalInventoryRuleSatisfied: true,
  metadataOnly: true,
  immutable: true,
});
