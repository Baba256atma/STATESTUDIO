/**
 * DKL-5:1 — Knowledge Validation Foundation.
 *
 * The canonical immutable Foundation aggregate for the Knowledge Validation
 * Platform. Publishes exactly eight runtime exports. Defines validation
 * contracts, quality signals, trust declarations, findings, ambiguity/conflict,
 * outcomes, severity, and lifecycle metadata.
 *
 * Metadata only — no validation execution, no score calculation, no trust
 * calculation, no cleansing, no AI, no Engine reasoning.
 *
 * Ownership: owned exclusively by DKL-5:1.
 */

import {
  KnowledgeModelingPublicIndexId,
  KnowledgeModelingPublicIndexVersion,
} from "./knowledgeModelingPublicIndex.ts";
import { KnowledgeValidationContracts } from "./knowledgeValidationContracts.ts";
import { KnowledgeValidationOwnership } from "./knowledgeValidationOwnership.ts";
import { KnowledgeValidationBoundaries } from "./knowledgeValidationBoundaries.ts";
import { KnowledgeValidationLifecycle } from "./knowledgeValidationLifecycle.ts";
import { KnowledgeValidationDependencies } from "./knowledgeValidationDependencies.ts";
import type { KnowledgeValidationFoundationIdentity as FoundationIdentityDescriptor } from "./knowledgeValidationFoundationTypes.ts";
import { KNOWLEDGE_VALIDATION_DEFINITION } from "./knowledgeValidationFoundationTypes.ts";

export const KnowledgeValidationFoundationVersion = "1.0.0";

export const KnowledgeValidationFoundationIdentity: FoundationIdentityDescriptor =
  Object.freeze({
    foundationId: "DKL-5:1/KnowledgeValidationFoundation",
    foundationVersion: KnowledgeValidationFoundationVersion,
    foundationName: "Knowledge Validation Foundation",
    foundationNamespace: "nexora.dkl.knowledge-validation.foundation",
    owner: "DKL-5 Knowledge Validation Platform",
    sourcePhase: "DKL-5:1",
    platformId: "DKL-5",
    platformVersion: KnowledgeValidationFoundationVersion,
    status: "FoundationComplete",
    readiness: "ReadyForRegistry",
  });

const READINESS = Object.freeze({
  FoundationComplete: true,
  Dkl4PublicIndexConnected: true,
  ValidationContractsDefined: true,
  ValidationTargetsDefined: true,
  ValidationDimensionsDefined: true,
  QualitySignalsDefined: true,
  TrustDeclarationDefined: true,
  OutcomesDefined: true,
  SeveritiesDefined: true,
  EvidenceAndFindingsDefined: true,
  AmbiguityAndConflictDefined: true,
  LifecycleDeclared: true,
  ExtensionPolicyDefined: true,
  CompatibilityPolicyDefined: true,
  OwnershipSeparated: true,
  BoundariesDeclared: true,
  MetadataOnly: true,
  ValidationArchitectureOnly: true,
  RuntimeValidationForbidden: true,
  ScoreCalculationForbidden: true,
  TrustCalculationForbidden: true,
  DataCleansingForbidden: true,
  AiConfidenceForbidden: true,
  PersistenceForbidden: true,
  AIFree: true,
  EngineFree: true,
  Deterministic: true,
  Immutable: true,
  ReadyForRegistry: true,
});

/** Canonical immutable Knowledge Validation Foundation aggregate. */
export const KnowledgeValidationFoundation = Object.freeze({
  identity: KnowledgeValidationFoundationIdentity,
  version: KnowledgeValidationFoundationVersion,
  definition: KNOWLEDGE_VALIDATION_DEFINITION,
  contracts: KnowledgeValidationContracts,
  ownership: KnowledgeValidationOwnership,
  boundaries: KnowledgeValidationBoundaries,
  lifecycle: KnowledgeValidationLifecycle,
  dependencies: KnowledgeValidationDependencies,
  upstream: Object.freeze({
    dkl4PublicIndexId: KnowledgeModelingPublicIndexId,
    dkl4PublicIndexVersion: KnowledgeModelingPublicIndexVersion,
    module: "knowledgeModelingPublicIndex.ts",
  }),
  guarantees: Object.freeze({
    metadataOnlyArchitecture: true,
    immutableContracts: true,
    explicitOwnership: true,
    clearDkl4Dependency: true,
    noDuplicateKnowledgeModelingOwnership: true,
    noHeavyDataCleaningResponsibility: true,
    explainableValidationVocabulary: true,
    evidenceBasedTrustDeclarations: true,
    explicitAmbiguityAndConflictRepresentation: true,
    partialUsabilityWhenLimitationsDeclared: true,
    noHiddenRuntimeBehavior: true,
    noAi: true,
    noSemanticInference: true,
    noPersistence: true,
    noGraphTraversal: true,
    noEngineReasoning: true,
    noUiCoupling: true,
    deterministicExports: true,
    controlledExtensionPolicy: true,
    stableCompatibilityPolicy: true,
  }),
  readiness: READINESS,
  completionStatus: Object.freeze([
    "FoundationComplete",
    "Dkl4PublicIndexConnected",
    "ValidationContractsDefined",
    "QualitySignalsDefined",
    "TrustDeclarationDefined",
    "OutcomesAndSeveritiesDefined",
    "EvidenceFindingsAmbiguityConflictDefined",
    "LifecycleDeclared",
    "ExtensionPolicyDefined",
    "CompatibilityPolicyDefined",
    "OwnershipSeparated",
    "BoundariesDeclared",
    "MetadataOnly",
    "AIFree",
    "EngineFree",
    "Deterministic",
    "Immutable",
    "ReadyForRegistry",
  ]),
  nextPhase: "DKL-5:2 — Knowledge Validation Registry",
  metadata: Object.freeze({
    metadataOnly: true,
    validationArchitectureOnly: true,
    deterministic: true,
    immutable: true,
    runtimeValidationPerformed: false,
    scoresCalculated: false,
    trustCalculated: false,
    dataCleansed: false,
    persistencePerformed: false,
    graphTraversalPerformed: false,
    aiExecuted: false,
    inferencePerformed: false,
    engineReasoningPerformed: false,
    sideEffectsPerformed: false,
  }),
  metadataOnly: true,
  validationArchitectureOnly: true,
  immutable: true,
  deterministic: true,
});

export {
  KnowledgeValidationContracts,
  KnowledgeValidationOwnership,
  KnowledgeValidationBoundaries,
  KnowledgeValidationLifecycle,
  KnowledgeValidationDependencies,
};
