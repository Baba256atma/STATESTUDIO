import test from "node:test";
import assert from "node:assert/strict";

import {
  buildWarRoomAlert,
  buildWarRoomSignal,
} from "./WarRoomContract.ts";
import {
  buildDecisionPressureRiskChange,
  buildDecisionPressureScenarioChange,
  DECISION_PRESSURE_ENGINE_DIAGNOSTIC,
  DECISION_PRESSURE_READY_DIAGNOSTIC,
  DecisionPressureEngine,
  getDecisionPressureResult,
  measureDecisionPressure,
  resetDecisionPressureEngineForTests,
  W1_DECISION_PRESSURE_COMPLETE_TAG,
} from "./DecisionPressureEngine.ts";

const evaluatedAt = "2026-06-18T02:00:00.000Z";

function criticalSignals() {
  return Object.freeze([
    buildWarRoomSignal({
      signalId: "signal-critical",
      source: "risk",
      sourceId: "risk-1",
      severity: "critical",
      title: "Critical risk",
      detail: "Risk exposure is critical.",
      confidence: 90,
      timestamp: evaluatedAt,
    }),
    buildWarRoomSignal({
      signalId: "signal-warning",
      source: "kpi",
      sourceId: "kpi-1",
      severity: "warning",
      title: "KPI warning",
      detail: "KPI is declining.",
      confidence: 85,
      timestamp: evaluatedAt,
    }),
  ]);
}

function criticalAlerts() {
  return Object.freeze([
    buildWarRoomAlert({
      alertId: "alert-critical",
      signalIds: ["signal-critical"],
      status: "open",
      severity: "critical",
      title: "Critical Risk Increase",
      detail: "Risk exposure is critical.",
      createdAt: evaluatedAt,
    }),
  ]);
}

test.beforeEach(() => {
  resetDecisionPressureEngineForTests();
});

test("exports W1 decision pressure tag and diagnostics", () => {
  assert.equal(W1_DECISION_PRESSURE_COMPLETE_TAG, "[W1_DECISION_PRESSURE_COMPLETE]");
  assert.equal(DECISION_PRESSURE_ENGINE_DIAGNOSTIC, "[DECISION_PRESSURE_ENGINE]");
  assert.equal(DECISION_PRESSURE_READY_DIAGNOSTIC, "[DECISION_PRESSURE_READY]");
  assert.deepEqual(DecisionPressureEngine.diagnostics, [
    "[DECISION_PRESSURE_ENGINE]",
    "[DECISION_PRESSURE_READY]",
  ]);
});

test("scores low medium high and critical pressure levels", () => {
  const low = measureDecisionPressure({
    evaluatedAt,
    signals: [],
    alerts: [],
    riskChanges: [],
    scenarioChanges: [],
  });
  const medium = measureDecisionPressure({
    evaluatedAt,
    signals: [
      buildWarRoomSignal({
        signalId: "signal-watch",
        source: "object",
        sourceId: "object-1",
        severity: "watch",
        title: "Object watch",
        detail: "Object requires monitoring.",
        confidence: 70,
        timestamp: evaluatedAt,
      }),
    ],
    alerts: [],
    riskChanges: [
      buildDecisionPressureRiskChange({
        changeId: "risk-medium",
        riskId: "risk-1",
        exposureDelta: 40,
        severityDelta: 30,
        confidence: 70,
      }),
    ],
    scenarioChanges: [],
  });
  const high = measureDecisionPressure({
    evaluatedAt,
    signals: criticalSignals(),
    alerts: [],
    riskChanges: [
      buildDecisionPressureRiskChange({
        changeId: "risk-high",
        riskId: "risk-1",
        exposureDelta: 70,
        severityDelta: 60,
        confidence: 80,
      }),
    ],
    scenarioChanges: [
      buildDecisionPressureScenarioChange({
        changeId: "scenario-high",
        scenarioId: "scenario-1",
        degradationDelta: 70,
        confidence: 80,
      }),
    ],
  });
  const critical = measureDecisionPressure({
    evaluatedAt,
    signals: criticalSignals(),
    alerts: criticalAlerts(),
    riskChanges: [
      buildDecisionPressureRiskChange({
        changeId: "risk-critical",
        riskId: "risk-1",
        exposureDelta: 95,
        severityDelta: 95,
        confidence: 95,
      }),
    ],
    scenarioChanges: [
      buildDecisionPressureScenarioChange({
        changeId: "scenario-critical",
        scenarioId: "scenario-1",
        degradationDelta: 95,
        confidence: 95,
      }),
    ],
  });

  assert.equal(low.pressureLevel, "low");
  assert.equal(medium.pressureLevel, "medium");
  assert.equal(high.pressureLevel, "high");
  assert.equal(critical.pressureLevel, "critical");
  assert.equal(critical.pressureScore >= high.pressureScore, true);
  assert.equal(critical.readOnly, true);
  assert.equal(critical.mutation, false);
});

test("does not mutate pressure inputs", () => {
  const signals = criticalSignals();
  const alerts = criticalAlerts();
  const riskChanges = Object.freeze([
    buildDecisionPressureRiskChange({
      changeId: "risk-critical",
      riskId: "risk-1",
      exposureDelta: 95,
      severityDelta: 95,
      confidence: 95,
    }),
  ]);
  const scenarioChanges = Object.freeze([
    buildDecisionPressureScenarioChange({
      changeId: "scenario-critical",
      scenarioId: "scenario-1",
      degradationDelta: 95,
      confidence: 95,
    }),
  ]);
  const before = JSON.stringify({ signals, alerts, riskChanges, scenarioChanges });

  const result = measureDecisionPressure({
    evaluatedAt,
    signals,
    alerts,
    riskChanges,
    scenarioChanges,
  });

  assert.equal(JSON.stringify({ signals, alerts, riskChanges, scenarioChanges }), before);
  assert.equal(getDecisionPressureResult(), result);
  assert.equal(result.sourceMutation, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.topologyMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.objectMutation, false);
  assert.equal(result.simulationMutation, false);
  assert.equal(Object.isFrozen(result), true);
});
