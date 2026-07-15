import { ExecutiveReasoningCompatibility } from "./executiveReasoningManifestPlatform.ts";
import { ExecutiveReasoningDependencyMap } from "./executiveReasoningManifestPlatform.ts";
import { ExecutiveReasoningOwnershipMap } from "./executiveReasoningManifestPlatform.ts";
import {
  ExecutiveReasoningPlatform,
  ExecutiveReasoningPlatformMetadata,
  ExecutiveReasoningPlatformRegistry,
  getExecutiveReasoningPlatformSummary,
} from "./executiveReasoningPlatformIndex.ts";
import {
  ExecutiveReasoningCertificationAllowedDependencies,
  ExecutiveReasoningCertificationGates,
  ExecutiveReasoningCertificationRegistry,
  ExecutiveReasoningCertificationRejectedDependencies,
} from "./executiveReasoningCertificationRegistry.ts";

const platformSummary = getExecutiveReasoningPlatformSummary();

export const ExecutiveReasoningCertificationManifest = Object.freeze({
  id: "eng-6-certification-manifest",
  name: "Executive Reasoning Certification Manifest",
  description:
    "Immutable certification manifest describing certified ENG-6:1 through ENG-6:6 architectural surfaces.",
  certificationId: ExecutiveReasoningCertificationRegistry.certificationId,
  certifiedComponents: Object.freeze([
    Object.freeze({
      phase: "ENG-6:1",
      component: "Foundation",
      reference: ExecutiveReasoningPlatform.foundation.platformId,
      status: "CERTIFIED",
    } as const),
    Object.freeze({
      phase: "ENG-6:2",
      component: "Registry",
      reference: ExecutiveReasoningPlatform.registry.metadata.registryId,
      status: "CERTIFIED",
    } as const),
    Object.freeze({
      phase: "ENG-6:3",
      component: "Model",
      reference: ExecutiveReasoningPlatform.model.metadata.modelPlatformId,
      status: "CERTIFIED",
    } as const),
    Object.freeze({
      phase: "ENG-6:4",
      component: "Validation",
      reference: ExecutiveReasoningPlatform.validation.metadata.validationId,
      status: "CERTIFIED",
    } as const),
    Object.freeze({
      phase: "ENG-6:5",
      component: "Manifest",
      reference: ExecutiveReasoningPlatform.manifest.Manifest.manifestId,
      status: "CERTIFIED",
    } as const),
    Object.freeze({
      phase: "ENG-6:6",
      component: "Platform",
      reference: ExecutiveReasoningPlatformMetadata.platformId,
      status: "CERTIFIED",
    } as const),
  ] as const),
  ownershipVerification: Object.freeze({
    platformOwner: ExecutiveReasoningOwnershipMap.platformOwner,
    modelOwner: ExecutiveReasoningOwnershipMap.modelOwner,
    registryOwner: ExecutiveReasoningOwnershipMap.registryOwner,
    validationOwner: ExecutiveReasoningOwnershipMap.validationOwner,
    manifestOwner: ExecutiveReasoningOwnershipMap.manifestOwner,
    namespaceOwner: ExecutiveReasoningOwnershipMap.namespaceOwner,
    singleOwnership: true,
    ownershipCompleteness: true,
    ownershipConsistency: true,
    duplicateOwnership: "Prohibited",
    status: "CERTIFIED",
  } as const),
  dependencyVerification: Object.freeze({
    allowed: ExecutiveReasoningCertificationAllowedDependencies,
    rejected: ExecutiveReasoningCertificationRejectedDependencies,
    chain: ExecutiveReasoningDependencyMap.chain,
    consumption: "PublicIndexOnly",
    direction: "ForwardOnly",
    status: "CERTIFIED",
  } as const),
  publicApiVerification: Object.freeze({
    approvedExportsOnly: true,
    immutableExports: true,
    noInternalLeakage: true,
    inventoriedApiCount: ExecutiveReasoningPlatformRegistry.counts.publicApiCount,
    status: "CERTIFIED",
  } as const),
  compatibilityVerification: Object.freeze({
    backwardCompatibility: ExecutiveReasoningCompatibility.backwardCompatibility.status,
    namespaceCompatibility: ExecutiveReasoningCompatibility.namespaceCompatibility.status,
    modelCompatibility: ExecutiveReasoningCompatibility.modelCompatibility.status,
    registryCompatibility: ExecutiveReasoningCompatibility.registryCompatibility.status,
    publicApiCompatibility: ExecutiveReasoningCompatibility.publicApiCompatibility.status,
    status: "CERTIFIED",
  } as const),
  immutabilityVerification: Object.freeze({
    frozenMetadata: true,
    deterministicMetadata: true,
    runtimeFreeDeclarations: true,
    status: "CERTIFIED",
  } as const),
  platformVerification: Object.freeze({
    platformId: ExecutiveReasoningPlatformMetadata.platformId,
    sectionCount: Object.keys(ExecutiveReasoningPlatform).length,
    totalPhases: platformSummary.totalPhases,
    releaseReadiness: platformSummary.releaseReadiness,
    status: "CERTIFIED",
  } as const),
  gateInventory: ExecutiveReasoningCertificationGates,
  owner: "ENG-6",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  aiFree: true,
} as const);
