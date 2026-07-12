import { TaskPlatformMetadata } from "./taskMetadataIndex.ts";
import type { TaskPlatformDependencyEntry } from "./taskPlatformManifestTypes.ts";

export const TaskPlatformDependencyMap = Object.freeze([
  Object.freeze({
    sourcePhaseId: "OPS-2:2",
    targetPhaseId: "OPS-2:1",
    dependencyType: "PublicApi",
    relationship: "Extends task foundation through public exports.",
    metadataOnly: true,
  } as const satisfies TaskPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-2:3",
    targetPhaseId: "OPS-2:1",
    dependencyType: "PublicApi",
    relationship: "Consumes task foundation through public exports.",
    metadataOnly: true,
  } as const satisfies TaskPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-2:3",
    targetPhaseId: "OPS-2:2",
    dependencyType: "PublicApi",
    relationship: "Consumes task metadata registries through public exports.",
    metadataOnly: true,
  } as const satisfies TaskPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-2:4",
    targetPhaseId: "OPS-2:1",
    dependencyType: "PublicApi",
    relationship: "Validates task foundation through public exports.",
    metadataOnly: true,
  } as const satisfies TaskPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-2:4",
    targetPhaseId: "OPS-2:2",
    dependencyType: "PublicApi",
    relationship: "Validates task registry and metadata through public exports.",
    metadataOnly: true,
  } as const satisfies TaskPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-2:4",
    targetPhaseId: "OPS-2:3",
    dependencyType: "PublicApi",
    relationship: "Validates task model through public exports.",
    metadataOnly: true,
  } as const satisfies TaskPlatformDependencyEntry),
] as const);

export const TaskPlatformDependencyMapMetadata = Object.freeze({
  dependencyMapId: "ops.task-intelligence.platform-dependency-map",
  dependencyMapVersion: TaskPlatformMetadata.compatibilityVersion,
  dependencyCount: TaskPlatformDependencyMap.length,
  metadataOnly: true,
  immutable: true,
} as const);
