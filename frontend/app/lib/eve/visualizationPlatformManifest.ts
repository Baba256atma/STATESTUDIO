import { VisualizationPlatformManifestCompatibility } from "./visualizationPlatformManifestCompatibility.ts";
import { VisualizationPlatformManifestGuarantees } from "./visualizationPlatformManifestGuarantees.ts";
import { VisualizationPlatformManifestInventory } from "./visualizationPlatformManifestInventory.ts";
import {
  VisualizationPlatformManifestIdentity,
  VisualizationPlatformManifestMetadataRecord,
  VisualizationPlatformManifestReadinessMetadataRecord,
} from "./visualizationPlatformManifestMetadata.ts";
import {
  VisualizationPlatformManifestComposition,
  VisualizationPlatformManifestReadiness,
} from "./visualizationPlatformManifestReadiness.ts";
import { VisualizationPlatformValidationPlatform } from "./visualizationPlatformValidation.ts";

export const VisualizationPlatformManifestIdentityMetadata =
  VisualizationPlatformManifestIdentity;
export const VisualizationPlatformManifestReadinessMetadata =
  VisualizationPlatformManifestReadinessMetadataRecord;
export const VisualizationPlatformManifestInventoryMetadata =
  VisualizationPlatformManifestInventory;
export const VisualizationPlatformManifestMetadata =
  VisualizationPlatformManifestMetadataRecord;

export const VisualizationPlatformManifestPlatform = Object.freeze({
  metadata: VisualizationPlatformManifestMetadata,
  identity: VisualizationPlatformManifestIdentityMetadata,
  inventory: VisualizationPlatformManifestInventoryMetadata,
  readiness: VisualizationPlatformManifestReadinessMetadata,
  validation: VisualizationPlatformValidationPlatform,
  composition: VisualizationPlatformManifestComposition,
  guarantees: VisualizationPlatformManifestGuarantees,
  compatibility: VisualizationPlatformManifestCompatibility,
  readinessDeclarations: VisualizationPlatformManifestReadiness,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const manifestSummary = Object.freeze({
  identity: VisualizationPlatformManifestIdentityMetadata,
  status: VisualizationPlatformManifestIdentityMetadata.status,
  readiness: VisualizationPlatformManifestReadinessMetadata,
  inventory: VisualizationPlatformManifestInventoryMetadata,
  validationReference: VisualizationPlatformValidationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationPlatformManifestSummary = () => manifestSummary;
export const getVisualizationPlatformManifestCount = () =>
  VisualizationPlatformManifestComposition.length;
export const getVisualizationPlatformManifestReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationPlatformManifestIdentityMetadata,
    readiness: VisualizationPlatformManifestReadinessMetadata.status,
    validationReference: VisualizationPlatformValidationPlatform.metadata.id,
  });
