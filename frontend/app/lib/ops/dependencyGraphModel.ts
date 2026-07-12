import {
  ExecutiveDependencyIntelligenceFoundation,
} from "./dependencyIntelligenceIndex.ts";
import { ExecutiveDependencyRegistry } from "./dependencyRegistryIndex.ts";
import { DependencyEdgeModel } from "./dependencyEdgeModel.ts";
import { DependencyNodeModel } from "./dependencyNodeModel.ts";
import type {
  DependencyGraphCollection,
  DependencyGraphDescriptor,
} from "./dependencyModelTypes.ts";

const graphMetadata = Object.freeze({
  platformId: ExecutiveDependencyIntelligenceFoundation.registry.platformId,
  platformVersion: ExecutiveDependencyIntelligenceFoundation.registry.version,
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: Object.freeze(["ops", "dependency-model", "graph-descriptor"]),
} as const);

export const DependencyGraphModel = Object.freeze([
  Object.freeze({
    graphId: "executive-dependency-graph-core",
    graphName: "Executive Dependency Graph Core",
    description:
      "Canonical structural graph descriptor for executive dependency intelligence.",
    nodes: DependencyNodeModel,
    edges: DependencyEdgeModel,
    graphMetadata,
    compatibilityMetadata: Object.freeze({
      foundationVersion: ExecutiveDependencyIntelligenceFoundation.registry.version,
      registryVersion: ExecutiveDependencyRegistry.metadata.registryVersion,
      compatibilityVersion: ExecutiveDependencyRegistry.metadata.compatibilityVersion,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
    platformMetadata: Object.freeze({
      platformId: ExecutiveDependencyIntelligenceFoundation.registry.platformId,
      platformVersion: ExecutiveDependencyIntelligenceFoundation.registry.version,
      metadataOnly: true,
      immutable: true,
      deterministic: true,
    }),
  } as const satisfies DependencyGraphDescriptor),
] as const satisfies DependencyGraphCollection);
