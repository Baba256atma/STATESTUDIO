import { ChartMetricVisualizationManifestCompatibility } from "./chartMetricVisualizationManifestCompatibility.ts";
import { ChartMetricVisualizationManifestGuarantees } from "./chartMetricVisualizationManifestGuarantees.ts";
import { ChartMetricVisualizationManifestInventory } from "./chartMetricVisualizationManifestInventory.ts";
import {
  ChartMetricVisualizationManifestIdentity,
  ChartMetricVisualizationManifestMetadataRecord,
  ChartMetricVisualizationManifestReadinessMetadataRecord,
} from "./chartMetricVisualizationManifestMetadata.ts";
import {
  ChartMetricVisualizationManifestComposition,
  ChartMetricVisualizationManifestReadiness,
} from "./chartMetricVisualizationManifestReadiness.ts";
import { ChartMetricVisualizationValidationPlatform } from "./chartMetricVisualizationValidation.ts";

export const ChartMetricVisualizationManifestIdentityMetadata =
  ChartMetricVisualizationManifestIdentity;

export const ChartMetricVisualizationManifestReadinessMetadata =
  ChartMetricVisualizationManifestReadinessMetadataRecord;

export const ChartMetricVisualizationManifestInventoryMetadata =
  ChartMetricVisualizationManifestInventory;

export const ChartMetricVisualizationManifestMetadata =
  ChartMetricVisualizationManifestMetadataRecord;

export const ChartMetricVisualizationManifestPlatform = Object.freeze({
  metadata: ChartMetricVisualizationManifestMetadata,
  identity: ChartMetricVisualizationManifestIdentityMetadata,
  inventory: ChartMetricVisualizationManifestInventoryMetadata,
  readiness: ChartMetricVisualizationManifestReadinessMetadata,
  validation: ChartMetricVisualizationValidationPlatform,
  composition: ChartMetricVisualizationManifestComposition,
  guarantees: ChartMetricVisualizationManifestGuarantees,
  compatibility: ChartMetricVisualizationManifestCompatibility,
  readinessDeclarations: ChartMetricVisualizationManifestReadiness,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const manifestSummary = Object.freeze({
  identity: ChartMetricVisualizationManifestIdentityMetadata,
  status: ChartMetricVisualizationManifestIdentityMetadata.status,
  readiness: ChartMetricVisualizationManifestReadinessMetadata,
  inventory: ChartMetricVisualizationManifestInventoryMetadata,
  validationReference: ChartMetricVisualizationValidationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getChartMetricVisualizationManifestSummary = () => manifestSummary;

export const getChartMetricVisualizationManifestCount = () =>
  ChartMetricVisualizationManifestComposition.length;

export const getChartMetricVisualizationManifestReleaseMetadata = () => Object.freeze({
  ...ChartMetricVisualizationManifestIdentityMetadata,
  readiness: ChartMetricVisualizationManifestReadinessMetadata.status,
  validationReference: ChartMetricVisualizationValidationPlatform.metadata.id,
});
