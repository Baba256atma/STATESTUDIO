import { DashboardExecutiveWorkspaceVisualizationCertificationCompatibility } from "./dashboardExecutiveWorkspaceVisualizationCertificationCompatibility.ts";
import { DashboardExecutiveWorkspaceVisualizationCertificationCriteria } from "./dashboardExecutiveWorkspaceVisualizationCertificationCriteria.ts";
import { DashboardExecutiveWorkspaceVisualizationCertificationInventory } from "./dashboardExecutiveWorkspaceVisualizationCertificationInventory.ts";
import {
  DashboardExecutiveWorkspaceVisualizationCertificationIdentity,
  DashboardExecutiveWorkspaceVisualizationCertificationMetadataRecord,
  DashboardExecutiveWorkspaceVisualizationCertificationReadiness,
} from "./dashboardExecutiveWorkspaceVisualizationCertificationMetadata.ts";
import { DashboardExecutiveWorkspaceVisualizationCertificationGates } from "./dashboardExecutiveWorkspaceVisualizationCertificationReadiness.ts";
import { DashboardExecutiveWorkspaceVisualizationPlatform } from "./dashboardExecutiveWorkspaceVisualizationPlatform.ts";

export const DashboardExecutiveWorkspaceVisualizationCertificationIdentityMetadata =
  DashboardExecutiveWorkspaceVisualizationCertificationIdentity;

export const DashboardExecutiveWorkspaceVisualizationCertificationReadinessMetadata =
  DashboardExecutiveWorkspaceVisualizationCertificationReadiness;

export const DashboardExecutiveWorkspaceVisualizationCertificationInventoryMetadata =
  DashboardExecutiveWorkspaceVisualizationCertificationInventory;

export const DashboardExecutiveWorkspaceVisualizationCertificationMetadata =
  DashboardExecutiveWorkspaceVisualizationCertificationMetadataRecord;

export const DashboardExecutiveWorkspaceVisualizationCertificationPlatform =
  Object.freeze({
    metadata: DashboardExecutiveWorkspaceVisualizationCertificationMetadata,
    identity:
      DashboardExecutiveWorkspaceVisualizationCertificationIdentityMetadata,
    inventory:
      DashboardExecutiveWorkspaceVisualizationCertificationInventoryMetadata,
    readiness:
      DashboardExecutiveWorkspaceVisualizationCertificationReadinessMetadata,
    platform: DashboardExecutiveWorkspaceVisualizationPlatform,
    criteria: DashboardExecutiveWorkspaceVisualizationCertificationCriteria,
    gates: DashboardExecutiveWorkspaceVisualizationCertificationGates,
    compatibility:
      DashboardExecutiveWorkspaceVisualizationCertificationCompatibility,
    metadataOnly: true,
    immutable: true,
    deterministic: true,
  } as const);

const certificationSummary = Object.freeze({
  identity: DashboardExecutiveWorkspaceVisualizationCertificationIdentityMetadata,
  status: DashboardExecutiveWorkspaceVisualizationCertificationIdentityMetadata.status,
  readiness:
    DashboardExecutiveWorkspaceVisualizationCertificationReadinessMetadata,
  inventory:
    DashboardExecutiveWorkspaceVisualizationCertificationInventoryMetadata,
  platformReference: DashboardExecutiveWorkspaceVisualizationPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getDashboardExecutiveWorkspaceVisualizationCertificationSummary = () =>
  certificationSummary;

export const getDashboardExecutiveWorkspaceVisualizationCertificationCount = () =>
  DashboardExecutiveWorkspaceVisualizationCertificationCriteria.length;

export const getDashboardExecutiveWorkspaceVisualizationCertificationReleaseMetadata = () =>
  Object.freeze({
    ...DashboardExecutiveWorkspaceVisualizationCertificationIdentityMetadata,
    readiness:
      DashboardExecutiveWorkspaceVisualizationCertificationReadinessMetadata.readiness,
    platformReference: DashboardExecutiveWorkspaceVisualizationPlatform.metadata.id,
  });
