import test from "node:test";
import assert from "node:assert/strict";

import {
  ANALYZE_WORKSPACE_MODULES,
  resolveAnalyzeModeContext,
  resetAnalyzeModeContractForTests,
} from "./analyzeModeContract.ts";
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
  insight: "Primary satisfaction signal with moderate upstream dependency pressure.",
  riskLevel: "medium",
  recommendedAction: "Monitor dependencies.",
  confidence: 0.68,
};

test.beforeEach(() => {
  resetAnalyzeModeContractForTests();
});

test("defines six analysis module slots", () => {
  assert.equal(ANALYZE_WORKSPACE_MODULES.length, 6);
  assert.ok(ANALYZE_WORKSPACE_MODULES.some((entry) => entry.id === "risk"));
  assert.ok(ANALYZE_WORKSPACE_MODULES.every((entry) => entry.status === "coming_soon"));
});

test("returns missing object when no ids available", () => {
  const result = resolveAnalyzeModeContext({
    selectedObjectId: null,
    routeObjectId: null,
    routeObjectName: null,
    panelData: null,
  });
  assert.equal(result.context, null);
  assert.equal(result.reason, "missing_object");
});

test("resolves ready workspace when panel data matches", () => {
  const result = resolveAnalyzeModeContext({
    selectedObjectId: "customer-satisfaction",
    routeObjectId: "customer-satisfaction",
    routeObjectName: "Customer Satisfaction",
    panelData: samplePanelData,
  });
  assert.equal(result.reason, "resolved");
  assert.equal(result.context?.objectName, "Customer Satisfaction");
  assert.equal(result.context?.analysisStatusLabel, "Ready");
  assert.equal(result.context?.modules.length, 6);
  assert.equal(result.context?.intelligence, null);
  assert.equal(result.context?.executiveSummary, null);
});

test("uses limited status when analysis context is missing", () => {
  const result = resolveAnalyzeModeContext({
    selectedObjectId: "customer-satisfaction",
    routeObjectId: "customer-satisfaction",
    routeObjectName: "Customer Satisfaction",
    panelData: null,
  });
  assert.equal(result.reason, "missing_analysis_context");
  assert.equal(result.context?.analysisStatusLabel, "Limited");
  assert.equal(result.context?.objectName, "Customer Satisfaction");
});

test("uses limited status when panel data object id mismatches", () => {
  const result = resolveAnalyzeModeContext({
    selectedObjectId: "customer-satisfaction",
    routeObjectId: "customer-satisfaction",
    routeObjectName: "Customer Satisfaction",
    panelData: { ...samplePanelData, objectId: "other" },
  });
  assert.equal(result.reason, "missing_analysis_context");
  assert.equal(result.context?.analysisStatus, "limited");
});

test("prefers route object id over selection", () => {
  const result = resolveAnalyzeModeContext({
    selectedObjectId: "obj-a",
    routeObjectId: "obj-b",
    routeObjectName: "Object B",
    panelData: { ...samplePanelData, objectId: "obj-b", objectName: "Object B" },
  });
  assert.equal(result.context?.objectId, "obj-b");
  assert.equal(result.context?.objectName, "Object B");
});
