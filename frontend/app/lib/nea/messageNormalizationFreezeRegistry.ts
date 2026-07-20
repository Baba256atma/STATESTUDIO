/**
 * NEA-6:8 — Message Normalization Freeze Registry.
 *
 * Immutable registry of certified components preserved by Certification
 * reference only. No reconstruction. No duplicated upstream metadata.
 *
 * Ownership: owned exclusively by NEA-6:8.
 */

import {
  MessageNormalizationCertificationId,
  MessageNormalizationCertificationPlatform,
  MessageNormalizationCertificationVersion,
} from "./messageNormalizationCertification.ts";
import type { MessageNormalizationFreezeComponent } from "./messageNormalizationFreezeTypes.ts";

const certification = MessageNormalizationCertificationPlatform;
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
): MessageNormalizationFreezeComponent =>
  Object.freeze({
    componentId: `NEA-6:8/Component/${key}`,
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
export const MessageNormalizationFreezeComponents: readonly MessageNormalizationFreezeComponent[] =
  Object.freeze([
    component(
      1,
      "Foundation",
      "Message Normalization Foundation",
      "NEA-6:1",
      ns.foundation.identity.foundationVersion,
      ns.foundation.identity.status,
      "Freeze.certification.platform.namespace.foundation",
    ),
    component(
      2,
      "Registry",
      "Message Normalization Registry",
      "NEA-6:2",
      ns.registry.identity.registryVersion,
      ns.registry.identity.status,
      "Freeze.certification.platform.namespace.registry",
    ),
    component(
      3,
      "Model",
      "Message Normalization Model",
      "NEA-6:3",
      ns.model.identity.modelVersion,
      ns.model.identity.status,
      "Freeze.certification.platform.namespace.model",
    ),
    component(
      4,
      "Validation",
      "Message Normalization Validation",
      "NEA-6:4",
      ns.validation.identity.validationVersion,
      ns.validation.identity.status,
      "Freeze.certification.platform.namespace.validation",
    ),
    component(
      5,
      "Manifest",
      "Message Normalization Manifest",
      "NEA-6:5",
      ns.manifest.identity.manifestVersion,
      ns.manifest.identity.status,
      "Freeze.certification.platform.namespace.manifest",
    ),
    component(
      6,
      "Platform",
      "Message Normalization Platform",
      "NEA-6:6",
      platform.identity.platformVersion,
      platform.status,
      "Freeze.certification.platform",
    ),
    component(
      7,
      "Certification",
      "Message Normalization Certification",
      "NEA-6:7",
      certification.identity.certificationVersion,
      certification.status,
      "Freeze.certification",
    ),
  ]);

/** Chain IDs preserved exclusively through Certification references. */
export const MessageNormalizationFreezeChainIds = Object.freeze({
  foundationId: ns.foundation.identity.foundationId,
  registryId: ns.registry.identity.registryId,
  modelId: ns.model.identity.modelId,
  validationId: ns.validation.identity.validationId,
  manifestId: ns.manifest.identity.manifestId,
  platformId: platform.identity.platformId,
  certificationId: MessageNormalizationCertificationId,
  freezeId: "NEA-6:8/MessageNormalizationFreeze" as const,
  messageIdentityCount: ns.registry.collections.messageIdentityCount,
  payloadCount: ns.registry.collections.payloadCount,
  canonicalExecutiveMessageCount:
    ns.foundation.contracts.canonicalExecutiveMessageCount,
  preservedByReference: true as const,
});

/**
 * Certified platform reference — Certification aggregate only.
 * Do not reconstruct Platform or Certification.
 */
export const MessageNormalizationFreezeCertifiedPlatformReference =
  Object.freeze({
    referenceId: "NEA-6:8/CertifiedPlatformReference",
    sourcePhase: "NEA-6:8" as const,
    certificationId: MessageNormalizationCertificationId,
    certificationVersion: MessageNormalizationCertificationVersion,
    certification: MessageNormalizationCertificationPlatform,
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
export const MessageNormalizationFreezeRegistryCatalog = Object.freeze({
  catalogId: "NEA-6:8/FreezeRegistryCatalog",
  sourcePhase: "NEA-6:8" as const,
  components: MessageNormalizationFreezeComponents,
  componentCount: MessageNormalizationFreezeComponents.length,
  chainIds: MessageNormalizationFreezeChainIds,
  certifiedPlatformReference:
    MessageNormalizationFreezeCertifiedPlatformReference,
  messageIdentityCount: ns.registry.collections.messageIdentityCount,
  payloadCount: ns.registry.collections.payloadCount,
  canonicalExecutiveMessageCount:
    ns.foundation.contracts.canonicalExecutiveMessageCount,
  messageIdentities: ns.registry.collections.messageIdentities,
  payloads: ns.registry.collections.payloads,
  canonicalExecutiveMessageContracts:
    ns.foundation.contracts.canonicalExecutiveMessageContracts,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
