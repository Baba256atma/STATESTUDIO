/** ASSISTANT-7:5 — Validation-derived immutable Manifest inventories. */
import { AssistantExecutiveActionPlanningValidation } from "./assistantExecutiveActionPlanningValidation.ts";
import type { AssistantExecutiveActionPlanningCompatibilityMetadata } from "./assistantExecutiveActionPlanningManifest.types.ts";

const validation = AssistantExecutiveActionPlanningValidation;
const model = validation.model;
const registry = model.registry;

export const AssistantExecutiveActionPlanningManifestCompatibility:
AssistantExecutiveActionPlanningCompatibilityMetadata = Object.freeze({
  platformCompatible: true,
  certificationCompatible: true,
  freezeCompatible: true,
  publicIndexCompatible: true,
  metadataOnly: true,
  immutable: true,
});

export const AssistantExecutiveActionPlanningManifestInventory =
  Object.freeze({
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
    planningInventory: Object.freeze({
      actionPlanTypes: registry.collections.actionPlanTypes,
      plannedActionTypes: registry.collections.plannedActionTypes,
      dependencyTypes: registry.collections.dependencyTypes,
      priorityTypes: registry.collections.actionPriorityLevels,
      timeHorizonTypes: registry.collections.timeHorizonTypes,
      ownershipReferenceTypes:
        registry.collections.ownershipReferenceTypes,
      planningPolicies: registry.collections.planningPolicies,
      planningLifecycle: registry.collections.planningLifecycleStates,
    }),
    publicMetadataInventory: Object.freeze({
      validationIdentity: validation.identity,
      validationConstants: validation.constants,
      validationPublicApi: validation.publicApiSurface,
    }),
    compatibilityInventory:
      AssistantExecutiveActionPlanningManifestCompatibility,
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
