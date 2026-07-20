/**
 * NEA-8:6 — Executive Gateway Suite Platform Namespace.
 *
 * Canonical platform namespace composing Foundation, Registry, Model,
 * Validation, Manifest, and Platform by reference only.
 * No reconstruction. No copied metadata.
 *
 * Ownership: owned exclusively by NEA-8:6.
 */

import {
  ExecutiveGatewaySuiteManifestId,
  ExecutiveGatewaySuiteManifestPlatform,
} from "./executiveGatewaySuiteManifest.ts";
import type { ExecutiveGatewaySuitePlatformPhaseComposition } from "./executiveGatewaySuitePlatformTypes.ts";

const manifest = ExecutiveGatewaySuiteManifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const composition = (
  section: ExecutiveGatewaySuitePlatformPhaseComposition["section"],
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): ExecutiveGatewaySuitePlatformPhaseComposition =>
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

/** Canonical phase composition descriptors — exactly six sections. */
export const ExecutiveGatewaySuitePlatformPhaseCompositionCatalog: readonly ExecutiveGatewaySuitePlatformPhaseComposition[] =
  Object.freeze([
    composition(
      "foundation",
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "executiveGatewaySuiteFoundation.ts",
      1,
    ),
    composition(
      "registry",
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "executiveGatewaySuiteRegistry.ts",
      2,
    ),
    composition(
      "model",
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "executiveGatewaySuiteModel.ts",
      3,
    ),
    composition(
      "validation",
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "executiveGatewaySuiteValidation.ts",
      4,
    ),
    composition(
      "manifest",
      manifest.identity.manifestId,
      manifest.identity.manifestName,
      manifest.identity.manifestVersion,
      manifest.identity.manifestNamespace,
      manifest.identity.status,
      "executiveGatewaySuiteManifest.ts",
      5,
    ),
    composition(
      "platform",
      "NEA-8:6/ExecutiveGatewaySuitePlatform",
      "Executive Gateway Suite Platform",
      "1.0.0",
      "nexora.nea.executive-gateway-suite.platform",
      "Platform",
      "executiveGatewaySuitePlatform.ts",
      6,
    ),
  ]);

/**
 * Canonical immutable Executive Gateway Suite Platform namespace.
 * Six sections by reference only.
 */
export const ExecutiveGatewaySuitePlatformNamespaceObject = Object.freeze({
  namespaceId: "NEA-8:6/ExecutiveGatewaySuitePlatformNamespace",
  sourcePhase: "NEA-8:6" as const,
  manifestId: ExecutiveGatewaySuiteManifestId,
  suiteName: "Executive Gateway Suite" as const,
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
  composition: ExecutiveGatewaySuitePlatformPhaseCompositionCatalog,
  composedPhaseCount:
    ExecutiveGatewaySuitePlatformPhaseCompositionCatalog.length,
  suiteComponents: foundation.composition.components,
  suiteComponentCount: foundation.composition.componentCount,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
