import { GraphVisualizationPlatform } from "./graphVisualizationPlatform.ts";
import { GraphVisualizationCertificationCompatibility } from "./graphVisualizationCertificationCompatibility.ts";
import { GraphVisualizationCertificationCriteria } from "./graphVisualizationCertificationCriteria.ts";
import { GraphVisualizationCertificationGates } from "./graphVisualizationCertificationGates.ts";
import { GraphVisualizationCertificationInventory } from "./graphVisualizationCertificationInventory.ts";
import { GraphVisualizationCertificationMetadata } from "./graphVisualizationCertificationMetadata.ts";

export const GraphVisualizationCertificationIdentity = Object.freeze({
  id: GraphVisualizationCertificationMetadata.id,
  name: GraphVisualizationCertificationMetadata.name,
  version: GraphVisualizationCertificationMetadata.version,
  namespace: GraphVisualizationCertificationMetadata.namespace,
} as const);

export { GraphVisualizationCertificationInventory, GraphVisualizationCertificationMetadata };
export const GraphVisualizationCertificationReadiness =
  GraphVisualizationCertificationMetadata.readinessMetadata;

export const GraphVisualizationCertification = Object.freeze({
  metadata: GraphVisualizationCertificationMetadata,
  platform: GraphVisualizationPlatform,
  criteria: GraphVisualizationCertificationCriteria,
  gates: GraphVisualizationCertificationGates,
  compatibility: GraphVisualizationCertificationCompatibility,
  inventory: GraphVisualizationCertificationInventory,
  readiness: GraphVisualizationCertificationReadiness,
  certificationEngine: false,
  runtimeCertification: false,
  validationExecution: false,
  execution: false,
  rendering: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

export function getGraphVisualizationCertificationSummary() {
  return GraphVisualizationCertification.metadata;
}

export function getGraphVisualizationCertificationCount() {
  return GraphVisualizationCertification.inventory.counts.criteriaCount;
}

export function getGraphVisualizationCertificationReleaseMetadata() {
  return Object.freeze({
    identity: GraphVisualizationCertificationIdentity,
    status: GraphVisualizationCertification.metadata.status,
    readiness: GraphVisualizationCertification.readiness,
    platformReference: GraphVisualizationCertification.metadata.platformReference,
  });
}
