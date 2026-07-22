import { VisualizationSuiteManifestPlatform } from "./visualizationSuiteManifest.ts";
import { VisualizationSuitePlatformCapabilities } from "./visualizationSuitePlatformCapabilities.ts";
import { VisualizationSuitePlatformCompatibility } from "./visualizationSuitePlatformCompatibility.ts";
import { VisualizationSuitePlatformGuarantees } from "./visualizationSuitePlatformGuarantees.ts";
import {
  VisualizationSuitePlatformComposition,
  VisualizationSuitePlatformInventory,
} from "./visualizationSuitePlatformInventory.ts";
import {
  VisualizationSuitePlatformIdentity,
  VisualizationSuitePlatformMetadataRecord,
  VisualizationSuitePlatformReadiness,
} from "./visualizationSuitePlatformMetadata.ts";

export const VisualizationSuitePlatformIdentityMetadata =
  VisualizationSuitePlatformIdentity;
export const VisualizationSuitePlatformReadinessMetadata =
  VisualizationSuitePlatformReadiness;
export const VisualizationSuitePlatformInventoryMetadata =
  VisualizationSuitePlatformInventory;
export const VisualizationSuitePlatformMetadata =
  VisualizationSuitePlatformMetadataRecord;

export const VisualizationSuitePlatform = Object.freeze({
  metadata: VisualizationSuitePlatformMetadata,
  identity: VisualizationSuitePlatformIdentityMetadata,
  inventory: VisualizationSuitePlatformInventoryMetadata,
  readiness: VisualizationSuitePlatformReadinessMetadata,
  manifest: VisualizationSuiteManifestPlatform,
  composition: VisualizationSuitePlatformComposition,
  capabilities: VisualizationSuitePlatformCapabilities,
  guarantees: VisualizationSuitePlatformGuarantees,
  compatibility: VisualizationSuitePlatformCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const platformSummary = Object.freeze({
  identity: VisualizationSuitePlatformIdentityMetadata,
  status: VisualizationSuitePlatformIdentityMetadata.status,
  readiness: VisualizationSuitePlatformReadinessMetadata,
  inventory: VisualizationSuitePlatformInventoryMetadata,
  manifestReference: VisualizationSuiteManifestPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationSuitePlatformSummary = () => platformSummary;
export const getVisualizationSuitePlatformCount = () =>
  VisualizationSuitePlatformComposition.length;
export const getVisualizationSuitePlatformReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationSuitePlatformIdentityMetadata,
    readiness: VisualizationSuitePlatformReadinessMetadata.status,
    manifestReference: VisualizationSuiteManifestPlatform.metadata.id,
  });
