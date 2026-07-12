import type { ExecutiveSchedulingPlatformFreezeCompatibilityEntry } from "./executiveSchedulingPlatformFreezeTypes.ts";

export const ExecutiveSchedulingPlatformFreezeCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Public Platform",
    freezeStatus: "Frozen",
    description: "OPS-1 public platform compatibility is frozen at the scheduling public API boundary.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Executive Scheduling Platform",
    freezeStatus: "Frozen",
    description: "Scheduling platform compatibility is frozen for stable metadata-only consumption.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    freezeStatus: "Frozen",
    description: "Future OPS phases must consume the frozen scheduling platform through public APIs only.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
] as const);

export const ExecutiveSchedulingPlatformTaskCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-2 Task Platform",
    freezeStatus: "Frozen",
    description: "OPS-2 task compatibility is frozen for scheduling task linkage consumers.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Task Metadata Consumers",
    freezeStatus: "Frozen",
    description: "Task compatibility remains frozen via readonly schedule task-link metadata.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
] as const);

export const ExecutiveSchedulingPlatformWorkflowCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-3 Workflow Platform",
    freezeStatus: "Frozen",
    description: "OPS-3 workflow compatibility is frozen for scheduling workflow linkage consumers.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Workflow Metadata Consumers",
    freezeStatus: "Frozen",
    description: "Workflow compatibility remains frozen via readonly schedule workflow-link metadata.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
] as const);

export const ExecutiveSchedulingPlatformProjectCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-4 Project Platform",
    freezeStatus: "Frozen",
    description: "OPS-4 project compatibility is frozen for scheduling project linkage consumers.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Project Metadata Consumers",
    freezeStatus: "Frozen",
    description: "Project compatibility remains frozen via readonly schedule project-link metadata.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
] as const);

export const ExecutiveSchedulingPlatformResourceCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-5 Resource Platform",
    freezeStatus: "Frozen",
    description: "OPS-5 resource compatibility is frozen for scheduling resource linkage consumers.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Resource Metadata Consumers",
    freezeStatus: "Frozen",
    description: "Resource compatibility remains frozen via readonly schedule resource-link metadata.",
    metadataOnly: true,
  } as const satisfies ExecutiveSchedulingPlatformFreezeCompatibilityEntry),
] as const);

export const ExecutiveSchedulingPlatformFreezeCompatibilityMetadata = Object.freeze({
  freezeCompatibilityId: "ops.executive-scheduling.platform-freeze-compatibility",
  freezeCompatibilityVersion: "1.0.0",
  compatibilityCount:
    ExecutiveSchedulingPlatformFreezeCompatibility.length +
    ExecutiveSchedulingPlatformTaskCompatibility.length +
    ExecutiveSchedulingPlatformWorkflowCompatibility.length +
    ExecutiveSchedulingPlatformProjectCompatibility.length +
    ExecutiveSchedulingPlatformResourceCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);
