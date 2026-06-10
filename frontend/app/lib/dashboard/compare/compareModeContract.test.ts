import test from "node:test";
import assert from "node:assert/strict";

import {
  COMPARE_TARGET_PLACEHOLDER_LABEL,
  COMPARE_WORKSPACE_MODULES,
  resolveCompareModeContext,
  resetCompareModeContractForTests,
} from "./compareModeContract.ts";
import type { ExecutiveObjectPanelData } from "../../panels/executiveObjectPanelData.ts";

const samplePanelData: ExecutiveObjectPanelData = {
  objectId: "customer-satisfaction",
  objectName: "Customer Satisfaction",
  objectType: "KPI",
  status: "Active",
  connectionCount: 4,
  dependencyCount: 2,
  scenarioCount: 1,
  lastUpdated: "Runtime",
  insight: "Primary satisfaction signal.",
  riskLevel: "medium",
  recommendedAction: "Monitor dependencies.",
  confidence: 0.68,
};

test.beforeEach(() => {
  resetCompareModeContractForTests();
});

test("defines four comparison module slots", () => {
  assert.equal(COMPARE_WORKSPACE_MODULES.length, 4);
  assert.ok(COMPARE_WORKSPACE_MODULES.some((entry) => entry.id === "impact"));
  assert.ok(COMPARE_WORKSPACE_MODULES.every((entry) => entry.status === "coming_soon"));
});

test("returns missing object when no ids available", () => {
  const result = resolveCompareModeContext({
    selectedObjectId: null,
    routeObjectId: null,
    routeObjectName: null,
    panelData: null,
  });
  assert.equal(result.context, null);
  assert.equal(result.reason, "missing_object");
});

test("resolves workspace with primary object and placeholder target", () => {
  const result = resolveCompareModeContext({
    selectedObjectId: "customer-satisfaction",
    routeObjectId: "customer-satisfaction",
    routeObjectName: "Customer Satisfaction",
    panelData: samplePanelData,
  });
  assert.equal(result.reason, "resolved");
  assert.equal(result.context?.primaryObjectName, "Customer Satisfaction");
  assert.equal(result.context?.targetObjectName, COMPARE_TARGET_PLACEHOLDER_LABEL);
  assert.equal(result.context?.targetObjectId, null);
  assert.equal(result.context?.comparisonStatusLabel, "Waiting For Comparison Target");
  assert.equal(result.context?.modules.length, 4);
});

test("uses limited status when comparison context is invalid", () => {
  const result = resolveCompareModeContext({
    selectedObjectId: "customer-satisfaction",
    routeObjectId: "customer-satisfaction",
    routeObjectName: "Customer Satisfaction",
    panelData: null,
  });
  assert.equal(result.reason, "invalid_comparison_context");
  assert.equal(result.context?.comparisonStatus, "limited");
  assert.equal(result.context?.primaryObjectName, "Customer Satisfaction");
});

test("uses limited status when panel data object id mismatches", () => {
  const result = resolveCompareModeContext({
    selectedObjectId: "customer-satisfaction",
    routeObjectId: "customer-satisfaction",
    routeObjectName: "Customer Satisfaction",
    panelData: { ...samplePanelData, objectId: "other" },
  });
  assert.equal(result.reason, "invalid_comparison_context");
  assert.equal(result.context?.comparisonStatus, "limited");
});

test("prefers route object id over selection", () => {
  const result = resolveCompareModeContext({
    selectedObjectId: "obj-a",
    routeObjectId: "obj-b",
    routeObjectName: "Object B",
    panelData: { ...samplePanelData, objectId: "obj-b", objectName: "Object B" },
  });
  assert.equal(result.context?.primaryObjectId, "obj-b");
  assert.equal(result.context?.primaryObjectName, "Object B");
});
