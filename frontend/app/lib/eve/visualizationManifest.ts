import { VisualizationValidation } from "./visualizationValidation.ts";
import { VisualizationManifestCompatibility } from "./visualizationManifestCompatibility.ts";
import { VisualizationManifestGuarantees } from "./visualizationManifestGuarantees.ts";
import { VisualizationManifestInventory } from "./visualizationManifestInventory.ts";
import { VisualizationManifestMetadata } from "./visualizationManifestMetadata.ts";
import { VisualizationManifestReadiness } from "./visualizationManifestReadiness.ts";

export const VisualizationManifestId = VisualizationManifestMetadata.id;
export const VisualizationManifestVersion = VisualizationManifestMetadata.version;
export const VisualizationManifestName = VisualizationManifestMetadata.name;
export const VisualizationManifestNamespace = VisualizationManifestMetadata.namespace;
export const VisualizationManifestStatus = VisualizationManifestMetadata.status;
export const VisualizationManifestReadinessStatus = VisualizationManifestMetadata.readiness;

export { VisualizationManifestMetadata };

export const VisualizationManifest = Object.freeze({
  metadata: VisualizationManifestMetadata,
  validation: VisualizationValidation,
  inventory: VisualizationManifestInventory,
  guarantees: VisualizationManifestGuarantees,
  readiness: VisualizationManifestReadiness,
  compatibility: VisualizationManifestCompatibility,
  execution: false,
  validationEngine: false,
  orchestration: false,
  rendering: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

