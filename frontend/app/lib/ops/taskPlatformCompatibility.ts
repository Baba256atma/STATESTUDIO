import type { TaskPlatformCompatibilityEntry } from "./taskPlatformCertificationTypes.ts";

export const TaskPlatformCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Public Platform",
    compatibilityStatus: "Compatible",
    description: "Compatible with the certified Executive Operations public platform.",
    metadataOnly: true,
  } as const satisfies TaskPlatformCompatibilityEntry),
  Object.freeze({
    target: "Workflow Intelligence",
    compatibilityStatus: "Compatible",
    description: "Compatible with future workflow intelligence consumers through public task APIs.",
    metadataOnly: true,
  } as const satisfies TaskPlatformCompatibilityEntry),
  Object.freeze({
    target: "Project Execution",
    compatibilityStatus: "Compatible",
    description: "Compatible with project execution layers that consume task metadata only.",
    metadataOnly: true,
  } as const satisfies TaskPlatformCompatibilityEntry),
  Object.freeze({
    target: "Scheduling Intelligence",
    compatibilityStatus: "Compatible",
    description: "Compatible with scheduling intelligence via readonly dependency and readiness metadata.",
    metadataOnly: true,
  } as const satisfies TaskPlatformCompatibilityEntry),
  Object.freeze({
    target: "Executive Dashboard",
    compatibilityStatus: "Compatible",
    description: "Compatible with dashboard consumers that read stable public task metadata.",
    metadataOnly: true,
  } as const satisfies TaskPlatformCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    compatibilityStatus: "Compatible",
    description: "Compatible with future OPS phases extending the certified task platform.",
    metadataOnly: true,
  } as const satisfies TaskPlatformCompatibilityEntry),
] as const);

export const TaskPlatformCompatibilityMetadata = Object.freeze({
  compatibilityMatrixId: "ops.task.platform-compatibility",
  compatibilityVersion: "1.0.0",
  compatibilityCount: TaskPlatformCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);
