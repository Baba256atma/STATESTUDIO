import { ResourcePlatformMetadata } from "./resourceMetadataIndex.ts";
import type { ResourcePlatformDependencyEntry } from "./resourcePlatformManifestTypes.ts";

export const ResourcePlatformDependencyMap = Object.freeze([
  Object.freeze({
    sourcePhaseId: "OPS-5:2",
    targetPhaseId: "OPS-5:1",
    dependencyType: "PublicApi",
    relationship: "Extends resource foundation through public exports.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-5:3",
    targetPhaseId: "OPS-5:1",
    dependencyType: "PublicApi",
    relationship: "Consumes resource foundation through public exports.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-5:3",
    targetPhaseId: "OPS-5:2",
    dependencyType: "PublicApi",
    relationship: "Consumes resource metadata registries through public exports.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-5:4",
    targetPhaseId: "OPS-5:1",
    dependencyType: "PublicApi",
    relationship: "Validates resource foundation through public exports.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-5:4",
    targetPhaseId: "OPS-5:2",
    dependencyType: "PublicApi",
    relationship: "Validates resource registry and metadata through public exports.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-5:4",
    targetPhaseId: "OPS-5:3",
    dependencyType: "PublicApi",
    relationship: "Validates resource model through public exports.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-5",
    targetPhaseId: "OPS-1",
    dependencyType: "PublicApi",
    relationship: "Resource platform depends on Executive Operations public foundation.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-5",
    targetPhaseId: "OPS-2",
    dependencyType: "PublicApi",
    relationship: "Resource platform depends on Task Intelligence public platform.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-5",
    targetPhaseId: "OPS-3",
    dependencyType: "PublicApi",
    relationship: "Resource platform depends on Workflow Intelligence public platform.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-5",
    targetPhaseId: "OPS-4",
    dependencyType: "PublicApi",
    relationship: "Resource platform depends on Project Execution public platform.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-5",
    targetPhaseId: "OPS-6",
    dependencyType: "PublicApi",
    relationship: "Resource platform publishes metadata for future OPS-6 consumption.",
    metadataOnly: true,
  } as const satisfies ResourcePlatformDependencyEntry),
] as const);

export const ResourcePlatformDependencyMapMetadata = Object.freeze({
  dependencyMapId: "ops.resource-intelligence.platform-dependency-map",
  dependencyMapVersion: ResourcePlatformMetadata.compatibilityVersion,
  dependencyCount: ResourcePlatformDependencyMap.length,
  metadataOnly: true,
  immutable: true,
} as const);
