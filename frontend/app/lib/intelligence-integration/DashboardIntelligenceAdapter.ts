import { buildExecutiveIntelligenceSnapshot } from "../intelligence/ExecutiveIntelligenceAdapter.ts";
import {
  DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
  DASHBOARD_INTELLIGENCE_ADAPTER_VERSION,
  EMPTY_DASHBOARD_INTELLIGENCE_ADAPTER_REGISTRY,
  type DashboardIntelligenceAdapterBuildInput,
  type DashboardIntelligenceAdapterLayer,
  type DashboardIntelligenceAdapterLayerSnapshot,
  type DashboardIntelligenceAdapterRegistry,
} from "./dashboardIntelligenceAdapterContract.ts";
import type { ExecutiveIntelligenceSnapshot } from "../intelligence/executiveIntelligenceSnapshotContract.ts";
import type { ExecutiveKpiSummary } from "../kpi-intelligence/executiveKpiSummaryContract.ts";
import type { ExecutiveObjectIntelligenceSummary } from "../object-intelligence/executiveObjectIntelligenceSummaryContract.ts";
import type { ExecutiveRelationshipSummary } from "../relationship-intelligence/executiveRelationshipSummaryContract.ts";
import type { ExecutiveRiskSummary } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import type { ExecutiveScenarioSummary } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";

let latestDashboardIntelligenceAdapterRegistry: DashboardIntelligenceAdapterRegistry =
  EMPTY_DASHBOARD_INTELLIGENCE_ADAPTER_REGISTRY;

function collectSnapshotInput(input: DashboardIntelligenceAdapterBuildInput) {
  return Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects ?? input.sceneObjects,
    relationships: input.relationships,
    kpis: input.kpis,
    risks: input.risks,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    historicalSnapshots: input.historicalSnapshots,
    selectedObjectId: input.selectedObjectId,
  });
}

function layerSnapshot(
  layer: DashboardIntelligenceAdapterLayer,
  layerVersion: string,
  summaryText: string,
  entityCount: number,
  layerDiagnostics: readonly string[]
): DashboardIntelligenceAdapterLayerSnapshot {
  return Object.freeze({
    layer,
    layerVersion,
    summaryText,
    entityCount,
    layerDiagnostics: Object.freeze([...layerDiagnostics]),
    adapterReady: true,
  });
}

function buildAdapterSummary(snapshot: ExecutiveIntelligenceSnapshot): string {
  return [
    "Dashboard intelligence adapter ready for Dashboard surfaces.",
    `Object layer: ${snapshot.objectIntelligence.objectCount} object(s).`,
    `Relationship layer: ${snapshot.relationshipIntelligence.relationshipCount} relationship(s).`,
    `KPI layer: ${snapshot.kpiIntelligence.kpiCount} KPI(s).`,
    `Risk layer: ${snapshot.riskIntelligence.topRisks.length} top risk signal(s).`,
    `Scenario layer: ${snapshot.scenarioIntelligence.scenarioCount} scenario(s).`,
  ].join(" ");
}

function buildLayerSnapshots(
  snapshot: ExecutiveIntelligenceSnapshot
): readonly DashboardIntelligenceAdapterLayerSnapshot[] {
  const {
    objectIntelligence,
    relationshipIntelligence,
    kpiIntelligence,
    riskIntelligence,
    scenarioIntelligence,
  } = snapshot;

  return Object.freeze([
    layerSnapshot(
      "object",
      objectIntelligence.version,
      objectIntelligence.executiveSummary,
      objectIntelligence.objectCount,
      objectIntelligence.diagnostics
    ),
    layerSnapshot(
      "relationship",
      relationshipIntelligence.version,
      relationshipIntelligence.executiveSummary,
      relationshipIntelligence.relationshipCount,
      relationshipIntelligence.diagnostics
    ),
    layerSnapshot(
      "kpi",
      kpiIntelligence.version,
      kpiIntelligence.executiveSummary,
      kpiIntelligence.kpiCount,
      kpiIntelligence.diagnostics
    ),
    layerSnapshot(
      "risk",
      riskIntelligence.version,
      riskIntelligence.executiveSummary,
      riskIntelligence.profiles.length,
      riskIntelligence.diagnostics
    ),
    layerSnapshot(
      "scenario",
      scenarioIntelligence.version,
      scenarioIntelligence.executiveSummary,
      scenarioIntelligence.scenarioCount,
      scenarioIntelligence.diagnostics
    ),
  ]);
}

function snapshotHasIntelligence(snapshot: ExecutiveIntelligenceSnapshot): boolean {
  return (
    snapshot.objectIntelligence.objectCount > 0 ||
    snapshot.relationshipIntelligence.relationshipCount > 0 ||
    snapshot.kpiIntelligence.kpiCount > 0 ||
    snapshot.riskIntelligence.profiles.length > 0 ||
    snapshot.scenarioIntelligence.scenarioCount > 0
  );
}

export function buildDashboardIntelligenceAdapterRegistry(
  input: DashboardIntelligenceAdapterBuildInput = {}
): DashboardIntelligenceAdapterRegistry {
  const snapshot =
    input.snapshot ?? buildExecutiveIntelligenceSnapshot(collectSnapshotInput(input));

  if (!snapshotHasIntelligence(snapshot)) {
    latestDashboardIntelligenceAdapterRegistry = EMPTY_DASHBOARD_INTELLIGENCE_ADAPTER_REGISTRY;
    return latestDashboardIntelligenceAdapterRegistry;
  }

  const layers = buildLayerSnapshots(snapshot);
  const {
    objectIntelligence,
    relationshipIntelligence,
    kpiIntelligence,
    riskIntelligence,
    scenarioIntelligence,
  } = snapshot;

  const registry = Object.freeze({
    version: DASHBOARD_INTELLIGENCE_ADAPTER_VERSION,
    adapterSummary: buildAdapterSummary(snapshot),
    snapshot,
    snapshotVersion: snapshot.version,
    objectIntelligence,
    relationshipIntelligence,
    kpiIntelligence,
    riskIntelligence,
    scenarioIntelligence,
    layers,
    layerCount: layers.length,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: DASHBOARD_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
  });

  latestDashboardIntelligenceAdapterRegistry = registry;
  return registry;
}

export function getDashboardIntelligenceAdapterRegistry(): DashboardIntelligenceAdapterRegistry {
  return latestDashboardIntelligenceAdapterRegistry;
}

export function resetDashboardIntelligenceAdapterForTests(): void {
  latestDashboardIntelligenceAdapterRegistry = EMPTY_DASHBOARD_INTELLIGENCE_ADAPTER_REGISTRY;
}

export const DashboardIntelligenceAdapter = Object.freeze({
  buildDashboardIntelligenceAdapterRegistry,
  getDashboardIntelligenceAdapterRegistry,
  resetDashboardIntelligenceAdapterForTests,
});
