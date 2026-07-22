import {
  ChartMetricVisualizationModelDescriptors,
  ChartMetricVisualizationStructuralComposition,
} from "./chartMetricVisualizationModelDescriptors.ts";
import { ChartMetricVisualizationModelInventory } from "./chartMetricVisualizationModelInventory.ts";
import {
  ChartMetricVisualizationModelIdentity,
  ChartMetricVisualizationModelMetadataRecord,
  ChartMetricVisualizationModelReadiness,
} from "./chartMetricVisualizationModelMetadata.ts";
import { ChartMetricVisualizationModelPolicies } from "./chartMetricVisualizationModelPolicies.ts";
import { ChartMetricVisualizationModelRelationships } from "./chartMetricVisualizationModelRelationships.ts";
import { ChartMetricVisualizationRegistryPlatform } from "./chartMetricVisualizationRegistry.ts";

export const ChartMetricVisualizationModelIdentityMetadata =
  ChartMetricVisualizationModelIdentity;

export const ChartMetricVisualizationModelReadinessMetadata =
  ChartMetricVisualizationModelReadiness;

export const ChartMetricVisualizationModelInventoryMetadata =
  ChartMetricVisualizationModelInventory;

export const ChartMetricVisualizationModelMetadata =
  ChartMetricVisualizationModelMetadataRecord;

export const ChartMetricVisualizationModelPlatform = Object.freeze({
  metadata: ChartMetricVisualizationModelMetadata,
  identity: ChartMetricVisualizationModelIdentityMetadata,
  inventory: ChartMetricVisualizationModelInventoryMetadata,
  readiness: ChartMetricVisualizationModelReadinessMetadata,
  registry: ChartMetricVisualizationRegistryPlatform,
  descriptors: ChartMetricVisualizationModelDescriptors,
  relationships: ChartMetricVisualizationModelRelationships,
  composition: ChartMetricVisualizationStructuralComposition,
  policies: ChartMetricVisualizationModelPolicies,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const modelSummary = Object.freeze({
  identity: ChartMetricVisualizationModelIdentityMetadata,
  status: ChartMetricVisualizationModelIdentityMetadata.status,
  readiness: ChartMetricVisualizationModelReadinessMetadata,
  inventory: ChartMetricVisualizationModelInventoryMetadata,
  registryReference: ChartMetricVisualizationRegistryPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getChartMetricVisualizationModelSummary = () => modelSummary;

export const getChartMetricVisualizationModelCount = () =>
  ChartMetricVisualizationModelDescriptors.length;

export const getChartMetricVisualizationModelReleaseMetadata = () => Object.freeze({
  ...ChartMetricVisualizationModelIdentityMetadata,
  readiness: ChartMetricVisualizationModelReadinessMetadata.status,
  registryReference: ChartMetricVisualizationRegistryPlatform.metadata.id,
});
