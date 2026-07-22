import { VisualizationManifest } from "./visualizationManifest.ts";
import { VisualizationPlatformCapabilities } from "./visualizationPlatformCapabilities.ts";
import { VisualizationPlatformCompatibility } from "./visualizationPlatformCompatibility.ts";
import { VisualizationPlatformGuarantees } from "./visualizationPlatformGuarantees.ts";
import { VisualizationPlatformInventory } from "./visualizationPlatformInventory.ts";
import { VisualizationPlatformMetadata } from "./visualizationPlatformMetadata.ts";

export const VisualizationPlatformId = VisualizationPlatformMetadata.id;
export const VisualizationPlatformVersion = VisualizationPlatformMetadata.version;
export const VisualizationPlatformName = VisualizationPlatformMetadata.name;
export const VisualizationPlatformNamespace = VisualizationPlatformMetadata.namespace;
export const VisualizationPlatformStatus = VisualizationPlatformMetadata.status;
export const VisualizationPlatformReadiness = VisualizationPlatformMetadata.readiness;

export { VisualizationPlatformMetadata };

export const VisualizationPlatform = Object.freeze({
  metadata: VisualizationPlatformMetadata,
  manifest: VisualizationManifest,
  capabilities: VisualizationPlatformCapabilities,
  guarantees: VisualizationPlatformGuarantees,
  compatibility: VisualizationPlatformCompatibility,
  inventory: VisualizationPlatformInventory,
  execution: false,
  visualizationExecution: false,
  orchestration: false,
  rendering: false,
  services: false,
  factories: false,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

