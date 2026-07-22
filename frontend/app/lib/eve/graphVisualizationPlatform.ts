import { GraphVisualizationManifest } from "./graphVisualizationManifest.ts";
import { GraphVisualizationPlatformCapabilities } from "./graphVisualizationPlatformCapabilities.ts";
import { GraphVisualizationPlatformCompatibility } from "./graphVisualizationPlatformCompatibility.ts";
import { GraphVisualizationPlatformGuarantees } from "./graphVisualizationPlatformGuarantees.ts";
import { GraphVisualizationPlatformInventory } from "./graphVisualizationPlatformInventory.ts";
import { GraphVisualizationPlatformMetadata } from "./graphVisualizationPlatformMetadata.ts";

export const GraphVisualizationPlatformIdentity = Object.freeze({
  id: GraphVisualizationPlatformMetadata.id,
  name: GraphVisualizationPlatformMetadata.name,
  version: GraphVisualizationPlatformMetadata.version,
  namespace: GraphVisualizationPlatformMetadata.namespace,
} as const);

export { GraphVisualizationPlatformInventory, GraphVisualizationPlatformMetadata };
export const GraphVisualizationPlatformReadiness =
  GraphVisualizationPlatformMetadata.readinessMetadata;

export const GraphVisualizationPlatform = Object.freeze({
  metadata: GraphVisualizationPlatformMetadata,
  manifest: GraphVisualizationManifest,
  capabilities: GraphVisualizationPlatformCapabilities,
  guarantees: GraphVisualizationPlatformGuarantees,
  compatibility: GraphVisualizationPlatformCompatibility,
  inventory: GraphVisualizationPlatformInventory,
  readiness: GraphVisualizationPlatformReadiness,
  validationExecution: false,
  analyticsExecution: false,
  traversal: false,
  pathfinding: false,
  layoutExecution: false,
  rendering: false,
  runtimeInteraction: false,
  runtimeExecution: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export function getGraphVisualizationPlatformSummary() {
  return GraphVisualizationPlatform.metadata;
}

export function getGraphVisualizationPlatformCount() {
  return GraphVisualizationPlatform.metadata.composition.length;
}

export function getGraphVisualizationPlatformReleaseMetadata() {
  return Object.freeze({
    identity: GraphVisualizationPlatformIdentity,
    status: GraphVisualizationPlatform.metadata.status,
    readiness: GraphVisualizationPlatform.readiness,
    manifestReference: GraphVisualizationPlatform.metadata.manifestReference,
  });
}
