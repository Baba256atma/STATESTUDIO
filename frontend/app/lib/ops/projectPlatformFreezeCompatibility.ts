import type { ProjectPlatformFreezeCompatibilityEntry } from "./projectPlatformFreezeTypes.ts";

export const ProjectPlatformFreezeCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Public Platform",
    freezeStatus: "Frozen",
    description: "OPS-1 public platform compatibility is frozen at the project public API boundary.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Executive Dashboard",
    freezeStatus: "Frozen",
    description: "Project execution compatibility is frozen for stable dashboard integration.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    freezeStatus: "Frozen",
    description: "Future OPS phases must consume the frozen project platform through public APIs only.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformFreezeCompatibilityEntry),
] as const);

export const ProjectPlatformTaskCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-2 Task Intelligence",
    freezeStatus: "Frozen",
    description: "OPS-2 task compatibility is frozen for project task-reference consumers.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Task Metadata Consumers",
    freezeStatus: "Frozen",
    description: "Task compatibility remains frozen via readonly task grouping and dependency metadata.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformFreezeCompatibilityEntry),
] as const);

export const ProjectPlatformWorkflowCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-3 Workflow Intelligence",
    freezeStatus: "Frozen",
    description: "OPS-3 workflow compatibility is frozen for project workflow-reference consumers.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Workflow Metadata Consumers",
    freezeStatus: "Frozen",
    description: "Workflow compatibility remains frozen via readonly workflow grouping and compatibility metadata.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformFreezeCompatibilityEntry),
] as const);

export const ProjectPlatformFreezeCompatibilityMetadata = Object.freeze({
  freezeCompatibilityId: "ops.project.platform-freeze-compatibility",
  freezeCompatibilityVersion: "1.0.0",
  compatibilityCount:
    ProjectPlatformFreezeCompatibility.length +
    ProjectPlatformTaskCompatibility.length +
    ProjectPlatformWorkflowCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);

