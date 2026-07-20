/**
 * NEA-5:6 — Gateway Routing Platform Namespace.
 *
 * Canonical platform namespace composing Foundation, Registry, Model,
 * Validation, Manifest, and Platform by reference only.
 * No reconstruction. No copied metadata.
 *
 * Ownership: owned exclusively by NEA-5:6.
 */

import {
  GatewayRoutingManifestId,
  GatewayRoutingManifestPlatform,
} from "./gatewayRoutingManifest.ts";
import type { GatewayRoutingPlatformPhaseComposition } from "./gatewayRoutingPlatformTypes.ts";

const manifest = GatewayRoutingManifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const composition = (
  section: GatewayRoutingPlatformPhaseComposition["section"],
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): GatewayRoutingPlatformPhaseComposition =>
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
export const GatewayRoutingPlatformPhaseCompositionCatalog: readonly GatewayRoutingPlatformPhaseComposition[] =
  Object.freeze([
    composition(
      "foundation",
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "gatewayRoutingFoundation.ts",
      1,
    ),
    composition(
      "registry",
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "gatewayRoutingRegistry.ts",
      2,
    ),
    composition(
      "model",
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "gatewayRoutingModel.ts",
      3,
    ),
    composition(
      "validation",
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "gatewayRoutingValidation.ts",
      4,
    ),
    composition(
      "manifest",
      manifest.identity.manifestId,
      manifest.identity.manifestName,
      manifest.identity.manifestVersion,
      manifest.identity.manifestNamespace,
      manifest.identity.status,
      "gatewayRoutingManifest.ts",
      5,
    ),
    composition(
      "platform",
      "NEA-5:6/GatewayRoutingPlatform",
      "Gateway Routing Platform",
      "1.0.0",
      "nexora.nea.gateway-routing.platform",
      "Platform",
      "gatewayRoutingPlatform.ts",
      6,
    ),
  ]);

/**
 * Canonical immutable Gateway Routing Platform namespace.
 * Six sections by reference only.
 */
export const GatewayRoutingPlatformNamespaceObject = Object.freeze({
  namespaceId: "NEA-5:6/GatewayRoutingPlatformNamespace",
  sourcePhase: "NEA-5:6" as const,
  manifestId: GatewayRoutingManifestId,
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
  composition: GatewayRoutingPlatformPhaseCompositionCatalog,
  composedPhaseCount: GatewayRoutingPlatformPhaseCompositionCatalog.length,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
