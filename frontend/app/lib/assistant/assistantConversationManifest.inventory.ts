/** ASSISTANT-1:5 — Validation-derived immutable Manifest inventories. */
import { AssistantConversationValidation } from "./assistantConversationValidation.ts";
import type { AssistantConversationCompatibilityMetadata } from "./assistantConversationManifest.types.ts";

const model = AssistantConversationValidation.model;
const registry = model.registry;

export const AssistantConversationManifestCompatibility:
AssistantConversationCompatibilityMetadata = Object.freeze({
  platformCompatible: true,
  certificationCompatible: true,
  freezeCompatible: true,
  publicIndexCompatible: true,
  metadataOnly: true,
  immutable: true,
});

export const AssistantConversationManifestInventory = Object.freeze({
  identityInventory: AssistantConversationValidation.identity,
  registryInventory: Object.freeze({
    identity: registry.identity,
    collections: registry.collections,
    entries: registry.entries,
    metadata: registry.metadata,
  }),
  modelInventory: model.domainModels,
  relationshipInventory: model.relationships,
  lifecycleInventory: model.lifecycle,
  validationInventory: Object.freeze({
    rules: AssistantConversationValidation.rules,
    gates: AssistantConversationValidation.gates,
    results: AssistantConversationValidation.results,
  }),
  publicMetadataInventory: Object.freeze({
    validationIdentity: AssistantConversationValidation.identity,
    validationConstants: AssistantConversationValidation.constants,
    validationPublicApi: AssistantConversationValidation.publicApiSurface,
  }),
  compatibilityInventory: AssistantConversationManifestCompatibility,
  readinessInventory: Object.freeze({
    readiness: "ReadyForPlatform",
    sourceReadiness: AssistantConversationValidation.readiness,
    metadataOnly: true,
    immutable: true,
  }),
  source: AssistantConversationValidation,
  canonicalInventoryRule: "Validation References Only",
  duplicatedDefinitions: false,
  independentlyMaintainedCounts: false,
  recalculatedMetadata: false,
  reconstructedInventories: false,
  metadataOnly: true,
  immutable: true,
} as const);
