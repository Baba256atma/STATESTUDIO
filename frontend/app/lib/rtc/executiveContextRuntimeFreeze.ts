/**
 * RTC-1:8 — Executive Context Runtime Freeze.
 *
 * Immutable release artifact for the certified Executive Context Runtime.
 * Consumes RTC-1:7 Certification public surface only.
 * Introduces no new Runtime functionality.
 *
 * Ownership: owned exclusively by RTC-1:8.
 *
 * Public exports:
 *   ExecutiveContextRuntimeFreezeId
 *   ExecutiveContextRuntimeFreezeVersion
 *   ExecutiveContextRuntimeFreezeName
 *   ExecutiveContextRuntimeFreezeNamespace
 *   ExecutiveContextRuntimeFreezeStatus
 *   ExecutiveContextRuntimeFreezeReadiness
 *   ExecutiveContextRuntimeFreeze
 *   getExecutiveContextRuntimeFreezeSummary()
 */

import {
  ExecutiveContextFreezeBaselineCatalog,
  ExecutiveContextFreezeBaselineNames,
  ExecutiveContextFreezeBaselines,
} from "./executiveContextFreezeBaselines.ts";
import {
  ExecutiveContextFreezeCompatibility,
  ExecutiveContextFreezeCompatibilityDeclarations,
  ExecutiveContextFreezeCompatibilityNames,
} from "./executiveContextFreezeCompatibility.ts";
import {
  ExecutiveContextArchitecturalLockNames,
  ExecutiveContextArchitecturalLocks,
  ExecutiveContextFreezeLock,
  EXECUTIVE_CONTEXT_RUNTIME_LOCK,
} from "./executiveContextFreezeLock.ts";
import { ExecutiveContextFreezeManifest } from "./executiveContextFreezeManifest.ts";
import {
  ExecutiveContextFreezeExtensionPolicy,
  ExecutiveContextFreezeGuarantees,
  ExecutiveContextFreezeIdentity,
  ExecutiveContextFreezeMetadata,
  ExecutiveContextFreezeMetadataGroups,
  ExecutiveContextFreezePrinciples,
  ExecutiveContextFreezeProhibitedSurfaces,
  ExecutiveContextFreezeReleaseStatuses,
  ExecutiveContextRuntimeFreezeId,
  ExecutiveContextRuntimeFreezeName,
  ExecutiveContextRuntimeFreezeNamespace,
  ExecutiveContextRuntimeFreezeNextPhase,
  ExecutiveContextRuntimeFreezeReadiness,
  ExecutiveContextRuntimeFreezeStatus,
  ExecutiveContextRuntimeFreezeVersion,
} from "./executiveContextFreezeMetadata.ts";
import {
  ExecutiveContextFreezePublicApi,
  ExecutiveContextFrozenPublicContracts,
} from "./executiveContextFreezePublicApi.ts";
import { ExecutiveContextRuntimeCertification } from "./executiveContextRuntimeCertification.ts";

export {
  ExecutiveContextRuntimeFreezeId,
  ExecutiveContextRuntimeFreezeName,
  ExecutiveContextRuntimeFreezeNamespace,
  ExecutiveContextRuntimeFreezeReadiness,
  ExecutiveContextRuntimeFreezeStatus,
  ExecutiveContextRuntimeFreezeVersion,
  EXECUTIVE_CONTEXT_RUNTIME_LOCK,
};

/**
 * Canonical immutable Executive Context Runtime Freeze aggregate.
 */
export const ExecutiveContextRuntimeFreeze = Object.freeze({
  identity: ExecutiveContextFreezeIdentity,
  certification: ExecutiveContextRuntimeCertification,
  lock: ExecutiveContextFreezeLock,
  lockIdentifier: EXECUTIVE_CONTEXT_RUNTIME_LOCK,
  architecturalLocks: ExecutiveContextArchitecturalLocks,
  architecturalLockNames: ExecutiveContextArchitecturalLockNames,
  baselines: ExecutiveContextFreezeBaselines,
  baselineNames: ExecutiveContextFreezeBaselineNames,
  baselineCatalog: ExecutiveContextFreezeBaselineCatalog,
  compatibility: ExecutiveContextFreezeCompatibility,
  compatibilityDeclarations: ExecutiveContextFreezeCompatibilityDeclarations,
  compatibilityNames: ExecutiveContextFreezeCompatibilityNames,
  publicApi: ExecutiveContextFreezePublicApi,
  frozenPublicContracts: ExecutiveContextFrozenPublicContracts,
  metadata: ExecutiveContextFreezeMetadata,
  manifest: ExecutiveContextFreezeManifest,
  releaseStatuses: ExecutiveContextFreezeReleaseStatuses,
  metadataGroups: ExecutiveContextFreezeMetadataGroups,
  extensionPolicy: ExecutiveContextFreezeExtensionPolicy,
  guarantees: ExecutiveContextFreezeGuarantees,
  principles: ExecutiveContextFreezePrinciples,
  prohibitedSurfaces: ExecutiveContextFreezeProhibitedSurfaces,
  baselinesPublished: ExecutiveContextFreezeManifest.baselinesPublished,
  statistics: Object.freeze({
    architecturalLockCount: ExecutiveContextArchitecturalLocks.length,
    baselineCount: ExecutiveContextFreezeBaselines.length,
    compatibilityCount: ExecutiveContextFreezeCompatibilityDeclarations.length,
    releaseStatusCount: ExecutiveContextFreezeReleaseStatuses.length,
    metadataGroupCount: ExecutiveContextFreezeMetadataGroups.length,
    guaranteeCount: ExecutiveContextFreezeGuarantees.length,
    principleCount: ExecutiveContextFreezePrinciples.length,
    publicApiContractCount: ExecutiveContextFreezePublicApi.inventory.contractCount,
    publicApiExportCount: ExecutiveContextFreezePublicApi.inventory.exportCount,
    publicApiServiceCount: ExecutiveContextFreezePublicApi.inventory.serviceCount,
    publicApiTotalEntries:
      ExecutiveContextFreezePublicApi.inventory.totalRegistryEntries,
  }),
  upstreamDependencies: Object.freeze([
    "RTC-1:7 — Executive Context Runtime Certification",
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
  status: ExecutiveContextRuntimeFreezeStatus,
  readiness: ExecutiveContextRuntimeFreezeReadiness,
  nextPhase: ExecutiveContextRuntimeFreezeNextPhase,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
  sealed: true as const,
  mutationAllowed: false as const,
  oneFreezeArtifactPerRelease: true as const,
  introducesNewApis: false as const,
  introducesNewRuntimeFunctionality: false as const,
  executesRuntimeLogic: false as const,
  activatesContexts: false as const,
  modifiesRuntimeState: false as const,
  validatesContexts: false as const,
  renderingBehavior: false as const,
  invokesAi: false as const,
  communicatesExternally: false as const,
  exposesImplementationDetails: false as const,
  reactBehavior: false as const,
  nextJsBehavior: false as const,
  publicIndexPhase: false as const,
} as const);

/** Deterministic frozen Freeze summary. */
export function getExecutiveContextRuntimeFreezeSummary() {
  return Object.freeze({
    freezeId: ExecutiveContextRuntimeFreezeId,
    version: ExecutiveContextRuntimeFreezeVersion,
    name: ExecutiveContextRuntimeFreezeName,
    namespace: ExecutiveContextRuntimeFreezeNamespace,
    status: ExecutiveContextRuntimeFreezeStatus,
    readiness: ExecutiveContextRuntimeFreezeReadiness,
    lockIdentifier: EXECUTIVE_CONTEXT_RUNTIME_LOCK,
    architecturalLockCount: ExecutiveContextArchitecturalLocks.length,
    baselineCount: ExecutiveContextFreezeBaselines.length,
    compatibilityCount: ExecutiveContextFreezeCompatibilityDeclarations.length,
    releaseStatusCount: ExecutiveContextFreezeReleaseStatuses.length,
    metadataGroupCount: ExecutiveContextFreezeMetadataGroups.length,
    publicApiTotalEntries:
      ExecutiveContextFreezePublicApi.inventory.totalRegistryEntries,
    nextPhase: ExecutiveContextRuntimeFreezeNextPhase,
    sourceCertification: ExecutiveContextFreezeIdentity.sourceCertification,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
}

export const getExecutiveContextRuntimeFreeze = () =>
  ExecutiveContextRuntimeFreeze;

export {
  ExecutiveContextFreezeIdentity,
  ExecutiveContextFreezeLock,
  ExecutiveContextRuntimeFreezeNextPhase,
};
