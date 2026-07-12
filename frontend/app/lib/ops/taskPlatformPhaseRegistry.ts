import { TaskPlatformMetadata } from "./taskMetadataIndex.ts";
import type { TaskPlatformPhaseEntry } from "./taskPlatformManifestTypes.ts";

export const TaskPlatformPhaseRegistry = Object.freeze([
  Object.freeze({
    phaseId: "OPS-2:1",
    phaseName: "Task Intelligence Foundation",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./taskIntelligenceIndex.ts",
    metadataOnly: true,
  } as const satisfies TaskPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-2:2",
    phaseName: "Task Registry & Metadata",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./taskMetadataIndex.ts",
    metadataOnly: true,
  } as const satisfies TaskPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-2:3",
    phaseName: "Task Model",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./taskModelIndex.ts",
    metadataOnly: true,
  } as const satisfies TaskPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-2:4",
    phaseName: "Task Validation Layer",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./taskValidationIndex.ts",
    metadataOnly: true,
  } as const satisfies TaskPlatformPhaseEntry),
] as const);

export const TaskPlatformPhaseRegistryMetadata = Object.freeze({
  registryId: "ops.task-intelligence.platform-phase-registry",
  registryVersion: TaskPlatformMetadata.compatibilityVersion,
  phaseCount: TaskPlatformPhaseRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
