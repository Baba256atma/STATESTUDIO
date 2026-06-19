import test from "node:test";
import assert from "node:assert/strict";

import {
  rankActionPriorities,
} from "./ActionPriorityEngine.ts";
import {
  EMPTY_DECISION_PRESSURE_RESULT,
  type DecisionPressureResult,
} from "./DecisionPressureEngine.ts";
import {
  buildWarRoomAlert,
  buildWarRoomSignal,
} from "./WarRoomContract.ts";
import {
  ASSISTANT_WAR_ROOM_DIAGNOSTIC,
  ASSISTANT_WAR_ROOM_READY_DIAGNOSTIC,
  AssistantWarRoomBridge,
  explainWarRoomState,
  getAssistantWarRoomBridgeResult,
  resetAssistantWarRoomBridgeForTests,
  W1_ASSISTANT_BRIDGE_COMPLETE_TAG,
} from "./AssistantWarRoomBridge.ts";

const explainedAt = "2026-06-18T04:00:00.000Z";

function pressure(): DecisionPressureResult {
  return Object.freeze({
    ...EMPTY_DECISION_PRESSURE_RESULT,
    evaluatedAt: explainedAt,
    pressureScore: 91,
    pressureLevel: "critical",
    signalPressure: 86,
    alertPressure: 100,
    riskChangePressure: 90,
    scenarioChangePressure: 88,
  });
}

function signal() {
  return buildWarRoomSignal({
    signalId: "signal-critical",
    source: "risk",
    sourceId: "risk-1",
    severity: "critical",
    title: "Critical risk",
    detail: "Risk exposure is critical.",
    confidence: 90,
    timestamp: explainedAt,
  });
}

function alert() {
  return buildWarRoomAlert({
    alertId: "alert-critical",
    signalIds: ["signal-critical"],
    status: "open",
    severity: "critical",
    title: "Critical Risk Increase",
    detail: "Risk exposure crossed executive threshold.",
    createdAt: explainedAt,
  });
}

test.beforeEach(() => {
  resetAssistantWarRoomBridgeForTests();
});

test("exports W1 assistant war room tag and diagnostics", () => {
  assert.equal(W1_ASSISTANT_BRIDGE_COMPLETE_TAG, "[W1_ASSISTANT_BRIDGE_COMPLETE]");
  assert.equal(ASSISTANT_WAR_ROOM_DIAGNOSTIC, "[ASSISTANT_WAR_ROOM]");
  assert.equal(ASSISTANT_WAR_ROOM_READY_DIAGNOSTIC, "[ASSISTANT_WAR_ROOM_READY]");
  assert.deepEqual(AssistantWarRoomBridge.diagnostics, [
    "[ASSISTANT_WAR_ROOM]",
    "[ASSISTANT_WAR_ROOM_READY]",
  ]);
});

test("generates alert pressure and priority explanations", () => {
  const sourceSignal = signal();
  const sourceAlert = alert();
  const sourcePressure = pressure();
  const priorities = rankActionPriorities({
    rankedAt: explainedAt,
    signals: [sourceSignal],
    alerts: [sourceAlert],
    pressure: sourcePressure,
  });

  const result = explainWarRoomState({
    explainedAt,
    alerts: [sourceAlert],
    pressure: sourcePressure,
    priorities,
  });

  assert.equal(result.explanationCount, 3);
  assert.equal(result.alertExplanations.length, 1);
  assert.match(result.alertExplanations[0]?.explanation ?? "", /related signal/);
  assert.match(result.pressureExplanation.explanation, /pressure score is 91/);
  assert.match(result.priorityExplanation?.explanation ?? "", /ranked first/);
  assert.equal(result.actionExecution, false);
  assert.equal(result.simulationExecution, false);
  assert.equal(result.readOnly, true);
  assert.equal(result.mutation, false);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.explanations), true);
  assert.throws(() => {
    (result.explanations as unknown as object[]).push({});
  }, TypeError);
});

test("does not mutate bridge inputs", () => {
  const sourceAlert = alert();
  const sourcePressure = pressure();
  const priorities = rankActionPriorities({
    rankedAt: explainedAt,
    signals: [signal()],
    alerts: [sourceAlert],
    pressure: sourcePressure,
  });
  const before = JSON.stringify({ sourceAlert, sourcePressure, priorities });

  const result = explainWarRoomState({
    explainedAt,
    alerts: [sourceAlert],
    pressure: sourcePressure,
    priorities,
  });

  assert.equal(JSON.stringify({ sourceAlert, sourcePressure, priorities }), before);
  assert.equal(getAssistantWarRoomBridgeResult(), result);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.topologyMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.dsMutation, false);
  assert.equal(result.objectMutation, false);
});
