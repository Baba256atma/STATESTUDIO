import { SchedulingPlatformMetadata } from "./schedulingMetadataIndex.ts";
import type { SchedulingPlatformDependencyEntry } from "./schedulingPlatformManifestTypes.ts";

export const SchedulingPlatformDependencyMap = Object.freeze([
  Object.freeze({
    sourcePhaseId: "OPS-6:2",
    targetPhaseId: "OPS-6:1",
    dependencyType: "PublicApi",
    relationship: "Extends scheduling foundation through public exports.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6:3",
    targetPhaseId: "OPS-6:1",
    dependencyType: "PublicApi",
    relationship: "Consumes scheduling foundation through public exports.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6:3",
    targetPhaseId: "OPS-6:2",
    dependencyType: "PublicApi",
    relationship: "Consumes scheduling metadata registries through public exports.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6:4",
    targetPhaseId: "OPS-6:1",
    dependencyType: "PublicApi",
    relationship: "Validates scheduling foundation through public exports.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6:4",
    targetPhaseId: "OPS-6:2",
    dependencyType: "PublicApi",
    relationship: "Validates scheduling registry and metadata through public exports.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6:4",
    targetPhaseId: "OPS-6:3",
    dependencyType: "PublicApi",
    relationship: "Validates scheduling model through public exports.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6",
    targetPhaseId: "OPS-1",
    dependencyType: "PublicApi",
    relationship: "Scheduling platform depends on Executive Operations public foundation.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6",
    targetPhaseId: "OPS-2",
    dependencyType: "PublicApi",
    relationship: "Scheduling platform depends on Task Intelligence public platform.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6",
    targetPhaseId: "OPS-3",
    dependencyType: "PublicApi",
    relationship: "Scheduling platform depends on Workflow Intelligence public platform.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6",
    targetPhaseId: "OPS-4",
    dependencyType: "PublicApi",
    relationship: "Scheduling platform depends on Project Execution public platform.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6",
    targetPhaseId: "OPS-5",
    dependencyType: "PublicApi",
    relationship: "Scheduling platform depends on Resource Intelligence public platform.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-6",
    targetPhaseId: "OPS-7",
    dependencyType: "PublicApi",
    relationship: "Scheduling platform publishes metadata for future OPS-7 consumption.",
    metadataOnly: true,
  } as const satisfies SchedulingPlatformDependencyEntry),
] as const);

export const SchedulingPlatformDependencyMapMetadata = Object.freeze({
  dependencyMapId: "ops.scheduling-intelligence.platform-dependency-map",
  dependencyMapVersion: SchedulingPlatformMetadata.compatibilityVersion,
  dependencyCount: SchedulingPlatformDependencyMap.length,
  metadataOnly: true,
  immutable: true,
} as const);
