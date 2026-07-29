/**
 * EX-1:8 — Executive Stage Freeze.
 *
 * Immutable release artifact for the certified Executive Stage.
 * Consumes EX-1:7 Certification public surface only.
 * Introduces no functional behaviour.
 *
 * Ownership: owned exclusively by EX-1:8.
 *
 * Public exports:
 *   ExecutiveStageFreezeId
 *   ExecutiveStageFreezeVersion
 *   ExecutiveStageFreezeName
 *   ExecutiveStageFreezeNamespace
 *   ExecutiveStageFreezeStatus
 *   ExecutiveStageFreezeReadiness
 *   ExecutiveStageFreeze
 *   getExecutiveStageFreezeSummary()
 *   EXECUTIVE_STAGE_LOCK
 */

import {
  ExecutiveStageArchitecturalLockNames,
  ExecutiveStageArchitecturalLocks,
  ExecutiveStageFreezeLock,
  EXECUTIVE_STAGE_LOCK,
} from "./executiveStageArchitecturalLocks.ts";
import {
  ExecutiveStageFreezeCompatibility,
  ExecutiveStageFreezeCompatibilityDeclarations,
  ExecutiveStageFreezeCompatibilityNames,
  ExecutiveStageRuntimeCompatibilityBaseline,
} from "./executiveStageCompatibility.ts";
import {
  ExecutiveStageExtensionCategories,
  ExecutiveStageExtensionCategoryNames,
  ExecutiveStageFreezeExtensionPolicy,
} from "./executiveStageExtensions.ts";
import { ExecutiveStageFreezeRegistry } from "./executiveStageFreezeRegistry.ts";
import {
  ExecutiveStageFrozenBaselineCatalog,
  ExecutiveStageFrozenBaselineNames,
  ExecutiveStageFrozenBaselines,
  ExecutiveStageFrozenArchitectureComponents,
} from "./executiveStageFrozenBaselines.ts";
import {
  ExecutiveStageFreezeComposition,
  ExecutiveStageFreezeGuarantees,
  ExecutiveStageFreezeIdentity,
  ExecutiveStageFreezeId,
  ExecutiveStageFreezeName,
  ExecutiveStageFreezeNamespace,
  ExecutiveStageFreezeNextPhase,
  ExecutiveStageFreezePrinciples,
  ExecutiveStageFreezeProhibitedSurfaces,
  ExecutiveStageFreezeReadiness,
  ExecutiveStageFreezeReleaseStatuses,
  ExecutiveStageFreezeStatus,
  ExecutiveStageFreezeVersion,
  ExecutiveStageFrozenPublicContractNames,
  ExecutiveStageFrozenPublicContracts,
  ExecutiveStageReleaseMetadata,
  ExecutiveStageReleaseMetadataFields,
} from "./executiveStageReleaseMetadata.ts";
import { ExecutiveStageCertification } from "./executiveStageCertification.ts";

export {
  ExecutiveStageFreezeId,
  ExecutiveStageFreezeName,
  ExecutiveStageFreezeNamespace,
  ExecutiveStageFreezeReadiness,
  ExecutiveStageFreezeStatus,
  ExecutiveStageFreezeVersion,
  EXECUTIVE_STAGE_LOCK,
};

/**
 * Canonical immutable Executive Stage Freeze aggregate.
 */
export const ExecutiveStageFreeze = Object.freeze({
  identity: ExecutiveStageFreezeIdentity,
  certification: ExecutiveStageCertification,
  lock: ExecutiveStageFreezeLock,
  lockIdentifier: EXECUTIVE_STAGE_LOCK,
  registry: ExecutiveStageFreezeRegistry,
  architecturalLocks: ExecutiveStageArchitecturalLocks,
  architecturalLockNames: ExecutiveStageArchitecturalLockNames,
  baselines: ExecutiveStageFrozenBaselines,
  baselineNames: ExecutiveStageFrozenBaselineNames,
  baselineCatalog: ExecutiveStageFrozenBaselineCatalog,
  architectureComponents: ExecutiveStageFrozenArchitectureComponents,
  compatibility: ExecutiveStageFreezeCompatibility,
  compatibilityDeclarations: ExecutiveStageFreezeCompatibilityDeclarations,
  compatibilityNames: ExecutiveStageFreezeCompatibilityNames,
  runtimeCompatibility: ExecutiveStageRuntimeCompatibilityBaseline,
  extensions: ExecutiveStageFreezeExtensionPolicy,
  extensionCategories: ExecutiveStageExtensionCategories,
  extensionCategoryNames: ExecutiveStageExtensionCategoryNames,
  publicContracts: ExecutiveStageFrozenPublicContracts,
  publicContractNames: ExecutiveStageFrozenPublicContractNames,
  releaseMetadata: ExecutiveStageReleaseMetadata,
  releaseMetadataFields: ExecutiveStageReleaseMetadataFields,
  releaseStatuses: ExecutiveStageFreezeReleaseStatuses,
  composition: ExecutiveStageFreezeComposition,
  guarantees: ExecutiveStageFreezeGuarantees,
  principles: ExecutiveStageFreezePrinciples,
  prohibitedSurfaces: ExecutiveStageFreezeProhibitedSurfaces,
  baselinesPublished: ExecutiveStageFreezeRegistry.baselinesPublished,
  statistics: Object.freeze({
    architecturalLockCount: ExecutiveStageArchitecturalLocks.length,
    baselineCount: ExecutiveStageFrozenBaselines.length,
    compatibilityCount: ExecutiveStageFreezeCompatibilityDeclarations.length,
    extensionCategoryCount: ExecutiveStageExtensionCategories.length,
    publicContractCount: ExecutiveStageFrozenPublicContracts.length,
    releaseMetadataFieldCount: ExecutiveStageReleaseMetadataFields.length,
    releaseStatusCount: ExecutiveStageFreezeReleaseStatuses.length,
    guaranteeCount: ExecutiveStageFreezeGuarantees.length,
    principleCount: ExecutiveStageFreezePrinciples.length,
    compositionCount: ExecutiveStageFreezeComposition.length,
  }),
  upstreamDependencies: Object.freeze([
    "EX-1:7 — Executive Stage Certification",
  ]),
  compositionLayers: Object.freeze([
    "Foundation",
    "Registry",
    "Model",
    "Validation",
    "Manifest",
    "Platform",
    "Certification",
    "Freeze",
  ]),
  status: ExecutiveStageFreezeStatus,
  readiness: ExecutiveStageFreezeReadiness,
  nextPhase: ExecutiveStageFreezeNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  sealed: true as const,
  mutationAllowed: false as const,
  oneFreezeArtifactPerRelease: true as const,
  onlyCertifiedArtifactsMayEnter: true as const,
  introducesNewApis: false as const,
  introducesFunctionalBehaviour: false as const,
  executesPlatformServices: false as const,
  modifiesRuntime: false as const,
  rendersStage: false as const,
  performsValidation: false as const,
  changesCertificationResults: false as const,
  invokesAi: false as const,
  communicatesExternally: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  publicIndexPhase: false as const,
} as const);

/** Deterministic frozen Freeze summary. */
export function getExecutiveStageFreezeSummary() {
  return Object.freeze({
    freezeId: ExecutiveStageFreezeId,
    version: ExecutiveStageFreezeVersion,
    name: ExecutiveStageFreezeName,
    namespace: ExecutiveStageFreezeNamespace,
    status: ExecutiveStageFreezeStatus,
    readiness: ExecutiveStageFreezeReadiness,
    lockIdentifier: EXECUTIVE_STAGE_LOCK,
    architecturalLockCount: ExecutiveStageArchitecturalLocks.length,
    baselineCount: ExecutiveStageFrozenBaselines.length,
    compatibilityCount: ExecutiveStageFreezeCompatibilityDeclarations.length,
    extensionCategoryCount: ExecutiveStageExtensionCategories.length,
    publicContractCount: ExecutiveStageFrozenPublicContracts.length,
    releaseMetadataFieldCount: ExecutiveStageReleaseMetadataFields.length,
    baselinesPublished: ExecutiveStageFreeze.baselinesPublished,
    nextPhase: ExecutiveStageFreezeNextPhase,
    sourceCertification: ExecutiveStageFreezeIdentity.sourceCertification,
    sealed: true as const,
    mutationAllowed: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveStageFreeze = () => ExecutiveStageFreeze;

export {
  ExecutiveStageFreezeIdentity,
  ExecutiveStageFreezeLock,
  ExecutiveStageFreezeNextPhase,
};
