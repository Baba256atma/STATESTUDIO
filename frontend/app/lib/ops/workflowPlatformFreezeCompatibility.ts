import type {
  WorkflowPlatformFreezeCompatibilityEntry,
  WorkflowPlatformTaskCompatibilityEntry,
} from "./workflowPlatformFreezeTypes.ts";

export const WorkflowPlatformFreezeCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Public Platform",
    freezeStatus: "Frozen",
    description: "OPS-1 public platform compatibility is frozen at the workflow public API boundary.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Project Execution",
    freezeStatus: "Frozen",
    description: "Project execution compatibility is frozen for stable workflow integration.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Scheduling Intelligence",
    freezeStatus: "Frozen",
    description: "Scheduling intelligence compatibility is frozen via readonly workflow descriptors.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Executive Dashboard",
    freezeStatus: "Frozen",
    description: "Executive dashboard compatibility is frozen for stable workflow visibility.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    freezeStatus: "Frozen",
    description: "Future OPS phases must consume the frozen workflow platform through public APIs only.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformFreezeCompatibilityEntry),
] as const);

export const WorkflowPlatformFreezeCompatibilityMetadata = Object.freeze({
  freezeCompatibilityId: "ops.workflow.platform-freeze-compatibility",
  freezeCompatibilityVersion: "1.0.0",
  compatibilityCount: WorkflowPlatformFreezeCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);

export const WorkflowPlatformTaskCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-2 Task Intelligence Public Platform",
    compatibilityStatus: "Frozen",
    description: "OPS-2 task compatibility is frozen for stable workflow task-link and readiness metadata.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformTaskCompatibilityEntry),
  Object.freeze({
    target: "Task Model Compatibility",
    compatibilityStatus: "Frozen",
    description: "Task model compatibility metadata is frozen across workflow readiness and task-link surfaces.",
    metadataOnly: true,
  } as const satisfies WorkflowPlatformTaskCompatibilityEntry),
] as const);

export const WorkflowPlatformTaskCompatibilityMetadata = Object.freeze({
  freezeTaskCompatibilityId: "ops.workflow.platform-freeze-task-compatibility",
  freezeTaskCompatibilityVersion: "1.0.0",
  compatibilityCount: WorkflowPlatformTaskCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);
