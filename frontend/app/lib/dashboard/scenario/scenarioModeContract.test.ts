import test from "node:test";
import assert from "node:assert/strict";

import {
  SCENARIO_CENTER_EMPTY_MESSAGE,
  SCENARIO_FUTURE_EXTENSION_SLOTS,
  SCENARIO_WORKSPACE_MODULES,
  resolveScenarioModeContext,
  resetScenarioModeContractForTests,
} from "./scenarioModeContract.ts";
import type { ExecutiveObjectPanelData } from "../../panels/executiveObjectPanelData.ts";

const samplePanelData: ExecutiveObjectPanelData = {
  objectId: "demand-forecast",
  objectName: "Demand Forecast",
  objectType: "KPI",
  status: "Active",
  connectionCount: 3,
  dependencyCount: 2,
  scenarioCount: 0,
  lastUpdated: "Runtime",
  insight: "Primary demand signal for operational planning.",
  riskLevel: "medium",
  recommendedAction: "Review forecast assumptions.",
  confidence: 0.71,
};

test.beforeEach(() => {
  resetScenarioModeContractForTests();
});

test("defines six scenario workspace modules and future extension slots", () => {
  assert.equal(SCENARIO_WORKSPACE_MODULES.length, 6);
  assert.equal(SCENARIO_FUTURE_EXTENSION_SLOTS.length, 6);
  assert.ok(SCENARIO_WORKSPACE_MODULES.some((entry) => entry.id === "builder"));
  assert.ok(SCENARIO_WORKSPACE_MODULES.every((entry) => entry.status === "coming_soon"));
});

test("returns missing object when no ids available", () => {
  const result = resolveScenarioModeContext({
    selectedObjectId: null,
    routeObjectId: null,
    routeObjectName: null,
    panelData: null,
  });
  assert.equal(result.context, null);
  assert.equal(result.reason, "missing_object");
});

test("resolves ready workspace with scenario center placeholder", () => {
  const result = resolveScenarioModeContext({
    selectedObjectId: "demand-forecast",
    routeObjectId: "demand-forecast",
    routeObjectName: "Demand Forecast",
    panelData: samplePanelData,
  });
  assert.equal(result.reason, "resolved");
  assert.equal(result.context?.objectName, "Demand Forecast");
  assert.equal(result.context?.scenarioStatusLabel, "Ready");
  assert.equal(result.context?.scenarioCenterMessage, SCENARIO_CENTER_EMPTY_MESSAGE);
  assert.equal(result.context?.modules.length, 6);
  assert.equal(result.context?.futureExtensions.length, 6);
});

test("uses limited status when scenario context is invalid", () => {
  const result = resolveScenarioModeContext({
    selectedObjectId: "demand-forecast",
    routeObjectId: "demand-forecast",
    routeObjectName: "Demand Forecast",
    panelData: null,
  });
  assert.equal(result.reason, "invalid_scenario_context");
  assert.equal(result.context?.scenarioStatus, "limited");
  assert.equal(result.context?.objectName, "Demand Forecast");
});

test("uses limited status when panel data object id mismatches", () => {
  const result = resolveScenarioModeContext({
    selectedObjectId: "demand-forecast",
    routeObjectId: "demand-forecast",
    routeObjectName: "Demand Forecast",
    panelData: { ...samplePanelData, objectId: "other" },
  });
  assert.equal(result.reason, "invalid_scenario_context");
  assert.equal(result.context?.scenarioStatus, "limited");
});

test("prefers route object id over selection", () => {
  const result = resolveScenarioModeContext({
    selectedObjectId: "obj-a",
    routeObjectId: "obj-b",
    routeObjectName: "Object B",
    panelData: { ...samplePanelData, objectId: "obj-b", objectName: "Object B" },
  });
  assert.equal(result.context?.objectId, "obj-b");
  assert.equal(result.context?.objectName, "Object B");
});
