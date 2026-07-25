/** ASSISTANT-6:5 — Immutable Manifest constants and derived totals. */
import { AssistantObjectContextManagementManifestInventory } from "./assistantObjectContextManagementManifest.inventory.ts";

const publishedInventoryKeys = Object.freeze(
  Object.keys(AssistantObjectContextManagementManifestInventory).filter(
    (key) => key.endsWith("Inventory"),
  ),
);

export const AssistantObjectContextManagementManifestConstants =
  Object.freeze({
    manifestIdentifier: "ASSISTANT-6:5/ObjectContextManagementManifest",
    namespace: "nexora.assistant.object-context-management.manifest",
    version: "1.0.0",
    status: "Manifest",
    readiness: "ReadyForPlatform",
    inventoryCount: publishedInventoryKeys.length,
    inventoryTotals: Object.freeze({
      publishedInventoryCount: publishedInventoryKeys.length,
      registryEntryCount:
        AssistantObjectContextManagementManifestInventory.registryInventory
          .entries.length,
      domainModelCount:
        AssistantObjectContextManagementManifestInventory
          .domainModelInventory.domainModels.length,
      relationshipCount:
        AssistantObjectContextManagementManifestInventory
          .relationshipInventory.length,
      lifecycleCount:
        AssistantObjectContextManagementManifestInventory.lifecycleInventory
          .length,
      validationRuleCount:
        AssistantObjectContextManagementManifestInventory
          .validationInventory.rules.length,
      validationGateCount:
        AssistantObjectContextManagementManifestInventory
          .validationInventory.gates.length,
    }),
  } as const);
