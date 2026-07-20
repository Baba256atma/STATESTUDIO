/**
 * NEA-4:8 — Security Gateway Freeze Registry.
 *
 * Immutable registry of certified components preserved by Certification
 * reference only. No reconstruction. No duplicated upstream metadata.
 *
 * Ownership: owned exclusively by NEA-4:8.
 */

import {
  SecurityGatewayCertificationId,
  SecurityGatewayCertificationPlatform,
  SecurityGatewayCertificationVersion,
} from "./securityGatewayCertification.ts";
import type { SecurityGatewayFreezeComponent } from "./securityGatewayFreezeTypes.ts";

const certification = SecurityGatewayCertificationPlatform;
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
): SecurityGatewayFreezeComponent =>
  Object.freeze({
    componentId: `NEA-4:8/Component/${key}`,
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
export const SecurityGatewayFreezeComponents: readonly SecurityGatewayFreezeComponent[] =
  Object.freeze([
    component(
      1,
      "Foundation",
      "Security Gateway Foundation",
      "NEA-4:1",
      ns.foundation.identity.foundationVersion,
      ns.foundation.identity.status,
      "Freeze.certification.platform.namespace.foundation",
    ),
    component(
      2,
      "Registry",
      "Security Gateway Registry",
      "NEA-4:2",
      ns.registry.identity.registryVersion,
      ns.registry.identity.status,
      "Freeze.certification.platform.namespace.registry",
    ),
    component(
      3,
      "Model",
      "Security Gateway Model",
      "NEA-4:3",
      ns.model.identity.modelVersion,
      ns.model.identity.status,
      "Freeze.certification.platform.namespace.model",
    ),
    component(
      4,
      "Validation",
      "Security Gateway Validation",
      "NEA-4:4",
      ns.validation.identity.validationVersion,
      ns.validation.identity.status,
      "Freeze.certification.platform.namespace.validation",
    ),
    component(
      5,
      "Manifest",
      "Security Gateway Manifest",
      "NEA-4:5",
      ns.manifest.identity.manifestVersion,
      ns.manifest.identity.status,
      "Freeze.certification.platform.namespace.manifest",
    ),
    component(
      6,
      "Platform",
      "Security Gateway Platform",
      "NEA-4:6",
      platform.identity.platformVersion,
      platform.status,
      "Freeze.certification.platform",
    ),
    component(
      7,
      "Certification",
      "Security Gateway Certification",
      "NEA-4:7",
      certification.identity.certificationVersion,
      certification.status,
      "Freeze.certification",
    ),
  ]);

/** Chain IDs preserved exclusively through Certification references. */
export const SecurityGatewayFreezeChainIds = Object.freeze({
  foundationId: ns.foundation.identity.foundationId,
  registryId: ns.registry.identity.registryId,
  modelId: ns.model.identity.modelId,
  validationId: ns.validation.identity.validationId,
  manifestId: ns.manifest.identity.manifestId,
  platformId: platform.identity.platformId,
  certificationId: SecurityGatewayCertificationId,
  freezeId: "NEA-4:8/SecurityGatewayFreeze" as const,
  securityIdentityCount: ns.registry.collections.securityIdentityCount,
  securityPolicyCount: ns.registry.collections.securityPolicyCount,
  permissionCount: ns.registry.collections.permissionCount,
  preservedByReference: true as const,
});

/**
 * Certified platform reference — Certification aggregate only.
 * Do not reconstruct Platform or Certification.
 */
export const SecurityGatewayFreezeCertifiedPlatformReference = Object.freeze({
  referenceId: "NEA-4:8/CertifiedPlatformReference",
  sourcePhase: "NEA-4:8" as const,
  certificationId: SecurityGatewayCertificationId,
  certificationVersion: SecurityGatewayCertificationVersion,
  certification: SecurityGatewayCertificationPlatform,
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
export const SecurityGatewayFreezeRegistryCatalog = Object.freeze({
  catalogId: "NEA-4:8/FreezeRegistryCatalog",
  sourcePhase: "NEA-4:8" as const,
  components: SecurityGatewayFreezeComponents,
  componentCount: SecurityGatewayFreezeComponents.length,
  chainIds: SecurityGatewayFreezeChainIds,
  certifiedPlatformReference: SecurityGatewayFreezeCertifiedPlatformReference,
  securityIdentityCount: ns.registry.collections.securityIdentityCount,
  securityPolicyCount: ns.registry.collections.securityPolicyCount,
  permissionCount: ns.registry.collections.permissionCount,
  securityIdentities: ns.registry.collections.securityIdentities,
  securityPolicies: ns.registry.collections.securityPolicies,
  permissions: ns.registry.collections.permissions,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
