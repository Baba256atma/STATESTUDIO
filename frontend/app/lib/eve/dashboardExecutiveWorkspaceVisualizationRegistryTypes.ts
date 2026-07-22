import type * as Foundation from "./dashboardExecutiveWorkspaceVisualizationFoundation.ts";

export type DashboardExecutiveWorkspaceRegistryKey =
  | "ExecutiveWorkspaceRegistry" | "WorkspaceIdentityRegistry"
  | "WorkspaceLayoutRegistry" | "WorkspaceZoneRegistry"
  | "WorkspaceSectionRegistry" | "DashboardRegistry" | "DashboardLayoutRegistry"
  | "DashboardTemplateRegistry" | "DashboardWidgetRegistry" | "DashboardPanelRegistry"
  | "ExecutiveCardRegistry" | "KPIPanelRegistry" | "ChartPanelRegistry"
  | "TimelinePanelRegistry" | "GraphPanelRegistry" | "NavigationPanelRegistry"
  | "FilterPanelRegistry" | "WorkspaceContextRegistry" | "DashboardOutputRegistry"
  | "WorkspaceExportRegistry" | "WorkspacePresentationRegistry"
  | "DashboardExtensionRegistry";

type FoundationContract =
  typeof Foundation.DashboardExecutiveWorkspaceVisualizationFoundationPlatform.contracts[number];

export interface DashboardExecutiveWorkspaceVocabularyEntry {
  readonly id: `EVE-6:2/Vocabulary/${string}/${string}`;
  readonly key: string;
  readonly name: string;
  readonly description: string;
  readonly deterministicOrder: number;
  readonly executable: false;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspaceVocabularyRegistry {
  readonly id: `EVE-6:2/Registry/${DashboardExecutiveWorkspaceRegistryKey}`;
  readonly key: DashboardExecutiveWorkspaceRegistryKey;
  readonly name: string;
  readonly foundationContractReference: FoundationContract;
  readonly entries: readonly DashboardExecutiveWorkspaceVocabularyEntry[];
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}

export interface DashboardExecutiveWorkspaceRegistryCategory {
  readonly id: `EVE-6:2/Category/${string}`;
  readonly key: string;
  readonly name: string;
  readonly vocabularyRegistryReference: DashboardExecutiveWorkspaceVocabularyRegistry;
  readonly deterministicOrder: number;
  readonly metadataOnly: true;
  readonly immutable: true;
}
