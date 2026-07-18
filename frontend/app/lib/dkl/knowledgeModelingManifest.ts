/**
 * DKL-4:5 — Knowledge Modeling Manifest.
 *
 * The canonical immutable Manifest aggregate for the Knowledge Modeling
 * Platform. Publishes exactly eight runtime exports of manifesto metadata.
 * Manifest only — no modeling, no validation execution, no Business Objects,
 * no Knowledge Graph, no AI, no Engine, no persistence.
 *
 * Ownership: owned exclusively by DKL-4:5.
 */

import { KnowledgeModelingFoundation } from "./knowledgeModelingFoundation.ts";
import { KnowledgeModelingRegistrySummary } from "./knowledgeModelingRegistry.ts";
import {
  KnowledgeModelingModelCatalog,
  KnowledgeModelingModelRelationships,
} from "./knowledgeModelingModel.ts";
import { KnowledgeModelingValidationReport } from "./knowledgeModelingValidation.ts";
import { KnowledgeModelingManifestInventory } from "./knowledgeModelingManifestInventory.ts";
import { KnowledgeModelingManifestDependencies } from "./knowledgeModelingManifestDependencies.ts";
import type {
  KnowledgeModelingManifestIdentityDescriptor,
  ManifestInventoryCounts,
  ManifestStatisticsDescriptor,
  ManifestSummaryDescriptor,
} from "./knowledgeModelingManifestTypes.ts";

export const KnowledgeModelingManifestVersion = "1.0.0";

export const KnowledgeModelingManifestNamespace =
  "nexora.dkl.knowledge-modeling.manifest";

export const KnowledgeModelingManifestIdentity: KnowledgeModelingManifestIdentityDescriptor =
  Object.freeze({
    manifestId: "DKL-4:5/KnowledgeModelingManifest",
    manifestVersion: KnowledgeModelingManifestVersion,
    manifestName: "Knowledge Modeling Manifest",
    manifestNamespace: KnowledgeModelingManifestNamespace,
    owner: "DKL-4 Knowledge Modeling Manifest",
    sourcePhase: "DKL-4:5",
    platformId: "DKL-4",
    platformVersion: KnowledgeModelingManifestVersion,
    status: "ManifestComplete",
    readiness: "ReadyForPlatform",
  });

const COUNTS: ManifestInventoryCounts = Object.freeze({
  componentCount: 5 as const,
  foundationPublicApiCount: 8 as const,
  registryPublicApiCount: 8 as const,
  modelPublicApiCount: 8 as const,
  validationPublicApiCount: 8 as const,
  manifestPublicApiCount: 8 as const,
  totalPublicApiCount: 40 as const,
  registryCategoryCount: KnowledgeModelingRegistrySummary.registryCategoryCount,
  businessObjectCategoryCount: KnowledgeModelingRegistrySummary.businessObjectTypeCount,
  relationshipCategoryCount: KnowledgeModelingRegistrySummary.relationshipTypeCount,
  canonicalModelCount: KnowledgeModelingModelCatalog.modelCount,
  validationCategoryCount: KnowledgeModelingValidationReport.categoryCount,
  validationRuleCount: KnowledgeModelingValidationReport.ruleCount,
  lifecycleStateCount: KnowledgeModelingFoundation.lifecycle.stateCount,
  extensionPolicyCount:
    KnowledgeModelingFoundation.contracts.extensionPolicies.length,
  compatibilityPolicyCount:
    KnowledgeModelingFoundation.contracts.compatibilityPolicies.length,
  dependencyCount: KnowledgeModelingManifestDependencies.entryCount,
});

const READINESS = Object.freeze({
  FoundationComplete: true,
  RegistryComplete: true,
  ModelComplete: true,
  ValidationComplete: true,
  ManifestComplete: true,
  ReadyForPlatform: true,
  MetadataOnly: true,
  RuntimeBehaviorForbidden: true,
  ModelingExecutionForbidden: true,
  ValidationExecutionForbidden: true,
  PersistenceForbidden: true,
  GraphTraversalForbidden: true,
  InferenceForbidden: true,
  AiForbidden: true,
  EngineFree: true,
  Deterministic: true,
  Immutable: true,
});

/**
 * Deterministic, metadata-only Manifest summary. Pure and side-effect free.
 */
export function getKnowledgeModelingManifestSummary(): ManifestSummaryDescriptor {
  return Object.freeze({
    manifestId: KnowledgeModelingManifestIdentity.manifestId,
    version: KnowledgeModelingManifestVersion,
    namespace: KnowledgeModelingManifestNamespace,
    phase: "DKL-4:5" as const,
    status: "ManifestComplete" as const,
    readiness: "ReadyForPlatform" as const,
    componentCount: 5 as const,
    totalPublicApiCount: 40 as const,
    validationStatus: KnowledgeModelingValidationReport.status,
    validationPassCount: KnowledgeModelingValidationReport.passCount,
    validationFailCount: KnowledgeModelingValidationReport.failCount,
    registryEntryCount: KnowledgeModelingRegistrySummary.totalEntryCount,
    businessObjectCategoryCount: KnowledgeModelingRegistrySummary.businessObjectTypeCount,
    relationshipCategoryCount: KnowledgeModelingRegistrySummary.relationshipTypeCount,
    canonicalModelCount: KnowledgeModelingModelCatalog.modelCount,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/**
 * Deterministic, metadata-only Manifest statistics. Pure and side-effect free.
 */
export function getKnowledgeModelingManifestStatistics(): ManifestStatisticsDescriptor {
  return Object.freeze({
    foundationContractCount: Object.keys(KnowledgeModelingFoundation.contracts).length,
    registryCategoryCount: KnowledgeModelingRegistrySummary.registryCategoryCount,
    registryEntryCount: KnowledgeModelingRegistrySummary.totalEntryCount,
    businessObjectCategoryCount: KnowledgeModelingRegistrySummary.businessObjectTypeCount,
    relationshipCategoryCount: KnowledgeModelingRegistrySummary.relationshipTypeCount,
    canonicalModelCount: KnowledgeModelingModelCatalog.modelCount,
    modelRelationshipDeclarationCount:
      KnowledgeModelingModelRelationships.declarationCount,
    validationCategoryCount: KnowledgeModelingValidationReport.categoryCount,
    validationRuleCount: KnowledgeModelingValidationReport.ruleCount,
    validationPassCount: KnowledgeModelingValidationReport.passCount,
    validationFailCount: KnowledgeModelingValidationReport.failCount,
    lifecycleStateCount: KnowledgeModelingFoundation.lifecycle.stateCount,
    ownershipOwnsCount: KnowledgeModelingFoundation.ownership.owns.length,
    ownershipDoesNotOwnCount: KnowledgeModelingFoundation.ownership.doesNotOwn.length,
    extensionPolicyCount:
      KnowledgeModelingFoundation.contracts.extensionPolicies.length,
    compatibilityPolicyCount:
      KnowledgeModelingFoundation.contracts.compatibilityPolicies.length,
    dependencyCount: KnowledgeModelingManifestDependencies.entryCount,
    totalPublicApiCount: 40 as const,
    phasesCompleted: 5 as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Canonical immutable Knowledge Modeling Manifest aggregate. */
export const KnowledgeModelingManifest = Object.freeze({
  identity: KnowledgeModelingManifestIdentity,
  version: KnowledgeModelingManifestVersion,
  namespace: KnowledgeModelingManifestNamespace,
  inventory: KnowledgeModelingManifestInventory,
  dependencies: KnowledgeModelingManifestDependencies,
  counts: COUNTS,
  ownership: Object.freeze({
    ownershipId: "DKL-4:5/ManifestOwnership",
    owner: "DKL-4 Knowledge Modeling Manifest",
    sourcePhase: "DKL-4:5" as const,
    owns: Object.freeze([
      "Manifest metadata",
      "Architectural inventory",
      "Release readiness metadata",
      "Dependency summaries",
      "Validation summaries",
      "Ownership summaries",
    ]),
    doesNotOwn: Object.freeze([
      "Foundation",
      "Registry",
      "Models",
      "Validation rules",
      "Runtime execution",
      "Business Objects",
      "Knowledge Objects",
      "Engine",
      "Advisor",
      "Scene",
      "UI",
      "Persistence",
      "Queries",
      "Search",
      "AI",
      "Reasoning",
    ]),
    metadataOnly: true,
    immutable: true,
  }),
  readiness: READINESS,
  completionStatus: Object.freeze([
    "ManifestComplete",
    "FoundationInventoried",
    "RegistryInventoried",
    "ModelInventoried",
    "ValidationInventoried",
    "DependenciesDeclared",
    "OwnershipSummarized",
    "ReadyForPlatform",
  ]),
  nextPhase: "DKL-4:6 — Knowledge Modeling Platform",
  metadata: Object.freeze({
    metadataOnly: true,
    manifestOnly: true,
    deterministic: true,
    immutable: true,
    runtimeBehaviorPerformed: false,
    validationExecuted: false,
    modelingExecuted: false,
    businessObjectsCreated: false,
    knowledgeGraphCreated: false,
    persistencePerformed: false,
    graphTraversalPerformed: false,
    inferencePerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
  }),
  metadataOnly: true,
  manifestOnly: true,
  immutable: true,
  deterministic: true,
});

export {
  KnowledgeModelingManifestInventory,
  KnowledgeModelingManifestDependencies,
};
