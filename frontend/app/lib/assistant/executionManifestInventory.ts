/** ASSISTANT-8:5 — Validation-derived immutable Manifest inventories. */
import { ExecutiveActionExecutionValidation } from "./executiveActionExecutionValidation.ts";
import { ExecutionManifestCompatibility } from "./executionManifestCompatibility.ts";
import { ExecutionManifestReadiness } from "./executionManifestReadiness.ts";

const validation = ExecutiveActionExecutionValidation;
const model = validation.model;
const registry = model.registry;
const platform = validation.platform;
const validationManifest = validation.manifest;
const validationMetadata = validation.metadata;

export const ExecutionManifestInventory = Object.freeze({
  contractsInventory: registry.contracts,
  capabilitiesInventory: registry.capabilities,
  lifecycleStatesInventory: registry.lifecycle,
  executionStatesInventory: registry.executionStates,
  progressTypesInventory: registry.progressTypes,
  exceptionTypesInventory: registry.exceptionTypes,
  feedbackTypesInventory: registry.feedbackTypes,
  policiesInventory: registry.policies,
  domainModelsInventory: model.domainModels,
  relationshipModelsInventory: model.relationships,
  validationCategoriesInventory: validation.categories,
  validationRulesInventory: validation.rules,
  validationGatesInventory: validation.gates,
  metadataDefinitionsInventory: registry.metadata.definitions,
  validationPlatformInventory: platform,
  validationManifestInventory: validationManifest,
  validationMetadataInventory: validationMetadata,
  compatibilityInventory: ExecutionManifestCompatibility,
  readinessInventory: ExecutionManifestReadiness,
  totals: Object.freeze({
    contractCount: registry.contracts.length,
    capabilityCount: registry.capabilities.length,
    lifecycleStateCount: registry.lifecycle.length,
    executionStateCount: registry.executionStates.length,
    progressTypeCount: registry.progressTypes.length,
    exceptionTypeCount: registry.exceptionTypes.length,
    feedbackTypeCount: registry.feedbackTypes.length,
    policyCount: registry.policies.length,
    domainModelCount: model.domainModels.length,
    relationshipModelCount: model.relationships.length,
    validationCategoryCount: platform.validationCategoryCount,
    validationRuleCount: platform.validationRuleCount,
    validationGateCount: platform.validationGateCount,
    metadataDefinitionCount: registry.metadata.definitions.length,
  }),
  source: validation,
  sourceValidationPlatform: platform,
  sourceValidationManifest: validationManifest,
  sourceValidationMetadata: validationMetadata,
  canonicalInventoryRule: "Validation References Only",
  duplicatedDefinitions: false,
  independentlyMaintainedCounts: false,
  recalculatedMetadata: false,
  reconstructedInventories: false,
  metadataOnly: true,
  immutable: true,
} as const);
