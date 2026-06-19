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
import {
  EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
  type ExecutiveSimulationSummary,
} from "../scenario-authoring/simulationResultAggregatorContract.ts";
import { buildWarRoomSignal } from "../warroom/WarRoomContract.ts";
import {
  aggregateDecisionInputs,
  D1_INPUT_AGGREGATOR_COMPLETE_TAG,
  DECISION_INPUT_AGGREGATOR_DIAGNOSTIC,
  DECISION_INPUT_READY_DIAGNOSTIC,
  DecisionInputAggregator,
  getDecisionInputProfile,
  resetDecisionInputAggregatorForTests,
} from "./DecisionInputAggregator.ts";

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

function scenarioResult(confidence: number): ExecutiveSimulationSummary {
  return Object.freeze({
    ...EMPTY_EXECUTIVE_SIMULATION_SUMMARY,
    overallScenarioImpact: 72,
    confidence,
    objectCount: 2,
    relationshipCount: 1,
    kpiCount: 1,
    riskCount: 1,
    keyPositiveEffects: Object.freeze(["Object simulation confidence remains strong."]),
    keyNegativeEffects: Object.freeze(["Risk movement remains elevated."]),
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
  resetDecisionInputAggregatorForTests();
});

test("exports D1 input aggregator tag and diagnostics", () => {
  assert.equal(D1_INPUT_AGGREGATOR_COMPLETE_TAG, "[D1_INPUT_AGGREGATOR_COMPLETE]");
  assert.equal(DECISION_INPUT_AGGREGATOR_DIAGNOSTIC, "[DECISION_INPUT_AGGREGATOR]");
  assert.equal(DECISION_INPUT_READY_DIAGNOSTIC, "[DECISION_INPUT_READY]");
  assert.deepEqual(DecisionInputAggregator.diagnostics, [
    "[DECISION_INPUT_AGGREGATOR]",
    "[DECISION_INPUT_READY]",
  ]);
});

test("aggregates DS intelligence scenario results compare results and war room signals", () => {
  const warRoomSignals = Object.freeze([
    buildWarRoomSignal({
      signalId: "signal-critical",
      source: "risk",
      sourceId: "risk-1",
      severity: "critical",
      title: "Supplier risk elevated",
      detail: "Critical supplier risk signal.",
      confidence: 91,
      timestamp: generatedAt,
    }),
    buildWarRoomSignal({
      signalId: "signal-watch",
      source: "kpi",
      sourceId: "kpi-1",
      severity: "watch",
      title: "Revenue KPI watch",
      detail: "Revenue KPI direction is down.",
      confidence: 88,
      timestamp: generatedAt,
    }),
  ]);

  const profile = aggregateDecisionInputs({
    profileId: "decision-input-1",
    generatedAt,
    objectIntelligence: objectRegistry(),
    relationshipIntelligence: relationshipRegistry(),
    kpiIntelligence: kpiRegistry(),
    riskIntelligence: riskRegistry(),
    scenarioResults: [scenarioResult(80), scenarioResult(60)],
    compareResults: [comparisonResult()],
    warRoomSignals,
  });

  assert.equal(profile.profileId, "decision-input-1");
  assert.equal(profile.dsIntelligence.objectCount, 1);
  assert.equal(profile.dsIntelligence.relationshipCount, 1);
  assert.equal(profile.dsIntelligence.kpiCount, 1);
  assert.equal(profile.dsIntelligence.riskCount, 1);
  assert.equal(profile.dsIntelligence.dsProfileCount, 4);
  assert.equal(profile.scenarioResults.scenarioResultCount, 2);
  assert.equal(profile.scenarioResults.averageScenarioConfidence, 70);
  assert.equal(profile.compareResults.compareResultCount, 1);
  assert.equal(profile.compareResults.differenceCount, 1);
  assert.equal(profile.warRoomSignals.signalCount, 2);
  assert.equal(profile.warRoomSignals.criticalSignalCount, 1);
  assert.equal(profile.totalInputCount, 9);
  assert.equal(profile.readinessScore, 100);
  assert.equal(profile.readOnly, true);
  assert.equal(profile.recalculation, false);
  assert.equal(profile.sourceMutation, false);
  assert.equal(profile.dsMutation, false);
  assert.equal(profile.simulationMutation, false);
  assert.equal(Object.isFrozen(profile), true);
  assert.equal(Object.isFrozen(profile.dsIntelligence.objectProfiles), true);
  assert.equal(Object.isFrozen(profile.warRoomSignals.signals), true);
  assert.throws(() => {
    (profile.warRoomSignals.signals as unknown as object[]).push({});
  }, TypeError);
});

test("does not mutate source intelligence inputs", () => {
  const object = objectRegistry();
  const relationship = relationshipRegistry();
  const kpi = kpiRegistry();
  const risk = riskRegistry();
  const scenarioResults = Object.freeze([scenarioResult(75)]);
  const compareResults = Object.freeze([comparisonResult()]);
  const warRoomSignals = Object.freeze([
    buildWarRoomSignal({
      signalId: "signal-1",
      source: "object",
      sourceId: "object-1",
      severity: "warning",
      title: "Object warning",
      detail: "Object health is declining.",
      confidence: 81,
      timestamp: generatedAt,
    }),
  ]);
  const before = JSON.stringify({
    object,
    relationship,
    kpi,
    risk,
    scenarioResults,
    compareResults,
    warRoomSignals,
  });

  const profile = aggregateDecisionInputs({
    profileId: "decision-input-2",
    generatedAt,
    objectIntelligence: object,
    relationshipIntelligence: relationship,
    kpiIntelligence: kpi,
    riskIntelligence: risk,
    scenarioResults,
    compareResults,
    warRoomSignals,
  });

  assert.equal(
    JSON.stringify({
      object,
      relationship,
      kpi,
      risk,
      scenarioResults,
      compareResults,
      warRoomSignals,
    }),
    before
  );
  assert.equal(getDecisionInputProfile(), profile);
});
