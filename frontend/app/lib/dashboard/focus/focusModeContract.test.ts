import test from "node:test";
import assert from "node:assert/strict";

import {
  resolveFocusModeContext,
  resolveFocusObjectId,
  resetFocusModeContractForTests,
} from "./focusModeContract.ts";
import type { ExecutiveObjectPanelData } from "../../panels/executiveObjectPanelData.ts";

const samplePanelData: ExecutiveObjectPanelData = {
  objectId: "machine-a",
  objectName: "Machine A",
  objectType: "Asset",
  status: "Active",
  connectionCount: 3,
  dependencyCount: 2,
  scenarioCount: 1,
  lastUpdated: "Runtime",
  insight: "Primary production asset with moderate upstream dependency pressure.",
  riskLevel: "medium",
  recommendedAction: "Monitor dependencies.",
  confidence: 0.72,
};

test.beforeEach(() => {
  resetFocusModeContractForTests();
});

test("resolveFocusObjectId prefers route object over selection", () => {
  assert.equal(
    resolveFocusObjectId({
      selectedObjectId: "obj-selected",
      routeObjectId: "obj-route",
      routeObjectName: "Route Object",
      panelData: null,
    }),
    "obj-route"
  );
});

test("resolveFocusObjectId falls back to selected object", () => {
  assert.equal(
    resolveFocusObjectId({
      selectedObjectId: "obj-selected",
      routeObjectId: null,
      routeObjectName: null,
      panelData: null,
    }),
    "obj-selected"
  );
});

test("returns missing object when no ids available", () => {
  const result = resolveFocusModeContext({
    selectedObjectId: null,
    routeObjectId: null,
    routeObjectName: null,
    panelData: null,
  });
  assert.equal(result.context, null);
  assert.equal(result.reason, "missing_object");
});

test("maps panel data to focus context view", () => {
  const result = resolveFocusModeContext({
    selectedObjectId: "machine-a",
    routeObjectId: "machine-a",
    routeObjectName: "Machine A",
    panelData: samplePanelData,
  });
  assert.equal(result.reason, "resolved");
  assert.equal(result.context?.objectName, "Machine A");
  assert.equal(result.context?.status, "Active");
  assert.equal(result.context?.impact, "Moderate");
  assert.equal(result.context?.confidenceLabel, "72%");
  assert.equal(result.context?.objectType, "Asset");
  assert.equal(result.context?.description, samplePanelData.insight);
});

test("uses fallback context when panel data is missing", () => {
  const result = resolveFocusModeContext({
    selectedObjectId: "machine-a",
    routeObjectId: "machine-a",
    routeObjectName: "Machine A",
    panelData: null,
  });
  assert.equal(result.reason, "missing_selection_context");
  assert.equal(result.context?.objectName, "Machine A");
  assert.equal(result.context?.confidenceLabel, "Pending");
});

test("uses fallback when panel data object id mismatches", () => {
  const result = resolveFocusModeContext({
    selectedObjectId: "machine-a",
    routeObjectId: "machine-a",
    routeObjectName: "Machine A",
    panelData: { ...samplePanelData, objectId: "other" },
  });
  assert.equal(result.reason, "missing_selection_context");
  assert.equal(result.context?.objectId, "machine-a");
});
