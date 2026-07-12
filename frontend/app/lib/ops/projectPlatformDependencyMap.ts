import { ProjectPlatformMetadata } from "./projectMetadataIndex.ts";
import type { ProjectPlatformDependencyEntry } from "./projectPlatformManifestTypes.ts";

export const ProjectPlatformDependencyMap = Object.freeze([
  Object.freeze({
    sourcePhaseId: "OPS-4:2",
    targetPhaseId: "OPS-4:1",
    dependencyType: "PublicApi",
    relationship: "Extends project foundation through public exports.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-4:3",
    targetPhaseId: "OPS-4:1",
    dependencyType: "PublicApi",
    relationship: "Consumes project foundation through public exports.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-4:3",
    targetPhaseId: "OPS-4:2",
    dependencyType: "PublicApi",
    relationship: "Consumes project metadata registries through public exports.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-4:4",
    targetPhaseId: "OPS-4:1",
    dependencyType: "PublicApi",
    relationship: "Validates project foundation through public exports.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-4:4",
    targetPhaseId: "OPS-4:2",
    dependencyType: "PublicApi",
    relationship: "Validates project registry and metadata through public exports.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-4:4",
    targetPhaseId: "OPS-4:3",
    dependencyType: "PublicApi",
    relationship: "Validates project model through public exports.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-4",
    targetPhaseId: "OPS-1",
    dependencyType: "PublicApi",
    relationship: "Project platform depends on Executive Operations public foundation.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-4",
    targetPhaseId: "OPS-2",
    dependencyType: "PublicApi",
    relationship: "Project platform depends on Task Intelligence public platform.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-4",
    targetPhaseId: "OPS-3",
    dependencyType: "PublicApi",
    relationship: "Project platform depends on Workflow Intelligence public platform.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-4",
    targetPhaseId: "OPS-5",
    dependencyType: "PublicApi",
    relationship: "Project platform publishes metadata for future OPS-5 consumption.",
    metadataOnly: true,
  } as const satisfies ProjectPlatformDependencyEntry),
] as const);

export const ProjectPlatformDependencyMapMetadata = Object.freeze({
  dependencyMapId: "ops.project-execution.platform-dependency-map",
  dependencyMapVersion: ProjectPlatformMetadata.compatibilityVersion,
  dependencyCount: ProjectPlatformDependencyMap.length,
  metadataOnly: true,
  immutable: true,
} as const);

