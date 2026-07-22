import { VisualizationPlatformCertificationCompatibility } from "./visualizationPlatformCertificationCompatibility.ts";
import { VisualizationPlatformCertificationCriteria } from "./visualizationPlatformCertificationCriteria.ts";
import { VisualizationPlatformCertificationGates } from "./visualizationPlatformCertificationGates.ts";
import { VisualizationPlatformCertificationInventory } from "./visualizationPlatformCertificationInventory.ts";
import {
  VisualizationPlatformCertificationIdentity,
  VisualizationPlatformCertificationMetadataRecord,
  VisualizationPlatformCertificationReadiness,
} from "./visualizationPlatformCertificationMetadata.ts";
import { VisualizationPlatformPlatform } from "./visualizationPlatformPlatform.ts";

export const VisualizationPlatformCertificationIdentityMetadata =
  VisualizationPlatformCertificationIdentity;
export const VisualizationPlatformCertificationReadinessMetadata =
  VisualizationPlatformCertificationReadiness;
export const VisualizationPlatformCertificationInventoryMetadata =
  VisualizationPlatformCertificationInventory;
export const VisualizationPlatformCertificationMetadata =
  VisualizationPlatformCertificationMetadataRecord;

export const VisualizationPlatformCertificationPlatform = Object.freeze({
  metadata: VisualizationPlatformCertificationMetadata,
  identity: VisualizationPlatformCertificationIdentityMetadata,
  inventory: VisualizationPlatformCertificationInventoryMetadata,
  readiness: VisualizationPlatformCertificationReadinessMetadata,
  platform: VisualizationPlatformPlatform,
  criteria: VisualizationPlatformCertificationCriteria,
  gates: VisualizationPlatformCertificationGates,
  compatibility: VisualizationPlatformCertificationCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const certificationSummary = Object.freeze({
  identity: VisualizationPlatformCertificationIdentityMetadata,
  status: VisualizationPlatformCertificationIdentityMetadata.status,
  readiness: VisualizationPlatformCertificationReadinessMetadata,
  inventory: VisualizationPlatformCertificationInventoryMetadata,
  platformReference: VisualizationPlatformPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationPlatformCertificationSummary = () =>
  certificationSummary;
export const getVisualizationPlatformCertificationCount = () =>
  VisualizationPlatformCertificationCriteria.length;
export const getVisualizationPlatformCertificationReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationPlatformCertificationIdentityMetadata,
    readiness: VisualizationPlatformCertificationReadinessMetadata.readiness,
    platformReference: VisualizationPlatformPlatform.metadata.id,
  });
