/** ASSISTANT-2:5 — Immutable Manifest constants and derived totals. */
import { AssistantExecutiveMemoryManifestInventory } from "./assistantExecutiveMemoryManifest.inventory.ts";

const publishedInventoryKeys = Object.freeze(
  Object.keys(AssistantExecutiveMemoryManifestInventory).filter((key) =>
    key.endsWith("Inventory")),
);

export const AssistantExecutiveMemoryManifestConstants = Object.freeze({
  manifestIdentifier: "ASSISTANT-2:5/ExecutiveMemoryManifest",
  namespace: "nexora.assistant.executive-memory.manifest",
  version: "1.0.0",
  status: "Manifest",
  readiness: "ReadyForPlatform",
  inventoryCount: publishedInventoryKeys.length,
  inventoryTotals: Object.freeze({
    publishedInventoryCount: publishedInventoryKeys.length,
    registryEntryCount:
      AssistantExecutiveMemoryManifestInventory.registryInventory.entries
        .length,
    domainModelCount:
      AssistantExecutiveMemoryManifestInventory.domainModelInventory
        .domainModels.length,
    relationshipCount:
      AssistantExecutiveMemoryManifestInventory.relationshipInventory.length,
    lifecycleCount:
      AssistantExecutiveMemoryManifestInventory.lifecycleInventory.length,
    validationRuleCount:
      AssistantExecutiveMemoryManifestInventory.validationInventory.rules
        .length,
    validationGateCount:
      AssistantExecutiveMemoryManifestInventory.validationInventory.gates
        .length,
  }),
} as const);
