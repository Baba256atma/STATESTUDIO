import {
  TaskCapabilityRegistry,
  TaskConsumerRegistry,
  TaskDependencyRegistry,
  TaskPlatformMetadata,
  buildTaskMetadataManifest,
  validateTaskMetadata,
} from "./taskMetadataIndex.ts";
import type { TaskValidationEntry } from "./taskValidationTypes.ts";

export const TaskRegistryValidation = Object.freeze([
  Object.freeze({
    id: "task-registry-integrity",
    name: "Metadata Registry Integrity",
    description: "Validates OPS-2:2 task metadata registry completeness.",
    category: "Registry",
    status:
      validateTaskMetadata().summary.status === "PASS" &&
      TaskCapabilityRegistry.length === 8
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
  Object.freeze({
    id: "task-dependency-consistency",
    name: "Dependency Consistency",
    description: "Validates task dependency metadata consistency.",
    category: "Dependency",
    status:
      TaskDependencyRegistry.every(
        (entry) => entry.dependencyMode === "MetadataOnly",
      )
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
  Object.freeze({
    id: "task-consumer-compatibility",
    name: "Consumer Compatibility",
    description: "Validates task consumer registry compatibility.",
    category: "Consumer",
    status:
      TaskConsumerRegistry.length === 6 &&
      TaskPlatformMetadata.compatibilityVersion === "1.0.0"
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
  Object.freeze({
    id: "task-registry-manifest-generation",
    name: "Registry Manifest Generation",
    description: "Validates deterministic OPS-2:2 metadata manifest generation.",
    category: "Manifest",
    status:
      Object.isFrozen(buildTaskMetadataManifest()) &&
      buildTaskMetadataManifest().metadataOnly
        ? "PASS"
        : "FAIL",
    metadataOnly: true,
  } as const satisfies TaskValidationEntry),
] as const);
