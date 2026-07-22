import {
  GraphVisualizationPlatformPublicFoundation,
  GraphVisualizationPublicIndexId,
  getGraphVisualizationPublicReleaseMetadata,
} from "./graphVisualizationPublicIndex.ts";
import { TimelineVisualizationFoundationCapabilities } from "./timelineVisualizationFoundationCapabilities.ts";
import { TimelineVisualizationFoundationContracts } from "./timelineVisualizationFoundationContracts.ts";
import { TimelineVisualizationFoundationLifecycle } from "./timelineVisualizationFoundationLifecycle.ts";
import {
  TimelineVisualizationFoundationBoundaries,
  TimelineVisualizationFoundationOwnership,
} from "./timelineVisualizationFoundationOwnership.ts";

export const TimelineVisualizationFoundationInventory = Object.freeze({
  contracts: TimelineVisualizationFoundationContracts,
  boundaries: TimelineVisualizationFoundationBoundaries,
  lifecycleStates: TimelineVisualizationFoundationLifecycle.states,
  capabilities: TimelineVisualizationFoundationCapabilities,
  counts: Object.freeze({
    contractCount: TimelineVisualizationFoundationContracts.length,
    boundaryCount: TimelineVisualizationFoundationBoundaries.length,
    lifecycleStateCount: TimelineVisualizationFoundationLifecycle.states.length,
    capabilityCount: TimelineVisualizationFoundationCapabilities.length,
  }),
  countsDerivedFromCanonicalCollections: true,
  hardcodesAggregateCounts: false,
  reconstructsUpstreamInventory: false,
  duplicatesUpstreamMetadata: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const upstreamReleaseMetadata = getGraphVisualizationPublicReleaseMetadata();

export const TimelineVisualizationFoundationMetadata = Object.freeze({
  id: "EVE-4:1/TimelineVisualizationFoundation",
  name: "Timeline & Temporal Visualization Foundation",
  version: "1.0.0",
  namespace: "nexora.eve.timeline-visualization.foundation",
  layer: "EVE",
  phase: "EVE-4:1",
  status: "ReadyForRegistry",
  readiness: "ReadyForRegistry",
  ownership: TimelineVisualizationFoundationOwnership,
  lifecycle: TimelineVisualizationFoundationLifecycle,
  capabilities: TimelineVisualizationFoundationCapabilities,
  boundaries: TimelineVisualizationFoundationBoundaries,
  inventory: TimelineVisualizationFoundationInventory,
  upstreamPublicIndexReference: GraphVisualizationPublicIndexId,
  upstreamPublicPlatform: GraphVisualizationPlatformPublicFoundation,
  upstreamReleaseMetadata,
  deterministicOrdering: true,
  dependency: Object.freeze({
    graphVisualizationPublicIndexOnly: true,
    directDependencyModule: "graphVisualizationPublicIndex.ts",
    directEveThreeInternalImports: false,
    directEveTwoImports: false,
    directEveOneImports: false,
    externalDependencies: false,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);
