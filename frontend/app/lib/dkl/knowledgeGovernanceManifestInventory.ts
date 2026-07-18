/**
 * DKL-8:5 — Knowledge Governance Manifest Inventory.
 *
 * Canonical inventories and architecture phases derived exclusively through
 * KnowledgeGovernanceValidationPlatform:
 * Validation → Model → Registry → Foundation → DKL-7 Public Index.
 * Counts from referenced collections. No reconstruction. No hardcoded counts.
 *
 * Ownership: owned exclusively by DKL-8:5.
 */

import { KnowledgeGovernanceValidationPlatform } from "./knowledgeGovernanceValidation.ts";
import type {
  KnowledgeGovernanceManifestArchitecturePhase,
  KnowledgeGovernanceManifestOwnershipDeclaration,
} from "./knowledgeGovernanceManifestTypes.ts";

/** Sole upstream surface — preserved by canonical reference. */
const validation = KnowledgeGovernanceValidationPlatform;
const model = validation.model;
const registry = model.registry;
const foundation = registry.foundation;

const phase = (
  phaseId: string,
  phaseName: string,
  stage: string,
  version: string,
  status: string,
  predecessor: string | null,
  successor: string | null,
  path: string,
  role: string,
  completed: boolean,
  order: number,
): KnowledgeGovernanceManifestArchitecturePhase =>
  Object.freeze({
    phaseId,
    phaseName,
    stage,
    version,
    status,
    directPredecessor: predecessor,
    directSuccessor: successor,
    canonicalReferencePath: path,
    architectureRole: role,
    runtimeBehavior: "None" as const,
    completed,
    deterministicOrder: order,
  });

/** Completed and future DKL-8 phase chain. */
export const KnowledgeGovernanceManifestArchitecturePhases: readonly KnowledgeGovernanceManifestArchitecturePhase[] =
  Object.freeze([
    phase(
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      "Foundation",
      foundation.identity.foundationVersion,
      foundation.status,
      foundation.identity.dkl7PublicIndexId,
      registry.identity.registryId,
      "Validation.model.registry.foundation",
      "Foundation",
      true,
      1,
    ),
    phase(
      registry.identity.registryId,
      registry.identity.registryName,
      "Registry",
      registry.identity.registryVersion,
      registry.status,
      foundation.identity.foundationId,
      model.identity.modelId,
      "Validation.model.registry",
      "Registry",
      true,
      2,
    ),
    phase(
      model.identity.modelId,
      model.identity.modelName,
      "Model",
      model.identity.modelVersion,
      model.status,
      registry.identity.registryId,
      validation.identity.validationId,
      "Validation.model",
      "Model",
      true,
      3,
    ),
    phase(
      validation.identity.validationId,
      validation.identity.validationName,
      "Validation",
      validation.identity.validationVersion,
      validation.status,
      model.identity.modelId,
      "DKL-8:5/KnowledgeGovernanceManifest",
      "Validation",
      "Validation",
      true,
      4,
    ),
    phase(
      "DKL-8:5/KnowledgeGovernanceManifest",
      "Knowledge Governance Manifest",
      "Manifest",
      "1.0.0",
      "ManifestDefined",
      validation.identity.validationId,
      "DKL-8:6/KnowledgeGovernancePlatform",
      "Manifest",
      "Manifest",
      true,
      5,
    ),
    phase(
      "DKL-8:6/KnowledgeGovernancePlatform",
      "Knowledge Governance Platform",
      "Platform",
      "Future",
      "Declared",
      "DKL-8:5/KnowledgeGovernanceManifest",
      "DKL-8:7/KnowledgeGovernanceCertification",
      "Future/Platform",
      "Platform",
      false,
      6,
    ),
    phase(
      "DKL-8:7/KnowledgeGovernanceCertification",
      "Knowledge Governance Certification",
      "Certification",
      "Future",
      "Declared",
      "DKL-8:6/KnowledgeGovernancePlatform",
      "DKL-8:8/KnowledgeGovernanceFreeze",
      "Future/Certification",
      "Certification",
      false,
      7,
    ),
    phase(
      "DKL-8:8/KnowledgeGovernanceFreeze",
      "Knowledge Governance Freeze",
      "Freeze",
      "Future",
      "Declared",
      "DKL-8:7/KnowledgeGovernanceCertification",
      "DKL-8:9/KnowledgeGovernancePublicIndex",
      "Future/Freeze",
      "Freeze",
      false,
      8,
    ),
    phase(
      "DKL-8:9/KnowledgeGovernancePublicIndex",
      "Knowledge Governance Public Index",
      "PublicIndex",
      "Future",
      "Declared",
      "DKL-8:8/KnowledgeGovernanceFreeze",
      null,
      "Future/PublicIndex",
      "PublicIndex",
      false,
      9,
    ),
  ]);

const completedPhaseCount =
  KnowledgeGovernanceManifestArchitecturePhases.filter(
    (item) => item.completed,
  ).length;
const futurePhaseCount =
  KnowledgeGovernanceManifestArchitecturePhases.filter(
    (item) => !item.completed,
  ).length;
const totalDkl8PhaseCount =
  KnowledgeGovernanceManifestArchitecturePhases.length;

/** Ownership collections preserved by Registry reference. */
export const KnowledgeGovernanceManifestOwnership: KnowledgeGovernanceManifestOwnershipDeclaration =
  Object.freeze({
    ownershipId: "DKL-8:5/Ownership",
    ownedCount: registry.ownership.owns.length,
    nonOwnedCount: registry.ownership.doesNotOwn.length,
    owns: registry.ownership.owns,
    doesNotOwn: registry.ownership.doesNotOwn,
    sourcePhase: "DKL-8:2" as const,
    preservedByReference: true as const,
    metadataOnly: true as const,
  });

/** Boundary collection preserved by Registry reference (no reconstruction). */
export const KnowledgeGovernanceManifestBoundaries =
  registry.boundaries.ownershipBoundaries;

/** Observed counts derived from referenced Validation-chain collections only. */
export const KnowledgeGovernanceManifestObservedCounts = Object.freeze({
  foundationSubjectCount: foundation.subjects.length,
  foundationContractCount: foundation.contracts.length,
  foundationRoleCount: foundation.roles.length,
  registryEntryCount: registry.totalEntryCount,
  subjectCount: registry.subjects.length,
  contractCount: registry.contracts.length,
  roleCount: registry.roles.length,
  capabilityCount: registry.capabilities.length,
  classificationCount: registry.classifications.length,
  sensitivityCount: registry.sensitivities.length,
  accessIntentCount: registry.accessIntents.length,
  usagePolicyCount: registry.usagePolicies.length,
  retentionIntentCount: registry.retentionIntents.length,
  dispositionIntentCount: registry.dispositionIntents.length,
  auditIntentCount: registry.auditIntents.length,
  complianceIntentCount: registry.complianceIntents.length,
  lifecycleStateCount: registry.lifecycleStates.length,
  lifecycleTransitionCount: registry.lifecycleTransitions.length,
  evidenceKindCount: registry.evidenceKinds.length,
  exceptionCategoryCount: registry.exceptionCategories.length,
  ownershipDeclarationCount:
    registry.ownership.owns.length + registry.ownership.doesNotOwn.length,
  boundaryCount: registry.boundaries.ownershipBoundaries.length,
  prohibitedSurfaceCount: registry.boundaries.prohibitedSurfaces.length,
  modelKindCount: model.modelKinds.length,
  relationshipKindCount: model.relationships.kinds.length,
  assignmentModelCount: model.assignmentModelCount,
  policyModelCount: model.policyModelCount,
  lifecycleModelCount: model.lifecycleModelCount,
  evidenceModelCount: model.evidenceModelCount,
  compositeModelCount: model.compositeModelCount,
  modelSectionCount: model.sectionCount,
  validationRuleCount: validation.rules.length,
  validationCategoryCount: validation.categories.length,
  validationGateCount: validation.gates.length,
  validationSeverityCount: validation.severities.length,
  validationOutcomeCount: validation.outcomes.length,
  validationOutcome: validation.validationOutcome,
  completedPhaseCount,
  futurePhaseCount,
  totalDkl8PhaseCount,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Chain identity anchors from Validation-platform references. */
export const KnowledgeGovernanceManifestChainIds = Object.freeze({
  foundationId: foundation.identity.foundationId,
  registryId: registry.identity.registryId,
  modelId: model.identity.modelId,
  validationId: validation.identity.validationId,
  manifestId: "DKL-8:5/KnowledgeGovernanceManifest" as const,
  preservedByReference: true as const,
});

/** Foundation profile — counts and collection references via Validation chain. */
export const KnowledgeGovernanceManifestFoundationProfile = Object.freeze({
  profileId: "DKL-8:5/Profile/Foundation",
  foundationId: foundation.identity.foundationId,
  foundationVersion: foundation.identity.foundationVersion,
  status: foundation.status,
  readiness: foundation.readiness,
  subjectCount: foundation.subjects.length,
  contractCount: foundation.contracts.length,
  roleCount: foundation.roles.length,
  subjects: foundation.subjects,
  contracts: foundation.contracts,
  roles: foundation.roles,
  accessPath: "Validation.model.registry.foundation",
  preservedByReference: true as const,
  metadataOnly: true as const,
});

/** Registry profile — counts and collections via Validation.model.registry. */
export const KnowledgeGovernanceManifestRegistryProfile = Object.freeze({
  profileId: "DKL-8:5/Profile/Registry",
  registryId: registry.identity.registryId,
  registryVersion: registry.identity.registryVersion,
  status: registry.status,
  readiness: registry.readiness,
  totalEntryCount: registry.totalEntryCount,
  subjects: registry.subjects,
  contracts: registry.contracts,
  roles: registry.roles,
  capabilities: registry.capabilities,
  accessPath: "Validation.model.registry",
  preservedByReference: true as const,
  metadataOnly: true as const,
});

/** Model profile — counts and collections via Validation.model. */
export const KnowledgeGovernanceManifestModelProfile = Object.freeze({
  profileId: "DKL-8:5/Profile/Model",
  modelId: model.identity.modelId,
  modelVersion: model.identity.modelVersion,
  status: model.status,
  readiness: model.readiness,
  modelKindCount: model.modelKinds.length,
  relationshipKindCount: model.relationships.kinds.length,
  assignmentModelCount: model.assignmentModelCount,
  policyModelCount: model.policyModelCount,
  lifecycleModelCount: model.lifecycleModelCount,
  evidenceModelCount: model.evidenceModelCount,
  compositeModelCount: model.compositeModelCount,
  modelKinds: model.modelKinds,
  relationshipKinds: model.relationships.kinds,
  accessPath: "Validation.model",
  preservedByReference: true as const,
  metadataOnly: true as const,
});

/** Validation profile — direct Validation collections. */
export const KnowledgeGovernanceManifestValidationProfile = Object.freeze({
  profileId: "DKL-8:5/Profile/Validation",
  validationId: validation.identity.validationId,
  validationVersion: validation.identity.validationVersion,
  status: validation.status,
  readiness: validation.readiness,
  validationOutcome: validation.validationOutcome,
  ruleCount: validation.rules.length,
  categoryCount: validation.categories.length,
  gateCount: validation.gates.length,
  severityCount: validation.severities.length,
  outcomeCount: validation.outcomes.length,
  failedRuleCount: validation.validationResult.failedRuleCount,
  rules: validation.rules,
  categories: validation.categories,
  gates: validation.gates,
  accessPath: "Validation",
  preservedByReference: true as const,
  metadataOnly: true as const,
});
