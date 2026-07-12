import type { ResourcePlatformFreezeCompatibilityEntry } from "./resourcePlatformFreezeTypes.ts";

export const ResourcePlatformFreezeCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-1 Public Platform",
    freezeStatus: "Frozen",
    description: "OPS-1 public platform compatibility is frozen at the resource public API boundary.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Executive Dashboard",
    freezeStatus: "Frozen",
    description: "Resource compatibility is frozen for stable dashboard integration.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Future OPS Phases",
    freezeStatus: "Frozen",
    description: "Future OPS phases must consume the frozen resource platform through public APIs only.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeCompatibilityEntry),
] as const);

export const ResourcePlatformTaskCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-2 Task Intelligence",
    freezeStatus: "Frozen",
    description: "OPS-2 task compatibility is frozen for resource task linkage consumers.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Task Metadata Consumers",
    freezeStatus: "Frozen",
    description: "Task compatibility remains frozen via readonly task support and readiness metadata.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeCompatibilityEntry),
] as const);

export const ResourcePlatformWorkflowCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-3 Workflow Intelligence",
    freezeStatus: "Frozen",
    description: "OPS-3 workflow compatibility is frozen for resource workflow linkage consumers.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Workflow Metadata Consumers",
    freezeStatus: "Frozen",
    description: "Workflow compatibility remains frozen via readonly workflow readiness and coordination metadata.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeCompatibilityEntry),
] as const);

export const ResourcePlatformProjectCompatibility = Object.freeze([
  Object.freeze({
    target: "OPS-4 Project Execution",
    freezeStatus: "Frozen",
    description: "OPS-4 project compatibility is frozen for resource project linkage consumers.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeCompatibilityEntry),
  Object.freeze({
    target: "Project Metadata Consumers",
    freezeStatus: "Frozen",
    description: "Project compatibility remains frozen via readonly project readiness and support metadata.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformFreezeCompatibilityEntry),
] as const);

export const ResourcePlatformFreezeCompatibilityMetadata = Object.freeze({
  freezeCompatibilityId: "ops.resource.platform-freeze-compatibility",
  freezeCompatibilityVersion: "1.0.0",
  compatibilityCount:
    ResourcePlatformFreezeCompatibility.length +
    ResourcePlatformTaskCompatibility.length +
    ResourcePlatformWorkflowCompatibility.length +
    ResourcePlatformProjectCompatibility.length,
  metadataOnly: true,
  immutable: true,
} as const);
