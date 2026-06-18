import { buildExecutiveKpiSummary } from "../kpi-intelligence/ExecutiveKpiSummary.ts";
import { buildExecutiveObjectIntelligenceSummary } from "../object-intelligence/ExecutiveObjectIntelligenceSummary.ts";
import { buildExecutiveRelationshipSummary } from "../relationship-intelligence/ExecutiveRelationshipSummary.ts";
import { buildExecutiveRiskSummary } from "../risk-intelligence/ExecutiveRiskSummary.ts";
import { buildExecutiveScenarioSummary } from "../scenario-intelligence/ExecutiveScenarioSummary.ts";
import {
  EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT,
  EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
  EXECUTIVE_INTELLIGENCE_SNAPSHOT_VERSION,
  type ExecutiveIntelligenceAdapterBuildInput,
  type ExecutiveIntelligenceSnapshot,
} from "./executiveIntelligenceSnapshotContract.ts";

let latestExecutiveIntelligenceSnapshot: ExecutiveIntelligenceSnapshot =
  EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT;

function collectCoreInput(input: ExecutiveIntelligenceAdapterBuildInput) {
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
  });
}

function collectKpiInput(input: ExecutiveIntelligenceAdapterBuildInput) {
  return Object.freeze({
    ...collectCoreInput(input),
    historicalSnapshots: input.historicalSnapshots,
  });
}

export function buildExecutiveIntelligenceSnapshot(
  input: ExecutiveIntelligenceAdapterBuildInput = {}
): ExecutiveIntelligenceSnapshot {
  const coreInput = collectCoreInput(input);
  const kpiInput = collectKpiInput(input);

  const objectIntelligence =
    input.objectIntelligence ?? buildExecutiveObjectIntelligenceSummary(coreInput);
  const relationshipIntelligence =
    input.relationshipIntelligence ?? buildExecutiveRelationshipSummary(coreInput);
  const kpiIntelligence = input.kpiIntelligence ?? buildExecutiveKpiSummary(kpiInput);
  const riskIntelligence = input.riskIntelligence ?? buildExecutiveRiskSummary(kpiInput);
  const scenarioIntelligence =
    input.scenarioIntelligence ?? buildExecutiveScenarioSummary(kpiInput);

  const snapshot = Object.freeze({
    version: EXECUTIVE_INTELLIGENCE_SNAPSHOT_VERSION,
    objectIntelligence,
    relationshipIntelligence,
    kpiIntelligence,
    riskIntelligence,
    scenarioIntelligence,
    readOnly: true as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    mrpMutation: false as const,
    routingMutation: false as const,
    legacyRouterUsage: false as const,
    diagnostics: EXEC_INTELLIGENCE_ADAPTER_DIAGNOSTICS,
  });

  latestExecutiveIntelligenceSnapshot = snapshot;
  return snapshot;
}

export function getExecutiveIntelligenceSnapshot(): ExecutiveIntelligenceSnapshot {
  return latestExecutiveIntelligenceSnapshot;
}

export function resetExecutiveIntelligenceAdapterForTests(): void {
  latestExecutiveIntelligenceSnapshot = EMPTY_EXECUTIVE_INTELLIGENCE_SNAPSHOT;
}

export const ExecutiveIntelligenceAdapter = Object.freeze({
  buildExecutiveIntelligenceSnapshot,
  getExecutiveIntelligenceSnapshot,
  resetExecutiveIntelligenceAdapterForTests,
});
