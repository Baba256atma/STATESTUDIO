import { DashboardExecutiveWorkspaceVisualizationFoundationPlatform } from "./dashboardExecutiveWorkspaceVisualizationFoundation.ts";
import type {
  DashboardExecutiveWorkspaceRegistryKey,
  DashboardExecutiveWorkspaceVocabularyEntry,
  DashboardExecutiveWorkspaceVocabularyRegistry,
} from "./dashboardExecutiveWorkspaceVisualizationRegistryTypes.ts";

const registrySeeds = Object.freeze([
  ["ExecutiveWorkspaceRegistry", "Executive Workspace Registry", ["ExecutiveWorkspace", "OperationalWorkspace", "StrategicWorkspace", "CustomWorkspace"]],
  ["WorkspaceIdentityRegistry", "Workspace Identity Registry", ["StableIdentity", "CanonicalName", "VersionedIdentity", "NamespacedIdentity"]],
  ["WorkspaceLayoutRegistry", "Workspace Layout Registry", ["Fixed", "Adaptive", "Responsive", "Grid", "Freeform"]],
  ["WorkspaceZoneRegistry", "Workspace Zone Registry", ["Header", "LeftNavigation", "MainWorkspace", "DashboardRegion", "VisualizationRegion", "RightPanel", "Footer", "Overlay"]],
  ["WorkspaceSectionRegistry", "Workspace Section Registry", ["PrimarySection", "SecondarySection", "SupportingSection", "OverlaySection"]],
  ["DashboardRegistry", "Dashboard Registry", ["ExecutiveDashboard", "OperationalDashboard", "AnalyticalDashboard", "CustomDashboard"]],
  ["DashboardLayoutRegistry", "Dashboard Layout Registry", ["SingleColumn", "MultiColumn", "Tabbed", "Layered", "Composite"]],
  ["DashboardTemplateRegistry", "Dashboard Template Registry", ["ExecutiveOverview", "KPIDashboard", "OperationsDashboard", "FinancialDashboard", "SalesDashboard", "StrategyDashboard", "RiskDashboard", "CustomWorkspace"]],
  ["DashboardWidgetRegistry", "Dashboard Widget Registry", ["KPIWidget", "ChartWidget", "TimelineWidget", "GraphWidget", "ExecutiveCardWidget", "TableWidget", "FilterWidget", "NavigationWidget", "StatusWidget", "SummaryWidget"]],
  ["DashboardPanelRegistry", "Dashboard Panel Registry", ["PrimaryPanel", "SupportingPanel", "InformationPanel", "ControlPanel"]],
  ["ExecutiveCardRegistry", "Executive Card Registry", ["MetricCard", "StatusCard", "SummaryCard", "DecisionCard"]],
  ["KPIPanelRegistry", "KPI Panel Registry", ["SingleKPI", "KPIGroup", "KPIComparison", "KPIScorecard"]],
  ["ChartPanelRegistry", "Chart Panel Registry", ["SingleChart", "ChartGroup", "ChartComparison", "ChartSummary"]],
  ["TimelinePanelRegistry", "Timeline Panel Registry", ["HistoricalTimeline", "ScenarioTimeline", "ForecastTimeline", "DecisionTimeline"]],
  ["GraphPanelRegistry", "Graph Panel Registry", ["RelationshipGraph", "DependencyGraph", "NetworkGraph", "HierarchyGraph"]],
  ["NavigationPanelRegistry", "Navigation Panel Registry", ["Sidebar", "Topbar", "Breadcrumb", "Tabs", "WorkspaceSwitcher"]],
  ["FilterPanelRegistry", "Filter Panel Registry", ["GlobalFilter", "DashboardFilter", "PanelFilter", "ContextFilter"]],
  ["WorkspaceContextRegistry", "Workspace Context Registry", ["ExecutiveContext", "TemporalContext", "ScenarioContext", "OrganizationalContext"]],
  ["DashboardOutputRegistry", "Dashboard Output Registry", ["WorkspaceOutput", "PublicationOutput", "ExportOutput", "PresentationOutput"]],
  ["WorkspaceExportRegistry", "Workspace Export Registry", ["SnapshotExport", "DocumentExport", "DataExport", "PresentationExport"]],
  ["WorkspacePresentationRegistry", "Workspace Presentation Registry", ["ExecutivePresentation", "AnalyticalPresentation", "OperationalPresentation", "AccessiblePresentation"]],
  ["DashboardExtensionRegistry", "Dashboard Extension Registry", ["WorkspaceType", "DashboardType", "WidgetType", "PanelType", "LayoutType", "OutputProfile"]],
] as const satisfies readonly [DashboardExecutiveWorkspaceRegistryKey, string,
  readonly string[]][]);

const foundation = DashboardExecutiveWorkspaceVisualizationFoundationPlatform;

export const DashboardExecutiveWorkspaceVisualizationVocabularyRegistries:
readonly DashboardExecutiveWorkspaceVocabularyRegistry[] = Object.freeze(registrySeeds.map(
  ([key, name, vocabulary], registryIndex) => {
    const entries: readonly DashboardExecutiveWorkspaceVocabularyEntry[] = Object.freeze(
      vocabulary.map((entryName, entryIndex) => Object.freeze({
        id: `EVE-6:2/Vocabulary/${key}/${entryName}` as const,
        key: entryName,
        name: entryName,
        description: `Descriptive ${name} vocabulary for ${entryName}.`,
        deterministicOrder: entryIndex + 1,
        executable: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      })),
    );
    return Object.freeze({
      id: `EVE-6:2/Registry/${key}` as const,
      key,
      name,
      foundationContractReference: foundation.contracts[registryIndex]!,
      entries,
      deterministicOrder: registryIndex + 1,
      metadataOnly: true as const,
      immutable: true as const,
    });
  }),
);

export const DashboardExecutiveWorkspaceVisualizationStandardVocabulary = Object.freeze({
  workspaceZones: DashboardExecutiveWorkspaceVisualizationVocabularyRegistries[3]!.entries,
  dashboardTemplates: DashboardExecutiveWorkspaceVisualizationVocabularyRegistries[7]!.entries,
  widgetFamilies: DashboardExecutiveWorkspaceVisualizationVocabularyRegistries[8]!.entries,
  layoutModes: DashboardExecutiveWorkspaceVisualizationVocabularyRegistries[2]!.entries,
  navigationTypes: DashboardExecutiveWorkspaceVisualizationVocabularyRegistries[15]!.entries,
  metadataOnly: true,
  immutable: true,
} as const);
