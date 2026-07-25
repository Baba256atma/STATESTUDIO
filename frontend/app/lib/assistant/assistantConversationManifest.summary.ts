/** ASSISTANT-1:5 — Immutable Manifest summary derived from inventory. */
import { AssistantConversationManifestConstants } from "./assistantConversationManifest.constants.ts";
import { AssistantConversationManifestIdentity } from "./assistantConversationManifest.identity.ts";
import { AssistantConversationManifestInventory } from "./assistantConversationManifest.inventory.ts";
import type { AssistantConversationManifestSummaryMetadata } from "./assistantConversationManifest.types.ts";

export const AssistantConversationManifestSummary:
AssistantConversationManifestSummaryMetadata = Object.freeze({
  manifestId: AssistantConversationManifestIdentity.id,
  validationStatus:
    AssistantConversationManifestInventory.validationInventory.results
      .validationStatus,
  readiness: "ReadyForPlatform",
  publishedInventoryCount:
    AssistantConversationManifestConstants.inventoryTotals
      .publishedInventoryCount,
  validationRuleCount:
    AssistantConversationManifestConstants.inventoryTotals.validationRuleCount,
  validationGateCount:
    AssistantConversationManifestConstants.inventoryTotals.validationGateCount,
  canonicalInventoryRuleSatisfied: true,
  metadataOnly: true,
  immutable: true,
});
