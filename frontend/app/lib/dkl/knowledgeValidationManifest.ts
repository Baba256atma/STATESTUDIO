/**
 * DKL-5:5 — Knowledge Validation Manifest.
 *
 * The canonical immutable Manifest aggregate for the Knowledge Validation
 * architecture. Publishes exactly eight runtime exports of manifest metadata.
 * Manifest only — no new contracts, no validation execution, no scoring, no
 * trust calculation, no cleansing, no remediation, no persistence, no Engine.
 *
 * Ownership: owned exclusively by DKL-5:5.
 */

import { KnowledgeValidationModelRelationships } from "./knowledgeValidationModel.ts";
import { KnowledgeValidationValidation } from "./knowledgeValidationValidation.ts";
import { KnowledgeValidationManifestInventory } from "./knowledgeValidationManifestInventory.ts";
import { KnowledgeValidationManifestDependencies } from "./knowledgeValidationManifestDependencies.ts";
import { KnowledgeValidationManifestCompatibility } from "./knowledgeValidationManifestCompatibility.ts";
import { KnowledgeValidationManifestExtensions } from "./knowledgeValidationManifestExtensions.ts";
import { KnowledgeValidationManifestReadiness } from "./knowledgeValidationManifestReadiness.ts";
import type {
  KnowledgeValidationManifestIdentityDescriptor,
  ManifestInventoryCounts,
  ManifestStatisticsDescriptor,
  ManifestSummaryDescriptor,
} from "./knowledgeValidationManifestTypes.ts";

export const KnowledgeValidationManifestVersion = "1.0.0";

export const KnowledgeValidationManifestNamespace =
  "nexora.dkl.knowledge-validation.manifest";

export const KnowledgeValidationManifestIdentity: KnowledgeValidationManifestIdentityDescriptor =
  Object.freeze({
    manifestId: "DKL-5:5/KnowledgeValidationManifest",
    manifestName: "Knowledge Validation Manifest",
    manifestVersion: KnowledgeValidationManifestVersion,
    manifestNamespace: KnowledgeValidationManifestNamespace,
    phase: "DKL-5:5",
    owner: "DKL-5 Knowledge Validation Manifest",
    architectureType: "KnowledgeValidation",
    sourcePhases: Object.freeze([
      "DKL-5:1",
      "DKL-5:2",
      "DKL-5:3",
      "DKL-5:4",
    ]) as readonly ["DKL-5:1", "DKL-5:2", "DKL-5:3", "DKL-5:4"],
    publicVisibility: "Public",
    metadataOnly: true,
    runtimeBehavior: false,
    validationStatus: "Pass",
    status: "ManifestComplete",
    readiness: "ReadyForPlatform",
    nextPhase: "DKL-5:6 — Knowledge Validation Platform",
  });

const foundation = KnowledgeValidationManifestInventory.foundation;
const registry = KnowledgeValidationManifestInventory.registry;
const model = KnowledgeValidationManifestInventory.model;
const validation = KnowledgeValidationManifestInventory.validation;

const COUNTS: ManifestInventoryCounts = Object.freeze({
  phaseCount: 5 as const,
  componentCount: 5 as const,
  foundationPublicApiCount: 8 as const,
  registryPublicApiCount: 8 as const,
  modelPublicApiCount: 8 as const,
  validationPublicApiCount: 8 as const,
  manifestPublicApiCount: 8 as const,
  totalPublicApiCount: 40 as const,
  foundationContractCount: foundation.contractKindCount,
  validationTargetCount: foundation.validationTargetCount,
  validationDimensionCount: foundation.validationDimensionCount,
  qualitySignalCount: foundation.qualitySignalCount,
  outcomeCount: foundation.outcomeCount,
  severityCount: foundation.severityCount,
  registryCollectionCount: registry.collectionCount,
  registryEntryCount: registry.totalEntryCount,
  canonicalModelCount: model.canonicalModelCount,
  modelRelationshipCount: model.modelRelationshipCount,
  validationCategoryCount: validation.categoryCount,
  validationRuleCount: validation.ruleCount,
  validationEvidenceCount: validation.evidenceCount,
  validationPassCount: validation.passCount,
  validationFailCount: validation.failCount,
  ownershipDeclarationCount:
    KnowledgeValidationManifestInventory.ownershipSummary.owns.length,
  dependencyDeclarationCount: KnowledgeValidationManifestDependencies.entryCount,
  compatibilityDeclarationCount:
    KnowledgeValidationManifestCompatibility.entryCount,
  extensionDeclarationCount: KnowledgeValidationManifestExtensions.entryCount,
  lifecycleStateCount: foundation.lifecycleStateCount,
});

const READINESS = Object.freeze({
  FoundationComplete: true,
  RegistryComplete: true,
  ModelComplete: true,
  ValidationComplete: true,
  ManifestComplete: true,
  ValidationOverallPass:
    KnowledgeValidationValidation.result.overallStatus === "Pass",
  AllReadinessGatesPass: KnowledgeValidationManifestReadiness.allGatesPass,
  ReadyForPlatform:
    KnowledgeValidationManifestReadiness.readiness === "ReadyForPlatform",
  MetadataOnly: true,
  RuntimeBehaviorForbidden: true,
  RuntimeValidationForbidden: true,
  ScoringForbidden: true,
  TrustCalculationForbidden: true,
  CleansingForbidden: true,
  RemediationForbidden: true,
  PersistenceForbidden: true,
  GraphTraversalForbidden: true,
  AiForbidden: true,
  EngineFree: true,
  SourceScanningForbidden: true,
  Deterministic: true,
  Immutable: true,
});

/** Deterministic, metadata-only Manifest summary. Pure and side-effect free. */
export function getKnowledgeValidationManifestSummary(): ManifestSummaryDescriptor {
  return Object.freeze({
    manifestId: KnowledgeValidationManifestIdentity.manifestId,
    version: KnowledgeValidationManifestVersion,
    namespace: KnowledgeValidationManifestNamespace,
    phase: "DKL-5:5" as const,
    status: "ManifestComplete" as const,
    readiness: "ReadyForPlatform" as const,
    phaseCount: 5 as const,
    componentCount: 5 as const,
    totalPublicApiCount: 40 as const,
    validationStatus: KnowledgeValidationValidation.result.overallStatus,
    validationPassCount: validation.passCount,
    validationFailCount: validation.failCount,
    registryEntryCount: registry.totalEntryCount,
    canonicalModelCount: model.canonicalModelCount,
    validationRuleCount: validation.ruleCount,
    readyForPlatform: KnowledgeValidationManifestReadiness.allGatesPass,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Deterministic, metadata-only Manifest statistics. Pure and side-effect free. */
export function getKnowledgeValidationManifestStatistics(): ManifestStatisticsDescriptor {
  return Object.freeze({
    phaseCount: 5 as const,
    componentCount: 5 as const,
    totalPublicApiCount: 40 as const,
    foundationContractCount: foundation.contractKindCount,
    validationTargetCount: foundation.validationTargetCount,
    validationDimensionCount: foundation.validationDimensionCount,
    qualitySignalCount: foundation.qualitySignalCount,
    outcomeCount: foundation.outcomeCount,
    severityCount: foundation.severityCount,
    registryCollectionCount: registry.collectionCount,
    registryEntryCount: registry.totalEntryCount,
    canonicalModelCount: model.canonicalModelCount,
    modelRelationshipCount: KnowledgeValidationModelRelationships.declarationCount,
    validationCategoryCount: validation.categoryCount,
    validationRuleCount: validation.ruleCount,
    validationEvidenceCount: validation.evidenceCount,
    validationPassCount: validation.passCount,
    validationFailCount: validation.failCount,
    ownershipDeclarationCount:
      KnowledgeValidationManifestInventory.ownershipSummary.owns.length,
    dependencyDeclarationCount: KnowledgeValidationManifestDependencies.entryCount,
    compatibilityDeclarationCount:
      KnowledgeValidationManifestCompatibility.entryCount,
    extensionDeclarationCount: KnowledgeValidationManifestExtensions.entryCount,
    lifecycleStateCount: foundation.lifecycleStateCount,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

/** Canonical immutable Knowledge Validation Manifest aggregate. */
export const KnowledgeValidationManifest = Object.freeze({
  identity: KnowledgeValidationManifestIdentity,
  version: KnowledgeValidationManifestVersion,
  namespace: KnowledgeValidationManifestNamespace,
  inventory: KnowledgeValidationManifestInventory,
  dependencies: KnowledgeValidationManifestDependencies,
  compatibility: KnowledgeValidationManifestCompatibility,
  extensions: KnowledgeValidationManifestExtensions,
  manifestReadiness: KnowledgeValidationManifestReadiness,
  counts: COUNTS,
  sections: Object.freeze([
    "metadata",
    "foundation",
    "registry",
    "model",
    "validation",
    "ownership",
    "boundary",
    "dependency",
    "compatibility",
    "extension",
    "guarantee",
    "readiness",
  ]),
  ownership: Object.freeze({
    ownershipId: "DKL-5:5/ManifestOwnership",
    owner: "DKL-5 Knowledge Validation Manifest",
    sourcePhase: "DKL-5:5" as const,
    owns: Object.freeze([
      "Manifest identity",
      "Architectural inventories",
      "Manifest statistics",
      "Ownership summaries",
      "Dependency summaries",
      "Compatibility summaries",
      "Extension summaries",
      "Guarantee summaries",
      "Platform-readiness metadata",
    ]),
    doesNotOwn: Object.freeze([
      "Foundation contracts",
      "Registry entries",
      "Model contracts",
      "Validation rules",
      "Runtime validation",
      "Live organizational knowledge",
      "Cleansing",
      "Scoring",
      "Trust calculation",
      "Conflict resolution",
      "Ambiguity resolution",
      "Remediation",
      "Persistence",
      "Search",
      "Queries",
      "Executive reasoning",
      "Advisor",
      "Scene",
      "UI",
      "Workflow",
    ]),
    noOwnershipTransfer: true,
    earlierPhasesRetainOwnership: true,
    metadataOnly: true,
    immutable: true,
  }),
  guarantees: Object.freeze({
    oneCanonicalInventory: true,
    immutableMetadata: true,
    deterministicOrdering: true,
    frozenCollections: true,
    accurateCounts: true,
    publicEntryPointOnlyDependencies: true,
    noDuplicateOwnership: true,
    noArchitectureDuplication: true,
    noNewContracts: true,
    noNewRegistries: true,
    noNewModels: true,
    noNewValidationRules: true,
    noRuntimeKnowledgeValidation: true,
    noNumericScoring: true,
    noTrustCalculation: true,
    noAiConfidence: true,
    noCleansing: true,
    noRemediation: true,
    noPersistence: true,
    noGraphTraversal: true,
    noEngineBehavior: true,
    noSourceScanning: true,
    noEnvironmentDependentBehavior: true,
    readinessOnlyWhenValidationPass:
      KnowledgeValidationValidation.result.overallStatus === "Pass",
  }),
  readiness: READINESS,
  completionStatus: Object.freeze([
    "ManifestComplete",
    "FoundationInventoried",
    "RegistryInventoried",
    "ModelInventoried",
    "ValidationInventoried",
    "OwnershipSummarized",
    "DependenciesDeclared",
    "CompatibilityAggregated",
    "ExtensionsAggregated",
    "ReadinessGatesPassed",
    "ReadyForPlatform",
  ]),
  nextPhase: "DKL-5:6 — Knowledge Validation Platform",
  metadata: Object.freeze({
    metadataOnly: true,
    manifestOnly: true,
    deterministic: true,
    immutable: true,
    runtimeBehaviorPerformed: false,
    validationExecuted: false,
    scoringPerformed: false,
    trustCalculated: false,
    cleansingPerformed: false,
    remediationPerformed: false,
    persistencePerformed: false,
    graphTraversalPerformed: false,
    aiExecuted: false,
    engineReasoningPerformed: false,
    sourceScanningPerformed: false,
  }),
  metadataOnly: true,
  manifestOnly: true,
  immutable: true,
  deterministic: true,
});

export {
  KnowledgeValidationManifestInventory,
  KnowledgeValidationManifestDependencies,
};
