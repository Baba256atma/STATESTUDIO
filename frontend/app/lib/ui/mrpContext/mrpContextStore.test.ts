import test from "node:test";
import assert from "node:assert/strict";

import {
  buildMrpContextHeaderView,
  buildMrpContextSignature,
  resolveMrpActiveMode,
  resolveMrpPanelName,
} from "./mrpContextResolver.ts";
import {
  DEFAULT_MRP_SELECTED_OBJECT,
  MRP_CONTEXT_GUARD_TAG,
  MRP_CONTEXT_SYNC_TAG,
} from "./mrpContextStoreContract.ts";
import {
  getMrpContextHeaderView,
  getMrpContextStorePublishCountForTests,
  publishMrpContextStore,
  resetMrpContextStoreForTests,
} from "./mrpContextStoreRuntime.ts";
import { resetMrpContextHistoryForTests } from "./mrpContextHistoryRuntime.ts";

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
  resetMrpContextStoreForTests();
  resetMrpContextHistoryForTests();
});

test("resolveMrpPanelName maps overview risk context to Risk", () => {
  assert.equal(
    resolveMrpPanelName({ ...baseInput, dashboardContext: "risk" }),
    "Risk"
  );
});

test("resolveMrpActiveMode maps overview risk context to Forecast", () => {
  assert.equal(
    resolveMrpActiveMode({ ...baseInput, dashboardContext: "risk" }),
    "Forecast"
  );
});

test("resolveMrpPanelName maps analyze mode to Risk", () => {
  assert.equal(
    resolveMrpPanelName({ ...baseInput, dashboardMode: "analyze" }),
    "Risk"
  );
});

test("resolveMrpActiveMode maps war room mode to Response Plan", () => {
  assert.equal(
    resolveMrpActiveMode({ ...baseInput, dashboardMode: "war_room" }),
    "Response Plan"
  );
});

test("selected object resolves from label with stable fallback", () => {
  const header = buildMrpContextHeaderView(
    {
      ...baseInput,
      selectedObjectLabel: "Factory A",
    },
    1
  );
  assert.equal(header.selectedObject, "Factory A");
});

test("selected object never empty — uses default fallback", () => {
  const header = buildMrpContextHeaderView(baseInput, 1);
  assert.equal(header.selectedObject, DEFAULT_MRP_SELECTED_OBJECT);
});

test("object selection update publishes header change", () => {
  publishMrpContextStore({
    ...baseInput,
    selectedObjectLabel: "Factory A",
  });
  publishMrpContextStore({
    ...baseInput,
    selectedObjectLabel: "Supply Chain",
  });
  const header = getMrpContextHeaderView();
  assert.equal(header.selectedObject, "Supply Chain");
  assert.equal(header.revision, 2);
});

test("workspace change updates panel name", () => {
  publishMrpContextStore(baseInput);
  publishMrpContextStore({
    ...baseInput,
    dashboardMode: "war_room",
    dashboardContext: "war_room",
  });
  const header = getMrpContextHeaderView();
  assert.equal(header.panelName, "War Room");
});

test("sub workspace change updates active mode", () => {
  publishMrpContextStore({
    ...baseInput,
    dashboardContext: "risk",
  });
  publishMrpContextStore({
    ...baseInput,
    dashboardContext: "risk",
    subWorkspaceMode: "Exposure Scan",
  });
  const header = getMrpContextHeaderView();
  assert.equal(header.activeMode, "Exposure Scan");
});

test("duplicate signature does not advance revision", () => {
  publishMrpContextStore({
    ...baseInput,
    selectedObjectLabel: "Factory A",
  });
  const firstRevision = getMrpContextHeaderView().revision;
  const result = publishMrpContextStore({
    ...baseInput,
    selectedObjectLabel: "Factory A",
  });
  assert.equal(result.changed, false);
  assert.equal(getMrpContextHeaderView().revision, firstRevision);
});

test("signature builder is stable for identical input", () => {
  const input = {
    ...baseInput,
    selectedObjectLabel: "Factory A",
  };
  assert.equal(buildMrpContextSignature(input), buildMrpContextSignature(input));
});

test("brake tags are exported", () => {
  assert.equal(MRP_CONTEXT_SYNC_TAG, "[MRP_CONTEXT_SYNC]");
  assert.equal(MRP_CONTEXT_GUARD_TAG, "[MRP_CONTEXT_GUARD]");
});

test("header fields are never empty strings after publish", () => {
  publishMrpContextStore({
    ...baseInput,
    dashboardMode: "war_room",
    dashboardContext: "war_room",
    routeObjectName: "Supply Chain",
  });
  const header = getMrpContextHeaderView();
  assert.ok(header.panelName.length > 0);
  assert.ok(header.activeMode.length > 0);
  assert.ok(header.selectedObject.length > 0);
});

test("publish count tracks calls including deduped attempts", () => {
  publishMrpContextStore(baseInput);
  publishMrpContextStore(baseInput);
  assert.ok(getMrpContextStorePublishCountForTests() >= 2);
});
