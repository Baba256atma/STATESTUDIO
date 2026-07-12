import type {
  DependencyEdge,
  DependencyGraph,
  DependencyMetadata,
  DependencyNode,
  DependencyPlatformDescriptor,
} from "./dependencyIntelligenceTypes.ts";

const dependencyMetadata = Object.freeze({
  platformId: "OPS-7:1",
  platformVersion: "1.0.0",
  releaseStage: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  tags: Object.freeze(["ops", "dependency-intelligence", "metadata-only"]),
} as const satisfies DependencyMetadata);

const platformMetadata = Object.freeze({
  platformId: "OPS-7:1",
  platformName: "Executive Dependency Intelligence Foundation",
  platformNamespace: "nexora.ops.dependency-intelligence.foundation",
  platformVersion: "1.0.0",
  platformDescription:
    "Canonical metadata-only foundation for representing executive dependency relationships.",
  platformStatus: "Draft",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const satisfies DependencyPlatformDescriptor);

export const DependencyNodeContract = Object.freeze({
  id: "dependency-node-contract",
  category: "ExecutiveEntity",
  label: "Dependency Node",
  description:
    "Canonical metadata-only contract describing one dependency node without UI or coordinate state.",
  metadata: dependencyMetadata,
} as const satisfies DependencyNode);

export const DependencyEdgeContract = Object.freeze({
  id: "dependency-edge-contract",
  source: "dependency-node-source",
  target: "dependency-node-target",
  direction: "Outbound",
  type: "Supporting",
  strength: "Moderate",
  priority: "Normal",
  criticality: "Important",
  status: "Defined",
  metadata: dependencyMetadata,
} as const satisfies DependencyEdge);

export const DependencyGraphContract = Object.freeze({
  nodes: Object.freeze([DependencyNodeContract]),
  edges: Object.freeze([DependencyEdgeContract]),
  graphMetadata: dependencyMetadata,
  platformMetadata,
} as const satisfies DependencyGraph);

export const DependencyIntelligenceContracts = Object.freeze({
  node: DependencyNodeContract,
  edge: DependencyEdgeContract,
  graph: DependencyGraphContract,
  all: Object.freeze([
    DependencyNodeContract,
    DependencyEdgeContract,
    DependencyGraphContract,
  ]),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
