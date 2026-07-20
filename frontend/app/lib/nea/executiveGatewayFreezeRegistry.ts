/**
 * NEA-1:8 — Executive Gateway Freeze Registry.
 *
 * Immutable registry of certified components preserved by Certification
 * reference only. No reconstruction. No duplicated upstream metadata.
 *
 * Ownership: owned exclusively by NEA-1:8.
 */

import {
  ExecutiveGatewayCertificationId,
  ExecutiveGatewayCertificationPlatform,
  ExecutiveGatewayCertificationVersion,
} from "./executiveGatewayCertification.ts";
import type { ExecutiveGatewayFreezeComponent } from "./executiveGatewayFreezeTypes.ts";

const certification = ExecutiveGatewayCertificationPlatform;
const platform = certification.platform;
const ns = platform.namespace;

const component = (
  order: number,
  key: string,
  name: string,
  phase: string,
  version: string,
  status: string,
  sourceReference: string,
): ExecutiveGatewayFreezeComponent =>
  Object.freeze({
    componentId: `NEA-1:8/Component/${key}`,
    componentName: name,
    phase,
    version,
    status,
    sourceReference,
    frozen: true as const,
    certified: true as const,
    reconstructsUpstream: false as const,
    duplicatesArchitecture: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Exactly seven frozen certified components in canonical phase order.
 * Identity fields are derived through Certification → Platform namespace.
 */
export const ExecutiveGatewayFreezeComponents: readonly ExecutiveGatewayFreezeComponent[] =
  Object.freeze([
    component(
      1,
      "Foundation",
      "Executive Gateway Foundation",
      "NEA-1:1",
      ns.foundation.identity.foundationVersion,
      ns.foundation.identity.status,
      "Freeze.certification.platform.namespace.foundation",
    ),
    component(
      2,
      "Registry",
      "Executive Gateway Registry",
      "NEA-1:2",
      ns.registry.identity.registryVersion,
      ns.registry.identity.status,
      "Freeze.certification.platform.namespace.registry",
    ),
    component(
      3,
      "Model",
      "Executive Gateway Model",
      "NEA-1:3",
      ns.model.identity.modelVersion,
      ns.model.identity.status,
      "Freeze.certification.platform.namespace.model",
    ),
    component(
      4,
      "Validation",
      "Executive Gateway Validation",
      "NEA-1:4",
      ns.validation.identity.validationVersion,
      ns.validation.identity.status,
      "Freeze.certification.platform.namespace.validation",
    ),
    component(
      5,
      "Manifest",
      "Executive Gateway Manifest",
      "NEA-1:5",
      ns.manifest.identity.manifestVersion,
      ns.manifest.identity.status,
      "Freeze.certification.platform.namespace.manifest",
    ),
    component(
      6,
      "Platform",
      "Executive Gateway Platform",
      "NEA-1:6",
      platform.identity.platformVersion,
      platform.status,
      "Freeze.certification.platform",
    ),
    component(
      7,
      "Certification",
      "Executive Gateway Certification",
      "NEA-1:7",
      certification.identity.certificationVersion,
      certification.status,
      "Freeze.certification",
    ),
  ]);

/** Chain IDs preserved exclusively through Certification references. */
export const ExecutiveGatewayFreezeChainIds = Object.freeze({
  foundationId: ns.foundation.identity.foundationId,
  registryId: ns.registry.identity.registryId,
  modelId: ns.model.identity.modelId,
  validationId: ns.validation.identity.validationId,
  manifestId: ns.manifest.identity.manifestId,
  platformId: platform.identity.platformId,
  certificationId: ExecutiveGatewayCertificationId,
  freezeId: "NEA-1:8/ExecutiveGatewayFreeze" as const,
  preservedByReference: true as const,
});

/**
 * Certified platform reference — Certification aggregate only.
 * Do not reconstruct Platform or Certification.
 */
export const ExecutiveGatewayFreezeCertifiedPlatformReference = Object.freeze({
  referenceId: "NEA-1:8/CertifiedPlatformReference",
  sourcePhase: "NEA-1:8" as const,
  certificationId: ExecutiveGatewayCertificationId,
  certificationVersion: ExecutiveGatewayCertificationVersion,
  certification: ExecutiveGatewayCertificationPlatform,
  platform: certification.platform,
  reconstructsCertification: false as const,
  reconstructsPlatform: false as const,
  duplicatesCertificationMetadata: false as const,
  duplicatesPlatformMetadata: false as const,
  preservedByReference: true as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable freeze registry catalog. */
export const ExecutiveGatewayFreezeRegistryCatalog = Object.freeze({
  catalogId: "NEA-1:8/FreezeRegistryCatalog",
  sourcePhase: "NEA-1:8" as const,
  components: ExecutiveGatewayFreezeComponents,
  componentCount: ExecutiveGatewayFreezeComponents.length,
  chainIds: ExecutiveGatewayFreezeChainIds,
  certifiedPlatformReference:
    ExecutiveGatewayFreezeCertifiedPlatformReference,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
