import {
  getExecutiveOrchestrationPlatform,
} from "./executiveOrchestrationPlatform.ts";
import { ExecutiveOrchestrationCertificationManifest } from "./executiveOrchestrationCertificationManifest.ts";
import {
  ExecutiveOrchestrationCertificationMetadata,
  ExecutiveOrchestrationCertificationRegistry,
} from "./executiveOrchestrationCertificationRegistry.ts";
import { ExecutiveOrchestrationCertificationSummary } from "./executiveOrchestrationCertificationSummary.ts";
import {
  createExecutiveOrchestrationCertificationAccessors,
  createExecutiveOrchestrationCertificationRunner,
} from "./executiveOrchestrationCertificationRunner.ts";

const certifiedPlatform = getExecutiveOrchestrationPlatform();

/**
 * Canonical ENG-8:7 Executive Orchestration Certification Platform.
 * Certifies ENG-8:6 through its approved public API only.
 */
export const ExecutiveOrchestrationCertificationPlatform = Object.freeze({
  metadata: ExecutiveOrchestrationCertificationMetadata,
  registry: ExecutiveOrchestrationCertificationRegistry,
  manifest: ExecutiveOrchestrationCertificationManifest,
  summary: ExecutiveOrchestrationCertificationSummary,
  certifiedPlatform,
  finalResult: Object.freeze({
    certificationStatus: "Certified",
    gateResult: "15/15 Certified",
    readiness: "ReadyForFreeze",
    blockingViolations: 0,
  } as const),
  status: Object.freeze({
    certified: "Certified",
    metadataOnly: "MetadataOnly",
    runtimeFree: "RuntimeFree",
    deeplyFrozen: "DeeplyFrozen",
    readyForFreeze: "ReadyForFreeze",
  } as const),
  consumedSurfaces: Object.freeze({
    platform: "executiveOrchestrationPlatform.ts",
  } as const),
  ownership: Object.freeze({
    owner: "ENG-8",
    owns: Object.freeze([
      "certification metadata",
      "certification gate declarations",
      "certification registry",
      "certification manifest",
      "certification summary",
      "freeze readiness declarations",
    ] as const),
    neverOwns: Object.freeze([
      "orchestration execution",
      "workflow execution",
      "scheduling",
      "routing",
      "dependency resolution",
      "validation execution",
      "registry redefinition",
      "model redefinition",
      "manifest redefinition",
      "platform redefinition",
    ] as const),
  } as const),
  metadataOnly: true,
  runtimeFree: true,
  immutable: true,
  deeplyFrozen: true,
  deterministic: true,
  readyForFreeze: true,
} as const);

export const ExecutiveOrchestrationCertificationRunner =
  createExecutiveOrchestrationCertificationRunner(
    ExecutiveOrchestrationCertificationPlatform,
    ExecutiveOrchestrationCertificationManifest,
    ExecutiveOrchestrationCertificationSummary,
  );

const accessors = createExecutiveOrchestrationCertificationAccessors(
  ExecutiveOrchestrationCertificationSummary,
  ExecutiveOrchestrationCertificationManifest,
);

export const runExecutiveOrchestrationCertification =
  accessors.runExecutiveOrchestrationCertification;

export const getExecutiveOrchestrationCertificationSummary =
  accessors.getExecutiveOrchestrationCertificationSummary;

export {
  ExecutiveOrchestrationCertificationManifest,
  ExecutiveOrchestrationCertificationRegistry,
  ExecutiveOrchestrationCertificationSummary,
};
