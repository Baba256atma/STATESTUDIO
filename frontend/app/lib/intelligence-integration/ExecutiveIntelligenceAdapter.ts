import { buildExecutiveIntelligenceSnapshot } from "../intelligence/ExecutiveIntelligenceAdapter.ts";
import { resetExecutiveIntelligenceAdapterForTests as resetCanonicalExecutiveIntelligenceAdapterForTests } from "../intelligence/ExecutiveIntelligenceAdapter.ts";
import { buildScenarioComparisonFoundationRegistry } from "../scenario-intelligence/ScenarioComparisonFoundation.ts";
import { buildScenarioRecommendationRegistry } from "../scenario-intelligence/ScenarioRecommendationEngine.ts";
import {
  EMPTY_EXECUTIVE_INTELLIGENCE_ADAPTER_REGISTRY,
  EXECUTIVE_INTELLIGENCE_ADAPTER_VERSION,
  type ExecutiveIntelligenceAdapterBuildInput,
  type ExecutiveIntelligenceAdapterLayer,
  type ExecutiveIntelligenceAdapterLayerSnapshot,
  type ExecutiveIntelligenceAdapterRegistry,
} from "./executiveIntelligenceAdapterContract.ts";
import {
  EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
} from "../intelligence/executiveIntelligenceSnapshotContract.ts";
import type { ExecutiveKpiSummary } from "../kpi-intelligence/executiveKpiSummaryContract.ts";
import type { ExecutiveObjectIntelligenceSummary } from "../object-intelligence/executiveObjectIntelligenceSummaryContract.ts";
import type { ExecutiveRelationshipSummary } from "../relationship-intelligence/executiveRelationshipSummaryContract.ts";
import type { ExecutiveRiskSummary } from "../risk-intelligence/executiveRiskSummaryContract.ts";
import type { ExecutiveScenarioSummary } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";

let latestExecutiveIntelligenceAdapterRegistry: ExecutiveIntelligenceAdapterRegistry =
  EMPTY_EXECUTIVE_INTELLIGENCE_ADAPTER_REGISTRY;

function collectKpiInput(input: ExecutiveIntelligenceAdapterBuildInput) {
  return Object.freeze({
    sceneJson: input.sceneJson,
    objects: input.objects ?? input.sceneObjects,
    relationships: input.relationships,
    kpis: input.kpis,
    risks: input.risks,
    sceneObjects: input.sceneObjects,
    dataSourceObjects: input.dataSourceObjects,
    dataSourceKpis: input.dataSourceKpis,
    selectedObjectId: input.selectedObjectId,
    historicalSnapshots: input.historicalSnapshots,
  });
}

function layerSnapshot(
  layer: ExecutiveIntelligenceAdapterLayer,
  layerVersion: string,
  summaryText: string,
  entityCount: number,
  layerDiagnostics: readonly string[]
): ExecutiveIntelligenceAdapterLayerSnapshot {
  return Object.freeze({
    layer,
    layerVersion,
    summaryText,
    entityCount,
    layerDiagnostics: Object.freeze([...layerDiagnostics]),
    adapterReady: true,
  });
}

function buildAdapterSummary(
  objectIntelligence: ExecutiveObjectIntelligenceSummary,
  relationshipIntelligence: ExecutiveRelationshipSummary,
  kpiIntelligence: ExecutiveKpiSummary,
  riskIntelligence: ExecutiveRiskSummary,
  scenarioIntelligence: ExecutiveScenarioSummary
): string {
  return [
    "Executive intelligence adapter ready for Analyze surfaces.",
    `Object layer: ${objectIntelligence.objectCount} object(s).`,
    `Relationship layer: ${relationshipIntelligence.relationshipCount} relationship(s).`,
    `KPI layer: ${kpiIntelligence.kpiCount} KPI(s).`,
    `Risk layer: ${riskIntelligence.topRisks.length} top risk signal(s).`,
    `Scenario layer: ${scenarioIntelligence.scenarioCount} scenario(s).`,
  ].join(" ");
}

function buildLayerSnapshots(
  objectIntelligence: ExecutiveObjectIntelligenceSummary,
  relationshipIntelligence: ExecutiveRelationshipSummary,
  kpiIntelligence: ExecutiveKpiSummary,
  riskIntelligence: ExecutiveRiskSummary,
  scenarioIntelligence: ExecutiveScenarioSummary
): readonly ExecutiveIntelligenceAdapterLayerSnapshot[] {
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

export function buildExecutiveIntelligenceAdapterRegistry(
  input: ExecutiveIntelligenceAdapterBuildInput = {}
): ExecutiveIntelligenceAdapterRegistry {
  const snapshot = buildExecutiveIntelligenceSnapshot(input);
  const kpiInput = collectKpiInput(input);

  const {
    objectIntelligence,
    relationshipIntelligence,
    kpiIntelligence,
    riskIntelligence,
    scenarioIntelligence,
  } = snapshot;

  const scenarioComparison =
    input.scenarioComparison ?? buildScenarioComparisonFoundationRegistry(kpiInput);
  const scenarioRecommendation =
    input.scenarioRecommendation ?? buildScenarioRecommendationRegistry(kpiInput);

  const layers = buildLayerSnapshots(
    objectIntelligence,
    relationshipIntelligence,
    kpiIntelligence,
    riskIntelligence,
    scenarioIntelligence
  );

  const registry = Object.freeze({
    version: EXECUTIVE_INTELLIGENCE_ADAPTER_VERSION,
    adapterSummary: buildAdapterSummary(
      objectIntelligence,
      relationshipIntelligence,
      kpiIntelligence,
      riskIntelligence,
      scenarioIntelligence
    ),
    objectIntelligence,
    relationshipIntelligence,
    kpiIntelligence,
    riskIntelligence,
    scenarioIntelligence,
    scenarioComparison,
    scenarioRecommendation,
    layers,
    layerCount: layers.length,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    routingMutation: false as const,
    mrpMutation: false as const,
    simulationActive: false as const,
    legacyRouterUsage: false as const,
    diagnostics: EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
  });

  latestExecutiveIntelligenceAdapterRegistry = registry;
  return registry;
}

export function getExecutiveIntelligenceAdapterRegistry(): ExecutiveIntelligenceAdapterRegistry {
  return latestExecutiveIntelligenceAdapterRegistry;
}

export function resetExecutiveIntelligenceAdapterForTests(): void {
  resetCanonicalExecutiveIntelligenceAdapterForTests();
  latestExecutiveIntelligenceAdapterRegistry = EMPTY_EXECUTIVE_INTELLIGENCE_ADAPTER_REGISTRY;
}

export const ExecutiveIntelligenceAdapter = Object.freeze({
  buildExecutiveIntelligenceAdapterRegistry,
  getExecutiveIntelligenceAdapterRegistry,
  resetExecutiveIntelligenceAdapterForTests,
});
