import {
  DependencyIntelligenceRegistry,
} from "./dependencyIntelligenceIndex.ts";
import type {
  DependencyLifecycleDescriptor,
} from "./dependencyRegistryTypes.ts";

const dependencyMetadata = Object.freeze({
  platformId: DependencyIntelligenceRegistry.platformId,
  platformVersion: DependencyIntelligenceRegistry.version,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: Object.freeze(["ops", "dependency-registry", "lifecycle-catalog"]),
} as const);

export const DependencyLifecycleRegistry = Object.freeze([
  Object.freeze({
    id: "proposed",
    description: "Dependency relationship is proposed and cataloged for future executive review.",
    metadata: dependencyMetadata,
  } as const satisfies DependencyLifecycleDescriptor),
  Object.freeze({
    id: "active",
    description: "Dependency relationship is active in the canonical metadata catalog.",
    metadata: dependencyMetadata,
  } as const satisfies DependencyLifecycleDescriptor),
  Object.freeze({
    id: "deprecated",
    description: "Dependency relationship remains documented but is no longer recommended for new usage.",
    metadata: dependencyMetadata,
  } as const satisfies DependencyLifecycleDescriptor),
  Object.freeze({
    id: "archived",
    description: "Dependency relationship is archived for historical metadata reference only.",
    metadata: dependencyMetadata,
  } as const satisfies DependencyLifecycleDescriptor),
] as const);
