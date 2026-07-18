/**
 * DKL-9:5 — Data Knowledge Suite Manifest Counts.
 *
 * Observed counts derived exclusively through Validation collections.
 * No hardcoded inventory values.
 *
 * Ownership: owned exclusively by DKL-9:5.
 */

import { DataKnowledgeSuiteValidationPlatform } from "./dataKnowledgeSuiteValidation.ts";

const validation = DataKnowledgeSuiteValidationPlatform;
const model = validation.model;
const registry = model.registry;

/**
 * Deterministic counting rule for Manifest-owned totalEntryCount:
 * capabilityModelCount + publicPlatformReferenceCount +
 * publicApiRegistryReferenceCount + dependencyModelCount +
 * ownershipReferenceCount + boundaryReferenceCount +
 * validationRuleCount + validationGateCount + validationCategoryCount +
 * guaranteeCount + publicApiCount
 */
export const DATA_KNOWLEDGE_SUITE_MANIFEST_COUNTING_RULE =
  "capabilityModelCount + publicPlatformReferenceCount + publicApiRegistryReferenceCount + dependencyModelCount + ownershipReferenceCount + boundaryReferenceCount + validationRuleCount + validationGateCount + validationCategoryCount + guaranteeCount + publicApiCount";

/** Observed counts — Validation/Model/Registry collection lengths only. */
export const DataKnowledgeSuiteManifestObservedCounts = Object.freeze({
  capabilityCount: model.inventory.capabilityModelCount,
  capabilityReferenceCount: model.inventory.capabilityReferenceModelCount,
  publicPlatformReferenceCount: model.inventory.publicPlatformReferenceCount,
  publicApiRegistryReferenceCount:
    model.inventory.publicApiRegistryReferenceCount,
  publicApiInventoryTotal: model.inventory.publicApiInventoryTotal,
  dependencyCount: model.inventory.dependencyModelCount,
  relationshipKindCount: model.inventory.relationshipKindCount,
  ownershipReferenceCount: model.inventory.ownershipReferenceCount,
  boundaryReferenceCount: model.inventory.boundaryReferenceCount,
  modelKindCount: model.inventory.modelKindCount,
  suiteModelCount: model.inventory.suiteModelCount,
  totalModelInstanceCount: model.inventory.totalModelInstanceCount,
  validationRuleCount: validation.inventory.ruleCount,
  validationGateCount: validation.inventory.gateCount,
  validationCategoryCount: validation.inventory.categoryCount,
  validationSeverityCount: validation.inventory.severityCount,
  validationOutcomeCount: validation.inventory.outcomeCount,
  registryTotalEntryCount: model.inventory.registryTotalEntryCount,
  registryContractCount: registry.inventory.contractCount,
  registryIntegrationContractCount:
    registry.inventory.integrationContractCount,
  lifecycleStateCount: registry.inventory.lifecycleStateCount,
  sourcedThroughValidation: true as const,
  reconstructed: false as const,
  hardcoded: false as const,
  duplicated: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
