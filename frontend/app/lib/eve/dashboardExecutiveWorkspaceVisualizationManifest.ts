import { DashboardExecutiveWorkspaceVisualizationManifestCompatibility } from "./dashboardExecutiveWorkspaceVisualizationManifestCompatibility.ts";
import { DashboardExecutiveWorkspaceVisualizationManifestGuarantees } from "./dashboardExecutiveWorkspaceVisualizationManifestGuarantees.ts";
import { DashboardExecutiveWorkspaceVisualizationManifestInventory } from "./dashboardExecutiveWorkspaceVisualizationManifestInventory.ts";
import {
  DashboardExecutiveWorkspaceVisualizationManifestIdentity,
  DashboardExecutiveWorkspaceVisualizationManifestMetadataRecord,
  DashboardExecutiveWorkspaceVisualizationManifestReadinessMetadataRecord,
} from "./dashboardExecutiveWorkspaceVisualizationManifestMetadata.ts";
import {
  DashboardExecutiveWorkspaceVisualizationManifestComposition,
  DashboardExecutiveWorkspaceVisualizationManifestReadiness,
} from "./dashboardExecutiveWorkspaceVisualizationManifestReadiness.ts";
import { DashboardExecutiveWorkspaceVisualizationValidationPlatform } from "./dashboardExecutiveWorkspaceVisualizationValidation.ts";

export const DashboardExecutiveWorkspaceVisualizationManifestIdentityMetadata =
  DashboardExecutiveWorkspaceVisualizationManifestIdentity;

export const DashboardExecutiveWorkspaceVisualizationManifestReadinessMetadata =
  DashboardExecutiveWorkspaceVisualizationManifestReadinessMetadataRecord;

export const DashboardExecutiveWorkspaceVisualizationManifestInventoryMetadata =
  DashboardExecutiveWorkspaceVisualizationManifestInventory;

export const DashboardExecutiveWorkspaceVisualizationManifestMetadata =
  DashboardExecutiveWorkspaceVisualizationManifestMetadataRecord;

export const DashboardExecutiveWorkspaceVisualizationManifestPlatform = Object.freeze({
  metadata: DashboardExecutiveWorkspaceVisualizationManifestMetadata,
  identity: DashboardExecutiveWorkspaceVisualizationManifestIdentityMetadata,
  inventory: DashboardExecutiveWorkspaceVisualizationManifestInventoryMetadata,
  readiness: DashboardExecutiveWorkspaceVisualizationManifestReadinessMetadata,
  validation: DashboardExecutiveWorkspaceVisualizationValidationPlatform,
  composition: DashboardExecutiveWorkspaceVisualizationManifestComposition,
  guarantees: DashboardExecutiveWorkspaceVisualizationManifestGuarantees,
  compatibility: DashboardExecutiveWorkspaceVisualizationManifestCompatibility,
  readinessDeclarations:
    DashboardExecutiveWorkspaceVisualizationManifestReadiness,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const manifestSummary = Object.freeze({
  identity: DashboardExecutiveWorkspaceVisualizationManifestIdentityMetadata,
  status: DashboardExecutiveWorkspaceVisualizationManifestIdentityMetadata.status,
  readiness: DashboardExecutiveWorkspaceVisualizationManifestReadinessMetadata,
  inventory: DashboardExecutiveWorkspaceVisualizationManifestInventoryMetadata,
  validationReference:
    DashboardExecutiveWorkspaceVisualizationValidationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getDashboardExecutiveWorkspaceVisualizationManifestSummary = () =>
  manifestSummary;

export const getDashboardExecutiveWorkspaceVisualizationManifestCount = () =>
  DashboardExecutiveWorkspaceVisualizationManifestComposition.length;

export const getDashboardExecutiveWorkspaceVisualizationManifestReleaseMetadata = () =>
  Object.freeze({
    ...DashboardExecutiveWorkspaceVisualizationManifestIdentityMetadata,
    readiness:
      DashboardExecutiveWorkspaceVisualizationManifestReadinessMetadata.status,
    validationReference:
      DashboardExecutiveWorkspaceVisualizationValidationPlatform.metadata.id,
  });
