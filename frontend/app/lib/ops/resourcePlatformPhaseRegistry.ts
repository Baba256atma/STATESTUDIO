import { ResourcePlatformMetadata } from "./resourceMetadataIndex.ts";
import type { ResourcePlatformPhaseEntry } from "./resourcePlatformManifestTypes.ts";

export const ResourcePlatformPhaseRegistry = Object.freeze([
  Object.freeze({
    phaseId: "OPS-5:1",
    phaseName: "Resource Intelligence Foundation",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./resourceIntelligenceIndex.ts",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-5:2",
    phaseName: "Resource Registry & Metadata",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./resourceMetadataIndex.ts",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-5:3",
    phaseName: "Resource Model",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./resourceModelIndex.ts",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPhaseEntry),
  Object.freeze({
    phaseId: "OPS-5:4",
    phaseName: "Resource Validation Layer",
    phaseVersion: "1.0.0",
    phaseStatus: "PASS",
    publicEntryPoint: "./resourceValidationIndex.ts",
    metadataOnly: true,
  } as const satisfies ResourcePlatformPhaseEntry),
] as const);

export const ResourcePlatformPhaseRegistryMetadata = Object.freeze({
  registryId: "ops.resource-intelligence.platform-phase-registry",
  registryVersion: ResourcePlatformMetadata.compatibilityVersion,
  phaseCount: ResourcePlatformPhaseRegistry.length,
  metadataOnly: true,
  immutable: true,
} as const);
