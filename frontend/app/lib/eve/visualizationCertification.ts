import { VisualizationPlatform } from "./visualizationPlatform.ts";
import { VisualizationCertificationCompatibility } from "./visualizationCertificationCompatibility.ts";
import { VisualizationCertificationCriteria } from "./visualizationCertificationCriteria.ts";
import { VisualizationCertificationGates } from "./visualizationCertificationGates.ts";
import { VisualizationCertificationInventory } from "./visualizationCertificationInventory.ts";
import { VisualizationCertificationMetadata } from "./visualizationCertificationMetadata.ts";

export const VisualizationCertificationId = VisualizationCertificationMetadata.id;
export const VisualizationCertificationVersion = VisualizationCertificationMetadata.version;
export const VisualizationCertificationName = VisualizationCertificationMetadata.name;
export const VisualizationCertificationNamespace = VisualizationCertificationMetadata.namespace;
export const VisualizationCertificationStatus = VisualizationCertificationMetadata.status;
export const VisualizationCertificationReadiness = VisualizationCertificationMetadata.readiness;

export { VisualizationCertificationMetadata };

export const VisualizationCertification = Object.freeze({
  metadata: VisualizationCertificationMetadata,
  platform: VisualizationPlatform,
  criteria: VisualizationCertificationCriteria,
  gates: VisualizationCertificationGates,
  compatibility: VisualizationCertificationCompatibility,
  inventory: VisualizationCertificationInventory,
  certificationEngine: false,
  automaticCertificationExecution: false,
  execution: false,
  rendering: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

