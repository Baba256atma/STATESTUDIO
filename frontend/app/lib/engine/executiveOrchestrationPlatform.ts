import {
  getExecutiveOrchestrationFoundation,
} from "./executiveOrchestrationFoundation.ts";
import {
  getExecutiveOrchestrationManifestPlatform,
} from "./executiveOrchestrationManifestPlatform.ts";
import {
  getExecutiveOrchestrationModelPlatform,
} from "./executiveOrchestrationModelPlatform.ts";
import {
  getExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import {
  ExecutiveOrchestrationValidationRunner,
} from "./executiveOrchestrationValidationRunner.ts";
import { ExecutiveOrchestrationPlatformMetadata } from "./executiveOrchestrationPlatformMetadata.ts";
import { ExecutiveOrchestrationPlatformRegistry } from "./executiveOrchestrationPlatformRegistry.ts";
import { ExecutiveOrchestrationPlatformSummary } from "./executiveOrchestrationPlatformSummary.ts";
import {
  createExecutiveOrchestrationPlatformAccessors,
  createExecutiveOrchestrationPlatformRunner,
} from "./executiveOrchestrationPlatformRunner.ts";

const releaseMetadata = Object.freeze({
  platformId: "ENG-8:6",
  phase: "ENG-8:6",
  namespace: "nexora.engine.executive.orchestration.platform",
  owner: "ENG-8",
  visibility: "ReadyForCertification",
  nextPhase: "ENG-8:7",
  previousPhase: "ENG-8:5",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  declarations: Object.freeze([
    "FoundationAssembled",
    "RegistryAssembled",
    "ModelAssembled",
    "ValidationAssembled",
    "ManifestAssembled",
    "PlatformAssembled",
    "ReadyForCertification",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);

/**
 * Canonical ENG-8:6 Executive Orchestration Platform.
 * Aggregates ENG-8:1 through ENG-8:5 through approved public APIs only.
 */
export const ExecutiveOrchestrationPlatform = Object.freeze({
  foundation: getExecutiveOrchestrationFoundation(),
  registry: getExecutiveOrchestrationRegistryPlatform(),
  model: getExecutiveOrchestrationModelPlatform(),
  validation: ExecutiveOrchestrationValidationRunner,
  manifest: getExecutiveOrchestrationManifestPlatform(),
  metadata: ExecutiveOrchestrationPlatformMetadata,
  registryMetadata: ExecutiveOrchestrationPlatformRegistry,
  summary: ExecutiveOrchestrationPlatformSummary,
  releaseMetadata,
  status: Object.freeze({
    stable: "Stable",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    deeplyFrozen: "DeeplyFrozen",
    readyForCertification: "ReadyForCertification",
  } as const),
  consumedSurfaces: Object.freeze({
    foundation: "executiveOrchestrationFoundation.ts",
    registry: "executiveOrchestrationRegistryPlatform.ts",
    model: "executiveOrchestrationModelPlatform.ts",
    validation: "executiveOrchestrationValidationRunner.ts",
    manifest: "executiveOrchestrationManifestPlatform.ts",
  } as const),
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deeplyFrozen: true,
  deterministic: true,
  readyForCertification: true,
} as const);

export const ExecutiveOrchestrationPlatformRunner =
  createExecutiveOrchestrationPlatformRunner(ExecutiveOrchestrationPlatform);

const accessors = createExecutiveOrchestrationPlatformAccessors(
  ExecutiveOrchestrationPlatform,
);

export const getExecutiveOrchestrationPlatform =
  accessors.getExecutiveOrchestrationPlatform;

export const getExecutiveOrchestrationPlatformSummary =
  accessors.getExecutiveOrchestrationPlatformSummary;

export {
  ExecutiveOrchestrationPlatformMetadata,
  ExecutiveOrchestrationPlatformRegistry,
  ExecutiveOrchestrationPlatformSummary,
};
