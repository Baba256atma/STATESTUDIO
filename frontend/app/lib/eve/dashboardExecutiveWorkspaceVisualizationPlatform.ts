import { DashboardExecutiveWorkspaceVisualizationManifestPlatform } from "./dashboardExecutiveWorkspaceVisualizationManifest.ts";
import { DashboardExecutiveWorkspaceVisualizationPlatformCapabilities } from "./dashboardExecutiveWorkspaceVisualizationPlatformCapabilities.ts";
import { DashboardExecutiveWorkspaceVisualizationPlatformCompatibility } from "./dashboardExecutiveWorkspaceVisualizationPlatformCompatibility.ts";
import { DashboardExecutiveWorkspaceVisualizationPlatformGuarantees } from "./dashboardExecutiveWorkspaceVisualizationPlatformGuarantees.ts";
import {
  DashboardExecutiveWorkspaceVisualizationPlatformComposition,
  DashboardExecutiveWorkspaceVisualizationPlatformInventory,
} from "./dashboardExecutiveWorkspaceVisualizationPlatformInventory.ts";
import {
  DashboardExecutiveWorkspaceVisualizationPlatformIdentity,
  DashboardExecutiveWorkspaceVisualizationPlatformMetadataRecord,
  DashboardExecutiveWorkspaceVisualizationPlatformReadiness,
} from "./dashboardExecutiveWorkspaceVisualizationPlatformMetadata.ts";

export const DashboardExecutiveWorkspaceVisualizationPlatformIdentityMetadata =
  DashboardExecutiveWorkspaceVisualizationPlatformIdentity;

export const DashboardExecutiveWorkspaceVisualizationPlatformReadinessMetadata =
  DashboardExecutiveWorkspaceVisualizationPlatformReadiness;

export const DashboardExecutiveWorkspaceVisualizationPlatformInventoryMetadata =
  DashboardExecutiveWorkspaceVisualizationPlatformInventory;

export const DashboardExecutiveWorkspaceVisualizationPlatformMetadata =
  DashboardExecutiveWorkspaceVisualizationPlatformMetadataRecord;

export const DashboardExecutiveWorkspaceVisualizationPlatform = Object.freeze({
  metadata: DashboardExecutiveWorkspaceVisualizationPlatformMetadata,
  identity: DashboardExecutiveWorkspaceVisualizationPlatformIdentityMetadata,
  inventory: DashboardExecutiveWorkspaceVisualizationPlatformInventoryMetadata,
  readiness: DashboardExecutiveWorkspaceVisualizationPlatformReadinessMetadata,
  manifest: DashboardExecutiveWorkspaceVisualizationManifestPlatform,
  composition: DashboardExecutiveWorkspaceVisualizationPlatformComposition,
  capabilities: DashboardExecutiveWorkspaceVisualizationPlatformCapabilities,
  guarantees: DashboardExecutiveWorkspaceVisualizationPlatformGuarantees,
  compatibility: DashboardExecutiveWorkspaceVisualizationPlatformCompatibility,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const platformSummary = Object.freeze({
  identity: DashboardExecutiveWorkspaceVisualizationPlatformIdentityMetadata,
  status: DashboardExecutiveWorkspaceVisualizationPlatformIdentityMetadata.status,
  readiness: DashboardExecutiveWorkspaceVisualizationPlatformReadinessMetadata,
  inventory: DashboardExecutiveWorkspaceVisualizationPlatformInventoryMetadata,
  manifestReference:
    DashboardExecutiveWorkspaceVisualizationManifestPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getDashboardExecutiveWorkspaceVisualizationPlatformSummary = () =>
  platformSummary;

export const getDashboardExecutiveWorkspaceVisualizationPlatformCount = () =>
  DashboardExecutiveWorkspaceVisualizationPlatformComposition.length;

export const getDashboardExecutiveWorkspaceVisualizationPlatformReleaseMetadata = () =>
  Object.freeze({
    ...DashboardExecutiveWorkspaceVisualizationPlatformIdentityMetadata,
    readiness:
      DashboardExecutiveWorkspaceVisualizationPlatformReadinessMetadata.status,
    manifestReference:
      DashboardExecutiveWorkspaceVisualizationManifestPlatform.metadata.id,
  });
