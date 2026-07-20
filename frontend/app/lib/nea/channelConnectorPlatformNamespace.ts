/**
 * NEA-2:6 — Channel Connectors Platform Namespace.
 *
 * Canonical platform namespace composing Foundation, Registry, Model,
 * Validation, Manifest, and Platform by reference only.
 * No reconstruction. No copied metadata.
 *
 * Ownership: owned exclusively by NEA-2:6.
 */

import {
  ChannelConnectorManifestId,
  ChannelConnectorManifestPlatform,
} from "./channelConnectorManifest.ts";
import type { ChannelConnectorPlatformPhaseComposition } from "./channelConnectorPlatformTypes.ts";

const manifest = ChannelConnectorManifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const composition = (
  section: ChannelConnectorPlatformPhaseComposition["section"],
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): ChannelConnectorPlatformPhaseComposition =>
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
export const ChannelConnectorPlatformPhaseCompositionCatalog: readonly ChannelConnectorPlatformPhaseComposition[] =
  Object.freeze([
    composition(
      "foundation",
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "channelConnectorFoundation.ts",
      1,
    ),
    composition(
      "registry",
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "channelConnectorRegistry.ts",
      2,
    ),
    composition(
      "model",
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "channelConnectorModel.ts",
      3,
    ),
    composition(
      "validation",
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "channelConnectorValidation.ts",
      4,
    ),
    composition(
      "manifest",
      manifest.identity.manifestId,
      manifest.identity.manifestName,
      manifest.identity.manifestVersion,
      manifest.identity.manifestNamespace,
      manifest.identity.status,
      "channelConnectorManifest.ts",
      5,
    ),
    composition(
      "platform",
      "NEA-2:6/ChannelConnectorPlatform",
      "Channel Connectors Platform",
      "1.0.0",
      "nexora.nea.channel-connectors.platform",
      "Platform",
      "channelConnectorPlatform.ts",
      6,
    ),
  ]);

/**
 * Canonical immutable Channel Connectors Platform namespace.
 * Six sections by reference only.
 */
export const ChannelConnectorPlatformNamespaceObject = Object.freeze({
  namespaceId: "NEA-2:6/ChannelConnectorPlatformNamespace",
  sourcePhase: "NEA-2:6" as const,
  manifestId: ChannelConnectorManifestId,
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
  composition: ChannelConnectorPlatformPhaseCompositionCatalog,
  composedPhaseCount: ChannelConnectorPlatformPhaseCompositionCatalog.length,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
