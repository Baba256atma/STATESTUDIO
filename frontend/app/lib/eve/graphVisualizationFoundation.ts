import {
  SceneRenderingPlatformPublicFoundation,
  SceneRenderingPublicIndexId,
  getSceneRenderingPublicReleaseMetadata,
} from "./sceneRenderingPublicIndex.ts";
import { GraphVisualizationBoundaries } from "./graphVisualizationBoundaries.ts";
import { GraphVisualizationCapabilities } from "./graphVisualizationCapabilities.ts";
import {
  GraphVisualizationContractNames,
  GraphVisualizationContracts,
} from "./graphVisualizationContracts.ts";
import { GraphVisualizationLifecycle } from "./graphVisualizationLifecycle.ts";
import { GraphVisualizationOwnership } from "./graphVisualizationOwnership.ts";

export const GraphVisualizationFoundationId = "EVE-3:1/GraphVisualizationFoundation" as const;

export const GraphVisualizationFoundationInventory = Object.freeze({
  contractCount: GraphVisualizationContracts.length,
  lifecycleStateCount: GraphVisualizationLifecycle.states.length,
  capabilityCount: GraphVisualizationCapabilities.length,
  boundaryCount: GraphVisualizationBoundaries.declarations.length,
  policyCount: GraphVisualizationBoundaries.policies.length,
  countsDerivedFromCanonicalCollections: true,
  hardcodesAggregateTotals: false,
  reconstructsUpstreamInventory: false,
  duplicatesUpstreamMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const upstreamReleaseMetadata = getSceneRenderingPublicReleaseMetadata();

export const GraphVisualizationFoundationMetadata = Object.freeze({
  id: GraphVisualizationFoundationId,
  name: "Graph Visualization Foundation",
  version: "1.0.0",
  namespace: "nexora.eve.graph-visualization.foundation",
  layer: "EVE",
  phase: "EVE-3:1",
  status: "ReadyForRegistry",
  readiness: "ReadyForRegistry",
  upstreamPublicIndexReference: SceneRenderingPublicIndexId,
  upstreamLockReference: upstreamReleaseMetadata.lockId,
  inventory: GraphVisualizationFoundationInventory,
  dependency: Object.freeze({
    sceneRenderingPublicIndexOnly: true,
    directDependencyModule: "sceneRenderingPublicIndex.ts",
    upstreamPublicPlatform: SceneRenderingPlatformPublicFoundation,
    directEveTwoInternalImports: false,
    directEveOneImports: false,
    externalDependencies: false,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export const GraphVisualizationFoundation = Object.freeze({
  metadata: GraphVisualizationFoundationMetadata,
  upstreamPublicPlatform: SceneRenderingPlatformPublicFoundation,
  contracts: GraphVisualizationContracts,
  contractNames: GraphVisualizationContractNames,
  ownership: GraphVisualizationOwnership,
  boundaries: GraphVisualizationBoundaries,
  lifecycle: GraphVisualizationLifecycle,
  capabilities: GraphVisualizationCapabilities,
  inventory: GraphVisualizationFoundationInventory,
  analyticsExecution: false,
  layoutExecution: false,
  pathCalculation: false,
  relationshipInference: false,
  rendering: false,
  sceneRenderingExecution: false,
  runtimeInteraction: false,
  networking: false,
  persistence: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export function getGraphVisualizationFoundationSummary() {
  return GraphVisualizationFoundation.metadata;
}

export function getGraphVisualizationFoundationContractCount() {
  return GraphVisualizationFoundation.inventory.contractCount;
}

export function getGraphVisualizationFoundationReadiness() {
  return GraphVisualizationFoundation.metadata.readiness;
}

export function getGraphVisualizationFoundationUpstreamMetadata() {
  return upstreamReleaseMetadata;
}
