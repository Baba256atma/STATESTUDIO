/**
 * INT-1 — Dashboard Intelligence Foundation contracts.
 * Presentation-layer bridge only — Dashboard requests, DS engines respond, runtime normalizes.
 */

import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";

export const DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION = "INT-1" as const;

export const DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS = Object.freeze([
  "[INT1_FOUNDATION]",
  "[DASHBOARD_RUNTIME]",
  "[DASHBOARD_INTELLIGENCE]",
  "[NORMALIZATION_LAYER]",
  "[PANEL_ROUTER]",
  "[INT1_COMPLETE]",
] as const);

export const NEXORA_DASHBOARD_INTELLIGENCE_LOG_PREFIX = "[NexoraDashboardIntelligence]" as const;

export const DASHBOARD_INTELLIGENCE_SOURCE = "int-1-dashboard-intelligence" as const;

export type DashboardIntelligenceMode =
  | "executive_summary"
  | "operational"
  | "risk"
  | "scenario"
  | "timeline"
  | "relationships"
  | "objects"
  | "kpis"
  | "data_sources"
  | "workspace";

export type DashboardIntelligencePanelId = DashboardIntelligenceMode;

export const DASHBOARD_INTELLIGENCE_MODES = Object.freeze([
  "executive_summary",
  "operational",
  "risk",
  "scenario",
  "timeline",
  "relationships",
  "objects",
  "kpis",
  "data_sources",
  "workspace",
] as const satisfies readonly DashboardIntelligenceMode[]);

export type DashboardIntelligenceEngineId =
  | "ds3_objects"
  | "ds3_relationships"
  | "ds4_kpi"
  | "ds5_okr"
  | "ds6_risk"
  | "ds7_scenario"
  | "ds_workspace"
  | "ds_data_sources"
  | "ds_composite_executive"
  | "ds_composite_operational"
  | "reserved_timeline";

export type DashboardIntelligenceStatus =
  | "ready"
  | "loading"
  | "empty"
  | "error"
  | "reserved";

export type DashboardRuntimeStatus = "idle" | "ready" | "refreshing" | "error";

export type DashboardLoadingState = Readonly<{
  loading: boolean;
  panel: DashboardIntelligencePanelId | null;
  startedAt: string | null;
}>;

export type DashboardErrorState = Readonly<{
  hasError: boolean;
  panel: DashboardIntelligencePanelId | null;
  code: string | null;
  message: string | null;
}>;

export type DashboardIntelligenceRefreshTrigger =
  | "manual"
  | "automatic"
  | "workspace_changed"
  | "object_selected"
  | "scenario_changed"
  | "relationship_changed"
  | "data_source_updated";

export type DashboardIntelligenceEventType =
  | "DashboardOpened"
  | "DashboardClosed"
  | "PanelChanged"
  | "PanelRequested"
  | "PanelLoaded"
  | "PanelFailed"
  | "DashboardRefreshRequested"
  | "DashboardRefreshCompleted";

export type DashboardIntelligencePanelContext = Readonly<{
  panel: DashboardIntelligencePanelId;
  mode: DashboardIntelligenceMode;
  workspaceId: WorkspaceId | null;
  objectId: string | null;
  scenarioId: string | null;
  relationshipId: string | null;
  dataSourceId: string | null;
  selectionLabel: string | null;
}>;

export type DashboardIntelligenceSessionState = Readonly<{
  workspaceId: WorkspaceId | null;
  objectId: string | null;
  scenarioId: string | null;
  relationshipId: string | null;
  dataSourceId: string | null;
  activePanel: DashboardIntelligencePanelId | null;
  selectionContext: string | null;
  openedAt: string | null;
  updatedAt: string;
}>;

export type DashboardIntelligenceMetric = Readonly<{
  metricId: string;
  label: string;
  value: string | number | boolean | null;
  unit: string | null;
}>;

export type DashboardIntelligenceNormalizedPayload = Readonly<{
  status: DashboardIntelligenceStatus;
  confidence: number | null;
  summary: string;
  metrics: readonly DashboardIntelligenceMetric[];
  warnings: readonly string[];
  recommendations: readonly string[];
  timestamp: string;
  source: string;
  panel: DashboardIntelligencePanelId;
}>;

export type DashboardIntelligenceDataSnapshot = Readonly<{
  panel: DashboardIntelligencePanelId;
  engineId: DashboardIntelligenceEngineId;
  workspaceId: WorkspaceId | null;
  payload: DashboardIntelligenceNormalizedPayload;
  capturedAt: string;
}>;

export type DashboardIntelligenceRequest = Readonly<{
  panel: DashboardIntelligencePanelId;
  workspaceId?: WorkspaceId | null;
  objectId?: string | null;
  scenarioId?: string | null;
  relationshipId?: string | null;
  dataSourceId?: string | null;
  selectionLabel?: string | null;
  bypassCache?: boolean;
}>;

export type DashboardIntelligenceRefreshRequest = Readonly<{
  panel?: DashboardIntelligencePanelId | null;
  trigger: DashboardIntelligenceRefreshTrigger;
  workspaceId?: WorkspaceId | null;
  objectId?: string | null;
  scenarioId?: string | null;
  relationshipId?: string | null;
  dataSourceId?: string | null;
  bypassCache?: boolean;
}>;

export type DashboardIntelligenceDiagnostics = Readonly<{
  panel: DashboardIntelligencePanelId;
  engineId: DashboardIntelligenceEngineId;
  runtimeDurationMs: number;
  normalizationDurationMs: number;
  cacheUsed: boolean;
  refreshTrigger: DashboardIntelligenceRefreshTrigger | null;
  generatedAt: string;
}>;

export type DashboardIntelligenceResponse = Readonly<{
  contractVersion: typeof DASHBOARD_INTELLIGENCE_FOUNDATION_VERSION;
  success: boolean;
  panel: DashboardIntelligencePanelId;
  engineId: DashboardIntelligenceEngineId;
  runtimeStatus: DashboardRuntimeStatus;
  loading: DashboardLoadingState;
  error: DashboardErrorState;
  snapshot: DashboardIntelligenceDataSnapshot | null;
  diagnostics: DashboardIntelligenceDiagnostics;
  generatedAt: string;
  tags: typeof DASHBOARD_INTELLIGENCE_FOUNDATION_TAGS;
}>;

export type DashboardIntelligencePanelRegistration = Readonly<{
  panel: DashboardIntelligencePanelId;
  mode: DashboardIntelligenceMode;
  engineId: DashboardIntelligenceEngineId;
  title: string;
  description: string;
  enabled: boolean;
}>;

export type DashboardIntelligenceEvent = Readonly<{
  type: DashboardIntelligenceEventType;
  panel: DashboardIntelligencePanelId | null;
  workspaceId: WorkspaceId | null;
  trigger: DashboardIntelligenceRefreshTrigger | null;
  timestamp: string;
}>;

export const DASHBOARD_INTELLIGENCE_PANEL_TITLES: Readonly<
  Record<DashboardIntelligencePanelId, string>
> = Object.freeze({
  executive_summary: "Executive Summary",
  operational: "Operational Intelligence",
  risk: "Risk Intelligence",
  scenario: "Scenario Intelligence",
  timeline: "Timeline Intelligence",
  relationships: "Relationship Intelligence",
  objects: "Object Intelligence",
  kpis: "KPI Intelligence",
  data_sources: "Data Source Intelligence",
  workspace: "Workspace Intelligence",
});

export const DEFAULT_DASHBOARD_INTELLIGENCE_PANEL_REGISTRATIONS: readonly DashboardIntelligencePanelRegistration[] =
  Object.freeze(
    DASHBOARD_INTELLIGENCE_MODES.map((panel) =>
      Object.freeze({
        panel,
        mode: panel,
        engineId: resolveDefaultEngineForPanel(panel),
        title: DASHBOARD_INTELLIGENCE_PANEL_TITLES[panel],
        description: `Dashboard intelligence route for ${DASHBOARD_INTELLIGENCE_PANEL_TITLES[panel]}.`,
        enabled: true,
      })
    )
  );

function resolveDefaultEngineForPanel(
  panel: DashboardIntelligencePanelId
): DashboardIntelligenceEngineId {
  switch (panel) {
    case "executive_summary":
      return "ds_composite_executive";
    case "operational":
      return "ds_composite_operational";
    case "risk":
      return "ds6_risk";
    case "scenario":
      return "ds7_scenario";
    case "timeline":
      return "reserved_timeline";
    case "relationships":
      return "ds3_relationships";
    case "objects":
      return "ds3_objects";
    case "kpis":
      return "ds4_kpi";
    case "data_sources":
      return "ds_data_sources";
    case "workspace":
      return "ds_workspace";
    default:
      return "ds_workspace";
  }
}
