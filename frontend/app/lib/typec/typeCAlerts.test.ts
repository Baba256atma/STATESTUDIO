import test from "node:test";
import assert from "node:assert/strict";

import {
  acknowledgeTypeCAlert,
  buildTypeCAlerts,
  clearTypeCAlerts,
  mergeTypeCAlerts,
  type TypeCAlert,
} from "./typeCAlerts.ts";
import type { TypeCExecutionState } from "./typeCExecutionState.ts";

function runningExecution(overrides: Partial<TypeCExecutionState> = {}): TypeCExecutionState {
  return {
    scenarioId: "scenario_supply_chain",
    status: "running",
    startedAt: Date.now(),
    monitoredSignals: ["Supplier delay risk", "Inventory instability"],
    riskLevel: "medium",
    ...overrides,
  };
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

test("buildTypeCAlerts creates critical alert for high risk", () => {
  const alerts = buildTypeCAlerts({
    executionState: runningExecution({ riskLevel: "high" }),
  });
  assert.equal(alerts.some((alert) => alert.level === "critical"), true);
  assert.equal(
    alerts.some((alert) => alert.message.includes("potential cascade failure")),
    true
  );
});

test("buildTypeCAlerts creates propagation alert for many signals", () => {
  const alerts = buildTypeCAlerts({
    executionState: runningExecution({
      monitoredSignals: [
        "Supplier delay risk",
        "Inventory instability",
        "Delivery disruption",
        "System stability pressure",
      ],
    }),
  });
  assert.equal(
    alerts.some((alert) => alert.message.includes("Multiple nodes affected")),
    true
  );
});

test("buildTypeCAlerts creates persistent risk alert for long-running medium risk", () => {
  const alerts = buildTypeCAlerts({
    executionState: runningExecution({
      startedAt: Date.now() - 40_000,
      riskLevel: "medium",
    }),
  });
  assert.equal(
    alerts.some((alert) => alert.message.includes("Risk not stabilizing")),
    true
  );
});

test("buildTypeCAlerts creates idle monitoring info alert when active with no signals", () => {
  const alerts = buildTypeCAlerts({
    executionState: runningExecution({
      monitoredSignals: [],
      riskLevel: "low",
    }),
  });
  assert.deepEqual(alerts.map((alert) => alert.level), ["info"]);
  assert.equal(alerts[0]?.message, "No significant signals detected yet");
});

test("mergeTypeCAlerts deduplicates stable alert ids", () => {
  const first = buildTypeCAlerts({
    executionState: runningExecution({ riskLevel: "high" }),
  });
  const second = buildTypeCAlerts({
    executionState: runningExecution({ riskLevel: "high" }),
  });
  const merged = mergeTypeCAlerts(first, second);
  assert.equal(merged.length, first.length);
  assert.deepEqual(
    merged.map((alert) => alert.id).sort(),
    first.map((alert) => alert.id).sort()
  );
});

test("mergeTypeCAlerts respects max alerts", () => {
  const alerts: TypeCAlert[] = Array.from({ length: 8 }, (_, index) => ({
    id: `alert_${index}`,
    level: "warning",
    message: `Alert ${index}`,
    relatedObjectIds: [],
    timestamp: Date.now() + index,
    acknowledged: false,
  }));
  assert.equal(mergeTypeCAlerts([], alerts, 5).length, 5);
});

test("acknowledgeTypeCAlert removes alert", () => {
  const alerts = buildTypeCAlerts({
    executionState: runningExecution({ riskLevel: "high" }),
  });
  const acknowledged = acknowledgeTypeCAlert(alerts, alerts[0]?.id ?? "");
  assert.equal(acknowledged.some((alert) => alert.id === alerts[0]?.id), false);
});

test("buildTypeCAlerts does not mutate execution state", () => {
  const state = runningExecution({ riskLevel: "high" });
  const before = clone(state);
  buildTypeCAlerts({ executionState: state });
  assert.deepEqual(state, before);
});

test("clearTypeCAlerts returns empty alert list", () => {
  assert.deepEqual(clearTypeCAlerts(), []);
});
