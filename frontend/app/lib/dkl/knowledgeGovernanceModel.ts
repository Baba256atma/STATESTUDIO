/**
 * DKL-8:3 — Knowledge Governance Model.
 *
 * Canonical immutable metadata-only model layer composing DKL-8:2 Registry
 * concepts into structural governance records. Consumes only the Registry
 * public surface. No validation, enforcement, persistence, or runtime.
 *
 * Ownership: owned exclusively by DKL-8:3.
 *
 * Public exports (exactly 8):
 *   KnowledgeGovernanceModelId
 *   KnowledgeGovernanceModelVersion
 *   KnowledgeGovernanceModelName
 *   KnowledgeGovernanceModelNamespace
 *   KnowledgeGovernanceModelStatus
 *   KnowledgeGovernanceModelReadiness
 *   KnowledgeGovernanceModelPlatform
 *   getKnowledgeGovernanceModelSummary()
 */

import {
  KnowledgeGovernanceRegistryId,
  KnowledgeGovernanceRegistryPlatform,
  KnowledgeGovernanceRegistryVersion,
} from "./knowledgeGovernanceRegistry.ts";
import {
  KnowledgeGovernanceAssignmentModelKinds,
  KnowledgeGovernanceAssignmentRegistryAnchors,
} from "./knowledgeGovernanceAssignmentModels.ts";
import {
  KnowledgeGovernanceCompositeAnchors,
  KnowledgeGovernanceCompositeModelKinds,
  KnowledgeGovernanceRelationshipKinds,
} from "./knowledgeGovernanceCompositeModels.ts";
import {
  KnowledgeGovernanceEvidenceModelKinds,
  KnowledgeGovernanceEvidenceRegistryAnchors,
} from "./knowledgeGovernanceEvidenceModels.ts";
import {
  KnowledgeGovernanceLifecycleModelKinds,
  KnowledgeGovernanceLifecycleRegistryAnchors,
} from "./knowledgeGovernanceLifecycleModels.ts";
import type {
  KnowledgeGovernanceModelKindDescriptor,
  KnowledgeGovernanceModelSummary,
} from "./knowledgeGovernanceModelTypes.ts";
import {
  KnowledgeGovernancePolicyModelKinds,
  KnowledgeGovernancePolicyRegistryAnchors,
} from "./knowledgeGovernancePolicyModels.ts";

export const KnowledgeGovernanceModelId =
  "DKL-8:3/KnowledgeGovernanceModel" as const;

export const KnowledgeGovernanceModelName =
  "Knowledge Governance Model" as const;

export const KnowledgeGovernanceModelVersion = "1.0.0" as const;

export const KnowledgeGovernanceModelNamespace =
  "nexora.dkl.knowledge-governance.model" as const;

export const KnowledgeGovernanceModelStatus = "ModelDefined" as const;

export const KnowledgeGovernanceModelReadiness =
  "ReadyForValidation" as const;

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "dependency",
  "modelKinds",
  "subjects",
  "scopes",
  "actors",
  "ownership",
  "stewardship",
  "classification",
  "sensitivity",
  "access",
  "usage",
  "retention",
  "disposition",
  "audit",
  "compliance",
  "policyApplicability",
  "lifecycle",
  "evidence",
  "decisions",
  "exceptions",
  "boundaries",
  "profiles",
  "snapshots",
  "records",
  "relationships",
  "findings",
  "issues",
  "conflicts",
  "ambiguities",
  "results",
  "references",
  "readiness",
] as const);

const modelKinds = Object.freeze([
  ...KnowledgeGovernanceAssignmentModelKinds,
  ...KnowledgeGovernancePolicyModelKinds,
  ...KnowledgeGovernanceLifecycleModelKinds,
  ...KnowledgeGovernanceEvidenceModelKinds,
  ...KnowledgeGovernanceCompositeModelKinds,
]);

const byKind = (
  kind: KnowledgeGovernanceModelKindDescriptor["modelKind"],
): KnowledgeGovernanceModelKindDescriptor => {
  const found = modelKinds.find((item) => item.modelKind === kind);
  if (!found) {
    throw new Error(`Missing model kind descriptor: ${kind}`);
  }
  return found;
};

const identity = Object.freeze({
  modelId: KnowledgeGovernanceModelId,
  modelName: KnowledgeGovernanceModelName,
  modelVersion: KnowledgeGovernanceModelVersion,
  modelNamespace: KnowledgeGovernanceModelNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-8" as const,
  stage: "Model" as const,
  sourcePhase: "DKL-8:3" as const,
  owner: "DKL-8 Knowledge Governance",
  status: KnowledgeGovernanceModelStatus,
  readiness: KnowledgeGovernanceModelReadiness,
  registryId: KnowledgeGovernanceRegistryId,
  registryVersion: KnowledgeGovernanceRegistryVersion,
  kind: "GovernanceIdentity" as const,
  metadataOnly: true as const,
  immutable: true as const,
  generatesTimestamps: false as const,
  generatesRandomIds: false as const,
  environmentDerivedValues: false as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-8:3/Dependency/DKL82Registry",
  directPreviousPhaseModule: "knowledgeGovernanceRegistry.ts" as const,
  registryOnly: true as const,
  registryId: KnowledgeGovernanceRegistryId,
  registryVersion: KnowledgeGovernanceRegistryVersion,
  foundationDirectImport: false as const,
  dkl7DirectImport: false as const,
  dkl6DirectImport: false as const,
  dkl5DirectImport: false as const,
  dkl4DirectImport: false as const,
  dkl3DirectImport: false as const,
  dkl2DirectImport: false as const,
  dkl1DirectImport: false as const,
  reconstructsFoundation: false as const,
  reconstructsRegistry: false as const,
  canonicalPath:
    "DKL-8:3 → DKL-8:2 Registry → DKL-8:1 Foundation → DKL-7 Public Index",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

const references = Object.freeze({
  referenceContractId: "DKL-8:3/References/GovernanceModelReferences",
  subjectReferences: Object.freeze([] as const),
  roleReferences: Object.freeze([] as const),
  policyReferences: Object.freeze([] as const),
  evidenceReferences: Object.freeze([] as const),
  decisionReferences: Object.freeze([] as const),
  exceptionReferences: Object.freeze([] as const),
  boundaryReferences: Object.freeze([] as const),
  profileReferences: Object.freeze([] as const),
  snapshotReferences: Object.freeze([] as const),
  recordReferences: Object.freeze([] as const),
  relationshipReferences: Object.freeze([] as const),
  findingReferences: Object.freeze([] as const),
  issueReferences: Object.freeze([] as const),
  conflictReferences: Object.freeze([] as const),
  ambiguityReferences: Object.freeze([] as const),
  embedsComponents: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

const modelApi = (
  exportName: string,
  kind:
    | "Aggregate"
    | "IdentityConstant"
    | "MetadataConstant"
    | "Helper",
) =>
  Object.freeze({
    id: `DKL-8:3/PublicApi/${exportName}`,
    exportName,
    phase: "DKL-8:3" as const,
    section: "Model" as const,
    kind,
    version: KnowledgeGovernanceModelVersion,
    status: KnowledgeGovernanceModelStatus,
    stability: "Stable" as const,
    public: true as const,
    sourceReference: "knowledgeGovernanceModel.ts" as const,
  });

/** Additive public-surface registry — exactly eight top-level exports. */
const KnowledgeGovernanceModelApiRegistry = Object.freeze([
  modelApi("KnowledgeGovernanceModelId", "IdentityConstant"),
  modelApi("KnowledgeGovernanceModelVersion", "IdentityConstant"),
  modelApi("KnowledgeGovernanceModelName", "IdentityConstant"),
  modelApi("KnowledgeGovernanceModelNamespace", "IdentityConstant"),
  modelApi("KnowledgeGovernanceModelStatus", "MetadataConstant"),
  modelApi("KnowledgeGovernanceModelReadiness", "MetadataConstant"),
  modelApi("KnowledgeGovernanceModelPlatform", "Aggregate"),
  modelApi("getKnowledgeGovernanceModelSummary", "Helper"),
]);

/**
 * Canonical immutable Knowledge Governance Model platform.
 * Exposes model definitions, not runtime instances.
 */
export const KnowledgeGovernanceModelPlatform = Object.freeze({
  identity,
  dependency,
  modelKinds,
  subjects: Object.freeze({
    definition: byKind("GovernanceSubjectReference"),
    registrySubjectIds: KnowledgeGovernanceAssignmentRegistryAnchors.subjectIds,
    embedsUpstreamObjects: false as const,
    reconstructsDkl4: false as const,
    reconstructsDkl6: false as const,
    reconstructsDkl7: false as const,
  }),
  scopes: Object.freeze({
    definition: byKind("GovernanceScope"),
    scopeTypes: Object.freeze([
      "Global",
      "Tenant",
      "Organization",
      "BusinessUnit",
      "Department",
      "Team",
      "Project",
      "KnowledgeDomain",
      "SubjectType",
      "SpecificSubject",
      "Relationship",
      "KnowledgeGraphSegment",
      "RepositoryCollection",
      "KnowledgeService",
      "CustomDeclaredScope",
    ] as const),
    resolvesInheritance: false as const,
    declarativeOnly: true as const,
  }),
  actors: Object.freeze({
    definition: byKind("GovernanceActorRoleReference"),
    actorTypes: Object.freeze([
      "User",
      "Team",
      "Department",
      "Organization",
      "Tenant",
      "System",
      "ExternalAuthority",
      "Unassigned",
    ] as const),
    registryRoleIds: KnowledgeGovernanceAssignmentRegistryAnchors.roleIds,
    resolvesIdentity: false as const,
    authenticates: false as const,
  }),
  ownership: Object.freeze({
    definition: byKind("OwnershipAssignment"),
    ownerRoleId: KnowledgeGovernanceAssignmentRegistryAnchors.ownerRoleId,
    assignsUsersAutomatically: false as const,
    enforcesOwnership: false as const,
  }),
  stewardship: Object.freeze({
    definition: byKind("StewardshipAssignment"),
    stewardRoleId: KnowledgeGovernanceAssignmentRegistryAnchors.stewardRoleId,
    mergedWithOwnership: false as const,
  }),
  classification: Object.freeze({
    definition: byKind("ClassificationAssignment"),
    classificationIds:
      KnowledgeGovernanceAssignmentRegistryAnchors.classificationIds,
    cardinality:
      KnowledgeGovernanceAssignmentRegistryAnchors.classificationCardinality,
    separateFromSensitivity: true as const,
    separateFromAuthorization: true as const,
    separateFromTrust: true as const,
    separateFromQuality: true as const,
    separateFromExecutiveImportance: true as const,
    calculatesAutomatically: false as const,
  }),
  sensitivity: Object.freeze({
    definition: byKind("SensitivityAssignment"),
    sensitivityIds:
      KnowledgeGovernanceAssignmentRegistryAnchors.sensitivityIds,
    cardinality:
      KnowledgeGovernanceAssignmentRegistryAnchors.sensitivityCardinality,
    separateFromClassification: true as const,
    duplicateSensitivityIdsAllowed: false as const,
    stableOrdering: true as const,
    calculatesRiskScore: false as const,
    enforcesAccess: false as const,
  }),
  access: Object.freeze({
    definition: byKind("AccessIntentAssignment"),
    accessIntentIds: KnowledgeGovernancePolicyRegistryAnchors.accessIntentIds,
    returnsAuthorizationOutcomes: false as const,
    producesAllowedDenied: false as const,
  }),
  usage: Object.freeze({
    definition: byKind("UsagePolicyAssignment"),
    usagePolicyIds: KnowledgeGovernancePolicyRegistryAnchors.usagePolicyIds,
    executesPolicyRules: false as const,
    evaluatesConflicts: false as const,
  }),
  retention: Object.freeze({
    definition: byKind("RetentionIntentAssignment"),
    retentionIntentIds:
      KnowledgeGovernancePolicyRegistryAnchors.retentionIntentIds,
    schedulesRetention: false as const,
    usesCron: false as const,
    deletesRecords: false as const,
  }),
  disposition: Object.freeze({
    definition: byKind("DispositionIntentAssignment"),
    dispositionIntentIds:
      KnowledgeGovernancePolicyRegistryAnchors.dispositionIntentIds,
    executesDisposition: false as const,
  }),
  audit: Object.freeze({
    definition: byKind("AuditIntentAssignment"),
    auditIntentIds: KnowledgeGovernancePolicyRegistryAnchors.auditIntentIds,
    implementsAuditLogging: false as const,
    storesEvents: false as const,
  }),
  compliance: Object.freeze({
    definition: byKind("ComplianceIntentAssignment"),
    complianceIntentIds:
      KnowledgeGovernancePolicyRegistryAnchors.complianceIntentIds,
    evaluatesCompliance: false as const,
    legalInterpretation: false as const,
  }),
  policyApplicability: Object.freeze({
    definition: byKind("PolicyApplicability"),
    policyReferenceKindIds:
      KnowledgeGovernancePolicyRegistryAnchors.policyReferenceKindIds,
    resolvesPrecedence: false as const,
    calculatesInheritedSets: false as const,
    executesOverrides: false as const,
  }),
  lifecycle: Object.freeze({
    stateDefinition: byKind("GovernanceLifecycleState"),
    transitionDefinition: byKind("GovernanceLifecycleTransitionRecord"),
    lifecycleStateIds:
      KnowledgeGovernanceLifecycleRegistryAnchors.lifecycleStateIds,
    lifecycleTransitionIds:
      KnowledgeGovernanceLifecycleRegistryAnchors.lifecycleTransitionIds,
    lifecycleStateCount:
      KnowledgeGovernanceLifecycleRegistryAnchors.lifecycleStateCount,
    lifecycleTransitionCount:
      KnowledgeGovernanceLifecycleRegistryAnchors.lifecycleTransitionCount,
    runtimeStateMachine: false as const,
    executesTransitions: false as const,
  }),
  evidence: Object.freeze({
    definition: byKind("GovernanceEvidenceReference"),
    evidenceKindIds: KnowledgeGovernanceEvidenceRegistryAnchors.evidenceKindIds,
    embedsDocuments: false as const,
  }),
  decisions: Object.freeze({
    definition: byKind("GovernanceDecisionReference"),
    decisionReferenceKindIds:
      KnowledgeGovernanceEvidenceRegistryAnchors.decisionReferenceKindIds,
    reconstructsEngineDecisions: false as const,
    makesDecisions: false as const,
  }),
  exceptions: Object.freeze({
    definition: byKind("GovernanceException"),
    exceptionCategoryIds:
      KnowledgeGovernanceEvidenceRegistryAnchors.exceptionCategoryIds,
    submitsExceptions: false as const,
    approvesExceptions: false as const,
    workflowMethods: false as const,
  }),
  boundaries: Object.freeze({
    definition: byKind("GovernanceBoundaryReference"),
    boundaryIds: KnowledgeGovernanceEvidenceRegistryAnchors.boundaryIds,
    createsExternalDependencies: false as const,
  }),
  profiles: Object.freeze({
    definition: byKind("GovernanceProfile"),
    composesByReference:
      KnowledgeGovernanceCompositeAnchors.profileComposesByReference,
    evaluatesCompleteness:
      KnowledgeGovernanceCompositeAnchors.profileEvaluatesCompleteness,
  }),
  snapshots: Object.freeze({
    definition: byKind("GovernanceSnapshot"),
    usesSystemTime: KnowledgeGovernanceCompositeAnchors.snapshotUsesSystemTime,
    persists: KnowledgeGovernanceCompositeAnchors.snapshotPersists,
  }),
  records: Object.freeze({
    definition: byKind("GovernanceRecord"),
    isPersistenceEntity:
      KnowledgeGovernanceCompositeAnchors.recordIsPersistenceEntity,
    isOrmModel: KnowledgeGovernanceCompositeAnchors.recordIsOrmModel,
  }),
  relationships: Object.freeze({
    definition: byKind("GovernanceRelationship"),
    kinds: KnowledgeGovernanceRelationshipKinds,
    relationshipKindCount: KnowledgeGovernanceRelationshipKinds.length,
    traversalEngine:
      KnowledgeGovernanceCompositeAnchors.relationshipTraversalEngine,
  }),
  findings: Object.freeze({
    definition: byKind("GovernanceFinding"),
    generatesFindings: KnowledgeGovernanceCompositeAnchors.generatesFindings,
  }),
  issues: Object.freeze({
    definition: byKind("GovernanceIssue"),
    detectsIssues: KnowledgeGovernanceCompositeAnchors.detectsIssues,
  }),
  conflicts: Object.freeze({
    definition: byKind("GovernanceConflict"),
    conflictTypes: Object.freeze([
      "OwnershipConflict",
      "ClassificationConflict",
      "SensitivityConflict",
      "AccessIntentConflict",
      "PolicyApplicabilityConflict",
      "RetentionConflict",
      "DispositionConflict",
      "LifecycleConflict",
      "ExceptionConflict",
      "BoundaryConflict",
    ] as const),
    resolvesConflicts: KnowledgeGovernanceCompositeAnchors.resolvesConflicts,
  }),
  ambiguities: Object.freeze({
    definition: byKind("GovernanceAmbiguity"),
    ambiguityTypes: Object.freeze([
      "MissingOwner",
      "MissingSteward",
      "UnknownScope",
      "UnclearClassification",
      "UnclearSensitivity",
      "UnresolvedPolicy",
      "UnclearRetention",
      "UnclearDisposition",
      "UnverifiedEvidence",
      "UnresolvedException",
      "UnknownLifecycle",
      "BoundaryUncertainty",
    ] as const),
    asksUserQuestions: KnowledgeGovernanceCompositeAnchors.asksUserQuestions,
  }),
  results: Object.freeze({
    definition: byKind("GovernanceModelResult"),
    runsValidation: KnowledgeGovernanceCompositeAnchors.runsValidation,
    calculatesReadinessDynamically:
      KnowledgeGovernanceCompositeAnchors.calculatesReadinessDynamically,
  }),
  references,
  readiness: KnowledgeGovernanceModelReadiness,
  apiRegistry: KnowledgeGovernanceModelApiRegistry,
  registry: KnowledgeGovernanceRegistryPlatform,
  assignmentModelCount: KnowledgeGovernanceAssignmentModelKinds.length,
  policyModelCount: KnowledgeGovernancePolicyModelKinds.length,
  lifecycleModelCount: KnowledgeGovernanceLifecycleModelKinds.length,
  evidenceModelCount: KnowledgeGovernanceEvidenceModelKinds.length,
  compositeModelCount: KnowledgeGovernanceCompositeModelKinds.length,
  modelKindCount: modelKinds.length,
  relationshipKindCount: KnowledgeGovernanceRelationshipKinds.length,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: KnowledgeGovernanceModelStatus,
  nextPhase: "DKL-8:4 — Knowledge Governance Validation",
  metadataOnly: true as const,
  runtimeBehavior: false as const,
  runtimeEnforcement: false as const,
  policyExecution: false as const,
  authenticationBehavior: false as const,
  authorizationBehavior: false as const,
  repositoryAccess: false as const,
  searchExecution: false as const,
  graphTraversal: false as const,
  aiBehavior: false as const,
  transportBehavior: false as const,
  engineReasoning: false as const,
  advisorBehavior: false as const,
  directorBehavior: false as const,
  sceneBehavior: false as const,
  uiBehavior: false as const,
  validatesGovernance: false as const,
  enforcesGovernance: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Knowledge Governance Model summary. */
export function getKnowledgeGovernanceModelSummary(): KnowledgeGovernanceModelSummary {
  return Object.freeze({
    id: KnowledgeGovernanceModelId,
    version: KnowledgeGovernanceModelVersion,
    namespace: KnowledgeGovernanceModelNamespace,
    status: KnowledgeGovernanceModelStatus,
    readiness: KnowledgeGovernanceModelReadiness,
    upstreamDependency: KnowledgeGovernanceRegistryId,
    modelKindCount: KnowledgeGovernanceModelPlatform.modelKindCount,
    relationshipKindCount:
      KnowledgeGovernanceModelPlatform.relationshipKindCount,
    assignmentModelCount:
      KnowledgeGovernanceModelPlatform.assignmentModelCount,
    policyModelCount: KnowledgeGovernanceModelPlatform.policyModelCount,
    lifecycleModelCount: KnowledgeGovernanceModelPlatform.lifecycleModelCount,
    evidenceModelCount: KnowledgeGovernanceModelPlatform.evidenceModelCount,
    compositeModelCount: KnowledgeGovernanceModelPlatform.compositeModelCount,
    sectionCount: KnowledgeGovernanceModelPlatform.sectionCount,
    runtimeBehavior: "None",
    nextPhase: "DKL-8:4 — Knowledge Governance Validation",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
