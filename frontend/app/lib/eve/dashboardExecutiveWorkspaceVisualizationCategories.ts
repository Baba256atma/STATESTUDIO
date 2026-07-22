import type { DashboardExecutiveWorkspaceRegistryCategory } from "./dashboardExecutiveWorkspaceVisualizationRegistryTypes.ts";
import { DashboardExecutiveWorkspaceVisualizationVocabularyRegistries } from "./dashboardExecutiveWorkspaceVisualizationVocabulary.ts";

const categorySeeds = Object.freeze([
  ["Workspaces", "Workspaces"], ["WorkspaceIdentities", "Workspace identities"],
  ["WorkspaceLayouts", "Workspace layouts"], ["WorkspaceZones", "Workspace zones"],
  ["WorkspaceSections", "Workspace sections"], ["Dashboards", "Dashboards"],
  ["DashboardLayouts", "Dashboard layouts"], ["DashboardTemplates", "Dashboard templates"],
  ["Widgets", "Widgets"], ["Panels", "Panels"], ["ExecutiveCards", "Executive cards"],
  ["KPIPanels", "KPI panels"], ["ChartPanels", "Chart panels"],
  ["TimelinePanels", "Timeline panels"], ["GraphPanels", "Graph panels"],
  ["Navigation", "Navigation"], ["Filters", "Filters"], ["Context", "Context"],
  ["Outputs", "Outputs"], ["Exports", "Exports"], ["Presentation", "Presentation"],
  ["Extensions", "Extensions"],
] as const);

export const DashboardExecutiveWorkspaceVisualizationRegistryCategories:
readonly DashboardExecutiveWorkspaceRegistryCategory[] = Object.freeze(categorySeeds.map(
  ([key, name], index) => Object.freeze({
    id: `EVE-6:2/Category/${key}` as const,
    key,
    name,
    vocabularyRegistryReference:
      DashboardExecutiveWorkspaceVisualizationVocabularyRegistries[index]!,
    deterministicOrder: index + 1,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);
