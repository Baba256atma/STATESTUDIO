import type { TaskPlatformFreezeCompatibilityEntry } from "./taskPlatformFreezeTypes.ts";

export const TaskPlatformFreezeCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Public Platform",
    freezeStatus: "Frozen",
    description: "OPS-1 public platform compatibility is frozen at the task public API boundary.",
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Workflow Intelligence",
    freezeStatus: "Frozen",
    description: "Workflow intelligence compatibility is frozen for task metadata consumers.",
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Project Execution",
    freezeStatus: "Frozen",
    description: "Project execution compatibility is frozen for stable task integration.",
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Scheduling Intelligence",
    freezeStatus: "Frozen",
    description: "Scheduling intelligence compatibility is frozen via readonly task descriptors.",
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Executive Dashboard",
    freezeStatus: "Frozen",
    description: "Executive dashboard compatibility is frozen for stable task visibility.",
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    freezeStatus: "Frozen",
    description: "Future OPS phases must consume the frozen task platform through public APIs only.",
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeCompatibilityEntry),
] as const);

export const TaskPlatformFreezeCompatibilityMetadata = Object.freeze({
  freezeCompatibilityId: "ops.task.platform-freeze-compatibility",
  freezeCompatibilityVersion: "1.0.0",
  compatibilityCount: TaskPlatformFreezeCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);
