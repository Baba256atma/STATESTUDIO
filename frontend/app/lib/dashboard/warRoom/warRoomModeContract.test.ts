import test from "node:test";
import assert from "node:assert/strict";

import {
  WAR_ROOM_FUTURE_CARD_SLOTS,
  WAR_ROOM_SITUATION_EMPTY_MESSAGE,
  WAR_ROOM_WORKSPACE_MODULES,
  resolveWarRoomModeContext,
  resetWarRoomModeContractForTests,
} from "./warRoomModeContract.ts";
import type { ExecutiveObjectPanelData } from "../../panels/executiveObjectPanelData.ts";

const samplePanelData: ExecutiveObjectPanelData = {
  objectId: "demand-forecast",
  objectName: "Demand Forecast",
  objectType: "KPI",
  status: "Active",
  connectionCount: 4,
  dependencyCount: 2,
  scenarioCount: 1,
  lastUpdated: "Runtime",
  insight: "Primary demand signal for executive review.",
  riskLevel: "high",
  recommendedAction: "Convene war room review.",
  confidence: 0.65,
};

test.beforeEach(() => {
  resetWarRoomModeContractForTests();
});

test("defines seven war room modules and future card slots", () => {
  assert.equal(WAR_ROOM_WORKSPACE_MODULES.length, 7);
  assert.equal(WAR_ROOM_FUTURE_CARD_SLOTS.length, 6);
  assert.ok(WAR_ROOM_WORKSPACE_MODULES.some((entry) => entry.id === "situation"));
  assert.ok(WAR_ROOM_WORKSPACE_MODULES.every((entry) => entry.status === "coming_soon"));
});

test("returns missing object when no ids available", () => {
  const result = resolveWarRoomModeContext({
    selectedObjectId: null,
    routeObjectId: null,
    routeObjectName: null,
    panelData: null,
  });
  assert.equal(result.context, null);
  assert.equal(result.reason, "missing_object");
});

test("resolves ready workspace with situation summary placeholder", () => {
  const result = resolveWarRoomModeContext({
    selectedObjectId: "demand-forecast",
    routeObjectId: "demand-forecast",
    routeObjectName: "Demand Forecast",
    panelData: samplePanelData,
  });
  assert.equal(result.reason, "resolved");
  assert.equal(result.context?.objectName, "Demand Forecast");
  assert.equal(result.context?.warRoomStatusLabel, "Ready");
  assert.equal(result.context?.situationSummaryMessage, WAR_ROOM_SITUATION_EMPTY_MESSAGE);
  assert.equal(result.context?.modules.length, 7);
  assert.equal(result.context?.futureCardSlots.length, 6);
});

test("uses limited status when war room context is invalid", () => {
  const result = resolveWarRoomModeContext({
    selectedObjectId: "demand-forecast",
    routeObjectId: "demand-forecast",
    routeObjectName: "Demand Forecast",
    panelData: null,
  });
  assert.equal(result.reason, "invalid_war_room_context");
  assert.equal(result.context?.warRoomStatus, "limited");
  assert.equal(result.context?.objectName, "Demand Forecast");
});

test("uses limited status when panel data object id mismatches", () => {
  const result = resolveWarRoomModeContext({
    selectedObjectId: "demand-forecast",
    routeObjectId: "demand-forecast",
    routeObjectName: "Demand Forecast",
    panelData: { ...samplePanelData, objectId: "other" },
  });
  assert.equal(result.reason, "invalid_war_room_context");
  assert.equal(result.context?.warRoomStatus, "limited");
});

test("prefers route object id over selection", () => {
  const result = resolveWarRoomModeContext({
    selectedObjectId: "obj-a",
    routeObjectId: "obj-b",
    routeObjectName: "Object B",
    panelData: { ...samplePanelData, objectId: "obj-b", objectName: "Object B" },
  });
  assert.equal(result.context?.objectId, "obj-b");
  assert.equal(result.context?.objectName, "Object B");
});
