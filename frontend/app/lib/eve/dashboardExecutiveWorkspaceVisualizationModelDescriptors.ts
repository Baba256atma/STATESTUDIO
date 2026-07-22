import type {
  DashboardExecutiveWorkspaceModelDescriptor,
  DashboardExecutiveWorkspaceModelName,
} from "./dashboardExecutiveWorkspaceVisualizationModelTypes.ts";
import { DashboardExecutiveWorkspaceVisualizationRegistryPlatform } from "./dashboardExecutiveWorkspaceVisualizationRegistry.ts";

const descriptorSeeds = Object.freeze([
  ["ExecutiveWorkspaceModel", "WorkspaceRoot", ["workspaceIdentityReference", "layoutReference", "zoneReferences", "sectionReferences", "dashboardReferences", "contextReference", "presentationReference", "exportReference", "compatibilityMetadata"]],
  ["WorkspaceIdentityModel", "WorkspaceIdentity", ["stableId", "canonicalName", "ownerReference", "registryReference"]],
  ["WorkspaceLayoutModel", "WorkspaceLayout", ["layoutIdentity", "layoutMode", "zoneOrdering", "sectionOrdering", "responsiveIntent", "densityIntent", "sizingIntent", "placementIntent", "compatibilityMetadata"]],
  ["WorkspaceZoneModel", "WorkspaceZone", ["zoneIdentity", "zoneType", "parentLayoutReference", "sectionReferences", "orderingIntent", "visibilityIntent", "presentationIntent"]],
  ["WorkspaceSectionModel", "WorkspaceSection", ["sectionIdentity", "zoneReference", "dashboardOrPanelReferences", "orderingIntent", "visibilityIntent", "presentationIntent", "extensionMetadata"]],
  ["DashboardModel", "DashboardRoot", ["dashboardIdentity", "layoutReference", "templateReference", "widgetReferences", "panelReferences", "navigationReference", "filterReference", "contextCompatibility", "outputReference", "presentationMetadata"]],
  ["DashboardLayoutModel", "DashboardLayout", ["layoutIdentity", "layoutFamily", "regionReferences", "orderingIntent", "placementIntent", "responsiveIntent", "densityIntent", "compatibilityMetadata"]],
  ["DashboardTemplateModel", "DashboardTemplate", ["templateIdentity", "templateIntent", "supportedPanelFamilies", "supportedWidgetFamilies", "requiredZoneIntents", "presentationProfile", "compatibilityMetadata"]],
  ["DashboardWidgetModel", "DashboardWidget", ["widgetIdentity", "widgetFamily", "sourceReference", "panelReference", "presentationIntent", "visibilityIntent", "interactionIntent", "compatibilityMetadata", "extensionMetadata"]],
  ["DashboardPanelModel", "DashboardPanel", ["panelIdentity", "panelFamily", "widgetReferences", "contentReferences", "layoutReference", "presentationIntent", "outputCompatibility"]],
  ["ExecutiveCardModel", "ExecutiveCardPanel", ["cardIdentity", "metricReferences", "presentationHierarchy", "sourceReference"]],
  ["KpiPanelModel", "KpiPanel", ["panelIdentity", "kpiReferences", "presentationIntent", "sourceReference"]],
  ["ChartPanelModel", "ChartPanel", ["panelIdentity", "chartReferences", "presentationIntent", "sourceReference"]],
  ["TimelinePanelModel", "TimelinePanel", ["panelIdentity", "timelineReferences", "presentationIntent", "sourceReference"]],
  ["GraphPanelModel", "GraphPanel", ["panelIdentity", "graphReferences", "presentationIntent", "sourceReference"]],
  ["NavigationPanelModel", "NavigationPanel", ["panelIdentity", "navigationType", "targetReferences", "presentationIntent"]],
  ["FilterPanelModel", "FilterPanel", ["panelIdentity", "filterReferences", "scopeReference", "presentationIntent"]],
  ["WorkspaceContextModel", "WorkspaceContext", ["contextIdentity", "workspaceReference", "executiveRoleIntent", "scenarioReference", "temporalReference", "filterContextReference", "visibilityContextReference", "compatibilityMetadata"]],
  ["DashboardOutputModel", "DashboardOutput", ["outputIdentity", "dashboardReference", "workspaceReference", "outputProfile", "sceneTargetReference", "compatibilityMetadata", "extensionMetadata"]],
  ["WorkspaceExportModel", "WorkspaceExport", ["exportIdentity", "workspaceReference", "dashboardReferences", "exportProfile", "contentIntent", "compatibilityMetadata"]],
  ["WorkspacePresentationModel", "WorkspacePresentation", ["presentationIdentity", "workspaceReference", "themeIntent", "densityIntent", "accessibilityIntent", "localizationIntent", "displayModeIntent", "compatibilityMetadata"]],
  ["DashboardExtensionModel", "DashboardExtension", ["extensionIdentity", "extensionType", "compatibilityReference"]],
] as const satisfies readonly [DashboardExecutiveWorkspaceModelName, string,
  readonly string[]][]);

const registry = DashboardExecutiveWorkspaceVisualizationRegistryPlatform;

export const DashboardExecutiveWorkspaceVisualizationModelDescriptors:
readonly DashboardExecutiveWorkspaceModelDescriptor[] = Object.freeze(descriptorSeeds.map(
  ([canonicalName, modelKind, structuralMetadata], index) => Object.freeze({
    id: `EVE-6:3/Model/${canonicalName}` as const,
    canonicalName,
    modelKind,
    namespace: `nexora.eve.dashboard-executive-workspace-visualization.model.${canonicalName.toLowerCase()}` as const,
    version: "1.0.0" as const,
    registryVocabularyReference: registry.vocabularyRegistries[index]!,
    registryCategoryReference: registry.categories[index]!,
    ownershipReference: registry.foundation.ownership,
    lifecycleApplicability: registry.foundation.lifecycle,
    capabilityReferences: registry.foundation.capabilities,
    boundaryReferences: registry.foundation.boundaries,
    structuralMetadata: Object.freeze([...structuralMetadata]),
    compatibilityMetadata: Object.freeze({ registryCompatible: true as const }),
    extensionMetadata: Object.freeze({
      classificationReference: registry.extensions[index % registry.extensions.length],
    }),
    deterministicOrder: index + 1,
    stability: "Stable" as const,
    executableBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

const compositionSeeds = Object.freeze([
  ["Workspace root", 0], ["Workspace identity", 1], ["Workspace layout", 2],
  ["Workspace zone collection", 3], ["Workspace section collection", 4],
  ["Dashboard collection", 5], ["Dashboard root", 5], ["Dashboard layout", 6],
  ["Dashboard template", 7], ["Widget collection", 8], ["Panel collection", 9],
  ["Executive-card collection", 10], ["KPI-panel collection", 11],
  ["Chart-panel collection", 12], ["Timeline-panel collection", 13],
  ["Graph-panel collection", 14], ["Navigation collection", 15],
  ["Filter collection", 16], ["Output and export references", 18],
  ["Context and presentation references", 17],
] as const);

export const DashboardExecutiveWorkspaceVisualizationStructuralComposition = Object.freeze(
  compositionSeeds.map(([name, modelIndex], index) => Object.freeze({
    id: `EVE-6:3/Composition/${index + 1}` as const,
    name,
    modelReference: DashboardExecutiveWorkspaceVisualizationModelDescriptors[modelIndex]!,
    deterministicOrder: index + 1,
    compositionExecution: false,
    metadataOnly: true,
    immutable: true,
  })),
);
