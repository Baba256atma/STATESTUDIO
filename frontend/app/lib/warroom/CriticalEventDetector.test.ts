import test from "node:test";
import assert from "node:assert/strict";

import { buildWarRoomSignal } from "./WarRoomContract.ts";
import {
  EMPTY_WAR_ROOM_SIGNAL_SET,
  type WarRoomSignalSet,
} from "./WarRoomSignalAggregator.ts";
import {
  CRITICAL_EVENT_DETECTOR_DIAGNOSTIC,
  CRITICAL_EVENT_READY_DIAGNOSTIC,
  CriticalEventDetector,
  detectCriticalEvents,
  getCriticalEventDetectionResult,
  resetCriticalEventDetectorForTests,
  W1_CRITICAL_EVENT_COMPLETE_TAG,
} from "./CriticalEventDetector.ts";

const detectedAt = "2026-06-18T01:00:00.000Z";

function signalSet(): WarRoomSignalSet {
  const signals = Object.freeze([
    buildWarRoomSignal({
      signalId: "kpi-critical",
      source: "kpi",
      sourceId: "revenue",
      severity: "critical",
      title: "Revenue KPI intelligence",
      detail: "Revenue score 31, direction down.",
      confidence: 91,
      timestamp: detectedAt,
    }),
    buildWarRoomSignal({
      signalId: "risk-critical",
      source: "risk",
      sourceId: "supplier-risk",
      severity: "critical",
      title: "Supplier risk intelligence",
      detail: "Supply Risk, severity 92, exposure 89, momentum worsening.",
      confidence: 88,
      timestamp: detectedAt,
    }),
    buildWarRoomSignal({
      signalId: "scenario-critical",
      source: "scenario",
      sourceId: "scenario-risk",
      severity: "critical",
      title: "Supplier disruption scenario intelligence",
      detail: "Risk scenario composite impact 91.",
      confidence: 91,
      timestamp: detectedAt,
    }),
    buildWarRoomSignal({
      signalId: "relationship-critical",
      source: "relationship",
      sourceId: "rel-1",
      severity: "critical",
      title: "depends_on relationship intelligence",
      detail: "Dependency 94, influence 75, risk exposure 90.",
      confidence: 83,
      timestamp: detectedAt,
    }),
    buildWarRoomSignal({
      signalId: "kpi-watch",
      source: "kpi",
      sourceId: "margin",
      severity: "watch",
      title: "Margin KPI intelligence",
      detail: "Margin score 64, direction neutral.",
      confidence: 80,
      timestamp: detectedAt,
    }),
  ]);

  return Object.freeze({
    ...EMPTY_WAR_ROOM_SIGNAL_SET,
    generatedAt: detectedAt,
    signals,
    signalCount: signals.length,
    kpiSignalCount: 2,
    riskSignalCount: 1,
    scenarioSignalCount: 1,
    relationshipSignalCount: 1,
  });
}

test.beforeEach(() => {
  resetCriticalEventDetectorForTests();
});

test("exports W1 critical event tag and diagnostics", () => {
  assert.equal(W1_CRITICAL_EVENT_COMPLETE_TAG, "[W1_CRITICAL_EVENT_COMPLETE]");
  assert.equal(CRITICAL_EVENT_DETECTOR_DIAGNOSTIC, "[CRITICAL_EVENT_DETECTOR]");
  assert.equal(CRITICAL_EVENT_READY_DIAGNOSTIC, "[CRITICAL_EVENT_READY]");
  assert.deepEqual(CriticalEventDetector.diagnostics, [
    "[CRITICAL_EVENT_DETECTOR]",
    "[CRITICAL_EVENT_READY]",
  ]);
});

test("generates alerts for critical executive conditions", () => {
  const result = detectCriticalEvents({ signalSet: signalSet(), detectedAt });

  assert.equal(result.alertCount, 4);
  assert.equal(result.criticalKpiDeclineCount, 1);
  assert.equal(result.criticalRiskIncreaseCount, 1);
  assert.equal(result.criticalScenarioDegradationCount, 1);
  assert.equal(result.criticalDependencyExposureCount, 1);
  assert.deepEqual(result.alerts.map((alert) => alert.title), [
    "Critical KPI Decline",
    "Critical Risk Increase",
    "Critical Scenario Degradation",
    "Critical Dependency Exposure",
  ]);
  assert.equal(result.alerts.every((alert) => alert.severity === "critical"), true);
  assert.equal(result.alerts.every((alert) => alert.status === "open"), true);
  assert.equal(result.readOnly, true);
  assert.equal(result.mutation, false);
  assert.equal(result.sourceMutation, false);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.alerts), true);
  assert.throws(() => {
    (result.alerts as unknown as object[]).push({});
  }, TypeError);
});

test("does not mutate signal set input", () => {
  const input = signalSet();
  const before = JSON.stringify(input);

  const result = detectCriticalEvents({ signalSet: input, detectedAt });

  assert.equal(JSON.stringify(input), before);
  assert.equal(getCriticalEventDetectionResult(), result);
  assert.equal(result.dsMutation, false);
  assert.equal(result.sceneMutation, false);
  assert.equal(result.topologyMutation, false);
  assert.equal(result.routingMutation, false);
  assert.equal(result.simulationMutation, false);
});
