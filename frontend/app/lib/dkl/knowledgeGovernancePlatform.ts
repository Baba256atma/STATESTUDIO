/**
 * DKL-8:6 — Knowledge Governance Platform.
 *
 * Canonical immutable runtime-neutral integration surface for Knowledge
 * Governance through DKL-8:5. Consumes only KnowledgeGovernanceManifestPlatform.
 * Metadata-only. Platform-only. Runtime-free.
 *
 * Ownership: owned exclusively by DKL-8:6.
 *
 * Public exports (exactly 8):
 *   KnowledgeGovernancePlatformId
 *   KnowledgeGovernancePlatformVersion
 *   KnowledgeGovernancePlatformName
 *   KnowledgeGovernancePlatformNamespace
 *   KnowledgeGovernancePlatformStatus
 *   KnowledgeGovernancePlatformReadiness
 *   KnowledgeGovernancePlatform
 *   getKnowledgeGovernancePlatformSummary()
 */

import { KnowledgeGovernanceManifestPlatform } from "./knowledgeGovernanceManifest.ts";
import {
  KnowledgeGovernancePlatformChainIds,
  KnowledgeGovernancePlatformObservedCounts,
  KnowledgeGovernancePlatformPhases,
  KnowledgeGovernancePlatformUpstreamSurfaces,
} from "./knowledgeGovernancePlatformArchitecture.ts";
import { KnowledgeGovernancePlatformCompatibility } from "./knowledgeGovernancePlatformCompatibility.ts";
import { KnowledgeGovernancePlatformDependencies } from "./knowledgeGovernancePlatformDependencies.ts";
import { KnowledgeGovernancePlatformGuarantees } from "./knowledgeGovernancePlatformGuarantees.ts";
import {
  KnowledgeGovernancePlatformArchitectureStatus,
  KnowledgeGovernancePlatformPublicApis,
  KnowledgeGovernancePlatformReadinessValue,
} from "./knowledgeGovernancePlatformReadiness.ts";
import type {
  KnowledgeGovernancePlatformInventory,
  KnowledgeGovernancePlatformSummary,
} from "./knowledgeGovernancePlatformTypes.ts";

export const KnowledgeGovernancePlatformId =
  "DKL-8:6/KnowledgeGovernancePlatform" as const;

export const KnowledgeGovernancePlatformName =
  "Knowledge Governance Platform" as const;

export const KnowledgeGovernancePlatformVersion = "1.0.0" as const;

export const KnowledgeGovernancePlatformNamespace =
  "nexora.dkl.knowledge-governance.platform" as const;

export const KnowledgeGovernancePlatformStatus = "PlatformDefined" as const;

export const KnowledgeGovernancePlatformReadiness =
  KnowledgeGovernancePlatformReadinessValue;

const PLATFORM_SECTIONS = Object.freeze([
  "identity",
  "metadata",
  "dependency",
  "architecture",
  "foundation",
  "registry",
  "model",
  "validation",
  "manifest",
  "ownership",
  "boundaries",
  "dependencies",
  "inventory",
  "counts",
  "apiRegistry",
  "compatibility",
  "guarantees",
  "readiness",
] as const);

/**
 * Counting rule for Platform totalEntryCount:
 * completedPhases + futurePhases + platformDependencies +
 * manifestTotalEntryCount + platformGuarantees + platformCompatibility +
 * platformPublicApis
 */
const COUNTING_RULE =
  "completedPhases + futurePhases + platformDependencies + manifestTotalEntryCount + platformGuarantees + platformCompatibility + platformPublicApis";

const manifest = KnowledgeGovernanceManifestPlatform;
const counts = KnowledgeGovernancePlatformObservedCounts;
const upstream = KnowledgeGovernancePlatformUpstreamSurfaces;

const totalEntryCount =
  counts.completedPhaseCount +
  counts.futurePhaseCount +
  KnowledgeGovernancePlatformDependencies.length +
  counts.manifestTotalEntryCount +
  KnowledgeGovernancePlatformGuarantees.length +
  KnowledgeGovernancePlatformCompatibility.length +
  KnowledgeGovernancePlatformPublicApis.length;

const inventory: KnowledgeGovernancePlatformInventory = Object.freeze({
  inventoryId: "DKL-8:6/KnowledgeGovernancePlatformInventory",
  completedPhaseCount: counts.completedPhaseCount,
  futurePhaseCount: counts.futurePhaseCount,
  totalDkl8PhaseCount: counts.totalDkl8PhaseCount,
  dependencyCount: KnowledgeGovernancePlatformDependencies.length,
  manifestTotalEntryCount: counts.manifestTotalEntryCount,
  registryEntryCount: counts.registryEntryCount,
  subjectCount: counts.subjectCount,
  contractCount: counts.contractCount,
  roleCount: counts.roleCount,
  capabilityCount: counts.capabilityCount,
  classificationCount: counts.classificationCount,
  sensitivityCount: counts.sensitivityCount,
  modelKindCount: counts.modelKindCount,
  relationshipKindCount: counts.relationshipKindCount,
  validationRuleCount: counts.validationRuleCount,
  validationCategoryCount: counts.validationCategoryCount,
  validationGateCount: counts.validationGateCount,
  ownershipDeclarationCount: counts.ownershipDeclarationCount,
  boundaryCount: counts.boundaryCount,
  manifestSectionCount: counts.manifestSectionCount,
  guaranteeCount: KnowledgeGovernancePlatformGuarantees.length,
  compatibilityCount: KnowledgeGovernancePlatformCompatibility.length,
  publicApiCount: KnowledgeGovernancePlatformPublicApis.length,
  sectionCount: PLATFORM_SECTIONS.length,
  totalEntryCount,
  countingRule: COUNTING_RULE,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});

const identity = Object.freeze({
  platformId: KnowledgeGovernancePlatformId,
  platformName: KnowledgeGovernancePlatformName,
  platformVersion: KnowledgeGovernancePlatformVersion,
  platformNamespace: KnowledgeGovernancePlatformNamespace,
  layer: "Data Knowledge Layer" as const,
  phase: "DKL-8" as const,
  stage: "Platform" as const,
  sourcePhase: "DKL-8:6" as const,
  owner: "DKL-8 Knowledge Governance",
  status: KnowledgeGovernancePlatformStatus,
  readiness: KnowledgeGovernancePlatformReadiness,
  manifestId: manifest.identity.manifestId,
  manifestVersion: manifest.identity.manifestVersion,
  architectureStatus: KnowledgeGovernancePlatformArchitectureStatus,
  metadataOnly: true as const,
  immutable: true as const,
});

const metadata = Object.freeze({
  metadataId: "DKL-8:6/KnowledgeGovernancePlatformMetadata",
  platformId: KnowledgeGovernancePlatformId,
  description:
    "Canonical immutable runtime-neutral integration surface aggregating DKL-8 Manifest by reference.",
  releaseMetadata: Object.freeze({
    version: KnowledgeGovernancePlatformVersion,
    status: KnowledgeGovernancePlatformStatus,
    readiness: KnowledgeGovernancePlatformReadiness,
    validationOutcome: counts.validationOutcome,
    manifestTotalEntryCount: counts.manifestTotalEntryCount,
    singlePublicPlatform: true as const,
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
  reconstructs: false as const,
  immutable: true as const,
  deterministic: true as const,
});

const dependency = Object.freeze({
  dependencyId: "DKL-8:6/Dependency/DKL85Manifest",
  directPreviousPhaseModule: "knowledgeGovernanceManifest.ts" as const,
  manifestOnly: true as const,
  manifestId: manifest.identity.manifestId,
  manifestVersion: manifest.identity.manifestVersion,
  validationDirectImport: false as const,
  modelDirectImport: false as const,
  registryDirectImport: false as const,
  foundationDirectImport: false as const,
  dkl7DirectImport: false as const,
  futurePhaseDependency: false as const,
  circularDependency: false as const,
  reconstructsManifest: false as const,
  reconstructsValidation: false as const,
  reconstructsModel: false as const,
  reconstructsRegistry: false as const,
  reconstructsFoundation: false as const,
  canonicalPath:
    "DKL-8:6 → DKL-8:5 Manifest → DKL-8:4 Validation → DKL-8:3 Model → DKL-8:2 Registry → DKL-8:1 Foundation → DKL-7 Public Index",
  runtimeBehavior: "None" as const,
  metadataOnly: true as const,
});

/**
 * Canonical immutable Knowledge Governance Platform.
 */
export const KnowledgeGovernancePlatform = Object.freeze({
  identity,
  metadata,
  dependency,
  architecture: Object.freeze({
    phases: KnowledgeGovernancePlatformPhases,
    architectureStatus: KnowledgeGovernancePlatformArchitectureStatus,
    chainIds: KnowledgeGovernancePlatformChainIds,
    completedPhaseCount: counts.completedPhaseCount,
    futurePhaseCount: counts.futurePhaseCount,
    totalPhaseCount: counts.totalDkl8PhaseCount,
  }),
  foundation: upstream.foundation,
  registry: upstream.registry,
  model: upstream.model,
  validation: upstream.validation,
  manifest: upstream.manifest,
  ownership: upstream.ownership,
  boundaries: upstream.boundaries,
  dependencies: KnowledgeGovernancePlatformDependencies,
  inventory,
  counts: Object.freeze({
    ...counts,
    totalEntryCount,
    dependencyCount: KnowledgeGovernancePlatformDependencies.length,
    guaranteeCount: KnowledgeGovernancePlatformGuarantees.length,
    compatibilityCount: KnowledgeGovernancePlatformCompatibility.length,
    publicApiCount: KnowledgeGovernancePlatformPublicApis.length,
  }),
  apiRegistry: KnowledgeGovernancePlatformPublicApis,
  compatibility: KnowledgeGovernancePlatformCompatibility,
  guarantees: KnowledgeGovernancePlatformGuarantees,
  readiness: KnowledgeGovernancePlatformReadiness,
  sectionOrder: PLATFORM_SECTIONS,
  sectionCount: PLATFORM_SECTIONS.length,
  status: KnowledgeGovernancePlatformStatus,
  nextPhase: "DKL-8:7 — Knowledge Governance Certification",
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
  reconstructs: false as const,
  immutable: true as const,
  deterministic: true as const,
});

/** Deterministic frozen Knowledge Governance Platform summary. */
export function getKnowledgeGovernancePlatformSummary(): KnowledgeGovernancePlatformSummary {
  return Object.freeze({
    id: KnowledgeGovernancePlatformId,
    version: KnowledgeGovernancePlatformVersion,
    namespace: KnowledgeGovernancePlatformNamespace,
    status: KnowledgeGovernancePlatformStatus,
    readiness: KnowledgeGovernancePlatformReadiness,
    upstreamDependency: manifest.identity.manifestId,
    validationOutcome: counts.validationOutcome,
    completedPhaseCount: counts.completedPhaseCount,
    futurePhaseCount: counts.futurePhaseCount,
    registryEntryCount: counts.registryEntryCount,
    modelKindCount: counts.modelKindCount,
    validationRuleCount: counts.validationRuleCount,
    manifestTotalEntryCount: counts.manifestTotalEntryCount,
    totalEntryCount,
    sectionCount: PLATFORM_SECTIONS.length,
    runtimeBehavior: "None",
    nextPhase: "DKL-8:7 — Knowledge Governance Certification",
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  });
}
