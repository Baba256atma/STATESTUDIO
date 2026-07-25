/** ASSISTANT-4:5 — Immutable Manifest constants and derived totals. */
import { AssistantExecutiveGuidanceManifestInventory } from "./assistantExecutiveGuidanceManifest.inventory.ts";

const publishedInventoryKeys = Object.freeze(
  Object.keys(AssistantExecutiveGuidanceManifestInventory).filter((key) =>
    key.endsWith("Inventory")),
);

export const AssistantExecutiveGuidanceManifestConstants = Object.freeze({
  manifestIdentifier: "ASSISTANT-4:5/ExecutiveGuidanceManifest",
  namespace: "nexora.assistant.executive-guidance.manifest",
  version: "1.0.0",
  status: "Manifest",
  readiness: "ReadyForPlatform",
  inventoryCount: publishedInventoryKeys.length,
  inventoryTotals: Object.freeze({
    publishedInventoryCount: publishedInventoryKeys.length,
    registryEntryCount:
      AssistantExecutiveGuidanceManifestInventory.registryInventory.entries
        .length,
    domainModelCount:
      AssistantExecutiveGuidanceManifestInventory.domainModelInventory
        .domainModels.length,
    relationshipCount:
      AssistantExecutiveGuidanceManifestInventory.relationshipInventory.length,
    lifecycleCount:
      AssistantExecutiveGuidanceManifestInventory.lifecycleInventory.length,
    validationRuleCount:
      AssistantExecutiveGuidanceManifestInventory.validationInventory.rules
        .length,
    validationGateCount:
      AssistantExecutiveGuidanceManifestInventory.validationInventory.gates
        .length,
  }),
} as const);
