/** ASSISTANT-1:5 — Immutable Manifest constants and derived totals. */
import { AssistantConversationManifestInventory } from "./assistantConversationManifest.inventory.ts";

export const AssistantConversationManifestConstants = Object.freeze({
  manifestIdentifier: "ASSISTANT-1:5/ConversationManifest",
  namespace: "nexora.assistant.conversation.manifest",
  version: "1.0.0",
  status: "Manifest",
  readiness: "ReadyForPlatform",
  inventoryTotals: Object.freeze({
    publishedInventoryCount: 9,
    registryEntryCount:
      AssistantConversationManifestInventory.registryInventory.entries.length,
    modelCount: AssistantConversationManifestInventory.modelInventory.length,
    relationshipCount:
      AssistantConversationManifestInventory.relationshipInventory.length,
    lifecycleCount:
      AssistantConversationManifestInventory.lifecycleInventory.length,
    validationRuleCount:
      AssistantConversationManifestInventory.validationInventory.rules.length,
    validationGateCount:
      AssistantConversationManifestInventory.validationInventory.gates.length,
  }),
} as const);
