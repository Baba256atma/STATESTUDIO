/**
 * NEA-4:6 — Security Gateway Platform Namespace.
 *
 * Canonical platform namespace composing Foundation, Registry, Model,
 * Validation, Manifest, and Platform by reference only.
 * No reconstruction. No copied metadata.
 *
 * Ownership: owned exclusively by NEA-4:6.
 */

import {
  SecurityGatewayManifestId,
  SecurityGatewayManifestPlatform,
} from "./securityGatewayManifest.ts";
import type { SecurityGatewayPlatformPhaseComposition } from "./securityGatewayPlatformTypes.ts";

const manifest = SecurityGatewayManifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const composition = (
  section: SecurityGatewayPlatformPhaseComposition["section"],
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): SecurityGatewayPlatformPhaseComposition =>
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
export const SecurityGatewayPlatformPhaseCompositionCatalog: readonly SecurityGatewayPlatformPhaseComposition[] =
  Object.freeze([
    composition(
      "foundation",
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "securityGatewayFoundation.ts",
      1,
    ),
    composition(
      "registry",
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "securityGatewayRegistry.ts",
      2,
    ),
    composition(
      "model",
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "securityGatewayModel.ts",
      3,
    ),
    composition(
      "validation",
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "securityGatewayValidation.ts",
      4,
    ),
    composition(
      "manifest",
      manifest.identity.manifestId,
      manifest.identity.manifestName,
      manifest.identity.manifestVersion,
      manifest.identity.manifestNamespace,
      manifest.identity.status,
      "securityGatewayManifest.ts",
      5,
    ),
    composition(
      "platform",
      "NEA-4:6/SecurityGatewayPlatform",
      "Security Gateway Platform",
      "1.0.0",
      "nexora.nea.security-gateway.platform",
      "Platform",
      "securityGatewayPlatform.ts",
      6,
    ),
  ]);

/**
 * Canonical immutable Security Gateway Platform namespace.
 * Six sections by reference only.
 */
export const SecurityGatewayPlatformNamespaceObject = Object.freeze({
  namespaceId: "NEA-4:6/SecurityGatewayPlatformNamespace",
  sourcePhase: "NEA-4:6" as const,
  manifestId: SecurityGatewayManifestId,
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
  composition: SecurityGatewayPlatformPhaseCompositionCatalog,
  composedPhaseCount: SecurityGatewayPlatformPhaseCompositionCatalog.length,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
