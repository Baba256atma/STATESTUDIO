import {
  getExecutiveOrchestrationManifestPlatform,
} from "./executiveOrchestrationManifestPlatform.ts";
import {
  getExecutiveOrchestrationRegistryPlatform,
} from "./executiveOrchestrationRegistryPlatform.ts";
import {
  getExecutiveOrchestrationModelPlatform,
} from "./executiveOrchestrationModelPlatform.ts";
import {
  getExecutiveOrchestrationValidationSummary,
} from "./executiveOrchestrationValidationRunner.ts";
import type {
  ExecutiveOrchestrationPlatformSummary as ExecutiveOrchestrationPlatformSummaryDescriptor,
} from "./executiveOrchestrationPlatformTypes.ts";

const registryPlatform = getExecutiveOrchestrationRegistryPlatform();
const modelPlatform = getExecutiveOrchestrationModelPlatform();
const validationSummary = getExecutiveOrchestrationValidationSummary();
const manifestPlatform = getExecutiveOrchestrationManifestPlatform();

/**
 * Immutable platform summary aggregating prior phase metadata.
 */
export const ExecutiveOrchestrationPlatformSummary = Object.freeze({
  platformId: "ENG-8:6",
  phase: "ENG-8:6",
  namespace: "nexora.engine.executive.orchestration.platform",
  owner: "ENG-8",
  sectionCount: 5,
  registryComponentCount: registryPlatform.inventory.componentCount,
  coordinationTargetCount: registryPlatform.inventory.coordinationTargetCount,
  modelCount: modelPlatform.modelRegistry.entries.length,
  validationRuleCount: validationSummary.totalRules,
  dependencyCount: manifestPlatform.summary.dependencyCount,
  responsibilityCount: registryPlatform.inventory.responsibilityCount,
  manifestReadiness: "ReadyForPlatform",
  platformReadiness: "ReadyForCertification",
  status: "Stable",
  architectureMode: "MetadataOnly",
  immutability: "DeeplyFrozen",
  validationStatus: validationSummary.validationStatus,
  manifestStatus: "ManifestComplete",
  nextPhase: "ENG-8:7",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationPlatformSummaryDescriptor);
