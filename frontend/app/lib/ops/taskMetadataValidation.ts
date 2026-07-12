import { ExecutiveTaskIntelligenceFoundation } from "./taskIntelligenceIndex.ts";
import {
  TaskCapabilityRegistry,
  TaskCapabilityRegistryMetadata,
} from "./taskCapabilityRegistry.ts";
import {
  TaskConsumerRegistry,
  TaskConsumerRegistryMetadata,
} from "./taskConsumerRegistry.ts";
import {
  TaskDependencyRegistry,
  TaskDependencyRegistryMetadata,
} from "./taskDependencyRegistry.ts";
import {
  TaskPlatformMetadata,
  TaskSupportedDomains,
} from "./taskMetadata.ts";
import { buildTaskMetadataManifest } from "./taskMetadataManifest.ts";
import {
  TaskPublicApiRegistry,
  TaskPublicApiRegistryMetadata,
} from "./taskPublicApiRegistry.ts";

const buildChecks = () =>
  Object.freeze([
    Object.freeze({
      id: "task-metadata-completeness",
      name: "Metadata Completeness",
      status:
        TaskPlatformMetadata.supportedTaskDomains.length === 8 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "task-registry-integrity",
      name: "Registry Integrity",
      status:
        TaskCapabilityRegistry.length === TaskCapabilityRegistryMetadata.capabilityCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-dependency-consistency",
      name: "Dependency Consistency",
      status:
        TaskDependencyRegistry.length === TaskDependencyRegistryMetadata.dependencyCount &&
        TaskDependencyRegistry.every(
          (entry) => entry.dependencyMode === "MetadataOnly",
        )
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-consumer-registry-integrity",
      name: "Consumer Registry Integrity",
      status:
        TaskConsumerRegistry.length === TaskConsumerRegistryMetadata.consumerCount
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-public-api-registry-integrity",
      name: "Public API Registry Integrity",
      status:
        TaskPublicApiRegistry.length === TaskPublicApiRegistryMetadata.exportedApiCount &&
        TaskPublicApiRegistry.length >= 9
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-manifest-generation",
      name: "Manifest Generation",
      status:
        Object.isFrozen(buildTaskMetadataManifest()) &&
        buildTaskMetadataManifest().metadata.supportedTaskDomains.length ===
          TaskSupportedDomains.length
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "task-immutable-exports",
      name: "Immutable Exports",
      status:
        Object.isFrozen(ExecutiveTaskIntelligenceFoundation) &&
        Object.isFrozen(TaskPlatformMetadata) &&
        Object.isFrozen(TaskCapabilityRegistry) &&
        Object.isFrozen(TaskPublicApiRegistry)
          ? "PASS"
          : "FAIL",
    }),
  ] as const);

export const validateTaskMetadata = () => {
  const checks = buildChecks();
  const passed = checks.filter((check) => check.status === "PASS").length;
  const failed = checks.length - passed;

  return Object.freeze({
    checks,
    summary: Object.freeze({
      total: checks.length,
      passed,
      failed,
      status: failed === 0 ? "PASS" : "FAIL",
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);
};
