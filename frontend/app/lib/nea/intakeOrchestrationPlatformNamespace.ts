/**
 * NEA-7:6 — Intake Orchestration Platform Namespace.
 *
 * Canonical platform namespace composing Foundation, Registry, Model,
 * Validation, Manifest, and Platform by reference only.
 * No reconstruction. No copied metadata.
 *
 * Ownership: owned exclusively by NEA-7:6.
 */

import {
  IntakeOrchestrationManifestId,
  IntakeOrchestrationManifestPlatform,
} from "./intakeOrchestrationManifest.ts";
import type { IntakeOrchestrationPlatformPhaseComposition } from "./intakeOrchestrationPlatformTypes.ts";

const manifest = IntakeOrchestrationManifestPlatform;
const validation = manifest.validationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

const composition = (
  section: IntakeOrchestrationPlatformPhaseComposition["section"],
  phaseId: string,
  phaseName: string,
  version: string,
  namespace: string,
  status: string,
  module: string,
  order: number,
): IntakeOrchestrationPlatformPhaseComposition =>
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
export const IntakeOrchestrationPlatformPhaseCompositionCatalog: readonly IntakeOrchestrationPlatformPhaseComposition[] =
  Object.freeze([
    composition(
      "foundation",
      foundation.identity.foundationId,
      foundation.identity.foundationName,
      foundation.identity.foundationVersion,
      foundation.identity.foundationNamespace,
      foundation.identity.status,
      "intakeOrchestrationFoundation.ts",
      1,
    ),
    composition(
      "registry",
      registry.identity.registryId,
      registry.identity.registryName,
      registry.identity.registryVersion,
      registry.identity.registryNamespace,
      registry.identity.status,
      "intakeOrchestrationRegistry.ts",
      2,
    ),
    composition(
      "model",
      model.identity.modelId,
      model.identity.modelName,
      model.identity.modelVersion,
      model.identity.modelNamespace,
      model.identity.status,
      "intakeOrchestrationModel.ts",
      3,
    ),
    composition(
      "validation",
      validation.identity.validationId,
      validation.identity.validationName,
      validation.identity.validationVersion,
      validation.identity.validationNamespace,
      validation.identity.status,
      "intakeOrchestrationValidation.ts",
      4,
    ),
    composition(
      "manifest",
      manifest.identity.manifestId,
      manifest.identity.manifestName,
      manifest.identity.manifestVersion,
      manifest.identity.manifestNamespace,
      manifest.identity.status,
      "intakeOrchestrationManifest.ts",
      5,
    ),
    composition(
      "platform",
      "NEA-7:6/IntakeOrchestrationPlatform",
      "Intake Orchestration Platform",
      "1.0.0",
      "nexora.nea.intake-orchestration.platform",
      "Platform",
      "intakeOrchestrationPlatform.ts",
      6,
    ),
  ]);

/**
 * Canonical immutable Intake Orchestration Platform namespace.
 * Six sections by reference only.
 */
export const IntakeOrchestrationPlatformNamespaceObject = Object.freeze({
  namespaceId: "NEA-7:6/IntakeOrchestrationPlatformNamespace",
  sourcePhase: "NEA-7:6" as const,
  manifestId: IntakeOrchestrationManifestId,
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
  composition: IntakeOrchestrationPlatformPhaseCompositionCatalog,
  composedPhaseCount: IntakeOrchestrationPlatformPhaseCompositionCatalog.length,
  reconstructsUpstream: false as const,
  duplicatesArchitecture: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
