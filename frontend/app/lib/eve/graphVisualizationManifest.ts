import { GraphVisualizationValidation } from "./graphVisualizationValidation.ts";
import {
  GraphVisualizationManifestComposition,
  GraphVisualizationManifestReadiness,
} from "./graphVisualizationManifestComposition.ts";
import { GraphVisualizationManifestCompatibility } from "./graphVisualizationManifestCompatibility.ts";
import { GraphVisualizationManifestGuarantees } from "./graphVisualizationManifestGuarantees.ts";
import { GraphVisualizationManifestInventory } from "./graphVisualizationManifestInventory.ts";
import { GraphVisualizationManifestMetadata } from "./graphVisualizationManifestMetadata.ts";

export const GraphVisualizationManifestIdentity = Object.freeze({
  id: GraphVisualizationManifestMetadata.id,
  name: GraphVisualizationManifestMetadata.name,
  version: GraphVisualizationManifestMetadata.version,
  namespace: GraphVisualizationManifestMetadata.namespace,
} as const);

export { GraphVisualizationManifestInventory, GraphVisualizationManifestMetadata };
export const GraphVisualizationManifestReadinessMetadata = Object.freeze({
  status: GraphVisualizationManifestMetadata.readiness,
  declarations: GraphVisualizationManifestReadiness,
  metadataOnly: true,
  immutable: true,
} as const);

export const GraphVisualizationManifest = Object.freeze({
  metadata: GraphVisualizationManifestMetadata,
  validation: GraphVisualizationValidation,
  composition: GraphVisualizationManifestComposition,
  guarantees: GraphVisualizationManifestGuarantees,
  compatibility: GraphVisualizationManifestCompatibility,
  readiness: GraphVisualizationManifestReadinessMetadata,
  inventory: GraphVisualizationManifestInventory,
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

export function getGraphVisualizationManifestSummary() {
  return GraphVisualizationManifest.metadata;
}

export function getGraphVisualizationManifestCount() {
  return GraphVisualizationManifest.inventory.counts.phaseCount;
}

export function getGraphVisualizationManifestReleaseMetadata() {
  return Object.freeze({
    identity: GraphVisualizationManifestIdentity,
    status: GraphVisualizationManifest.metadata.status,
    readiness: GraphVisualizationManifest.readiness,
    validationReference: GraphVisualizationManifest.metadata.validationReference,
  });
}
