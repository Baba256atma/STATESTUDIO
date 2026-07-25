/** ASSISTANT-7:5 — Immutable Manifest constants and derived totals. */
import { AssistantExecutiveActionPlanningManifestInventory } from "./assistantExecutiveActionPlanningManifest.inventory.ts";

const publishedInventoryKeys = Object.freeze(
  Object.keys(AssistantExecutiveActionPlanningManifestInventory).filter(
    (key) => key.endsWith("Inventory"),
  ),
);

export const AssistantExecutiveActionPlanningManifestConstants =
  Object.freeze({
    manifestIdentifier: "ASSISTANT-7:5/ExecutiveActionPlanningManifest",
    namespace: "nexora.assistant.executive-action-planning.manifest",
    version: "1.0.0",
    status: "Manifest",
    readiness: "ReadyForPlatform",
    publishedInventoryCount: publishedInventoryKeys.length,
    inventoryCount: publishedInventoryKeys.length,
    inventoryTotals: Object.freeze({
      publishedInventoryCount: publishedInventoryKeys.length,
      registryEntryCount:
        AssistantExecutiveActionPlanningManifestInventory.registryInventory
          .entries.length,
      domainModelCount:
        AssistantExecutiveActionPlanningManifestInventory
          .domainModelInventory.domainModels.length,
      relationshipCount:
        AssistantExecutiveActionPlanningManifestInventory
          .relationshipInventory.length,
      lifecycleCount:
        AssistantExecutiveActionPlanningManifestInventory
          .lifecycleInventory.length,
      validationRuleCount:
        AssistantExecutiveActionPlanningManifestInventory
          .validationInventory.rules.length,
      validationGateCount:
        AssistantExecutiveActionPlanningManifestInventory
          .validationInventory.gates.length,
    }),
    validationRuleCount:
      AssistantExecutiveActionPlanningManifestInventory.validationInventory
        .rules.length,
    validationGateCount:
      AssistantExecutiveActionPlanningManifestInventory.validationInventory
        .gates.length,
  } as const);
