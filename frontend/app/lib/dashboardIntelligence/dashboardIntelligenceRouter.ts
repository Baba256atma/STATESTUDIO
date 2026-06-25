/**
 * INT-1 — Dashboard Intelligence router.
 * Read-only routing from dashboard panels to certified DS engines.
 * No calculations — fetch only.
 */

import { getDashboardKpiSummary } from "../kpi/kpiDashboardIntegrationRuntime.ts";
import { getDashboardOkrSummary } from "../okr/okrDashboardIntegrationRuntime.ts";
import { getDashboardRiskSummary } from "../risk/riskDashboardIntegrationRuntime.ts";
import { getWorkspaceScenarioWorkspaceSummary } from "../scenario/scenarioWorkspaceIntegrationRuntime.ts";
import { getObjectIntelligenceProfiles } from "../workspace/workspaceObjectIntelligenceContract.ts";
import { getWorkspaceRelationships } from "../workspace/workspaceRelationshipCreationContract.ts";
import {
  getActiveWorkspace,
  getActiveWorkspaceId,
  getWorkspaceRegistrySnapshot,
} from "../workspace/workspaceRegistryStore.ts";
import { getActiveWorkspaceDataSources } from "../workspace/workspaceDataSourceRegistry.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import type {
  DashboardIntelligenceEngineId,
  DashboardIntelligencePanelContext,
  DashboardIntelligencePanelId,
} from "./dashboardIntelligenceContract.ts";

export type DashboardIntelligenceEnginePayload = Readonly<{
  engineId: DashboardIntelligenceEngineId;
  panel: DashboardIntelligencePanelId;
  workspaceId: WorkspaceId | null;
  data: unknown;
}>;

function resolveWorkspaceId(context: DashboardIntelligencePanelContext): string {
  return String(context.workspaceId ?? getActiveWorkspaceId() ?? "").trim();
}

export function routeDashboardIntelligenceRequest(
  context: DashboardIntelligencePanelContext
): DashboardIntelligenceEnginePayload {
  const workspaceId = resolveWorkspaceId(context);
  const engineId = resolveEngineIdForPanel(context.panel);

  switch (engineId) {
    case "ds4_kpi":
      return Object.freeze({
        engineId,
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: getDashboardKpiSummary(workspaceId),
      });
    case "ds5_okr":
      return Object.freeze({
        engineId,
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: getDashboardOkrSummary(workspaceId),
      });
    case "ds6_risk":
      return Object.freeze({
        engineId,
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: getDashboardRiskSummary(workspaceId),
      });
    case "ds7_scenario":
      return Object.freeze({
        engineId,
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: getWorkspaceScenarioWorkspaceSummary(workspaceId),
      });
    case "ds3_objects":
      return Object.freeze({
        engineId,
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: workspaceId ? getObjectIntelligenceProfiles(workspaceId) : [],
      });
    case "ds3_relationships":
      return Object.freeze({
        engineId,
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: workspaceId ? getWorkspaceRelationships(workspaceId) : [],
      });
    case "ds_data_sources":
      return Object.freeze({
        engineId,
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: getActiveWorkspaceDataSources(),
      });
    case "ds_workspace":
      return Object.freeze({
        engineId,
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: Object.freeze({
          activeWorkspace: getActiveWorkspace(),
          registry: getWorkspaceRegistrySnapshot(),
        }),
      });
    case "ds_composite_executive":
      return Object.freeze({
        engineId,
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: Object.freeze({
          kpis: getDashboardKpiSummary(workspaceId),
          okrs: getDashboardOkrSummary(workspaceId),
          risks: getDashboardRiskSummary(workspaceId),
          scenarios: getWorkspaceScenarioWorkspaceSummary(workspaceId),
        }),
      });
    case "ds_composite_operational":
      return Object.freeze({
        engineId,
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: Object.freeze({
          kpis: getDashboardKpiSummary(workspaceId),
          okrs: getDashboardOkrSummary(workspaceId),
          risks: getDashboardRiskSummary(workspaceId),
          objects: workspaceId ? getObjectIntelligenceProfiles(workspaceId) : [],
          relationships: workspaceId ? getWorkspaceRelationships(workspaceId) : [],
        }),
      });
    case "reserved_timeline":
    default:
      return Object.freeze({
        engineId: "reserved_timeline",
        panel: context.panel,
        workspaceId: workspaceId || null,
        data: Object.freeze({
          reserved: true,
          ownerPhase: "Future Timeline Engine",
        }),
      });
  }
}

function resolveEngineIdForPanel(panel: DashboardIntelligencePanelId): DashboardIntelligenceEngineId {
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
