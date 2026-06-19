import test from "node:test";
import assert from "node:assert/strict";

import {
  buildWarRoomAlert,
  buildWarRoomSignal,
} from "./WarRoomContract.ts";
import {
  EMPTY_DECISION_PRESSURE_RESULT,
  type DecisionPressureResult,
} from "./DecisionPressureEngine.ts";
import {
  ACTION_PRIORITY_ENGINE_DIAGNOSTIC,
  ACTION_PRIORITY_READY_DIAGNOSTIC,
  ActionPriorityEngine,
  getActionPriorityEngineResult,
  rankActionPriorities,
  resetActionPriorityEngineForTests,
  W1_ACTION_PRIORITY_COMPLETE_TAG,
} from "./ActionPriorityEngine.ts";

const rankedAt = "2026-06-18T03:00:00.000Z";

function pressure(score: number): DecisionPressureResult {
  return Object.freeze({
    ...EMPTY_DECISION_PRESSURE_RESULT,
    evaluatedAt: rankedAt,
    pressureScore: score,
    pressureLevel: score >= 85 ? "critical" : score >= 55 ? "high" : score >= 25 ? "medium" : "low",
  });
}

function signals() {
  return Object.freeze([
    buildWarRoomSignal({
      signalId: "signal-low",
      source: "object",
      sourceId: "object-1",
      severity: "watch",
      title: "Object watch",
      detail: "Object requires monitoring.",
      confidence: 72,
      timestamp: rankedAt,
    }),
    buildWarRoomSignal({
      signalId: "signal-critical",
      source: "risk",
      sourceId: "risk-1",
      severity: "critical",
      title: "Critical risk",
      detail: "Risk exposure is critical.",
      confidence: 90,
      timestamp: rankedAt,
    }),
  ]);
}

function alerts() {
  return Object.freeze([
    buildWarRoomAlert({
      alertId: "alert-critical",
      signalIds: ["signal-critical"],
      status: "open",
      severity: "critical",
      title: "Critical Risk Increase",
      detail: "Risk exposure crossed executive threshold.",
      createdAt: rankedAt,
    }),
  ]);
}

test.beforeEach(() => {
  resetActionPriorityEngineForTests();
});

test("exports W1 action priority tag and diagnostics", () => {
  assert.equal(W1_ACTION_PRIORITY_COMPLETE_TAG, "[W1_ACTION_PRIORITY_COMPLETE]");
  assert.equal(ACTION_PRIORITY_ENGINE_DIAGNOSTIC, "[ACTION_PRIORITY_ENGINE]");
  assert.equal(ACTION_PRIORITY_READY_DIAGNOSTIC, "[ACTION_PRIORITY_READY]");
  assert.deepEqual(ActionPriorityEngine.diagnostics, [
    "[ACTION_PRIORITY_ENGINE]",
    "[ACTION_PRIORITY_READY]",
  ]);
});

test("generates priority queue top actions and top concerns", () => {
  const result = rankActionPriorities({
    rankedAt,
    signals: signals(),
    alerts: alerts(),
    pressure: pressure(91),
  });

  assert.equal(result.priorityCount, 3);
  assert.equal(result.topActionCount, 3);
  assert.equal(result.topConcernCount, 3);
  assert.equal(result.priorityQueue[0]?.level, "critical");
  assert.equal(result.priorityQueue[0]?.rank, 1);
  assert.match(result.topActions[0]?.label ?? "", /Act on/);
  assert.equal(result.topConcerns[0]?.priorityId, result.priorityQueue[0]?.priorityId);
  assert.equal(result.readOnly, true);
  assert.equal(result.mutation, false);
  assert.equal(result.sourceMutation, false);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.priorityQueue), true);
  assert.equal(Object.isFrozen(result.topActions), true);
  assert.throws(() => {
    (result.priorityQueue as unknown as object[]).push({});
  }, TypeError);
});

test("does not mutate signals alerts or pressure score", () => {
  const sourceSignals = signals();
  const sourceAlerts = alerts();
  const sourcePressure = pressure(91);
  const before = JSON.stringify({ sourceSignals, sourceAlerts, sourcePressure });

  const result = rankActionPriorities({
    rankedAt,
    signals: sourceSignals,
    alerts: sourceAlerts,
    pressure: sourcePressure,
  });

  assert.equal(JSON.stringify({ sourceSignals, sourceAlerts, sourcePressure }), before);
  assert.equal(getActionPriorityEngineResult(), result);
  assert.equal(result.dsMutation, false);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.topologyMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.objectMutation, false);
  assert.equal(result.simulationMutation, false);
});
