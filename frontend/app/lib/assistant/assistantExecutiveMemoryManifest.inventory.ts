/** ASSISTANT-2:5 — Validation-derived immutable Manifest inventories. */
import { AssistantExecutiveMemoryValidation } from "./assistantExecutiveMemoryValidation.ts";
import type { AssistantExecutiveMemoryCompatibilityMetadata } from "./assistantExecutiveMemoryManifest.types.ts";

const validation = AssistantExecutiveMemoryValidation;
const model = validation.model;
const registry = model.registry;

export const AssistantExecutiveMemoryManifestCompatibility:
AssistantExecutiveMemoryCompatibilityMetadata = Object.freeze({
  platformCompatible: true,
  certificationCompatible: true,
  freezeCompatible: true,
  publicIndexCompatible: true,
  metadataOnly: true,
  immutable: true,
});

export const AssistantExecutiveMemoryManifestInventory = Object.freeze({
  identityInventory: validation.identity,
  registryInventory: Object.freeze({
    identity: registry.identity,
    collections: registry.collections,
    entries: registry.entries,
    categories: registry.statistics,
    metadata: registry.metadata,
  }),
  domainModelInventory: Object.freeze({
    domainModels: model.domainModels,
    relationshipModels: model.relationships,
    lifecycleModels: model.lifecycle,
  }),
  relationshipInventory: model.relationships,
  lifecycleInventory: model.lifecycle,
  validationInventory: Object.freeze({
    rules: validation.rules,
    gates: validation.gates,
    results: validation.results,
  }),
  publicMetadataInventory: Object.freeze({
    validationIdentity: validation.identity,
    validationConstants: validation.constants,
    validationPublicApi: validation.publicApiSurface,
  }),
  compatibilityInventory: AssistantExecutiveMemoryManifestCompatibility,
  readinessInventory: Object.freeze({
    readiness: "ReadyForPlatform",
    sourceReadiness: validation.readiness,
    metadataOnly: true,
    immutable: true,
  }),
  source: validation,
  canonicalInventoryRule: "Validation References Only",
  duplicatedDefinitions: false,
  independentlyMaintainedCounts: false,
  recalculatedMetadata: false,
  reconstructedInventories: false,
  metadataOnly: true,
  immutable: true,
} as const);
