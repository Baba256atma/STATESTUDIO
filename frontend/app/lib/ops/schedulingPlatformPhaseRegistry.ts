import { SchedulingPlatformMetadata } from "./schedulingMetadataIndex.ts";
import type { SchedulingPlatformPhaseEntry } from "./schedulingPlatformManifestTypes.ts";

export const SchedulingPlatformPhaseRegistry = Object.freeze([
  Object.freeze({
    phaseId: "OPS-6:1",
    phaseName: "Scheduling Intelligence Foundation",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./schedulingIntelligenceIndex.ts",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-6:2",
    phaseName: "Scheduling Registry & Metadata",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./schedulingMetadataIndex.ts",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-6:3",
    phaseName: "Scheduling Model",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./schedulingModelIndex.ts",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-6:4",
    phaseName: "Scheduling Validation Layer",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./schedulingValidationIndex.ts",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformPhaseEntry),
] as const);

export const SchedulingPlatformPhaseRegistryMetadata = Object.freeze({
  registryId: "ops.scheduling-intelligence.platform-phase-registry",
  registryVersion: SchedulingPlatformMetadata.compatibilityVersion,
  phaseCount: SchedulingPlatformPhaseRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
