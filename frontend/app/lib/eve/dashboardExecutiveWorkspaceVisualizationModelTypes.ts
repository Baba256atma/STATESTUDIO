import type * as Registry from "./dashboardExecutiveWorkspaceVisualizationRegistry.ts";

export type DashboardExecutiveWorkspaceModelName =
  | "ExecutiveWorkspaceModel" | "WorkspaceIdentityModel" | "WorkspaceLayoutModel"
  | "WorkspaceZoneModel" | "WorkspaceSectionModel" | "DashboardModel"
  | "DashboardLayoutModel" | "DashboardTemplateModel" | "DashboardWidgetModel"
  | "DashboardPanelModel" | "ExecutiveCardModel" | "KpiPanelModel"
  | "ChartPanelModel" | "TimelinePanelModel" | "GraphPanelModel"
  | "NavigationPanelModel" | "FilterPanelModel" | "WorkspaceContextModel"
  | "DashboardOutputModel" | "WorkspaceExportModel" | "WorkspacePresentationModel"
  | "DashboardExtensionModel";

type RegistryVocabulary =
  typeof Registry.DashboardExecutiveWorkspaceVisualizationRegistryPlatform
    .vocabularyRegistries[number];
type RegistryCategory =
  typeof Registry.DashboardExecutiveWorkspaceVisualizationRegistryPlatform.categories[number];

export interface DashboardExecutiveWorkspaceModelDescriptor {
  readonly id: `EVE-6:3/Model/${DashboardExecutiveWorkspaceModelName}`;
  readonly canonicalName: DashboardExecutiveWorkspaceModelName;
  readonly modelKind: string;
  readonly namespace: `nexora.eve.dashboard-executive-workspace-visualization.model.${string}`;
  readonly version: "1.0.0";
  readonly registryVocabularyReference: RegistryVocabulary;
  readonly registryCategoryReference: RegistryCategory;
  readonly ownershipReference: unknown;
  readonly lifecycleApplicability: unknown;
  readonly capabilityReferences: readonly unknown[];
  readonly boundaryReferences: readonly unknown[];
  readonly structuralMetadata: readonly string[];
  readonly compatibilityMetadata: Readonly<{ registryCompatible: true }>;
  readonly extensionMetadata: Readonly<{ classificationReference: unknown }>;
  readonly deterministicOrder: number;
  readonly stability: "Stable";
  readonly executableBehavior: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspaceModelRelationship {
  readonly id: `EVE-6:3/Relationship/${string}`;
  readonly sourceModel: DashboardExecutiveWorkspaceModelName;
  readonly targetModel: DashboardExecutiveWorkspaceModelName;
  readonly referenceField: string;
  readonly registryReference: "EVE-6:2/DashboardExecutiveWorkspaceVisualizationRegistry";
  readonly deterministicOrder: number;
  readonly traversalProvided: false;
  readonly resolutionProvided: false;
  readonly executionProvided: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}
