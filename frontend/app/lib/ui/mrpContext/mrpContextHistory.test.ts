import test from "node:test";
import assert from "node:assert/strict";

import {
  MRP_BACK_NAVIGATION_TAG,
  MRP_CONTEXT_HISTORY_MAX_DEPTH,
  MRP_HISTORY_RUNTIME_TAG,
} from "./mrpContextHistoryContract.ts";
import { buildMrpContextRestorePlan } from "./mrpContextRestoreContract.ts";
import {
  classifyMrpContextTransition,
  completeMrpContextBackNavigation,
  getMrpContextHistoryDepth,
  getMrpContextHistorySummary,
  recordMrpContextHistoryTransition,
  requestMrpContextBackNavigation,
  resetMrpContextHistoryForTests,
} from "./mrpContextHistoryRuntime.ts";
import { resetMrpContextStoreForTests } from "./mrpContextStoreRuntime.ts";

const baseInput = Object.freeze({
  activeTab: "dashboard" as const,
  dashboardMode: "overview" as const,
  dashboardContext: "overview" as const,
  selectedObjectId: null,
  selectedObjectLabel: null,
  routeObjectId: null,
  routeObjectName: null,
  subWorkspaceMode: null,
  navigationBackStackDepth: 0,
  focusContext: null,
  analyzeContext: null,
  compareContext: null,
  scenarioContext: null,
  warRoomContext: null,
});

test.beforeEach(() => {
  resetMrpContextHistoryForTests();
  resetMrpContextStoreForTests();
});

test("tracks panel, workspace, and sub-workspace transitions", () => {
  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardContext: "risk",
  });
  assert.equal(classifyMrpContextTransition(
    {
      ...baseInput,
      signature: "a",
      transitionType: "panel",
      panelName: "Insight Home",
      activeMode: "Executive Summary",
      selectedObject: "No object selected",
    },
    {
      ...baseInput,
      dashboardContext: "risk",
      signature: "b",
      transitionType: "panel",
      panelName: "Risk",
      activeMode: "Forecast",
      selectedObject: "No object selected",
    }
  ), "panel");

  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardMode: "war_room",
    dashboardContext: "war_room",
  });
  assert.equal(getMrpContextHistoryDepth(), 1);

  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardMode: "war_room",
    dashboardContext: "war_room",
    subWorkspaceMode: "Response Plan",
  });
  assert.equal(getMrpContextHistoryDepth(), 2);
});

test("example trail Risk → Forecast → Dependency Analysis → Supplier A", () => {
  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardContext: "risk",
  });
  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardContext: "risk",
    subWorkspaceMode: "Forecast",
  });
  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardContext: "risk",
    subWorkspaceMode: "Dependency Analysis",
  });
  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardContext: "risk",
    subWorkspaceMode: "Dependency Analysis",
    selectedObjectLabel: "Supplier A",
    selectedObjectId: "supplier-a",
  });

  assert.equal(getMrpContextHistoryDepth(), 3);

  const back1 = requestMrpContextBackNavigation();
  assert.equal(back1.approved, true);
  assert.equal(back1.entry?.selectedObject, "No object selected");
  assert.equal(back1.entry?.activeMode, "Dependency Analysis");
  completeMrpContextBackNavigation();

  const back2 = requestMrpContextBackNavigation();
  assert.equal(back2.approved, true);
  assert.equal(back2.entry?.activeMode, "Forecast");
  completeMrpContextBackNavigation();
});

test("back restores previous workspace panel and object context", () => {
  recordMrpContextHistoryTransition(baseInput);
  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardMode: "war_room",
    dashboardContext: "war_room",
    selectedObjectId: "supply-chain",
    selectedObjectLabel: "Supply Chain",
    routeObjectId: "supply-chain",
    routeObjectName: "Supply Chain",
  });

  const back = requestMrpContextBackNavigation();
  assert.equal(back.approved, true);
  assert.ok(back.entry);
  assert.equal(back.entry.panelName, "Insight Home");

  const plan = buildMrpContextRestorePlan(back.entry!);
  assert.equal(plan.actions[0]?.type, "setDashboardMode");
  assert.equal(plan.selectedObjectId, null);
  assert.equal(plan.panelName, "Insight Home");
  completeMrpContextBackNavigation();
});

test("restore plan preserves overview dashboard context routes", () => {
  recordMrpContextHistoryTransition(baseInput);
  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardContext: "risk",
    subWorkspaceMode: "Forecast",
  });

  const back = requestMrpContextBackNavigation();
  const plan = buildMrpContextRestorePlan(back.entry!);
  assert.equal(plan.actions[0]?.type, "setDashboardMode");
  assert.equal((plan.actions[0] as { mode?: string }).mode, "overview");
  completeMrpContextBackNavigation();
});

test("back navigation does not re-push restored state onto history", () => {
  recordMrpContextHistoryTransition(baseInput);
  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardContext: "risk",
  });
  assert.equal(getMrpContextHistoryDepth(), 1);

  const back = requestMrpContextBackNavigation();
  assert.equal(back.approved, true);
  completeMrpContextBackNavigation();

  recordMrpContextHistoryTransition(baseInput);
  assert.equal(getMrpContextHistoryDepth(), 0);
});

test("enforces maximum history depth of 50", () => {
  recordMrpContextHistoryTransition(baseInput);
  for (let index = 0; index < 55; index += 1) {
    recordMrpContextHistoryTransition({
      ...baseInput,
      subWorkspaceMode: `Mode ${index}`,
    });
  }
  assert.equal(getMrpContextHistoryDepth(), MRP_CONTEXT_HISTORY_MAX_DEPTH);
});

test("debounces rapid back navigation to prevent loops", () => {
  recordMrpContextHistoryTransition(baseInput);
  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardContext: "risk",
  });

  const first = requestMrpContextBackNavigation();
  assert.equal(first.approved, true);
  completeMrpContextBackNavigation();

  const second = requestMrpContextBackNavigation();
  assert.equal(second.approved, false);
  assert.equal(second.reason, "history_empty");
});

test("history summary exposes back availability", () => {
  const empty = getMrpContextHistorySummary();
  assert.equal(empty.canNavigateBack, false);

  recordMrpContextHistoryTransition(baseInput);
  recordMrpContextHistoryTransition({
    ...baseInput,
    dashboardContext: "risk",
  });

  const withHistory = getMrpContextHistorySummary();
  assert.equal(withHistory.canNavigateBack, true);
  assert.equal(withHistory.depth, 1);
});

test("exports runtime tags", () => {
  assert.equal(MRP_HISTORY_RUNTIME_TAG, "[MRP_HISTORY_RUNTIME]");
  assert.equal(MRP_BACK_NAVIGATION_TAG, "[MRP_BACK_NAVIGATION]");
});
