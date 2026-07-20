/**
 * NEA-2:8 — Channel Connectors Freeze Registry.
 *
 * Immutable registry of certified components preserved by Certification
 * reference only. No reconstruction. No duplicated upstream metadata.
 *
 * Ownership: owned exclusively by NEA-2:8.
 */

import {
  ChannelConnectorCertificationId,
  ChannelConnectorCertificationPlatform,
  ChannelConnectorCertificationVersion,
} from "./channelConnectorCertification.ts";
import type { ChannelConnectorFreezeComponent } from "./channelConnectorFreezeTypes.ts";

const certification = ChannelConnectorCertificationPlatform;
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
): ChannelConnectorFreezeComponent =>
  Object.freeze({
    componentId: `NEA-2:8/Component/${key}`,
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
export const ChannelConnectorFreezeComponents: readonly ChannelConnectorFreezeComponent[] =
  Object.freeze([
    component(
      1,
      "Foundation",
      "Channel Connectors Foundation",
      "NEA-2:1",
      ns.foundation.identity.foundationVersion,
      ns.foundation.identity.status,
      "Freeze.certification.platform.namespace.foundation",
    ),
    component(
      2,
      "Registry",
      "Channel Connectors Registry",
      "NEA-2:2",
      ns.registry.identity.registryVersion,
      ns.registry.identity.status,
      "Freeze.certification.platform.namespace.registry",
    ),
    component(
      3,
      "Model",
      "Channel Connectors Model",
      "NEA-2:3",
      ns.model.identity.modelVersion,
      ns.model.identity.status,
      "Freeze.certification.platform.namespace.model",
    ),
    component(
      4,
      "Validation",
      "Channel Connectors Validation",
      "NEA-2:4",
      ns.validation.identity.validationVersion,
      ns.validation.identity.status,
      "Freeze.certification.platform.namespace.validation",
    ),
    component(
      5,
      "Manifest",
      "Channel Connectors Manifest",
      "NEA-2:5",
      ns.manifest.identity.manifestVersion,
      ns.manifest.identity.status,
      "Freeze.certification.platform.namespace.manifest",
    ),
    component(
      6,
      "Platform",
      "Channel Connectors Platform",
      "NEA-2:6",
      platform.identity.platformVersion,
      platform.status,
      "Freeze.certification.platform",
    ),
    component(
      7,
      "Certification",
      "Channel Connectors Certification",
      "NEA-2:7",
      certification.identity.certificationVersion,
      certification.status,
      "Freeze.certification",
    ),
  ]);

/** Chain IDs preserved exclusively through Certification references. */
export const ChannelConnectorFreezeChainIds = Object.freeze({
  foundationId: ns.foundation.identity.foundationId,
  registryId: ns.registry.identity.registryId,
  modelId: ns.model.identity.modelId,
  validationId: ns.validation.identity.validationId,
  manifestId: ns.manifest.identity.manifestId,
  platformId: platform.identity.platformId,
  certificationId: ChannelConnectorCertificationId,
  freezeId: "NEA-2:8/ChannelConnectorFreeze" as const,
  connectorIdentityCount: ns.registry.collections.identityCount,
  preservedByReference: true as const,
});

/**
 * Certified platform reference — Certification aggregate only.
 * Do not reconstruct Platform or Certification.
 */
export const ChannelConnectorFreezeCertifiedPlatformReference = Object.freeze({
  referenceId: "NEA-2:8/CertifiedPlatformReference",
  sourcePhase: "NEA-2:8" as const,
  certificationId: ChannelConnectorCertificationId,
  certificationVersion: ChannelConnectorCertificationVersion,
  certification: ChannelConnectorCertificationPlatform,
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
export const ChannelConnectorFreezeRegistryCatalog = Object.freeze({
  catalogId: "NEA-2:8/FreezeRegistryCatalog",
  sourcePhase: "NEA-2:8" as const,
  components: ChannelConnectorFreezeComponents,
  componentCount: ChannelConnectorFreezeComponents.length,
  chainIds: ChannelConnectorFreezeChainIds,
  certifiedPlatformReference:
    ChannelConnectorFreezeCertifiedPlatformReference,
  connectorIdentityCount: ns.registry.collections.identityCount,
  connectorIdentities: ns.registry.collections.identities,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
