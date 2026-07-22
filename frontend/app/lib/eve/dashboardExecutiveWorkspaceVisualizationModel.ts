import {
  DashboardExecutiveWorkspaceVisualizationModelDescriptors,
  DashboardExecutiveWorkspaceVisualizationStructuralComposition,
} from "./dashboardExecutiveWorkspaceVisualizationModelDescriptors.ts";
import { DashboardExecutiveWorkspaceVisualizationModelInventory } from "./dashboardExecutiveWorkspaceVisualizationModelInventory.ts";
import {
  DashboardExecutiveWorkspaceVisualizationModelIdentity,
  DashboardExecutiveWorkspaceVisualizationModelMetadataRecord,
  DashboardExecutiveWorkspaceVisualizationModelReadiness,
} from "./dashboardExecutiveWorkspaceVisualizationModelMetadata.ts";
import { DashboardExecutiveWorkspaceVisualizationModelPolicies } from "./dashboardExecutiveWorkspaceVisualizationModelPolicies.ts";
import { DashboardExecutiveWorkspaceVisualizationModelRelationships } from "./dashboardExecutiveWorkspaceVisualizationModelRelationships.ts";
import { DashboardExecutiveWorkspaceVisualizationRegistryPlatform } from "./dashboardExecutiveWorkspaceVisualizationRegistry.ts";

export const DashboardExecutiveWorkspaceVisualizationModelIdentityMetadata =
  DashboardExecutiveWorkspaceVisualizationModelIdentity;

export const DashboardExecutiveWorkspaceVisualizationModelReadinessMetadata =
  DashboardExecutiveWorkspaceVisualizationModelReadiness;

export const DashboardExecutiveWorkspaceVisualizationModelInventoryMetadata =
  DashboardExecutiveWorkspaceVisualizationModelInventory;

export const DashboardExecutiveWorkspaceVisualizationModelMetadata =
  DashboardExecutiveWorkspaceVisualizationModelMetadataRecord;

export const DashboardExecutiveWorkspaceVisualizationModelPlatform = Object.freeze({
  metadata: DashboardExecutiveWorkspaceVisualizationModelMetadata,
  identity: DashboardExecutiveWorkspaceVisualizationModelIdentityMetadata,
  inventory: DashboardExecutiveWorkspaceVisualizationModelInventoryMetadata,
  readiness: DashboardExecutiveWorkspaceVisualizationModelReadinessMetadata,
  registry: DashboardExecutiveWorkspaceVisualizationRegistryPlatform,
  descriptors: DashboardExecutiveWorkspaceVisualizationModelDescriptors,
  relationships: DashboardExecutiveWorkspaceVisualizationModelRelationships,
  composition: DashboardExecutiveWorkspaceVisualizationStructuralComposition,
  policies: DashboardExecutiveWorkspaceVisualizationModelPolicies,
  metadataOnly: true,
  immutable: true,
  deterministic: true,
} as const);

const modelSummary = Object.freeze({
  identity: DashboardExecutiveWorkspaceVisualizationModelIdentityMetadata,
  status: DashboardExecutiveWorkspaceVisualizationModelIdentityMetadata.status,
  readiness: DashboardExecutiveWorkspaceVisualizationModelReadinessMetadata,
  inventory: DashboardExecutiveWorkspaceVisualizationModelInventoryMetadata,
  registryReference:
    DashboardExecutiveWorkspaceVisualizationRegistryPlatform.metadata.id,
  metadataOnly: true,
  immutable: true,
} as const);

export const getDashboardExecutiveWorkspaceVisualizationModelSummary = () =>
  modelSummary;

export const getDashboardExecutiveWorkspaceVisualizationModelCount = () =>
  DashboardExecutiveWorkspaceVisualizationModelDescriptors.length;

export const getDashboardExecutiveWorkspaceVisualizationModelReleaseMetadata = () =>
  Object.freeze({
    ...DashboardExecutiveWorkspaceVisualizationModelIdentityMetadata,
    readiness: DashboardExecutiveWorkspaceVisualizationModelReadinessMetadata.status,
    registryReference:
      DashboardExecutiveWorkspaceVisualizationRegistryPlatform.metadata.id,
  });
