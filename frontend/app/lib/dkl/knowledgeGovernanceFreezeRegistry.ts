/**
 * DKL-8:8 — Knowledge Governance Freeze Registry.
 *
 * Exactly seven frozen certified components, preserved through Certification.
 * No phase reconstruction.
 *
 * Ownership: owned exclusively by DKL-8:8.
 */

import { KnowledgeGovernanceCertificationPlatform } from "./knowledgeGovernanceCertification.ts";
import type { KnowledgeGovernanceFreezeComponent } from "./knowledgeGovernanceFreezeTypes.ts";

const certification = KnowledgeGovernanceCertificationPlatform;
const platform = certification.platform;

const component = (
  order: number,
  key: string,
  name: string,
  phase: string,
  version: string,
  status: string,
  sourceReference: string,
  publicSurfaceStatus: KnowledgeGovernanceFreezeComponent["publicSurfaceStatus"],
): KnowledgeGovernanceFreezeComponent =>
  Object.freeze({
    id: `DKL-8:8/Component/${key}`,
    name,
    phase,
    version,
    status,
    sourceReference,
    frozen: true as const,
    certified: true as const,
    stability: "Locked" as const,
    compatibility: "Compatible" as const,
    publicSurfaceStatus,
    deterministicOrder: order,
    metadataOnly: true as const,
  });

/** Exactly seven frozen DKL-8 components in canonical phase order. */
export const KnowledgeGovernanceFreezeComponents: readonly KnowledgeGovernanceFreezeComponent[] =
  Object.freeze([
    component(
      1,
      "KnowledgeGovernanceFoundation",
      "Knowledge Governance Foundation",
      "DKL-8:1",
      certification.foundation.identity.foundationVersion,
      certification.foundation.status,
      "Freeze.certification.foundation",
      "InternalProtected",
    ),
    component(
      2,
      "KnowledgeGovernanceRegistry",
      "Knowledge Governance Registry",
      "DKL-8:2",
      certification.registry.identity.registryVersion,
      certification.registry.status,
      "Freeze.certification.registry",
      "InternalProtected",
    ),
    component(
      3,
      "KnowledgeGovernanceModel",
      "Knowledge Governance Model",
      "DKL-8:3",
      certification.model.identity.modelVersion,
      certification.model.status,
      "Freeze.certification.model",
      "InternalProtected",
    ),
    component(
      4,
      "KnowledgeGovernanceValidation",
      "Knowledge Governance Validation",
      "DKL-8:4",
      certification.validation.identity.validationVersion,
      certification.validation.status,
      "Freeze.certification.validation",
      "InternalProtected",
    ),
    component(
      5,
      "KnowledgeGovernanceManifest",
      "Knowledge Governance Manifest",
      "DKL-8:5",
      certification.manifest.identity.manifestVersion,
      certification.manifest.status,
      "Freeze.certification.manifest",
      "InternalProtected",
    ),
    component(
      6,
      "KnowledgeGovernancePlatform",
      "Knowledge Governance Platform",
      "DKL-8:6",
      platform.identity.platformVersion,
      platform.status,
      "Freeze.certification.platform",
      "Protected",
    ),
    component(
      7,
      "KnowledgeGovernanceCertification",
      "Knowledge Governance Certification",
      "DKL-8:7",
      certification.identity.certificationVersion,
      certification.status,
      "Freeze.certification",
      "Protected",
    ),
  ]);

/** Chain IDs derived through Certification references. */
export const KnowledgeGovernanceFreezeChainIds = Object.freeze({
  foundationId: certification.foundation.identity.foundationId,
  registryId: certification.registry.identity.registryId,
  modelId: certification.model.identity.modelId,
  validationId: certification.validation.identity.validationId,
  manifestId: certification.manifest.identity.manifestId,
  platformId: platform.identity.platformId,
  certificationId: certification.identity.certificationId,
  freezeId: "DKL-8:8/KnowledgeGovernanceFreeze" as const,
  preservedByReference: true as const,
});

/** Upstream surfaces preserved by Certification reference. */
export const KnowledgeGovernanceFreezeUpstreamSurfaces = Object.freeze({
  certification,
  platform: certification.platform,
  manifest: certification.manifest,
  validation: certification.validation,
  model: certification.model,
  registry: certification.registry,
  foundation: certification.foundation,
  ownership: certification.ownership,
  boundaries: certification.boundaries,
  platformGuarantees: certification.platformGuarantees,
  platformCompatibility: certification.platformCompatibility,
  certificationCriteria: certification.criteria,
  certificationGates: certification.gates,
  preservedByReference: true as const,
});
