import { ChartMetricVisualizationManifestPlatform } from "./chartMetricVisualizationManifest.ts";
import { ChartMetricVisualizationPlatformCapabilities } from "./chartMetricVisualizationPlatformCapabilities.ts";
import { ChartMetricVisualizationPlatformCompatibility } from "./chartMetricVisualizationPlatformCompatibility.ts";
import { ChartMetricVisualizationPlatformGuarantees } from "./chartMetricVisualizationPlatformGuarantees.ts";
import {
  ChartMetricVisualizationPlatformComposition,
  ChartMetricVisualizationPlatformInventory,
} from "./chartMetricVisualizationPlatformInventory.ts";
import {
  ChartMetricVisualizationPlatformIdentity,
  ChartMetricVisualizationPlatformMetadataRecord,
  ChartMetricVisualizationPlatformReadiness,
} from "./chartMetricVisualizationPlatformMetadata.ts";

export const ChartMetricVisualizationPlatformIdentityMetadata =
  ChartMetricVisualizationPlatformIdentity;

export const ChartMetricVisualizationPlatformReadinessMetadata =
  ChartMetricVisualizationPlatformReadiness;

export const ChartMetricVisualizationPlatformInventoryMetadata =
  ChartMetricVisualizationPlatformInventory;

export const ChartMetricVisualizationPlatformMetadata =
  ChartMetricVisualizationPlatformMetadataRecord;

export const ChartMetricVisualizationPlatform = Object.freeze({
  metadata: ChartMetricVisualizationPlatformMetadata,
  identity: ChartMetricVisualizationPlatformIdentityMetadata,
  inventory: ChartMetricVisualizationPlatformInventoryMetadata,
  readiness: ChartMetricVisualizationPlatformReadinessMetadata,
  manifest: ChartMetricVisualizationManifestPlatform,
  composition: ChartMetricVisualizationPlatformComposition,
  capabilities: ChartMetricVisualizationPlatformCapabilities,
  guarantees: ChartMetricVisualizationPlatformGuarantees,
  compatibility: ChartMetricVisualizationPlatformCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const platformSummary = Object.freeze({
  identity: ChartMetricVisualizationPlatformIdentityMetadata,
  status: ChartMetricVisualizationPlatformIdentityMetadata.status,
  readiness: ChartMetricVisualizationPlatformReadinessMetadata,
  inventory: ChartMetricVisualizationPlatformInventoryMetadata,
  manifestReference: ChartMetricVisualizationManifestPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getChartMetricVisualizationPlatformSummary = () => platformSummary;

export const getChartMetricVisualizationPlatformCount = () =>
  ChartMetricVisualizationPlatformComposition.length;

export const getChartMetricVisualizationPlatformReleaseMetadata = () => Object.freeze({
  ...ChartMetricVisualizationPlatformIdentityMetadata,
  readiness: ChartMetricVisualizationPlatformReadinessMetadata.status,
  manifestReference: ChartMetricVisualizationManifestPlatform.metadata.id,
});
