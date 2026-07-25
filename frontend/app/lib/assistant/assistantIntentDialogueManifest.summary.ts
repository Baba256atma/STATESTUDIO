/** ASSISTANT-3:5 — Immutable Manifest summary derived from inventory. */
import { AssistantIntentDialogueManifestConstants } from "./assistantIntentDialogueManifest.constants.ts";
import { AssistantIntentDialogueManifestIdentity } from "./assistantIntentDialogueManifest.identity.ts";
import { AssistantIntentDialogueManifestInventory } from "./assistantIntentDialogueManifest.inventory.ts";
import type { AssistantIntentDialogueManifestSummaryMetadata } from "./assistantIntentDialogueManifest.types.ts";

export const AssistantIntentDialogueManifestSummary:
AssistantIntentDialogueManifestSummaryMetadata = Object.freeze({
  manifestId: AssistantIntentDialogueManifestIdentity.id,
  validationStatus:
    AssistantIntentDialogueManifestInventory.validationInventory.results
      .validationStatus,
  readiness: "ReadyForPlatform",
  architectureCompleteness: "Complete",
  inventoryCompleteness: "Complete",
  validationCompleteness: "Complete",
  consumerReadiness: "Ready",
  platformEligibility: "Eligible",
  publishedInventoryCount:
    AssistantIntentDialogueManifestConstants.inventoryTotals
      .publishedInventoryCount,
  validationRuleCount:
    AssistantIntentDialogueManifestConstants.inventoryTotals
      .validationRuleCount,
  validationGateCount:
    AssistantIntentDialogueManifestConstants.inventoryTotals
      .validationGateCount,
  canonicalInventoryRuleSatisfied: true,
  metadataOnly: true,
  immutable: true,
});
