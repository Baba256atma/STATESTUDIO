/**
 * NEA-3:8 — Session & Conversation Freeze Registry.
 *
 * Immutable registry of certified components preserved by Certification
 * reference only. No reconstruction. No duplicated upstream metadata.
 *
 * Ownership: owned exclusively by NEA-3:8.
 */

import {
  SessionConversationCertificationId,
  SessionConversationCertificationPlatform,
  SessionConversationCertificationVersion,
} from "./sessionConversationCertification.ts";
import type { SessionConversationFreezeComponent } from "./sessionConversationFreezeTypes.ts";

const certification = SessionConversationCertificationPlatform;
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
): SessionConversationFreezeComponent =>
  Object.freeze({
    componentId: `NEA-3:8/Component/${key}`,
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
export const SessionConversationFreezeComponents: readonly SessionConversationFreezeComponent[] =
  Object.freeze([
    component(
      1,
      "Foundation",
      "Session & Conversation Foundation",
      "NEA-3:1",
      ns.foundation.identity.foundationVersion,
      ns.foundation.identity.status,
      "Freeze.certification.platform.namespace.foundation",
    ),
    component(
      2,
      "Registry",
      "Session & Conversation Registry",
      "NEA-3:2",
      ns.registry.identity.registryVersion,
      ns.registry.identity.status,
      "Freeze.certification.platform.namespace.registry",
    ),
    component(
      3,
      "Model",
      "Session & Conversation Model",
      "NEA-3:3",
      ns.model.identity.modelVersion,
      ns.model.identity.status,
      "Freeze.certification.platform.namespace.model",
    ),
    component(
      4,
      "Validation",
      "Session & Conversation Validation",
      "NEA-3:4",
      ns.validation.identity.validationVersion,
      ns.validation.identity.status,
      "Freeze.certification.platform.namespace.validation",
    ),
    component(
      5,
      "Manifest",
      "Session & Conversation Manifest",
      "NEA-3:5",
      ns.manifest.identity.manifestVersion,
      ns.manifest.identity.status,
      "Freeze.certification.platform.namespace.manifest",
    ),
    component(
      6,
      "Platform",
      "Session & Conversation Platform",
      "NEA-3:6",
      platform.identity.platformVersion,
      platform.status,
      "Freeze.certification.platform",
    ),
    component(
      7,
      "Certification",
      "Session & Conversation Certification",
      "NEA-3:7",
      certification.identity.certificationVersion,
      certification.status,
      "Freeze.certification",
    ),
  ]);

/** Chain IDs preserved exclusively through Certification references. */
export const SessionConversationFreezeChainIds = Object.freeze({
  foundationId: ns.foundation.identity.foundationId,
  registryId: ns.registry.identity.registryId,
  modelId: ns.model.identity.modelId,
  validationId: ns.validation.identity.validationId,
  manifestId: ns.manifest.identity.manifestId,
  platformId: platform.identity.platformId,
  certificationId: SessionConversationCertificationId,
  freezeId: "NEA-3:8/SessionConversationFreeze" as const,
  sessionIdentityCount: ns.registry.collections.sessionIdentityCount,
  conversationIdentityCount: ns.registry.collections.conversationIdentityCount,
  preservedByReference: true as const,
});

/**
 * Certified platform reference — Certification aggregate only.
 * Do not reconstruct Platform or Certification.
 */
export const SessionConversationFreezeCertifiedPlatformReference =
  Object.freeze({
    referenceId: "NEA-3:8/CertifiedPlatformReference",
    sourcePhase: "NEA-3:8" as const,
    certificationId: SessionConversationCertificationId,
    certificationVersion: SessionConversationCertificationVersion,
    certification: SessionConversationCertificationPlatform,
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
export const SessionConversationFreezeRegistryCatalog = Object.freeze({
  catalogId: "NEA-3:8/FreezeRegistryCatalog",
  sourcePhase: "NEA-3:8" as const,
  components: SessionConversationFreezeComponents,
  componentCount: SessionConversationFreezeComponents.length,
  chainIds: SessionConversationFreezeChainIds,
  certifiedPlatformReference:
    SessionConversationFreezeCertifiedPlatformReference,
  sessionIdentityCount: ns.registry.collections.sessionIdentityCount,
  conversationIdentityCount: ns.registry.collections.conversationIdentityCount,
  sessionIdentities: ns.registry.collections.sessionIdentities,
  conversationIdentities: ns.registry.collections.conversationIdentities,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
