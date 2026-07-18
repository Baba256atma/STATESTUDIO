/**
 * DKL-5:3 — Knowledge Validation Model.
 *
 * Canonical immutable model aggregate for DKL-5 Knowledge Validation.
 * Publishes exactly eight runtime exports of model contracts. Model only —
 * no rule execution, scoring, trust calculation, remediation, or persistence.
 *
 * Ownership: owned exclusively by DKL-5:3.
 */

import {
  KnowledgeValidationFoundation,
  KnowledgeValidationFoundationIdentity,
  KnowledgeValidationFoundationVersion,
} from "./knowledgeValidationFoundation.ts";
import {
  KnowledgeValidationRegistry,
  KnowledgeValidationRegistryIdentity,
  KnowledgeValidationRegistryVersion,
} from "./knowledgeValidationRegistry.ts";
import {
  EvidenceReferenceModel,
  ValidationEvidenceModel,
} from "./knowledgeValidationEvidenceModels.ts";
import {
  ValidationAmbiguityModel,
  ValidationConflictModel,
} from "./knowledgeValidationConflictAmbiguityModels.ts";
import {
  ValidationFindingModel,
  ValidationIssueModel,
  ValidationLimitationModel,
} from "./knowledgeValidationFindingIssueModels.ts";
import {
  ConsumerSuitabilityStateCatalog,
  ExecutiveUsabilityCapabilityCatalog,
  KnowledgeValidationAggregateModel,
  ValidationBoundaryModel,
  ValidationConsumerSuitabilityModel,
  ValidationEvidenceSetModel,
  ValidationExecutiveUsabilityModel,
  ValidationFindingSetModel,
  ValidationIssueSetModel,
  ValidationProvenanceModel,
  ValidationReadinessModel,
  ValidationRuleSetModel,
  ValidationSessionModel,
  ValidationSubjectSetModel,
  ValidationVersionModel,
} from "./knowledgeValidationStructureModels.ts";
import {
  ValidationCriterionModel,
  ValidationRuleModel,
  ValidationScopeModel,
  ValidationTargetModel,
} from "./knowledgeValidationTargetRuleModels.ts";
import {
  KnowledgeQualitySignalModel,
  KnowledgeTrustDeclarationModel,
  ValidationResultModel,
  ValidationSeverityModel,
  ValidationStatusModel,
  ValidationSummaryModel,
} from "./knowledgeValidationTrustResultModels.ts";
import type {
  CanonicalModelDescriptor,
  KnowledgeValidationModelPhaseIdentity,
  ModelRelationshipDeclaration,
} from "./knowledgeValidationModelTypes.ts";

export const KnowledgeValidationModelVersion = "1.0.0";

export const KnowledgeValidationModelNamespace =
  "nexora.dkl.knowledge-validation.model";

export const KnowledgeValidationModelIdentity: KnowledgeValidationModelPhaseIdentity =
  Object.freeze({
    modelPhaseId: "DKL-5:3/KnowledgeValidationModel",
    modelPhaseVersion: KnowledgeValidationModelVersion,
    modelPhaseName: "Knowledge Validation Model",
    modelPhaseNamespace: KnowledgeValidationModelNamespace,
    owner: "DKL-5 Knowledge Validation Model",
    sourcePhase: "DKL-5:3",
    platformId: "DKL-5",
    platformVersion: KnowledgeValidationModelVersion,
    status: "ModelComplete",
    readiness: "ReadyForValidation",
  });

const CANONICAL_MODELS: readonly CanonicalModelDescriptor[] = Object.freeze([
  KnowledgeValidationAggregateModel,
  ValidationTargetModel,
  ValidationScopeModel,
  ValidationRuleModel,
  ValidationCriterionModel,
  ValidationEvidenceModel,
  EvidenceReferenceModel,
  ValidationFindingModel,
  ValidationIssueModel,
  ValidationConflictModel,
  ValidationAmbiguityModel,
  ValidationLimitationModel,
  ValidationResultModel,
  ValidationSummaryModel,
  ValidationStatusModel,
  ValidationSeverityModel,
  KnowledgeQualitySignalModel,
  KnowledgeTrustDeclarationModel,
  ValidationReadinessModel,
  ValidationProvenanceModel,
  ValidationBoundaryModel,
  ValidationSessionModel,
  ValidationSubjectSetModel,
  ValidationRuleSetModel,
  ValidationEvidenceSetModel,
  ValidationFindingSetModel,
  ValidationIssueSetModel,
  ValidationConsumerSuitabilityModel,
  ValidationExecutiveUsabilityModel,
  ValidationVersionModel,
]);

/** Ordered catalog of every canonical DKL-5:3 model descriptor. */
export const KnowledgeValidationModelCatalog = Object.freeze({
  catalogId: "DKL-5:3/ModelCatalog",
  models: CANONICAL_MODELS,
  modelCount: CANONICAL_MODELS.length,
  modelKinds: Object.freeze(CANONICAL_MODELS.map((m) => m.modelKind)),
  modelIds: Object.freeze(CANONICAL_MODELS.map((m) => m.modelId)),
  modelNames: Object.freeze(CANONICAL_MODELS.map((m) => m.modelName)),
  byKind: Object.freeze({
    KnowledgeValidation: KnowledgeValidationAggregateModel,
    ValidationTarget: ValidationTargetModel,
    ValidationScope: ValidationScopeModel,
    ValidationRule: ValidationRuleModel,
    ValidationCriterion: ValidationCriterionModel,
    ValidationEvidence: ValidationEvidenceModel,
    EvidenceReference: EvidenceReferenceModel,
    ValidationFinding: ValidationFindingModel,
    ValidationIssue: ValidationIssueModel,
    ValidationConflict: ValidationConflictModel,
    ValidationAmbiguity: ValidationAmbiguityModel,
    ValidationLimitation: ValidationLimitationModel,
    ValidationResult: ValidationResultModel,
    ValidationSummary: ValidationSummaryModel,
    ValidationStatus: ValidationStatusModel,
    ValidationSeverity: ValidationSeverityModel,
    KnowledgeQualitySignal: KnowledgeQualitySignalModel,
    KnowledgeTrustDeclaration: KnowledgeTrustDeclarationModel,
    ValidationReadiness: ValidationReadinessModel,
    ValidationProvenance: ValidationProvenanceModel,
    ValidationBoundary: ValidationBoundaryModel,
    ValidationSession: ValidationSessionModel,
    ValidationSubjectSet: ValidationSubjectSetModel,
    ValidationRuleSet: ValidationRuleSetModel,
    ValidationEvidenceSet: ValidationEvidenceSetModel,
    ValidationFindingSet: ValidationFindingSetModel,
    ValidationIssueSet: ValidationIssueSetModel,
    ValidationConsumerSuitability: ValidationConsumerSuitabilityModel,
    ValidationExecutiveUsability: ValidationExecutiveUsabilityModel,
    ValidationVersion: ValidationVersionModel,
  }),
  consumerSuitabilityStates: ConsumerSuitabilityStateCatalog,
  executiveUsabilityCapabilities: ExecutiveUsabilityCapabilityCatalog,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

const RELATIONSHIPS: readonly ModelRelationshipDeclaration[] = Object.freeze([
  Object.freeze({
    id: "kv-rel-validation-contains-target",
    from: "KnowledgeValidation",
    to: "ValidationTarget",
    kind: "Contains",
    description: "Validation contains Target.",
  }),
  Object.freeze({
    id: "kv-rel-validation-applies-rule-set",
    from: "KnowledgeValidation",
    to: "ValidationRuleSet",
    kind: "Applies",
    description: "Validation applies Rule Set.",
  }),
  Object.freeze({
    id: "kv-rel-rule-references-criteria",
    from: "ValidationRule",
    to: "ValidationCriterion",
    kind: "References",
    description: "Rule references Criteria.",
  }),
  Object.freeze({
    id: "kv-rel-criterion-requires-evidence",
    from: "ValidationCriterion",
    to: "ValidationEvidence",
    kind: "Requires",
    description: "Criterion requires Evidence.",
  }),
  Object.freeze({
    id: "kv-rel-evidence-supports-finding",
    from: "ValidationEvidence",
    to: "ValidationFinding",
    kind: "SupportsOrContradicts",
    description: "Evidence supports or contradicts Finding.",
  }),
  Object.freeze({
    id: "kv-rel-finding-contributes-to-issue",
    from: "ValidationFinding",
    to: "ValidationIssue",
    kind: "Contributes",
    description: "Finding contributes to Issue.",
  }),
  Object.freeze({
    id: "kv-rel-finding-may-create-limitation",
    from: "ValidationFinding",
    to: "ValidationLimitation",
    kind: "MayCreate",
    description: "Findings may create Limitation.",
  }),
  Object.freeze({
    id: "kv-rel-finding-declares-quality-signal",
    from: "ValidationFinding",
    to: "KnowledgeQualitySignal",
    kind: "Declares",
    description: "Findings may declare Quality Signals.",
  }),
  Object.freeze({
    id: "kv-rel-conflict-limits-trust",
    from: "ValidationConflict",
    to: "KnowledgeTrustDeclaration",
    kind: "Limits",
    description: "Conflicts limit Trust.",
  }),
  Object.freeze({
    id: "kv-rel-ambiguity-limits-trust",
    from: "ValidationAmbiguity",
    to: "KnowledgeTrustDeclaration",
    kind: "Limits",
    description: "Ambiguities limit Trust.",
  }),
  Object.freeze({
    id: "kv-rel-trust-contributes-to-result",
    from: "KnowledgeTrustDeclaration",
    to: "ValidationResult",
    kind: "Contributes",
    description: "Trust contributes to Result.",
  }),
  Object.freeze({
    id: "kv-rel-result-determines-consumer-suitability",
    from: "ValidationResult",
    to: "ValidationConsumerSuitability",
    kind: "Determines",
    description: "Result determines Consumer Suitability declaration.",
  }),
  Object.freeze({
    id: "kv-rel-result-informs-executive-usability",
    from: "ValidationResult",
    to: "ValidationExecutiveUsability",
    kind: "Informs",
    description: "Result informs Executive Usability declaration.",
  }),
  Object.freeze({
    id: "kv-rel-summary-describes-validation",
    from: "ValidationSummary",
    to: "KnowledgeValidation",
    kind: "Describes",
    description: "Summary describes Validation.",
  }),
]);

/** Structural relationships between model contracts. */
export const KnowledgeValidationModelRelationships = Object.freeze({
  relationshipsId: "DKL-5:3/ModelRelationships",
  declarations: RELATIONSHIPS,
  declarationCount: RELATIONSHIPS.length,
  graphTraversalForbidden: true,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Model-phase ownership metadata. */
export const KnowledgeValidationModelOwnership = Object.freeze({
  ownershipId: "DKL-5:3/ModelOwnership",
  owner: "DKL-5 Knowledge Validation Model",
  sourcePhase: "DKL-5:3",
  owns: Object.freeze([
    "Canonical Knowledge Validation model contracts",
    "Structural relationships between validation models",
    "Registry-to-model references",
    "Model ownership metadata",
    "Model compatibility metadata",
    "Model extension metadata",
    "Evidence, finding, issue, conflict, ambiguity, limitation, trust, result, and summary structures",
    "Consumer suitability and Executive usability declarations",
  ]),
  doesNotOwn: Object.freeze([
    "Runtime rule execution",
    "Validation evaluation",
    "Data cleansing",
    "Trust calculation",
    "Score calculation",
    "Entity resolution",
    "Semantic inference",
    "Ambiguity resolution",
    "Conflict resolution",
    "Source correction",
    "Remediation",
    "Persistence",
    "Repositories",
    "Queries",
    "Search",
    "Executive reasoning",
    "Decisions",
    "Advisor",
    "Scene",
    "UI",
    "Notifications",
    "Workflow orchestration",
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Model-phase dependency metadata. */
export const KnowledgeValidationModelDependencies = Object.freeze({
  dependencyId: "DKL-5:3/ModelDependencies",
  sourcePhase: "DKL-5:3",
  approved: Object.freeze([
    Object.freeze({
      module: "knowledgeValidationFoundation.ts",
      phase: KnowledgeValidationFoundationIdentity.sourcePhase,
      version: KnowledgeValidationFoundationVersion,
      foundationId: KnowledgeValidationFoundationIdentity.foundationId,
      required: true,
      publicEntryPointOnly: true,
    }),
    Object.freeze({
      module: "knowledgeValidationRegistry.ts",
      phase: KnowledgeValidationRegistryIdentity.sourcePhase,
      version: KnowledgeValidationRegistryVersion,
      registryId: KnowledgeValidationRegistryIdentity.registryId,
      required: true,
      publicEntryPointOnly: true,
    }),
  ]),
  approvedDependencyCount: 2,
  upstreamByReference: Object.freeze({
    foundationId: KnowledgeValidationFoundationIdentity.foundationId,
    foundationVersion: KnowledgeValidationFoundationVersion,
    foundationReadyForRegistry:
      KnowledgeValidationFoundation.readiness.ReadyForRegistry === true,
    registryId: KnowledgeValidationRegistryIdentity.registryId,
    registryVersion: KnowledgeValidationRegistryVersion,
    registryReadyForModel:
      KnowledgeValidationRegistry.readiness.ReadyForModel === true,
    reachedThroughApprovedEntryPoints: true,
  }),
  noDirectDkl4Dependency: true,
  noInternalPriorPhaseImports: true,
  noFutureDkl5Dependency: true,
  forbidden: Object.freeze([
    "knowledgeValidationFoundationTypes.ts",
    "knowledgeValidationContracts.ts",
    "knowledgeValidationRegistryTypes.ts",
    "knowledgeValidationRegistryCatalog.ts",
    "knowledgeValidationTargetRegistry.ts",
    "knowledgeModelingPublicIndex.ts",
    "knowledgeModelingModel.ts",
    "DKL-4 direct imports",
    "DKL-5:4+",
    "Engine",
    "Advisor",
    "Scene",
    "UI",
    "Persistence",
    "AI",
    "external packages",
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

/** Canonical immutable Knowledge Validation Model aggregate. */
export const KnowledgeValidationModel = Object.freeze({
  identity: KnowledgeValidationModelIdentity,
  version: KnowledgeValidationModelVersion,
  namespace: KnowledgeValidationModelNamespace,
  catalog: KnowledgeValidationModelCatalog,
  relationships: KnowledgeValidationModelRelationships,
  ownership: KnowledgeValidationModelOwnership,
  dependencies: KnowledgeValidationModelDependencies,
  foundation: Object.freeze({
    identity: KnowledgeValidationFoundationIdentity,
    version: KnowledgeValidationFoundationVersion,
    referencedThroughPublicFoundation: true,
  }),
  registry: Object.freeze({
    identity: KnowledgeValidationRegistryIdentity,
    version: KnowledgeValidationRegistryVersion,
    referencedThroughPublicRegistry: true,
    readiness: KnowledgeValidationRegistry.readiness.ReadyForModel,
  }),
  guarantees: Object.freeze({
    canonicalModelIdentities: true,
    immutableContracts: true,
    readonlyFields: true,
    explicitRegistryReferences: true,
    explicitOwnership: true,
    explicitProvenance: true,
    explainableFindings: true,
    evidenceBasedTrustDeclarations: true,
    noNumericScoring: true,
    noTrustCalculation: true,
    noAiConfidence: true,
    noRuntimeRuleExecution: true,
    noAmbiguityResolution: true,
    noConflictResolution: true,
    noRemediation: true,
    noPersistenceCoupling: true,
    noEngineBehavior: true,
    noHiddenMutableState: true,
    deterministicExports: true,
  }),
  readiness: Object.freeze({
    ModelComplete: true,
    ReadyForValidation: true,
    MetadataOnly: true,
    RuntimeInstanceForbidden: true,
    RuleExecutionForbidden: true,
    ScoreCalculationForbidden: true,
    TrustCalculationForbidden: true,
    AmbiguityResolutionForbidden: true,
    ConflictResolutionForbidden: true,
    RemediationForbidden: true,
    PersistenceForbidden: true,
    AiForbidden: true,
    EngineBehaviorForbidden: true,
    Deterministic: true,
    Immutable: true,
  }),
  completionStatus: Object.freeze([
    "ModelComplete",
    "KnowledgeValidationAggregateDefined",
    "TargetRuleCriterionDefined",
    "EvidenceModelsDefined",
    "FindingIssueLimitationDefined",
    "ConflictAmbiguityDefined",
    "QualitySignalTrustDefined",
    "ResultSummaryDefined",
    "ConsumerExecutiveUsabilityDefined",
    "ProvenanceRelationshipsDefined",
    "RegistryReferenced",
    "MetadataOnly",
    "ReadyForValidation",
  ]),
  nextPhase: "DKL-5:4 — Knowledge Validation Validation",
  metadataOnly: true,
  modelOnly: true,
  immutable: true,
  deterministic: true,
});
