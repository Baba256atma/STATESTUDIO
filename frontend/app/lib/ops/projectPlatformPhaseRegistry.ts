import { ProjectPlatformMetadata } from "./projectMetadataIndex.ts";
import type { ProjectPlatformPhaseEntry } from "./projectPlatformManifestTypes.ts";

export const ProjectPlatformPhaseRegistry = Object.freeze([
  Object.freeze({
    phaseId: "OPS-4:1",
    phaseName: "Project Execution Foundation",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./projectExecutionIndex.ts",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-4:2",
    phaseName: "Project Registry & Metadata",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./projectMetadataIndex.ts",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-4:3",
    phaseName: "Project Model",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./projectModelIndex.ts",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-4:4",
    phaseName: "Project Validation Layer",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./projectValidationIndex.ts",
    metadataOnly: true,
  } as const satisfies ProjectPlatformPhaseEntry),
] as const);

export const ProjectPlatformPhaseRegistryMetadata = Object.freeze({
  registryId: "ops.project-execution.platform-phase-registry",
  registryVersion: ProjectPlatformMetadata.compatibilityVersion,
  phaseCount: ProjectPlatformPhaseRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);

