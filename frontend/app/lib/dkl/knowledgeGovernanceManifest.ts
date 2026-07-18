/**
 * DKL-8:5 — Knowledge Governance Manifest.
 *
 * Canonical immutable architectural manifest for Knowledge Governance
 * (DKL-8:1 through DKL-8:4). Consumes only the DKL-8:4 Validation public surface.
 * Metadata-only. Manifest-only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-8:5.
 *
 * Public exports (exactly 8):
 *   KnowledgeGovernanceManifestId
 *   KnowledgeGovernanceManifestVersion
 *   KnowledgeGovernanceManifestName
 *   KnowledgeGovernanceManifestNamespace
 *   KnowledgeGovernanceManifestStatus
 *   KnowledgeGovernanceManifestReadiness
 *   KnowledgeGovernanceManifestPlatform
 *   getKnowledgeGovernanceManifestSummary()
 */

import { KnowledgeGovernanceValidationPlatform } from "./knowledgeGovernanceValidation.ts";
import { KnowledgeGovernanceManifestCompatibility } from "./knowledgeGovernanceManifestCompatibility.ts";
import { KnowledgeGovernanceManifestDependencies } from "./knowledgeGovernanceManifestDependencies.ts";
import { KnowledgeGovernanceManifestGuarantees } from "./knowledgeGovernanceManifestGuarantees.ts";
import {
  KnowledgeGovernanceManifestArchitecturePhases,
  KnowledgeGovernanceManifestBoundaries,
  KnowledgeGovernanceManifestChainIds,
  KnowledgeGovernanceManifestFoundationProfile,
  KnowledgeGovernanceManifestModelProfile,
  KnowledgeGovernanceManifestObservedCounts,
  KnowledgeGovernanceManifestOwnership,
  KnowledgeGovernanceManifestRegistryProfile,
  KnowledgeGovernanceManifestValidationProfile,
} from "./knowledgeGovernanceManifestInventory.ts";
import {
  KnowledgeGovernanceManifestArchitectureStatus,
  KnowledgeGovernanceManifestPublicApis,
  KnowledgeGovernanceManifestReadinessValue,
} from "./knowledgeGovernanceManifestReadiness.ts";
import type {
  KnowledgeGovernanceManifestInventory,
  KnowledgeGovernanceManifestSummary,
} from "./knowledgeGovernanceManifestTypes.ts";

const validation = KnowledgeGovernanceValidationPlatform;

export const KnowledgeGovernanceManifestId =
  "DKL-8:5/KnowledgeGovernanceManifest" as const;

export const KnowledgeGovernanceManifestName =
  "Knowledge Governance Manifest" as const;

export const KnowledgeGovernanceManifestVersion = "1.0.0" as const;

export const KnowledgeGovernanceManifestNamespace =
  "nexora.dkl.knowledge-governance.manifest" as const;

export const KnowledgeGovernanceManifestStatus = "ManifestDefined" as const;

export const KnowledgeGovernanceManifestReadiness =
  KnowledgeGovernanceManifestReadinessValue;

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "dependency",
  "architecture",
  "foundation",
  "registry",
  "model",
  "validation",
  "ownership",
  "boundaries",
  "dependencies",
  "inventory",
  "compatibility",
  "guarantees",
  "publicApi",
  "readiness",
] as const);

/**
 * Counting rule for Manifest totalEntryCount:
 * completedPhases + futurePhases + dependencies + registryEntries +
 * modelKinds + relationshipKinds + validationRules + validationCategories +
 * validationGates + validationSeverities + validationOutcomes +
 * guarantees + compatibility + publicApis
 */
const COUNTING_RULE =
  "completedPhases + futurePhases + dependencies + registryEntries + modelKinds + relationshipKinds + validationRules + validationCategories + validationGates + validationSeverities + validationOutcomes + guarantees + compatibility + publicApis";

const counts = KnowledgeGovernanceManifestObservedCounts;

const totalEntryCount =
  counts.completedPhaseCount +
  counts.futurePhaseCount +
  KnowledgeGovernanceManifestDependencies.length +
  counts.registryEntryCount +
  counts.modelKindCount +
  counts.relationshipKindCount +
  counts.validationRuleCount +
  counts.validationCategoryCount +
  counts.validationGateCount +
  counts.validationSeverityCount +
  counts.validationOutcomeCount +
  KnowledgeGovernanceManifestGuarantees.length +
  KnowledgeGovernanceManifestCompatibility.length +
  KnowledgeGovernanceManifestPublicApis.length;

const inventory: KnowledgeGovernanceManifestInventory = Object.freeze({
  inventoryId: "DKL-8:5/KnowledgeGovernanceManifestInventory",
  completedPhaseCount: counts.completedPhaseCount,
  futurePhaseCount: counts.futurePhaseCount,
  totalDkl8PhaseCount: counts.totalDkl8PhaseCount,
  dependencyCount: KnowledgeGovernanceManifestDependencies.length,
  registryEntryCount: counts.registryEntryCount,
  subjectCount: counts.subjectCount,
  contractCount: counts.contractCount,
  roleCount: counts.roleCount,
  capabilityCount: counts.capabilityCount,
  classificationCount: counts.classificationCount,
  sensitivityCount: counts.sensitivityCount,
  accessIntentCount: counts.accessIntentCount,
  usagePolicyCount: counts.usagePolicyCount,
  retentionIntentCount: counts.retentionIntentCount,
  dispositionIntentCount: counts.dispositionIntentCount,
  auditIntentCount: counts.auditIntentCount,
  complianceIntentCount: counts.complianceIntentCount,
  lifecycleStateCount: counts.lifecycleStateCount,
  lifecycleTransitionCount: counts.lifecycleTransitionCount,
  evidenceKindCount: counts.evidenceKindCount,
  exceptionCategoryCount: counts.exceptionCategoryCount,
  ownershipDeclarationCount: counts.ownershipDeclarationCount,
  boundaryCount: counts.boundaryCount,
  modelKindCount: counts.modelKindCount,
  relationshipKindCount: counts.relationshipKindCount,
  assignmentModelCount: counts.assignmentModelCount,
  policyModelCount: counts.policyModelCount,
  lifecycleModelCount: counts.lifecycleModelCount,
  evidenceModelCount: counts.evidenceModelCount,
  compositeModelCount: counts.compositeModelCount,
  validationRuleCount: counts.validationRuleCount,
  validationCategoryCount: counts.validationCategoryCount,
  validationGateCount: counts.validationGateCount,
  validationSeverityCount: counts.validationSeverityCount,
  validationOutcomeCount: counts.validationOutcomeCount,
  guaranteeCount: KnowledgeGovernanceManifestGuarantees.length,
  compatibilityCount: KnowledgeGovernanceManifestCompatibility.length,
  publicApiCount: KnowledgeGovernanceManifestPublicApis.length,
  sectionCount: PLATFORM_SECTIONS.length,
  totalEntryCount,
  countingRule: COUNTING_RULE,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

const identity = Object.freeze({
  manifestId: KnowledgeGovernanceManifestId,
  manifestName: KnowledgeGovernanceManifestName,
  manifestVersion: KnowledgeGovernanceManifestVersion,
  manifestNamespace: KnowledgeGovernanceManifestNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-8" as const,
  stage: "Manifest" as const,
  sourcePhase: "DKL-8:5" as const,
  owner: "DKL-8 Knowledge Governance",
  status: KnowledgeGovernanceManifestStatus,
  readiness: KnowledgeGovernanceManifestReadiness,
  validationId: validation.identity.validationId,
  validationVersion: validation.identity.validationVersion,
  architectureStatus: KnowledgeGovernanceManifestArchitectureStatus,
  metadataOnly: true as const,
  immutable: true as const,
});

const metadata = Object.freeze({
  metadataId: "DKL-8:5/KnowledgeGovernanceManifestMetadata",
  manifestId: KnowledgeGovernanceManifestId,
  description:
    "Canonical immutable architectural manifest inventoring DKL-8:1 Foundation through DKL-8:4 Validation.",
  releaseMetadata: Object.freeze({
    version: KnowledgeGovernanceManifestVersion,
    status: KnowledgeGovernanceManifestStatus,
    readiness: KnowledgeGovernanceManifestReadiness,
    validationOutcome: counts.validationOutcome,
    singleSourceOfTruth: true as const,
  }),
  metadataOnly: true as const,
  declarationOnly: true as const,
  runtimeBehavior: false as const,
  validates: false as const,
  executes: false as const,
  enforces: false as const,
  persists: false as const,
  retrieves: false as const,
  reasons: false as const,
  renders: false as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-8:5/Dependency/DKL84Validation",
  directPreviousPhaseModule: "knowledgeGovernanceValidation.ts" as const,
  validationOnly: true as const,
  validationId: validation.identity.validationId,
  validationVersion: validation.identity.validationVersion,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl7DirectImport: false as const,
  dkl6DirectImport: false as const,
  futurePhaseDependency: false as const,
  circularDependency: false as const,
  reconstructsValidation: false as const,
  reconstructsModel: false as const,
  reconstructsRegistry: false as const,
  reconstructsFoundation: false as const,
  canonicalPath:
    "DKL-8:5 → DKL-8:4 Validation → DKL-8:3 Model → DKL-8:2 Registry → DKL-8:1 Foundation → DKL-7 Public Index",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Knowledge Governance Manifest platform.
 */
export const KnowledgeGovernanceManifestPlatform = Object.freeze({
  identity,
  metadata,
  dependency,
  architecture: Object.freeze({
    phases: KnowledgeGovernanceManifestArchitecturePhases,
    architectureStatus: KnowledgeGovernanceManifestArchitectureStatus,
    chainIds: KnowledgeGovernanceManifestChainIds,
    completedPhaseCount: counts.completedPhaseCount,
    futurePhaseCount: counts.futurePhaseCount,
    totalPhaseCount: counts.totalDkl8PhaseCount,
  }),
  foundation: KnowledgeGovernanceManifestFoundationProfile,
  registry: KnowledgeGovernanceManifestRegistryProfile,
  model: KnowledgeGovernanceManifestModelProfile,
  validation: KnowledgeGovernanceManifestValidationProfile,
  ownership: KnowledgeGovernanceManifestOwnership,
  boundaries: KnowledgeGovernanceManifestBoundaries,
  dependencies: KnowledgeGovernanceManifestDependencies,
  inventory,
  counts: Object.freeze({
    ...counts,
    totalEntryCount,
    guaranteeCount: KnowledgeGovernanceManifestGuarantees.length,
    compatibilityCount: KnowledgeGovernanceManifestCompatibility.length,
    publicApiCount: KnowledgeGovernanceManifestPublicApis.length,
    dependencyCount: KnowledgeGovernanceManifestDependencies.length,
  }),
  compatibility: KnowledgeGovernanceManifestCompatibility,
  guarantees: KnowledgeGovernanceManifestGuarantees,
  publicApi: KnowledgeGovernanceManifestPublicApis,
  apiRegistry: KnowledgeGovernanceManifestPublicApis,
  readiness: KnowledgeGovernanceManifestReadiness,
  upstreamValidation: validation,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: KnowledgeGovernanceManifestStatus,
  nextPhase: "DKL-8:6 — Knowledge Governance Platform",
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
  validates: false as const,
  executes: false as const,
  enforces: false as const,
  persists: false as const,
  retrieves: false as const,
  reasons: false as const,
  renders: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Knowledge Governance Manifest summary. */
export function getKnowledgeGovernanceManifestSummary(): KnowledgeGovernanceManifestSummary {
  return Object.freeze({
    id: KnowledgeGovernanceManifestId,
    version: KnowledgeGovernanceManifestVersion,
    namespace: KnowledgeGovernanceManifestNamespace,
    status: KnowledgeGovernanceManifestStatus,
    readiness: KnowledgeGovernanceManifestReadiness,
    upstreamDependency: validation.identity.validationId,
    validationOutcome: counts.validationOutcome,
    completedPhaseCount: counts.completedPhaseCount,
    futurePhaseCount: counts.futurePhaseCount,
    registryEntryCount: counts.registryEntryCount,
    modelKindCount: counts.modelKindCount,
    validationRuleCount: counts.validationRuleCount,
    totalEntryCount,
    sectionCount: PLATFORM_SECTIONS.length,
    runtimeBehavior: "None",
    nextPhase: "DKL-8:6 — Knowledge Governance Platform",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
