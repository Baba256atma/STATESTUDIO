/** ASSISTANT-5:5 — Immutable Manifest constants and derived totals. */
import { AssistantWorkspaceOrchestrationManifestInventory } from "./assistantWorkspaceOrchestrationManifest.inventory.ts";

const publishedInventoryKeys = Object.freeze(
  Object.keys(AssistantWorkspaceOrchestrationManifestInventory).filter((key) =>
    key.endsWith("Inventory")),
);

export const AssistantWorkspaceOrchestrationManifestConstants = Object.freeze({
  manifestIdentifier: "ASSISTANT-5:5/WorkspaceOrchestrationManifest",
  namespace: "nexora.assistant.workspace-orchestration.manifest",
  version: "1.0.0",
  status: "Manifest",
  readiness: "ReadyForPlatform",
  inventoryCount: publishedInventoryKeys.length,
  inventoryTotals: Object.freeze({
    publishedInventoryCount: publishedInventoryKeys.length,
    registryEntryCount:
      AssistantWorkspaceOrchestrationManifestInventory.registryInventory
        .entries.length,
    domainModelCount:
      AssistantWorkspaceOrchestrationManifestInventory.domainModelInventory
        .domainModels.length,
    relationshipCount:
      AssistantWorkspaceOrchestrationManifestInventory.relationshipInventory
        .length,
    lifecycleCount:
      AssistantWorkspaceOrchestrationManifestInventory.lifecycleInventory
        .length,
    validationRuleCount:
      AssistantWorkspaceOrchestrationManifestInventory.validationInventory
        .rules.length,
    validationGateCount:
      AssistantWorkspaceOrchestrationManifestInventory.validationInventory
        .gates.length,
  }),
} as const);
