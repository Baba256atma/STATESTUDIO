import test from "node:test";
import assert from "node:assert/strict";

import type { KpiIntelligenceRegistry } from "../kpi-intelligence/kpiIntelligenceContract.ts";
import type { ObjectIntelligenceRegistry } from "../object-intelligence/objectIntelligenceContract.ts";
import type { RelationshipIntelligenceRegistry } from "../relationship-intelligence/relationshipIntelligenceContract.ts";
import type { RiskIntelligenceRegistry } from "../risk-intelligence/riskIntelligenceContract.ts";
import {
  buildScenarioComparisonRequest,
  buildScenarioComparisonResult,
  buildScenarioDifferenceProfile,
} from "../scenario-authoring/ScenarioComparisonContract.ts";
import { EMPTY_EXECUTIVE_SIMULATION_SUMMARY } from "../scenario-authoring/simulationResultAggregatorContract.ts";
import type { ExecutiveScenarioSummary } from "../scenario-intelligence/executiveScenarioSummaryContract.ts";
import {
  aggregateWarRoomSignals,
  getWarRoomSignalSet,
  resetWarRoomSignalAggregatorForTests,
  W1_SIGNAL_AGGREGATOR_COMPLETE_TAG,
  WAR_ROOM_AGGREGATOR_DIAGNOSTIC,
  WAR_ROOM_AGGREGATOR_READY_DIAGNOSTIC,
  WarRoomSignalAggregator,
} from "./WarRoomSignalAggregator.ts";

const generatedAt = "2026-06-18T00:00:00.000Z";

function objectRegistry(): ObjectIntelligenceRegistry {
  const profile = Object.freeze({
    objectId: "object-1",
    label: "Supplier",
    objectType: "supplier",
    source: "scene" as const,
    health: 42,
    impact: 77,
    confidence: 81,
    importance: 90,
    trend: "declining" as const,
  });
  return Object.freeze({
    version: "3.1.0",
    profiles: Object.freeze([profile]),
    profileByObjectId: Object.freeze({ [profile.objectId]: profile }),
    objectCount: 1,
    sceneMutation: false,
    simulation: false,
    diagnostics: Object.freeze(["[OBJECT_INTELLIGENCE_RUNTIME]", "[OBJECT_INTELLIGENCE_PROFILE_CREATED]"]),
  });
}

function relationshipRegistry(): RelationshipIntelligenceRegistry {
  const profile = Object.freeze({
    relationshipId: "rel-1",
    sourceId: "object-1",
    targetId: "object-2",
    relationshipType: "depends_on",
    strength: 80,
    dependency: 84,
    influence: 72,
    confidence: 78,
    riskExposure: 73,
  });
  return Object.freeze({
    version: "4.1.0",
    profiles: Object.freeze([profile]),
    profileByRelationshipId: Object.freeze({ [profile.relationshipId]: profile }),
    relationshipCount: 1,
    sceneMutation: false,
    objectMutation: false,
    routingMutation: false,
    diagnostics: Object.freeze(["[RELATIONSHIP_INTELLIGENCE_RUNTIME]", "[RELATIONSHIP_INTELLIGENCE_READY]"]),
  });
}

function kpiRegistry(): KpiIntelligenceRegistry {
  const profile = Object.freeze({
    kpiId: "kpi-1",
    label: "Revenue",
    category: "Revenue" as const,
    value: 90,
    target: 100,
    intelligenceScore: 41,
    confidence: 88,
    direction: "down" as const,
    source: "runtime" as const,
  });
  return Object.freeze({
    version: "5.1.0",
    profiles: Object.freeze([profile]),
    profileByKpiId: Object.freeze({ [profile.kpiId]: profile }),
    kpiCount: 1,
    supportedCategories: Object.freeze(["Revenue"]),
    visualRendering: false,
    sceneMutation: false,
    mrpMutation: false,
    diagnostics: Object.freeze(["[KPI_INTELLIGENCE_RUNTIME]", "[KPI_INTELLIGENCE_READY]"]),
  });
}

function riskRegistry(): RiskIntelligenceRegistry {
  const profile = Object.freeze({
    riskId: "risk-1",
    subjectId: "object-1",
    label: "Supplier continuity",
    primaryCategory: "supply" as const,
    primaryCategoryLabel: "Supply Risk" as const,
    severity: 91,
    exposure: 86,
    confidence: 83,
    momentum: "worsening" as const,
    categories: Object.freeze({
      operationalRisk: 50,
      financialRisk: 20,
      scheduleRisk: 30,
      dependencyRisk: 70,
      supplyRisk: 91,
      strategicRisk: 42,
    }),
  });
  return Object.freeze({
    version: "6.1.0",
    profiles: Object.freeze([profile]),
    profileByRiskId: Object.freeze({ [profile.riskId]: profile }),
    profileBySubjectId: Object.freeze({ [profile.subjectId]: profile }),
    riskCount: 1,
    sceneMutation: false,
    routingMutation: false,
    simulation: false,
    diagnostics: Object.freeze(["[RISK_INTELLIGENCE_RUNTIME]", "[RISK_INTELLIGENCE_READY]"]),
  });
}

function scenarioSummary(): ExecutiveScenarioSummary {
  const summary = Object.freeze({
    scenarioId: "scenario-1",
    scenarioType: "risk" as const,
    label: "Supplier risk scenario",
    impactAggregation: Object.freeze({
      objectImpactCount: 1,
      relationshipImpactCount: 1,
      kpiImpactCount: 1,
      riskImpactCount: 1,
      averageObjectImpactScore: 65,
      averageRelationshipImpactScore: 66,
      averageKpiImpactScore: 55,
      averageRiskImpactScore: 87,
      compositeImpactScore: 88,
    }),
    strengths: Object.freeze([]),
    weaknesses: Object.freeze([]),
    opportunities: Object.freeze([]),
    threats: Object.freeze([]),
    recommendedActions: Object.freeze([]),
  });
  return Object.freeze({
    version: "7.7.0",
    executiveSummary: "Scenario intelligence ready.",
    scenarioCount: 1,
    summaries: Object.freeze([summary]),
    summaryByScenarioId: Object.freeze({ [summary.scenarioId]: summary }),
    readOnly: true,
    sceneMutation: false,
    simulationActive: false,
    diagnostics: Object.freeze(["[EXEC_SCENARIO_SUMMARY]", "[EXEC_SCENARIO_READY]"]),
  });
}

function comparisonResult() {
  const request = buildScenarioComparisonRequest({
    comparisonId: "compare-1",
    mode: "scenario_vs_scenario",
    scenarioA: {
      scenarioId: "scenario-a",
      label: "Scenario A",
      summary: EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
      baseline: false,
    },
    scenarioB: {
      scenarioId: "scenario-b",
      label: "Scenario B",
      summary: EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
      baseline: false,
    },
  });
  const difference = buildScenarioDifferenceProfile({
    differenceId: "diff-1",
    category: "risk",
    scenarioAId: "scenario-a",
    scenarioBId: "scenario-b",
    overallImpactDelta: 4,
    riskMovementDelta: 9,
    kpiMovementDelta: 0,
    confidenceDelta: 3,
    objectCountDelta: 0,
    relationshipCountDelta: 0,
    kpiCountDelta: 0,
    riskCountDelta: 1,
    advantage: "scenarioB",
    summary: "Scenario B reduces risk exposure.",
  });
  return buildScenarioComparisonResult({
    request,
    differences: [difference],
    primaryDifference: difference,
  });
}

test.beforeEach(() => {
  resetWarRoomSignalAggregatorForTests();
});

test("exports W1 signal aggregator tag and diagnostics", () => {
  assert.equal(W1_SIGNAL_AGGREGATOR_COMPLETE_TAG, "[W1_SIGNAL_AGGREGATOR_COMPLETE]");
  assert.equal(WAR_ROOM_AGGREGATOR_DIAGNOSTIC, "[WAR_ROOM_AGGREGATOR]");
  assert.equal(WAR_ROOM_AGGREGATOR_READY_DIAGNOSTIC, "[WAR_ROOM_AGGREGATOR_READY]");
  assert.deepEqual(WarRoomSignalAggregator.diagnostics, [
    "[WAR_ROOM_AGGREGATOR]",
    "[WAR_ROOM_AGGREGATOR_READY]",
  ]);
});

test("aggregates DS and C1 intelligence into WarRoomSignalSet", () => {
  const result = aggregateWarRoomSignals({
    generatedAt,
    objectIntelligence: objectRegistry(),
    relationshipIntelligence: relationshipRegistry(),
    kpiIntelligence: kpiRegistry(),
    riskIntelligence: riskRegistry(),
    scenarioIntelligence: scenarioSummary(),
    compareResults: [comparisonResult()],
  });

  assert.equal(result.signalCount, 6);
  assert.equal(result.objectSignalCount, 1);
  assert.equal(result.relationshipSignalCount, 1);
  assert.equal(result.kpiSignalCount, 1);
  assert.equal(result.riskSignalCount, 1);
  assert.equal(result.scenarioSignalCount, 1);
  assert.equal(result.compareSignalCount, 1);
  assert.deepEqual(result.signals.map((signal) => signal.source), [
    "object",
    "relationship",
    "kpi",
    "risk",
    "scenario",
    "executive",
  ]);
  assert.equal(result.readOnly, true);
  assert.equal(result.recalculation, false);
  assert.equal(result.sourceMutation, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.simulationMutation, false);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.signals), true);
  assert.throws(() => {
    (result.signals as unknown as object[]).push({});
  }, TypeError);
});

test("does not mutate source intelligence inputs", () => {
  const object = objectRegistry();
  const relationship = relationshipRegistry();
  const kpi = kpiRegistry();
  const risk = riskRegistry();
  const scenario = scenarioSummary();
  const comparison = comparisonResult();
  const before = JSON.stringify({ object, relationship, kpi, risk, scenario, comparison });

  const result = aggregateWarRoomSignals({
    generatedAt,
    objectIntelligence: object,
    relationshipIntelligence: relationship,
    kpiIntelligence: kpi,
    riskIntelligence: risk,
    scenarioIntelligence: scenario,
    compareResults: [comparison],
  });

  assert.equal(JSON.stringify({ object, relationship, kpi, risk, scenario, comparison }), before);
  assert.equal(getWarRoomSignalSet(), result);
});
