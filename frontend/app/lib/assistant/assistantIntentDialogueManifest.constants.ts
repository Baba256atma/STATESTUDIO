/** ASSISTANT-3:5 — Immutable Manifest constants and derived totals. */
import { AssistantIntentDialogueManifestInventory } from "./assistantIntentDialogueManifest.inventory.ts";

const publishedInventoryKeys = Object.freeze(
  Object.keys(AssistantIntentDialogueManifestInventory).filter((key) =>
    key.endsWith("Inventory")),
);

export const AssistantIntentDialogueManifestConstants = Object.freeze({
  manifestIdentifier: "ASSISTANT-3:5/IntentDialogueUnderstandingManifest",
  namespace: "nexora.assistant.intent-dialogue.manifest",
  version: "1.0.0",
  status: "Manifest",
  readiness: "ReadyForPlatform",
  inventoryCount: publishedInventoryKeys.length,
  inventoryTotals: Object.freeze({
    publishedInventoryCount: publishedInventoryKeys.length,
    registryEntryCount:
      AssistantIntentDialogueManifestInventory.registryInventory.entries.length,
    domainModelCount:
      AssistantIntentDialogueManifestInventory.domainModelInventory.domainModels
        .length,
    relationshipCount:
      AssistantIntentDialogueManifestInventory.relationshipInventory.length,
    lifecycleCount:
      AssistantIntentDialogueManifestInventory.lifecycleInventory.length,
    validationRuleCount:
      AssistantIntentDialogueManifestInventory.validationInventory.rules.length,
    validationGateCount:
      AssistantIntentDialogueManifestInventory.validationInventory.gates.length,
  }),
} as const);
