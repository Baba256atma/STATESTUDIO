import { ExecutionPlatformMetadata } from "./executionMetadataIndex.ts";
import type { ExecutionPlatformPhaseEntry } from "./executionPlatformManifestTypes.ts";

export const ExecutionPlatformPhaseRegistry = Object.freeze([
  Object.freeze({
    phaseId: "OPS-1:1",
    phaseName: "Execution Foundation",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./executionIndex.ts",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-1:2",
    phaseName: "Execution Registry & Metadata",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./executionMetadataIndex.ts",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-1:3",
    phaseName: "Execution Model",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./executionModelIndex.ts",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-1:4",
    phaseName: "Execution Validation Layer",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./executionValidationIndex.ts",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformPhaseEntry),
] as const);

export const ExecutionPlatformPhaseRegistryMetadata = Object.freeze({
  registryId: "ops.execution.platform-phase-registry",
  registryVersion: ExecutionPlatformMetadata.compatibilityVersion,
  phaseCount: ExecutionPlatformPhaseRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
