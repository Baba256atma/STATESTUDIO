/**
 * DKL-7:8 — Knowledge Services Freeze Registry.
 *
 * Exactly eight certified frozen components. Certification preserved by
 * canonical reference. No prior-phase reconstruction.
 *
 * Ownership: owned exclusively by DKL-7:8.
 */

import {
  KnowledgeServicesCertification,
  KnowledgeServicesCertificationId,
  KnowledgeServicesCertificationVersion,
} from "./knowledgeServicesCertification.ts";
import type {
  KnowledgeServicesFreezeCertifiedComponent,
  KnowledgeServicesFreezeRegistryEntry,
} from "./knowledgeServicesFreezeTypes.ts";

const certification = KnowledgeServicesCertification;
const platform = certification.platform;
const chain = Object.freeze({
  certificationId: KnowledgeServicesCertificationId,
  platformId: platform.identity.platformId,
  manifestId: platform.identity.manifestId,
  validationId: platform.identity.validationId,
  modelId: platform.identity.modelId,
  registryId: platform.identity.registryId,
  foundationId: platform.identity.foundationId,
  dkl6PublicIndexId: platform.identity.dkl6PublicIndexId,
});

const component = (
  key: string,
  phaseId: string,
  stage: string,
  version: string,
  path: string,
  ownershipStatus: string,
  boundaryStatus: string,
  publicIndexRelevance: string,
  order: number,
): KnowledgeServicesFreezeCertifiedComponent =>
  Object.freeze({
    componentId: `DKL-7:8/Component/${key}`,
    phaseId,
    stage,
    version,
    certifiedStatus: "Certified" as const,
    freezeStatus: "Frozen" as const,
    protectionStatus: "Protected" as const,
    canonicalReferencePath: path,
    ownershipStatus,
    boundaryStatus,
    compatibilityStatus: "Compatible" as const,
    changePolicy: "Forbidden" as const,
    publicIndexRelevance,
    runtimeBehavior: "None" as const,
    deterministicOrder: order,
  });

/** Exactly eight certified frozen components in canonical phase order. */
export const KnowledgeServicesFreezeComponents: readonly KnowledgeServicesFreezeCertifiedComponent[] =
  Object.freeze([
    component(
      "Foundation",
      chain.foundationId,
      "Foundation",
      "1.0.0",
      "Freeze.certification.platform.manifest.validation.model.registry.foundation",
      "PreservedByReference",
      "29 prohibited surfaces preserved",
      "RequiredPublicIndexUpstream",
      1,
    ),
    component(
      "Registry",
      chain.registryId,
      "Registry",
      "1.0.0",
      "Freeze.certification.platform.manifest.validation.model.registry",
      "PreservedByReference",
      "Read-only service boundaries preserved",
      "RequiredPublicIndexUpstream",
      2,
    ),
    component(
      "Model",
      chain.modelId,
      "Model",
      "1.0.0",
      "Freeze.certification.platform.manifest.validation.model",
      "PreservedByReference",
      "Transport and persistence neutrality preserved",
      "RequiredPublicIndexUpstream",
      3,
    ),
    component(
      "Validation",
      chain.validationId,
      "Validation",
      "1.0.0",
      "Freeze.certification.platform.manifest.validation",
      "PreservedByReference",
      "Architecture validation only preserved",
      "RequiredPublicIndexUpstream",
      4,
    ),
    component(
      "Manifest",
      chain.manifestId,
      "Manifest",
      "1.0.0",
      "Freeze.certification.platform.manifest",
      "PreservedByReference",
      "ManifestComplete preserved",
      "RequiredPublicIndexUpstream",
      5,
    ),
    component(
      "Platform",
      chain.platformId,
      "Platform",
      "1.0.0",
      "Freeze.certification.platform",
      "PreservedByReference",
      "PlatformComplete preserved",
      "RequiredPublicIndexUpstream",
      6,
    ),
    component(
      "Certification",
      chain.certificationId,
      "Certification",
      KnowledgeServicesCertificationVersion,
      "Freeze.certification",
      "PreservedByReference",
      "Certified Pass state preserved",
      "RequiredPublicIndexUpstream",
      7,
    ),
    component(
      "Freeze",
      "DKL-7:8/KnowledgeServicesFreeze",
      "Freeze",
      "1.0.0",
      "Freeze",
      "OwnedByFreeze",
      "Freeze does not weaken prior boundaries",
      "DirectPublicIndexInput",
      8,
    ),
  ]);

/** Canonical immutable Freeze Registry. */
export const KnowledgeServicesFreezeRegistry: KnowledgeServicesFreezeRegistryEntry =
  Object.freeze({
    registryId: "DKL-7:8/KnowledgeServicesFreezeRegistry",
    registryVersion: "1.0.0",
    componentCount: 8 as const,
    certifiedCount: 8 as const,
    frozenCount: 8 as const,
    protectedCount: 8 as const,
    failedCount: 0 as const,
    components: KnowledgeServicesFreezeComponents,
    canonicalPhaseOrder: Object.freeze([
      "Foundation",
      "Registry",
      "Model",
      "Validation",
      "Manifest",
      "Platform",
      "Certification",
      "Freeze",
    ] as const),
    lockReferences: Object.freeze([
      "LOCK-KS-PUBLIC-API",
      "LOCK-KS-DEPENDENCY-CHAIN",
      "LOCK-KS-OWNERSHIP",
      "LOCK-KS-BOUNDARY",
      "LOCK-KS-SERVICE-INVENTORY",
      "LOCK-KS-CAPABILITY-INVENTORY",
      "LOCK-KS-CONTRACT-INVENTORY",
      "LOCK-KS-MODEL-INVENTORY",
      "LOCK-KS-VALIDATION-STATE",
      "LOCK-KS-COMPATIBILITY",
      "LOCK-KS-RUNTIME-PROHIBITION",
      "LOCK-KS-CERTIFICATION-BASELINE",
    ] as const),
    readinessStatus: "ReadyForPublicIndex" as const,
    metadataOnly: true,
    immutable: true,
  });

export const KnowledgeServicesFreezeChainIds = chain;
