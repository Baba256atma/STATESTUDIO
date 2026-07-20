/**
 * NEA-6:6 — Message Normalization Platform Namespace.
 *
 * Canonical platform namespace composing Foundation, Registry, Model,
 * Validation, Manifest, and Platform by reference only.
 * No reconstruction. No copied metadata.
 *
 * Ownership: owned exclusively by NEA-6:6.
 */

import {
  MessageNormalizationManifestId,
  MessageNormalizationManifestPlatform,
} from "./messageNormalizationManifest.ts";
import type { MessageNormalizationPlatformPhaseComposition } from "./messageNormalizationPlatformTypes.ts";

const manifest = MessageNormalizationManifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const composition = (
  section: MessageNormalizationPlatformPhaseComposition["section"],
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): MessageNormalizationPlatformPhaseComposition =>
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
export const MessageNormalizationPlatformPhaseCompositionCatalog: readonly MessageNormalizationPlatformPhaseComposition[] =
  Object.freeze([
    composition(
      "foundation",
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "messageNormalizationFoundation.ts",
      1,
    ),
    composition(
      "registry",
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "messageNormalizationRegistry.ts",
      2,
    ),
    composition(
      "model",
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "messageNormalizationModel.ts",
      3,
    ),
    composition(
      "validation",
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "messageNormalizationValidation.ts",
      4,
    ),
    composition(
      "manifest",
      manifest.identity.manifestId,
      manifest.identity.manifestName,
      manifest.identity.manifestVersion,
      manifest.identity.manifestNamespace,
      manifest.identity.status,
      "messageNormalizationManifest.ts",
      5,
    ),
    composition(
      "platform",
      "NEA-6:6/MessageNormalizationPlatform",
      "Message Normalization Platform",
      "1.0.0",
      "nexora.nea.message-normalization.platform",
      "Platform",
      "messageNormalizationPlatform.ts",
      6,
    ),
  ]);

/**
 * Canonical immutable Message Normalization Platform namespace.
 * Six sections by reference only.
 */
export const MessageNormalizationPlatformNamespaceObject = Object.freeze({
  namespaceId: "NEA-6:6/MessageNormalizationPlatformNamespace",
  sourcePhase: "NEA-6:6" as const,
  manifestId: MessageNormalizationManifestId,
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
  composition: MessageNormalizationPlatformPhaseCompositionCatalog,
  composedPhaseCount: MessageNormalizationPlatformPhaseCompositionCatalog.length,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
