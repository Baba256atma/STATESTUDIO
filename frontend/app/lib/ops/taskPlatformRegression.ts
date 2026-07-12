import type { TaskPlatformRegressionEntry } from "./taskPlatformFreezeTypes.ts";

export const TaskPlatformRegressionMetadata = Object.freeze([
  Object.freeze({
    id: "task-reg-foundation-stability",
    scope: "Foundation",
    stabilityStatus: "Stable",
    description: "Task foundation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies TaskPlatformRegressionEntry),
  Object.freeze({
    id: "task-reg-registry-stability",
    scope: "Registry",
    stabilityStatus: "Stable",
    description: "Task registry and metadata public surfaces remain stable.",
    metadataOnly: true,
  } as const satisfies TaskPlatformRegressionEntry),
  Object.freeze({
    id: "task-reg-model-stability",
    scope: "Model",
    stabilityStatus: "Stable",
    description: "Task model public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies TaskPlatformRegressionEntry),
  Object.freeze({
    id: "task-reg-validation-stability",
    scope: "Validation",
    stabilityStatus: "Stable",
    description: "Task validation public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies TaskPlatformRegressionEntry),
  Object.freeze({
    id: "task-reg-manifest-stability",
    scope: "Manifest",
    stabilityStatus: "Stable",
    description: "Task manifest public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies TaskPlatformRegressionEntry),
  Object.freeze({
    id: "task-reg-platform-index-stability",
    scope: "Platform Index",
    stabilityStatus: "Stable",
    description: "Task platform index public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies TaskPlatformRegressionEntry),
  Object.freeze({
    id: "task-reg-certification-stability",
    scope: "Certification",
    stabilityStatus: "Stable",
    description: "Task certification public architecture remains stable.",
    metadataOnly: true,
  } as const satisfies TaskPlatformRegressionEntry),
  Object.freeze({
    id: "task-reg-public-api-stability",
    scope: "Public API",
    stabilityStatus: "Stable",
    description: "Task public API surface remains stable and frozen.",
    metadataOnly: true,
  } as const satisfies TaskPlatformRegressionEntry),
] as const);

export const TaskPlatformRegressionMetadataSummary = Object.freeze({
  regressionId: "ops.task.platform-regression",
  regressionVersion: "1.0.0",
  regressionCount: TaskPlatformRegressionMetadata.length,
  metadataOnly: true,
  immutable: true,
} as const);
