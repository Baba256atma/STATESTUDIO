import { ChartMetricVisualizationCertificationCompatibility } from "./chartMetricVisualizationCertificationCompatibility.ts";
import { ChartMetricVisualizationCertificationCriteria } from "./chartMetricVisualizationCertificationCriteria.ts";
import { ChartMetricVisualizationCertificationGates } from "./chartMetricVisualizationCertificationGates.ts";
import { ChartMetricVisualizationCertificationInventory } from "./chartMetricVisualizationCertificationInventory.ts";
import {
  ChartMetricVisualizationCertificationIdentity,
  ChartMetricVisualizationCertificationMetadataRecord,
  ChartMetricVisualizationCertificationReadiness,
} from "./chartMetricVisualizationCertificationMetadata.ts";
import { ChartMetricVisualizationPlatform } from "./chartMetricVisualizationPlatform.ts";

export const ChartMetricVisualizationCertificationIdentityMetadata =
  ChartMetricVisualizationCertificationIdentity;

export const ChartMetricVisualizationCertificationReadinessMetadata =
  ChartMetricVisualizationCertificationReadiness;

export const ChartMetricVisualizationCertificationInventoryMetadata =
  ChartMetricVisualizationCertificationInventory;

export const ChartMetricVisualizationCertificationMetadata =
  ChartMetricVisualizationCertificationMetadataRecord;

export const ChartMetricVisualizationCertificationPlatform = Object.freeze({
  metadata: ChartMetricVisualizationCertificationMetadata,
  identity: ChartMetricVisualizationCertificationIdentityMetadata,
  inventory: ChartMetricVisualizationCertificationInventoryMetadata,
  readiness: ChartMetricVisualizationCertificationReadinessMetadata,
  platform: ChartMetricVisualizationPlatform,
  criteria: ChartMetricVisualizationCertificationCriteria,
  gates: ChartMetricVisualizationCertificationGates,
  compatibility: ChartMetricVisualizationCertificationCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const certificationSummary = Object.freeze({
  identity: ChartMetricVisualizationCertificationIdentityMetadata,
  status: ChartMetricVisualizationCertificationIdentityMetadata.status,
  readiness: ChartMetricVisualizationCertificationReadinessMetadata,
  inventory: ChartMetricVisualizationCertificationInventoryMetadata,
  platformReference: ChartMetricVisualizationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getChartMetricVisualizationCertificationSummary = () => certificationSummary;

export const getChartMetricVisualizationCertificationCount = () =>
  ChartMetricVisualizationCertificationCriteria.length;

export const getChartMetricVisualizationCertificationReleaseMetadata = () => Object.freeze({
  ...ChartMetricVisualizationCertificationIdentityMetadata,
  readiness: ChartMetricVisualizationCertificationReadinessMetadata.readiness,
  platformReference: ChartMetricVisualizationPlatform.metadata.id,
});
