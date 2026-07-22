import { DashboardExecutiveWorkspaceVisualizationBoundaries } from "./dashboardExecutiveWorkspaceVisualizationBoundaries.ts";
import { DashboardExecutiveWorkspaceVisualizationCapabilities } from "./dashboardExecutiveWorkspaceVisualizationCapabilities.ts";
import type {
  DashboardExecutiveWorkspaceContractDeclaration,
  DashboardExecutiveWorkspaceContractName,
} from "./dashboardExecutiveWorkspaceVisualizationFoundationTypes.ts";
import { DashboardExecutiveWorkspaceVisualizationLifecycle } from "./dashboardExecutiveWorkspaceVisualizationLifecycle.ts";
import { DashboardExecutiveWorkspaceVisualizationOwnership } from "./dashboardExecutiveWorkspaceVisualizationOwnership.ts";

const contractSeeds = Object.freeze([
  ["ExecutiveWorkspaceContract", "Executive Workspace Contract", ["workspaceIdentityReference", "dashboardReferences", "contextReference"]],
  ["WorkspaceIdentityContract", "Workspace Identity Contract", ["stableId", "canonicalName", "ownerReference"]],
  ["WorkspaceLayoutContract", "Workspace Layout Contract", ["zoneReferences", "sectionReferences", "orderingIntent"]],
  ["WorkspaceZoneContract", "Workspace Zone Contract", ["zoneIdentity", "zoneType", "presentationIntent"]],
  ["WorkspaceSectionContract", "Workspace Section Contract", ["sectionIdentity", "zoneReference", "contentReferences"]],
  ["DashboardContract", "Dashboard Contract", ["dashboardIdentity", "layoutReference", "panelReferences"]],
  ["DashboardLayoutContract", "Dashboard Layout Contract", ["layoutIdentity", "zoneReferences", "orderingIntent"]],
  ["DashboardTemplateContract", "Dashboard Template Contract", ["templateIdentity", "templateIntent", "compatibilityReference"]],
  ["DashboardWidgetContract", "Dashboard Widget Contract", ["widgetIdentity", "widgetFamily", "panelReference"]],
  ["DashboardPanelContract", "Dashboard Panel Contract", ["panelIdentity", "panelType", "contentReferences"]],
  ["ExecutiveCardContract", "Executive Card Contract", ["cardIdentity", "metricReferences", "presentationHierarchy"]],
  ["KPIPanelContract", "KPI Panel Contract", ["panelIdentity", "kpiReferences", "outputReference"]],
  ["ChartPanelContract", "Chart Panel Contract", ["panelIdentity", "chartReferences", "outputReference"]],
  ["TimelinePanelContract", "Timeline Panel Contract", ["panelIdentity", "timelineReferences", "outputReference"]],
  ["GraphPanelContract", "Graph Panel Contract", ["panelIdentity", "graphReferences", "outputReference"]],
  ["NavigationPanelContract", "Navigation Panel Contract", ["panelIdentity", "navigationReferences", "zoneReference"]],
  ["FilterPanelContract", "Filter Panel Contract", ["panelIdentity", "filterReferences", "scopeReference"]],
  ["WorkspaceContextContract", "Workspace Context Contract", ["contextIdentity", "temporalReference", "scenarioReference"]],
  ["DashboardOutputContract", "Dashboard Output Contract", ["outputIdentity", "dashboardReference", "targetReference"]],
  ["WorkspaceExportContract", "Workspace Export Contract", ["exportIdentity", "workspaceReference", "profileReference"]],
  ["WorkspacePresentationContract", "Workspace Presentation Contract", ["presentationIdentity", "workspaceReference", "intentReference"]],
  ["DashboardExtensionContract", "Dashboard Extension Contract", ["extensionIdentity", "extensionType", "compatibilityReference"]],
] as const satisfies readonly [DashboardExecutiveWorkspaceContractName, string,
  readonly string[]][]);

export const DashboardExecutiveWorkspaceVisualizationContracts:
readonly DashboardExecutiveWorkspaceContractDeclaration[] = Object.freeze(contractSeeds.map(
  ([name, canonicalName, structuralMetadata], index) => Object.freeze({
    id: `EVE-6:1/Contract/${name}` as const,
    canonicalName,
    namespace: `nexora.eve.dashboard-executive-workspace-visualization.foundation.contract.${name.toLowerCase()}` as const,
    version: "1.0.0" as const,
    ownership: DashboardExecutiveWorkspaceVisualizationOwnership,
    lifecycle: DashboardExecutiveWorkspaceVisualizationLifecycle,
    capabilityReferences: DashboardExecutiveWorkspaceVisualizationCapabilities,
    boundaryReferences: DashboardExecutiveWorkspaceVisualizationBoundaries,
    structuralMetadata: Object.freeze([...structuralMetadata]),
    compatibilityMetadata: Object.freeze({ eveFiveCompatible: true as const }),
    extensionMetadata: Object.freeze({ classification: `${name}Extension` }),
    deterministicOrder: index + 1,
    executableBehavior: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  })),
);

const policyNames = Object.freeze([
  "Stable identity policy", "Immutable metadata policy", "Canonical reference policy",
  "Workspace isolation policy", "Dashboard isolation policy", "Widget isolation policy",
  "Layout separation policy", "Presentation separation policy",
  "Deterministic ordering policy", "Extension compatibility policy",
  "Dependency isolation policy", "Metadata-only policy", "Consumer compatibility policy",
  "Canonical Inventory Rule policy",
] as const);

export const DashboardExecutiveWorkspaceVisualizationPolicies = Object.freeze(
  policyNames.map((name, index) => Object.freeze({
    id: `EVE-6:1/Policy/${index + 1}` as const,
    name,
    description: `${name} is descriptive and performs no runtime enforcement.`,
    deterministicOrder: index + 1,
    runtimeChecks: false,
    metadataOnly: true,
    immutable: true,
  })),
);

export const DashboardExecutiveWorkspaceVisualizationIntents = Object.freeze({
  workspaceZones: Object.freeze([
    "Header", "Left Navigation", "Main Workspace", "Dashboard Region",
    "Visualization Region", "Right Information Panel", "Footer", "Overlay Region",
  ] as const),
  dashboardTemplates: Object.freeze([
    "Executive Overview", "KPI Dashboard", "Operations Dashboard", "Financial Dashboard",
    "Sales Dashboard", "Strategy Dashboard", "Risk Dashboard", "Custom Workspace",
  ] as const),
  widgetFamilies: Object.freeze([
    "KPI Widget", "Chart Widget", "Timeline Widget", "Graph Widget",
    "Executive Card Widget", "Table Widget", "Filter Widget", "Navigation Widget",
    "Status Widget", "Summary Widget",
  ] as const),
  metadataOnly: true,
  immutable: true,
} as const);
