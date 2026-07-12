import { DependencyIntelligenceRegistry } from "./dependencyIntelligenceIndex.ts";
import type { DependencyPlatformDependencyEntry } from "./dependencyManifestTypes.ts";

export const DependencyPlatformDependencyMap = Object.freeze([
  Object.freeze({
    sourcePhaseId: "OPS-7:2",
    targetPhaseId: "OPS-7:1",
    dependencyType: "PublicApi",
    relationship: "Registry consumes the dependency foundation through public APIs.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-7:3",
    targetPhaseId: "OPS-7:1",
    dependencyType: "PublicApi",
    relationship: "Model consumes the dependency foundation through public APIs.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-7:3",
    targetPhaseId: "OPS-7:2",
    dependencyType: "PublicApi",
    relationship: "Model consumes dependency registries through public APIs.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-7:4",
    targetPhaseId: "OPS-7:1",
    dependencyType: "PublicApi",
    relationship: "Validation consumes dependency foundation through public APIs.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-7:4",
    targetPhaseId: "OPS-7:2",
    dependencyType: "PublicApi",
    relationship: "Validation consumes dependency registry through public APIs.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-7:4",
    targetPhaseId: "OPS-7:3",
    dependencyType: "PublicApi",
    relationship: "Validation consumes dependency model through public APIs.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-7",
    targetPhaseId: "OPS-2",
    dependencyType: "PublicApi",
    relationship: "Dependency platform models compatibility with Task Intelligence.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-7",
    targetPhaseId: "OPS-3",
    dependencyType: "PublicApi",
    relationship: "Dependency platform models compatibility with Workflow Intelligence.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-7",
    targetPhaseId: "OPS-4",
    dependencyType: "PublicApi",
    relationship: "Dependency platform models compatibility with Project Execution.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-7",
    targetPhaseId: "OPS-5",
    dependencyType: "PublicApi",
    relationship: "Dependency platform models compatibility with Resource Intelligence.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
  Object.freeze({
    sourcePhaseId: "OPS-7",
    targetPhaseId: "OPS-6",
    dependencyType: "PublicApi",
    relationship: "Dependency platform models compatibility with Scheduling Intelligence.",
    metadataOnly: true,
  } as const satisfies DependencyPlatformDependencyEntry),
] as const);

export const DependencyPlatformDependencyMapMetadata = Object.freeze({
  dependencyMapId: "ops.executive-dependency.platform-dependency-map",
  dependencyMapVersion: DependencyIntelligenceRegistry.version,
  dependencyCount: DependencyPlatformDependencyMap.length,
  metadataOnly: true,
  immutable: true,
} as const);
