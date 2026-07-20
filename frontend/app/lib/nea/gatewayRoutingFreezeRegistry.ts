/**
 * NEA-5:8 — Gateway Routing Freeze Registry.
 *
 * Immutable registry of certified components preserved by Certification
 * reference only. No reconstruction. No duplicated upstream metadata.
 *
 * Ownership: owned exclusively by NEA-5:8.
 */

import {
  GatewayRoutingCertificationId,
  GatewayRoutingCertificationPlatform,
  GatewayRoutingCertificationVersion,
} from "./gatewayRoutingCertification.ts";
import type { GatewayRoutingFreezeComponent } from "./gatewayRoutingFreezeTypes.ts";

const certification = GatewayRoutingCertificationPlatform;
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
): GatewayRoutingFreezeComponent =>
  Object.freeze({
    componentId: `NEA-5:8/Component/${key}`,
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
export const GatewayRoutingFreezeComponents: readonly GatewayRoutingFreezeComponent[] =
  Object.freeze([
    component(
      1,
      "Foundation",
      "Gateway Routing Foundation",
      "NEA-5:1",
      ns.foundation.identity.foundationVersion,
      ns.foundation.identity.status,
      "Freeze.certification.platform.namespace.foundation",
    ),
    component(
      2,
      "Registry",
      "Gateway Routing Registry",
      "NEA-5:2",
      ns.registry.identity.registryVersion,
      ns.registry.identity.status,
      "Freeze.certification.platform.namespace.registry",
    ),
    component(
      3,
      "Model",
      "Gateway Routing Model",
      "NEA-5:3",
      ns.model.identity.modelVersion,
      ns.model.identity.status,
      "Freeze.certification.platform.namespace.model",
    ),
    component(
      4,
      "Validation",
      "Gateway Routing Validation",
      "NEA-5:4",
      ns.validation.identity.validationVersion,
      ns.validation.identity.status,
      "Freeze.certification.platform.namespace.validation",
    ),
    component(
      5,
      "Manifest",
      "Gateway Routing Manifest",
      "NEA-5:5",
      ns.manifest.identity.manifestVersion,
      ns.manifest.identity.status,
      "Freeze.certification.platform.namespace.manifest",
    ),
    component(
      6,
      "Platform",
      "Gateway Routing Platform",
      "NEA-5:6",
      platform.identity.platformVersion,
      platform.status,
      "Freeze.certification.platform",
    ),
    component(
      7,
      "Certification",
      "Gateway Routing Certification",
      "NEA-5:7",
      certification.identity.certificationVersion,
      certification.status,
      "Freeze.certification",
    ),
  ]);

/** Chain IDs preserved exclusively through Certification references. */
export const GatewayRoutingFreezeChainIds = Object.freeze({
  foundationId: ns.foundation.identity.foundationId,
  registryId: ns.registry.identity.registryId,
  modelId: ns.model.identity.modelId,
  validationId: ns.validation.identity.validationId,
  manifestId: ns.manifest.identity.manifestId,
  platformId: platform.identity.platformId,
  certificationId: GatewayRoutingCertificationId,
  freezeId: "NEA-5:8/GatewayRoutingFreeze" as const,
  routeIdentityCount: ns.registry.collections.routeIdentityCount,
  domainModelCount: ns.model.domainModels.modelCount,
  preservedByReference: true as const,
});

/**
 * Certified platform reference — Certification aggregate only.
 * Do not reconstruct Platform or Certification.
 */
export const GatewayRoutingFreezeCertifiedPlatformReference = Object.freeze({
  referenceId: "NEA-5:8/CertifiedPlatformReference",
  sourcePhase: "NEA-5:8" as const,
  certificationId: GatewayRoutingCertificationId,
  certificationVersion: GatewayRoutingCertificationVersion,
  certification: GatewayRoutingCertificationPlatform,
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
export const GatewayRoutingFreezeRegistryCatalog = Object.freeze({
  catalogId: "NEA-5:8/FreezeRegistryCatalog",
  sourcePhase: "NEA-5:8" as const,
  components: GatewayRoutingFreezeComponents,
  componentCount: GatewayRoutingFreezeComponents.length,
  chainIds: GatewayRoutingFreezeChainIds,
  certifiedPlatformReference: GatewayRoutingFreezeCertifiedPlatformReference,
  routeIdentityCount: ns.registry.collections.routeIdentityCount,
  domainModelCount: ns.model.domainModels.modelCount,
  routeIdentities: ns.registry.collections.routeIdentities,
  domainModels: ns.model.domainModels.models,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
