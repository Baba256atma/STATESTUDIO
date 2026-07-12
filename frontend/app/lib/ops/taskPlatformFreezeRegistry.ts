import type { TaskPlatformFreezeRegistryEntry } from "./taskPlatformFreezeTypes.ts";

export const TaskPlatformFreezeRegistry = Object.freeze([
  Object.freeze({
    phaseId: "OPS-2:1",
    phaseName: "Task Intelligence Foundation",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-2:2",
    phaseName: "Task Registry & Metadata",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-2:3",
    phaseName: "Task Model",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-2:4",
    phaseName: "Task Validation Layer",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-2:5",
    phaseName: "Task Manifest Layer",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-2:6",
    phaseName: "Task Platform Index",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeRegistryEntry),
  Object.freeze({
    phaseId: "OPS-2:7",
    phaseName: "Task Platform Certification",
    phaseVersion: "1.0.0",
    certificationStatus: "PASS",
    frozen: true,
    metadataOnly: true,
  } as const satisfies TaskPlatformFreezeRegistryEntry),
] as const);

export const TaskPlatformFreezeRegistryMetadata = Object.freeze({
  freezeRegistryId: "ops.task.platform-freeze-registry",
  freezeRegistryVersion: "1.0.0",
  phaseCount: TaskPlatformFreezeRegistry.length,
  freezeStatus: "Frozen",
  metadataOnly: true,
  immutable: true,
} as const);
