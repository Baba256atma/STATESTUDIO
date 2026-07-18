/**
 * DKL-7:4 — Knowledge Services Validation Summary.
 *
 * Deterministic frozen summary helper inputs and inventory aggregation.
 *
 * Ownership: owned exclusively by DKL-7:4.
 */

import {
  getKnowledgeServicesModelSummary,
  KnowledgeServicesModel,
} from "./knowledgeServicesModel.ts";
import { KNOWLEDGE_SERVICES_VALIDATION_EVIDENCE_COUNT } from "./knowledgeServicesValidationEvidence.ts";
import { KNOWLEDGE_SERVICES_VALIDATION_GROUP_COUNT } from "./knowledgeServicesValidationGroups.ts";
import {
  KnowledgeServicesValidationId,
  KnowledgeServicesValidationStatus,
  KnowledgeServicesValidationVersion,
  KNOWLEDGE_SERVICES_VALIDATION_RULE_COUNT,
} from "./knowledgeServicesValidationRules.ts";
import {
  KnowledgeServicesValidationFailCount,
  KnowledgeServicesValidationFindings,
  KnowledgeServicesValidationNotApplicableCount,
  KnowledgeServicesValidationOverallResult,
  KnowledgeServicesValidationPassCount,
  KnowledgeServicesValidationResults,
} from "./knowledgeServicesValidationResults.ts";
import type {
  KnowledgeServicesValidationInventory as ValidationInventoryRecord,
  KnowledgeServicesValidationSummary,
} from "./knowledgeServicesValidationTypes.ts";

const modelSummary = getKnowledgeServicesModelSummary();
const registry = KnowledgeServicesModel.registry;

export const KNOWLEDGE_SERVICES_VALIDATION_GUARANTEE_COUNT = 16 as const;

/** Canonical immutable validation inventory. */
export const KnowledgeServicesValidationInventory: ValidationInventoryRecord =
  Object.freeze({
    inventoryId: "DKL-7:4/KnowledgeServicesValidationInventory",
    groupCount: 15 as const,
    ruleCount: 48 as const,
    evidenceCount: KNOWLEDGE_SERVICES_VALIDATION_EVIDENCE_COUNT,
    resultCount: 48 as const,
    passCount: KnowledgeServicesValidationPassCount,
    failCount: KnowledgeServicesValidationFailCount,
    notApplicableCount: KnowledgeServicesValidationNotApplicableCount,
    findingCount: KnowledgeServicesValidationFindings.length,
    guaranteeCount: 16 as const,
    modelInventoryCount: KnowledgeServicesModel.inventory.totalEntryCount,
    modelRelationshipCount: KnowledgeServicesModel.inventory.relationshipCount,
    registryServiceCount: registry.services.length,
    registryCapabilityCount: registry.capabilities.length,
    registryContractCount: registry.contracts.length,
    prohibitedSurfaceCount:
      registry.foundation.boundaries.prohibitedSurfaces.length,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });

/** Build the deterministic frozen validation summary. */
export function buildKnowledgeServicesValidationSummary(): KnowledgeServicesValidationSummary {
  return Object.freeze({
    validationId: KnowledgeServicesValidationId,
    version: KnowledgeServicesValidationVersion,
    status: KnowledgeServicesValidationStatus,
    overallResult: KnowledgeServicesValidationOverallResult,
    readiness:
      KnowledgeServicesValidationOverallResult === "Pass"
        ? ("ReadyForManifest" as const)
        : ("Blocked" as const),
    modelId: modelSummary.modelId,
    registryId: modelSummary.registryId,
    foundationId: modelSummary.foundationId,
    groupCount: KNOWLEDGE_SERVICES_VALIDATION_GROUP_COUNT,
    ruleCount: KNOWLEDGE_SERVICES_VALIDATION_RULE_COUNT,
    evidenceCount: KNOWLEDGE_SERVICES_VALIDATION_EVIDENCE_COUNT,
    resultCount: KnowledgeServicesValidationResults.length,
    passCount: KnowledgeServicesValidationPassCount,
    failCount: KnowledgeServicesValidationFailCount,
    notApplicableCount: KnowledgeServicesValidationNotApplicableCount,
    findingCount: KnowledgeServicesValidationFindings.length,
    guaranteeCount: KNOWLEDGE_SERVICES_VALIDATION_GUARANTEE_COUNT,
    modelInventoryCount: KnowledgeServicesModel.inventory.totalEntryCount,
    requestModelCount: modelSummary.requestModelCount,
    responseModelCount: modelSummary.responseModelCount,
    resultModelCount: modelSummary.resultModelCount,
    contextModelCount: modelSummary.contextModelCount,
    referenceModelCount: modelSummary.referenceModelCount,
    graphModelCount: modelSummary.graphModelCount,
    relationshipCount: modelSummary.relationshipCount,
    serviceCount: modelSummary.registeredServiceCount,
    capabilityCount: modelSummary.registeredCapabilityCount,
    contractCount: modelSummary.registeredContractCount,
    accessModeCount: modelSummary.approvedAccessModeCount,
    mutationModeCount: modelSummary.mutationModeCount,
    prohibitedSurfaceCount:
      registry.foundation.boundaries.prohibitedSurfaces.length,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
