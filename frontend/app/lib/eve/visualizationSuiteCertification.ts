import { VisualizationSuiteCertificationCompatibility } from "./visualizationSuiteCertificationCompatibility.ts";
import { VisualizationSuiteCertificationCriteria } from "./visualizationSuiteCertificationCriteria.ts";
import { VisualizationSuiteCertificationGates } from "./visualizationSuiteCertificationGates.ts";
import { VisualizationSuiteCertificationInventory } from "./visualizationSuiteCertificationInventory.ts";
import {
  VisualizationSuiteCertificationIdentity,
  VisualizationSuiteCertificationMetadataRecord,
  VisualizationSuiteCertificationReadiness,
} from "./visualizationSuiteCertificationMetadata.ts";
import { VisualizationSuitePlatform } from "./visualizationSuitePlatform.ts";

export const VisualizationSuiteCertificationIdentityMetadata =
  VisualizationSuiteCertificationIdentity;
export const VisualizationSuiteCertificationReadinessMetadata =
  VisualizationSuiteCertificationReadiness;
export const VisualizationSuiteCertificationInventoryMetadata =
  VisualizationSuiteCertificationInventory;
export const VisualizationSuiteCertificationMetadata =
  VisualizationSuiteCertificationMetadataRecord;

export const VisualizationSuiteCertificationPlatform = Object.freeze({
  metadata: VisualizationSuiteCertificationMetadata,
  identity: VisualizationSuiteCertificationIdentityMetadata,
  inventory: VisualizationSuiteCertificationInventoryMetadata,
  readiness: VisualizationSuiteCertificationReadinessMetadata,
  platform: VisualizationSuitePlatform,
  criteria: VisualizationSuiteCertificationCriteria,
  gates: VisualizationSuiteCertificationGates,
  compatibility: VisualizationSuiteCertificationCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const certificationSummary = Object.freeze({
  identity: VisualizationSuiteCertificationIdentityMetadata,
  status: VisualizationSuiteCertificationIdentityMetadata.status,
  readiness: VisualizationSuiteCertificationReadinessMetadata,
  inventory: VisualizationSuiteCertificationInventoryMetadata,
  platformReference: VisualizationSuitePlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationSuiteCertificationSummary = () =>
  certificationSummary;
export const getVisualizationSuiteCertificationCount = () =>
  VisualizationSuiteCertificationCriteria.length;
export const getVisualizationSuiteCertificationReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationSuiteCertificationIdentityMetadata,
    readiness: VisualizationSuiteCertificationReadinessMetadata.readiness,
    platformReference: VisualizationSuitePlatform.metadata.id,
  });
