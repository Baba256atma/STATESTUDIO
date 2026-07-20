/**
 * NEA-3:6 — Session & Conversation Platform Namespace.
 *
 * Canonical platform namespace composing Foundation, Registry, Model,
 * Validation, Manifest, and Platform by reference only.
 * No reconstruction. No copied metadata.
 *
 * Ownership: owned exclusively by NEA-3:6.
 */

import {
  SessionConversationManifestId,
  SessionConversationManifestPlatform,
} from "./sessionConversationManifest.ts";
import type { SessionConversationPlatformPhaseComposition } from "./sessionConversationPlatformTypes.ts";

const manifest = SessionConversationManifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const composition = (
  section: SessionConversationPlatformPhaseComposition["section"],
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): SessionConversationPlatformPhaseComposition =>
  Object.freeze({
    section,
    phaseId,
    phaseName,
    version,
    namespace,
    status,
    module,
    ownership: "Referenced" as const,
    reconstructsPhase: false as const,
    duplicatesArchitecture: false as const,
    deterministicOrder: order,
  });

/** Canonical phase composition descriptors. */
export const SessionConversationPlatformPhaseCompositionCatalog: readonly SessionConversationPlatformPhaseComposition[] =
  Object.freeze([
    composition(
      "foundation",
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "sessionConversationFoundation.ts",
      1,
    ),
    composition(
      "registry",
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "sessionConversationRegistry.ts",
      2,
    ),
    composition(
      "model",
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "sessionConversationModel.ts",
      3,
    ),
    composition(
      "validation",
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "sessionConversationValidation.ts",
      4,
    ),
    composition(
      "manifest",
      manifest.identity.manifestId,
      manifest.identity.manifestName,
      manifest.identity.manifestVersion,
      manifest.identity.manifestNamespace,
      manifest.identity.status,
      "sessionConversationManifest.ts",
      5,
    ),
    composition(
      "platform",
      "NEA-3:6/SessionConversationPlatform",
      "Session & Conversation Platform",
      "1.0.0",
      "nexora.nea.session-conversation.platform",
      "Platform",
      "sessionConversationPlatform.ts",
      6,
    ),
  ]);

/**
 * Canonical immutable Session & Conversation Platform namespace.
 * Six sections by reference only.
 */
export const SessionConversationPlatformNamespaceObject = Object.freeze({
  namespaceId: "NEA-3:6/SessionConversationPlatformNamespace",
  sourcePhase: "NEA-3:6" as const,
  manifestId: SessionConversationManifestId,
  sectionOrder: Object.freeze([
    "foundation",
    "registry",
    "model",
    "validation",
    "manifest",
    "platform",
  ] as const),
  sectionCount: 6 as const,
  foundation,
  registry,
  model,
  validation,
  manifest,
  composition: SessionConversationPlatformPhaseCompositionCatalog,
  composedPhaseCount: SessionConversationPlatformPhaseCompositionCatalog.length,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
