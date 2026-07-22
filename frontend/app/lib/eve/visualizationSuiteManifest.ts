import { VisualizationSuiteManifestCompatibility } from "./visualizationSuiteManifestCompatibility.ts";
import { VisualizationSuiteManifestGuarantees } from "./visualizationSuiteManifestGuarantees.ts";
import { VisualizationSuiteManifestInventory } from "./visualizationSuiteManifestInventory.ts";
import {
  VisualizationSuiteManifestIdentity,
  VisualizationSuiteManifestMetadataRecord,
  VisualizationSuiteManifestReadinessMetadataRecord,
} from "./visualizationSuiteManifestMetadata.ts";
import {
  VisualizationSuiteManifestComposition,
  VisualizationSuiteManifestReadiness,
} from "./visualizationSuiteManifestReadiness.ts";
import { VisualizationSuiteValidationPlatform } from "./visualizationSuiteValidation.ts";

export const VisualizationSuiteManifestIdentityMetadata =
  VisualizationSuiteManifestIdentity;
export const VisualizationSuiteManifestReadinessMetadata =
  VisualizationSuiteManifestReadinessMetadataRecord;
export const VisualizationSuiteManifestInventoryMetadata =
  VisualizationSuiteManifestInventory;
export const VisualizationSuiteManifestMetadata =
  VisualizationSuiteManifestMetadataRecord;

export const VisualizationSuiteManifestPlatform = Object.freeze({
  metadata: VisualizationSuiteManifestMetadata,
  identity: VisualizationSuiteManifestIdentityMetadata,
  inventory: VisualizationSuiteManifestInventoryMetadata,
  readiness: VisualizationSuiteManifestReadinessMetadata,
  validation: VisualizationSuiteValidationPlatform,
  composition: VisualizationSuiteManifestComposition,
  guarantees: VisualizationSuiteManifestGuarantees,
  compatibility: VisualizationSuiteManifestCompatibility,
  readinessDeclarations: VisualizationSuiteManifestReadiness,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const manifestSummary = Object.freeze({
  identity: VisualizationSuiteManifestIdentityMetadata,
  status: VisualizationSuiteManifestIdentityMetadata.status,
  readiness: VisualizationSuiteManifestReadinessMetadata,
  inventory: VisualizationSuiteManifestInventoryMetadata,
  validationReference: VisualizationSuiteValidationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationSuiteManifestSummary = () => manifestSummary;
export const getVisualizationSuiteManifestCount = () =>
  VisualizationSuiteManifestComposition.length;
export const getVisualizationSuiteManifestReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationSuiteManifestIdentityMetadata,
    readiness: VisualizationSuiteManifestReadinessMetadata.status,
    validationReference: VisualizationSuiteValidationPlatform.metadata.id,
  });
