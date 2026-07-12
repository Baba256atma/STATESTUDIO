import { ExecutionPlatformMetadata } from "./executionMetadataIndex.ts";
import type { ExecutionPlatformDependencyEntry } from "./executionPlatformManifestTypes.ts";

export const ExecutionPlatformDependencyMap = Object.freeze([
  Object.freeze({
    sourcePhaseId: "OPS-1:2",
    targetPhaseId: "OPS-1:1",
    dependencyType: "PublicApi",
    relationship: "Extends execution foundation through public exports.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-1:3",
    targetPhaseId: "OPS-1:1",
    dependencyType: "PublicApi",
    relationship: "Consumes execution foundation through public exports.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-1:3",
    targetPhaseId: "OPS-1:2",
    dependencyType: "PublicApi",
    relationship: "Consumes registry and metadata through public exports.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-1:4",
    targetPhaseId: "OPS-1:1",
    dependencyType: "PublicApi",
    relationship: "Validates foundation through public exports.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-1:4",
    targetPhaseId: "OPS-1:2",
    dependencyType: "PublicApi",
    relationship: "Validates registry and metadata through public exports.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-1:4",
    targetPhaseId: "OPS-1:3",
    dependencyType: "PublicApi",
    relationship: "Validates execution model through public exports.",
    metadataOnly: true,
  } as const satisfies ExecutionPlatformDependencyEntry),
] as const);

export const ExecutionPlatformDependencyMapMetadata = Object.freeze({
  dependencyMapId: "ops.execution.platform-dependency-map",
  dependencyMapVersion: ExecutionPlatformMetadata.compatibilityVersion,
  dependencyCount: ExecutionPlatformDependencyMap.length,
  metadataOnly: true,
  immutable: true,
} as const);
