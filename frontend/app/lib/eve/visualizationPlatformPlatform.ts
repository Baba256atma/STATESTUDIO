import { VisualizationPlatformManifestPlatform } from "./visualizationPlatformManifest.ts";
import { VisualizationPlatformPlatformCapabilities } from "./visualizationPlatformPlatformCapabilities.ts";
import { VisualizationPlatformPlatformCompatibility } from "./visualizationPlatformPlatformCompatibility.ts";
import { VisualizationPlatformPlatformGuarantees } from "./visualizationPlatformPlatformGuarantees.ts";
import {
  VisualizationPlatformPlatformComposition,
  VisualizationPlatformPlatformInventory,
} from "./visualizationPlatformPlatformInventory.ts";
import {
  VisualizationPlatformPlatformIdentity,
  VisualizationPlatformPlatformMetadataRecord,
  VisualizationPlatformPlatformReadiness,
} from "./visualizationPlatformPlatformMetadata.ts";

export const VisualizationPlatformPlatformIdentityMetadata =
  VisualizationPlatformPlatformIdentity;
export const VisualizationPlatformPlatformReadinessMetadata =
  VisualizationPlatformPlatformReadiness;
export const VisualizationPlatformPlatformInventoryMetadata =
  VisualizationPlatformPlatformInventory;
export const VisualizationPlatformPlatformMetadata =
  VisualizationPlatformPlatformMetadataRecord;

export const VisualizationPlatformPlatform = Object.freeze({
  metadata: VisualizationPlatformPlatformMetadata,
  identity: VisualizationPlatformPlatformIdentityMetadata,
  inventory: VisualizationPlatformPlatformInventoryMetadata,
  readiness: VisualizationPlatformPlatformReadinessMetadata,
  manifest: VisualizationPlatformManifestPlatform,
  composition: VisualizationPlatformPlatformComposition,
  capabilities: VisualizationPlatformPlatformCapabilities,
  guarantees: VisualizationPlatformPlatformGuarantees,
  compatibility: VisualizationPlatformPlatformCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const platformSummary = Object.freeze({
  identity: VisualizationPlatformPlatformIdentityMetadata,
  status: VisualizationPlatformPlatformIdentityMetadata.status,
  readiness: VisualizationPlatformPlatformReadinessMetadata,
  inventory: VisualizationPlatformPlatformInventoryMetadata,
  manifestReference: VisualizationPlatformManifestPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getVisualizationPlatformPlatformSummary = () => platformSummary;
export const getVisualizationPlatformPlatformCount = () =>
  VisualizationPlatformPlatformComposition.length;
export const getVisualizationPlatformPlatformReleaseMetadata = () =>
  Object.freeze({
    ...VisualizationPlatformPlatformIdentityMetadata,
    readiness: VisualizationPlatformPlatformReadinessMetadata.status,
    manifestReference: VisualizationPlatformManifestPlatform.metadata.id,
  });
