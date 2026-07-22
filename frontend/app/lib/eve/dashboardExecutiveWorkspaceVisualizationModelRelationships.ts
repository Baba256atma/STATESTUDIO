import type {
  DashboardExecutiveWorkspaceModelName,
  DashboardExecutiveWorkspaceModelRelationship,
} from "./dashboardExecutiveWorkspaceVisualizationModelTypes.ts";
import { DashboardExecutiveWorkspaceVisualizationRegistryPlatform } from "./dashboardExecutiveWorkspaceVisualizationRegistry.ts";

const relationshipSeeds = Object.freeze([
  ["ExecutiveWorkspaceModel", "WorkspaceIdentityModel", "workspaceIdentityReference"],
  ["ExecutiveWorkspaceModel", "WorkspaceLayoutModel", "layoutReference"],
  ["ExecutiveWorkspaceModel", "WorkspaceZoneModel", "zoneReferences"],
  ["ExecutiveWorkspaceModel", "WorkspaceSectionModel", "sectionReferences"],
  ["ExecutiveWorkspaceModel", "DashboardModel", "dashboardReferences"],
  ["ExecutiveWorkspaceModel", "WorkspaceContextModel", "contextReference"],
  ["ExecutiveWorkspaceModel", "WorkspacePresentationModel", "presentationReference"],
  ["ExecutiveWorkspaceModel", "WorkspaceExportModel", "exportReference"],
  ["DashboardModel", "DashboardLayoutModel", "layoutReference"],
  ["DashboardModel", "DashboardTemplateModel", "templateReference"],
  ["DashboardModel", "DashboardWidgetModel", "widgetReferences"],
  ["DashboardModel", "DashboardPanelModel", "panelReferences"],
  ["DashboardPanelModel", "ExecutiveCardModel", "executiveCardReferences"],
  ["DashboardPanelModel", "KpiPanelModel", "kpiPanelReferences"],
  ["DashboardPanelModel", "ChartPanelModel", "chartPanelReferences"],
  ["DashboardPanelModel", "TimelinePanelModel", "timelinePanelReferences"],
  ["DashboardPanelModel", "GraphPanelModel", "graphPanelReferences"],
  ["DashboardModel", "NavigationPanelModel", "navigationReference"],
  ["DashboardModel", "FilterPanelModel", "filterReference"],
  ["DashboardModel", "DashboardOutputModel", "outputReference"],
] as const satisfies readonly [DashboardExecutiveWorkspaceModelName,
  DashboardExecutiveWorkspaceModelName, string][]);

export const DashboardExecutiveWorkspaceVisualizationModelRelationships:
readonly DashboardExecutiveWorkspaceModelRelationship[] = Object.freeze(
  relationshipSeeds.map(([sourceModel, targetModel, referenceField], index) =>
    Object.freeze({
      id: `EVE-6:3/Relationship/${sourceModel}-${targetModel}` as const,
      sourceModel,
      targetModel,
      referenceField,
      registryReference:
        DashboardExecutiveWorkspaceVisualizationRegistryPlatform.metadata.id,
      deterministicOrder: index + 1,
      traversalProvided: false as const,
      resolutionProvided: false as const,
      executionProvided: false as const,
      metadataOnly: true as const,
      immutable: true as const,
    })),
);
