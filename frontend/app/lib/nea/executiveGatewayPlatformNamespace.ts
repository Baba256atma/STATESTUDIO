/**
 * NEA-1:6 — Executive Gateway Platform Namespace.
 *
 * Canonical platform namespace composing Foundation, Registry, Model,
 * Validation, Manifest, and Platform by reference only.
 * No reconstruction. No copied metadata.
 *
 * Ownership: owned exclusively by NEA-1:6.
 */

import {
  ExecutiveGatewayManifestId,
  ExecutiveGatewayManifestPlatform,
} from "./executiveGatewayManifest.ts";
import type { ExecutiveGatewayPlatformPhaseComposition } from "./executiveGatewayPlatformTypes.ts";

const manifest = ExecutiveGatewayManifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const composition = (
  section: ExecutiveGatewayPlatformPhaseComposition["section"],
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): ExecutiveGatewayPlatformPhaseComposition =>
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
export const ExecutiveGatewayPlatformPhaseCompositionCatalog: readonly ExecutiveGatewayPlatformPhaseComposition[] =
  Object.freeze([
    composition(
      "foundation",
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "executiveGatewayFoundation.ts",
      1,
    ),
    composition(
      "registry",
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "executiveGatewayRegistry.ts",
      2,
    ),
    composition(
      "model",
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "executiveGatewayModel.ts",
      3,
    ),
    composition(
      "validation",
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "executiveGatewayValidation.ts",
      4,
    ),
    composition(
      "manifest",
      manifest.identity.manifestId,
      manifest.identity.manifestName,
      manifest.identity.manifestVersion,
      manifest.identity.manifestNamespace,
      manifest.identity.status,
      "executiveGatewayManifest.ts",
      5,
    ),
    composition(
      "platform",
      "NEA-1:6/ExecutiveGatewayPlatform",
      "Executive Gateway Platform",
      "1.0.0",
      "nexora.nea.executive-gateway.platform",
      "Platform",
      "executiveGatewayPlatform.ts",
      6,
    ),
  ]);

/**
 * Canonical immutable Executive Gateway Platform namespace.
 * Six sections by reference only.
 */
export const ExecutiveGatewayPlatformNamespaceObject = Object.freeze({
  namespaceId: "NEA-1:6/ExecutiveGatewayPlatformNamespace",
  sourcePhase: "NEA-1:6" as const,
  manifestId: ExecutiveGatewayManifestId,
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
  composition: ExecutiveGatewayPlatformPhaseCompositionCatalog,
  composedPhaseCount: ExecutiveGatewayPlatformPhaseCompositionCatalog.length,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
