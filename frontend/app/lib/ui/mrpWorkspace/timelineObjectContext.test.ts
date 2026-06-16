import test from "node:test";
import assert from "node:assert/strict";

import type { SceneJson } from "../../sceneTypes.ts";
import {
  DEFAULT_TIMELINE_OBJECT_CONTEXT,
  MRP_TIMELINE_OBJECT_CONTEXT_TAG,
  TIMELINE_NO_OBJECT_SELECTED_LABEL,
} from "./timeline/timelineObjectContextContract.ts";
import { resolveTimelineObjectContext } from "./timeline/timelineObjectContextResolver.ts";
import {
  resetTimelineObjectContextRuntimeForTests,
  syncTimelineObjectContext,
} from "./timeline/timelineObjectContextRuntime.ts";
import {
  getTimelineWorkspaceState,
  hydrateTimelineWorkspaceStateOnMount,
  resetTimelineWorkspaceStateRuntimeForTests,
} from "./timeline/timelineWorkspaceStateRuntime.ts";
import { buildTimelineWorkspaceViewFromState } from "./timeline/timelineWorkspaceStateViewMapper.ts";

test.beforeEach(() => {
  resetTimelineObjectContextRuntimeForTests();
  resetTimelineWorkspaceStateRuntimeForTests();
});

test("exports timeline object context tag", () => {
  assert.equal(MRP_TIMELINE_OBJECT_CONTEXT_TAG, "[MRP_TIMELINE_OBJECT_CONTEXT]");
});

test("resolveTimelineObjectContext returns no-object label when deselected", () => {
  const context = resolveTimelineObjectContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  assert.equal(context.hasSelection, false);
  assert.equal(context.selectedObject, TIMELINE_NO_OBJECT_SELECTED_LABEL);
  assert.equal(context.lastActivity, "None");
  assert.equal(context.lastChange, "None");
  assert.equal(context.recentEventsCount, "0");
});

test("resolveTimelineObjectContext reflects Factory A fixture", () => {
  const context = resolveTimelineObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  assert.equal(context.hasSelection, true);
  assert.equal(context.selectedObject, "Factory A");
  assert.equal(context.lastActivity, "Today · Operational review");
  assert.equal(context.lastChange, "Status updated to watch");
  assert.equal(context.recentEventsCount, "2");
});

test("resolveTimelineObjectContext reads scene object timeline fields", () => {
  const now = Date.now();
  const sceneJson = {
    scene: {
      objects: [
        {
          id: "node-1",
          status: "Revised allocation",
          updated_at: now - 120_000,
          severity: "warning",
        },
      ],
    },
  } as SceneJson;

  const context = resolveTimelineObjectContext({
    selectedObjectId: "node-1",
    selectedObjectLabel: "Node 1",
    sceneJson,
  });

  assert.equal(context.lastChange, "Revised allocation");
  assert.match(context.lastActivity, /Today ·/);
});

test("syncTimelineObjectContext updates workspace state read-only", () => {
  syncTimelineObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const state = getTimelineWorkspaceState();
  assert.equal(state.objectContext.selectedObject, "Factory A");
  assert.equal(state.objectContext.hasSelection, true);
});

test("deselection restores defaults without clearing timeline metrics fields", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  syncTimelineObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncTimelineObjectContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const state = getTimelineWorkspaceState();
  assert.deepEqual(state.objectContext, DEFAULT_TIMELINE_OBJECT_CONTEXT);
  assert.equal(state.phase, "ready");
  assert.ok(state.timelineSummary.headline.trim());
});

test("workspace view includes object context panel data", () => {
  syncTimelineObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const view = buildTimelineWorkspaceViewFromState(getTimelineWorkspaceState());
  assert.equal(view.objectContext.selectedObject, "Factory A");
  assert.equal(view.objectContext.lastChange, "Status updated to watch");
});

test("custom object status overrides fixture when provided", () => {
  const context = resolveTimelineObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
    selectedObjectStatus: "Under Review",
  });
  assert.equal(context.lastChange, "Under Review");
  assert.equal(context.lastActivity, "Today · Operational review");
});

test("object context survives hydrate remount with prior sync state", () => {
  syncTimelineObjectContext({
    selectedObjectId: "supplier-network",
    selectedObjectLabel: "Supplier Network",
  });
  const before = getTimelineWorkspaceState().objectContext;
  hydrateTimelineWorkspaceStateOnMount("remount");
  syncTimelineObjectContext({
    selectedObjectId: "supplier-network",
    selectedObjectLabel: "Supplier Network",
  });
  assert.deepEqual(getTimelineWorkspaceState().objectContext, before);
});
