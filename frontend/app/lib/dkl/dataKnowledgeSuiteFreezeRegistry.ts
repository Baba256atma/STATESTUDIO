/**
 * DKL-9:8 — Data Knowledge Suite Freeze Registry.
 *
 * Exactly seven frozen certified components, preserved through Certification.
 * No phase reconstruction.
 *
 * Ownership: owned exclusively by DKL-9:8.
 */

import { DataKnowledgeSuiteCertificationPlatform } from "./dataKnowledgeSuiteCertification.ts";
import type { DataKnowledgeSuiteFreezeComponent } from "./dataKnowledgeSuiteFreezeTypes.ts";

const certification = DataKnowledgeSuiteCertificationPlatform;
const platform = certification.platform;

const component = (
  order: number,
  key: string,
  name: string,
  phase: string,
  version: string,
  status: string,
  sourceReference: string,
  publicSurfaceStatus: DataKnowledgeSuiteFreezeComponent["publicSurfaceStatus"],
): DataKnowledgeSuiteFreezeComponent =>
  Object.freeze({
    id: `DKL-9:8/Component/${key}`,
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

/** Exactly seven frozen DKL-9 components in canonical phase order. */
export const DataKnowledgeSuiteFreezeComponents: readonly DataKnowledgeSuiteFreezeComponent[] =
  Object.freeze([
    component(
      1,
      "DataKnowledgeSuiteFoundation",
      "Data Knowledge Suite Foundation",
      "DKL-9:1",
      certification.foundation.identity.foundationVersion,
      certification.foundation.status,
      "Freeze.certification.foundation",
      "InternalProtected",
    ),
    component(
      2,
      "DataKnowledgeSuiteRegistry",
      "Data Knowledge Suite Registry",
      "DKL-9:2",
      certification.registry.identity.registryVersion,
      certification.registry.status,
      "Freeze.certification.registry",
      "InternalProtected",
    ),
    component(
      3,
      "DataKnowledgeSuiteModel",
      "Data Knowledge Suite Model",
      "DKL-9:3",
      certification.model.identity.modelVersion,
      certification.model.status,
      "Freeze.certification.model",
      "InternalProtected",
    ),
    component(
      4,
      "DataKnowledgeSuiteValidation",
      "Data Knowledge Suite Validation",
      "DKL-9:4",
      certification.validation.identity.validationVersion,
      certification.validation.status,
      "Freeze.certification.validation",
      "InternalProtected",
    ),
    component(
      5,
      "DataKnowledgeSuiteManifest",
      "Data Knowledge Suite Manifest",
      "DKL-9:5",
      certification.manifest.identity.manifestVersion,
      certification.manifest.status,
      "Freeze.certification.manifest",
      "InternalProtected",
    ),
    component(
      6,
      "DataKnowledgeSuitePlatform",
      "Data Knowledge Suite Platform",
      "DKL-9:6",
      platform.identity.platformVersion,
      platform.status,
      "Freeze.certification.platform",
      "Protected",
    ),
    component(
      7,
      "DataKnowledgeSuiteCertification",
      "Data Knowledge Suite Certification",
      "DKL-9:7",
      certification.identity.certificationVersion,
      certification.status,
      "Freeze.certification",
      "Protected",
    ),
  ]);

/** Chain IDs derived through Certification references. */
export const DataKnowledgeSuiteFreezeChainIds = Object.freeze({
  foundationId: certification.foundation.identity.foundationId,
  registryId: certification.registry.identity.registryId,
  modelId: certification.model.identity.modelId,
  validationId: certification.validation.identity.validationId,
  manifestId: certification.manifest.identity.manifestId,
  platformId: platform.identity.platformId,
  certificationId: certification.identity.certificationId,
  freezeId: "DKL-9:8/DataKnowledgeSuiteFreeze" as const,
  preservedByReference: true as const,
});

/** Upstream surfaces preserved by Certification reference. */
export const DataKnowledgeSuiteFreezeUpstreamSurfaces = Object.freeze({
  certification,
  platform: certification.platform,
  manifest: certification.manifest,
  validation: certification.validation,
  model: certification.model,
  registry: certification.registry,
  foundation: certification.foundation,
  ownership: certification.ownership,
  boundaries: certification.boundaries,
  capabilityCatalog: certification.capabilityCatalog,
  platformGuarantees: certification.platformGuarantees,
  platformCompatibility: certification.platformCompatibility,
  certificationCriteria: certification.criteria,
  certificationGates: certification.gates,
  preservedByReference: true as const,
});
