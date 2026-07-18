import {
  ExecutiveOrchestrationCertificationPlatform,
  getExecutiveOrchestrationCertificationSummary,
} from "./executiveOrchestrationCertificationPlatform.ts";
import { ExecutiveOrchestrationFreezeCompatibility } from "./executiveOrchestrationFreezeCompatibility.ts";
import { ExecutiveOrchestrationFreezeLocks } from "./executiveOrchestrationFreezeLocks.ts";
import {
  ExecutiveOrchestrationFreezeManifest,
  ExecutiveOrchestrationFreezeMetadata,
  ExecutiveOrchestrationFreezeSummary,
} from "./executiveOrchestrationFreezeManifest.ts";
import { ExecutiveOrchestrationFreezeRegistry } from "./executiveOrchestrationFreezeRegistry.ts";
import {
  createExecutiveOrchestrationFreezeAccessors,
  createExecutiveOrchestrationFreezeRunner,
} from "./executiveOrchestrationFreezeRunner.ts";

const release = Object.freeze({
  freezeId: "ENG-8:8",
  certificationId: "ENG-8:7",
  status: "Frozen",
  certificationStatus: "Certified",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  runtimeBehavior: "None",
  readiness: "ReadyForPublicIndex",
  nextPhase: "ENG-8:9",
  certifiedGateCount:
    getExecutiveOrchestrationCertificationSummary().certifiedGateCount,
  frozenDomainCount: 8,
  declarations: Object.freeze([
    "Frozen",
    "Certified",
    "MetadataOnly",
    "RuntimeFree",
    "DeeplyFrozen",
    "ReadyForPublicIndex",
  ] as const),
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
  deeplyFrozen: true,
} as const);

/**
 * Canonical ENG-8:8 Executive Orchestration Freeze Platform.
 * Freezes ENG-8:7 certified architecture through its approved public API only.
 */
export const ExecutiveOrchestrationFreezePlatform = Object.freeze({
  registry: ExecutiveOrchestrationFreezeRegistry,
  compatibility: ExecutiveOrchestrationFreezeCompatibility,
  locks: ExecutiveOrchestrationFreezeLocks,
  manifest: ExecutiveOrchestrationFreezeManifest,
  metadata: ExecutiveOrchestrationFreezeMetadata,
  summary: ExecutiveOrchestrationFreezeSummary,
  release,
  certifiedPlatform: ExecutiveOrchestrationCertificationPlatform,
  status: Object.freeze({
    frozen: "Frozen",
    certified: "Certified",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    deeplyFrozen: "DeeplyFrozen",
    readyForPublicIndex: "ReadyForPublicIndex",
  } as const),
  consumedSurfaces: Object.freeze({
    certification: "executiveOrchestrationCertificationPlatform.ts",
  } as const),
  ownership: Object.freeze({
    owner: "ENG-8",
    owns: Object.freeze([
      "freeze metadata",
      "freeze registry",
      "freeze compatibility declarations",
      "architectural locks",
      "freeze manifest",
      "public index readiness declarations",
    ] as const),
    neverOwns: Object.freeze([
      "orchestration execution",
      "workflow execution",
      "scheduling",
      "routing",
      "validation execution",
      "certification execution",
      "freeze execution",
      "architecture redefinition",
    ] as const),
  } as const),
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deeplyFrozen: true,
  deterministic: true,
  readyForPublicIndex: true,
} as const);

export const ExecutiveOrchestrationFreezeRunner =
  createExecutiveOrchestrationFreezeRunner(
    ExecutiveOrchestrationFreezePlatform,
    ExecutiveOrchestrationFreezeManifest,
    ExecutiveOrchestrationFreezeSummary,
  );

const accessors = createExecutiveOrchestrationFreezeAccessors(
  ExecutiveOrchestrationFreezeSummary,
  ExecutiveOrchestrationFreezeManifest,
);

export const runExecutiveOrchestrationFreeze =
  accessors.runExecutiveOrchestrationFreeze;

export const getExecutiveOrchestrationFreezeSummary =
  accessors.getExecutiveOrchestrationFreezeSummary;

export {
  ExecutiveOrchestrationFreezeCompatibility,
  ExecutiveOrchestrationFreezeLocks,
  ExecutiveOrchestrationFreezeManifest,
  ExecutiveOrchestrationFreezeRegistry,
};
