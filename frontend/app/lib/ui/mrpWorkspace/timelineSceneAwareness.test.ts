import test from "node:test";
import assert from "node:assert/strict";

import type { SceneJson } from "../../sceneTypes.ts";
import type { WorkspaceNavigationHistoryEntry } from "../dashboard/executiveWorkspaceNavigationHistoryContract.ts";
import {
  DEFAULT_TIMELINE_SCENE_AWARENESS,
  MRP_TIMELINE_SCENE_AWARE_TAG,
  TIMELINE_SCENE_COVERAGE_LABELS,
  TIMELINE_SCENE_FORBIDDEN_CAPABILITIES,
  TIMELINE_SCENE_READ_FIELDS,
} from "./timeline/timelineSceneAwarenessContract.ts";
import {
  resolveTimelineSceneAwareness,
  resolveTimelineSceneCoverage,
} from "./timeline/timelineSceneAwarenessResolver.ts";
import {
  assertTimelineSceneReadOnly,
  getTimelineSceneAwarenessSnapshot,
  guardTimelineSceneWrite,
  resetTimelineSceneAwarenessRuntimeForTests,
  syncTimelineSceneAwareness,
} from "./timeline/timelineSceneAwarenessRuntime.ts";
import {
  getTimelineWorkspaceState,
  hydrateTimelineWorkspaceStateOnMount,
  resetTimelineWorkspaceStateRuntimeForTests,
} from "./timeline/timelineWorkspaceStateRuntime.ts";
import { buildTimelineWorkspaceViewFromState } from "./timeline/timelineWorkspaceStateViewMapper.ts";
import { resetTimelineObjectContextRuntimeForTests } from "./timeline/timelineObjectContextRuntime.ts";
import { resetTimelineWorkspaceDataRuntimeForTests } from "./timeline/timelineWorkspaceDataRuntime.ts";

test.beforeEach(() => {
  resetTimelineSceneAwarenessRuntimeForTests();
  resetTimelineObjectContextRuntimeForTests();
  resetTimelineWorkspaceDataRuntimeForTests();
  resetTimelineWorkspaceStateRuntimeForTests();
});

const now = Date.now();

const navigationHistory: readonly WorkspaceNavigationHistoryEntry[] = Object.freeze([
  Object.freeze({
    workspaceId: "analyze",
    workspaceName: "Analyze",
    transitionType: "forward",
    timestamp: now - 60_000,
    originWorkspaceId: "overview",
    targetWorkspaceId: "analyze",
    lifecycleSnapshot: null,
    source: "workspace_navigation_history",
  }),
  Object.freeze({
    workspaceId: "war_room",
    workspaceName: "War Room",
    transitionType: "forward",
    timestamp: now - 120_000,
    originWorkspaceId: "overview",
    targetWorkspaceId: "war_room",
    lifecycleSnapshot: null,
    source: "workspace_navigation_history",
  }),
]);

const sceneWithEvents: SceneJson = {
  scene: {
    objects: Array.from({ length: 15 }, (_, index) => {
      if (index === 0) {
        return { id: "1", label: "A", severity: "critical" };
      }
      if (index < 8) {
        return { id: String(index + 1), label: `Obj ${index + 1}`, status: "delayed" };
      }
      return { id: String(index + 1), label: `Obj ${index + 1}`, state: "stable" };
    }),
  },
} as SceneJson;

test("exports timeline scene awareness tag", () => {
  assert.equal(MRP_TIMELINE_SCENE_AWARE_TAG, "[MRP_TIMELINE_SCENE_AWARE]");
});

test("defines read-only scene fields and forbidden capabilities", () => {
  assert.deepEqual(TIMELINE_SCENE_READ_FIELDS, [
    "selectedObject",
    "sceneObjects",
    "workspaceDiagnostics",
    "eventHistory",
  ]);
  assert.deepEqual(TIMELINE_SCENE_FORBIDDEN_CAPABILITIES, [
    "move_objects",
    "modify_topology",
    "modify_scene",
    "change_camera",
    "control_scene",
  ]);
});

test("resolveTimelineSceneCoverage counts tracked objects events and recent activity", () => {
  const coverage = resolveTimelineSceneCoverage({
    sceneJson: sceneWithEvents,
    navigationHistoryEntries: navigationHistory,
  });
  assert.equal(coverage.objectsTracked, 15);
  assert.equal(coverage.objectsWithEvents, 8);
  assert.ok(coverage.recentEvents >= 2);
});

test("resolveTimelineSceneAwareness remains read-only", () => {
  const snapshot = resolveTimelineSceneAwareness({
    selectedObjectId: "1",
    sceneJson: sceneWithEvents,
    navigationHistoryEntries: navigationHistory,
  });
  assert.equal(snapshot.readOnly, true);
  assert.equal(snapshot.selectedObjectId, "1");
  assert.equal(assertTimelineSceneReadOnly(snapshot), true);
});

test("guardTimelineSceneWrite blocks scene mutations", () => {
  const blocked = guardTimelineSceneWrite({
    capability: "modify_topology",
    source: "timeline_workspace",
  });
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.tag, MRP_TIMELINE_SCENE_AWARE_TAG);
  assert.match(blocked.reason, /read-only/);
});

test("syncTimelineSceneAwareness updates workspace state coverage read-only", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  syncTimelineSceneAwareness({
    sceneJson: sceneWithEvents,
    navigationHistoryEntries: navigationHistory,
    selectedObjectId: "1",
  });

  const state = getTimelineWorkspaceState();
  assert.equal(state.sceneCoverage.objectsTracked, 15);
  assert.equal(state.sceneCoverage.objectsWithEvents, 8);
  assert.ok(state.sceneCoverage.recentEvents >= 2);
  assert.equal(state.sceneAwarenessReadOnly, true);
  assert.equal(getTimelineSceneAwarenessSnapshot().readOnly, true);
});

test("syncTimelineSceneAwareness dedupes identical signatures", () => {
  syncTimelineSceneAwareness({ sceneJson: sceneWithEvents, navigationHistoryEntries: navigationHistory });
  const revisionAfterFirst = getTimelineSceneAwarenessSnapshot().revision;

  syncTimelineSceneAwareness({ sceneJson: sceneWithEvents, navigationHistoryEntries: navigationHistory });
  assert.equal(getTimelineSceneAwarenessSnapshot().revision, revisionAfterFirst);
});

test("workspace view includes scene coverage", () => {
  hydrateTimelineWorkspaceStateOnMount("test");
  syncTimelineSceneAwareness({ sceneJson: sceneWithEvents, navigationHistoryEntries: navigationHistory });
  const view = buildTimelineWorkspaceViewFromState(getTimelineWorkspaceState());

  assert.equal(view.sceneCoverage.objectsTracked, 15);
  assert.equal(view.sceneAwarenessReadOnly, true);
});

test("empty scene returns zero coverage defaults", () => {
  const coverage = resolveTimelineSceneCoverage({
    sceneJson: null,
    navigationHistoryEntries: Object.freeze([]),
  });
  assert.deepEqual(coverage, DEFAULT_TIMELINE_SCENE_AWARENESS.coverage);
});

test("exports timeline coverage labels", () => {
  assert.equal(TIMELINE_SCENE_COVERAGE_LABELS.objectsTracked, "Objects Tracked");
  assert.equal(TIMELINE_SCENE_COVERAGE_LABELS.objectsWithEvents, "Objects With Events");
  assert.equal(TIMELINE_SCENE_COVERAGE_LABELS.recentEvents, "Recent Events");
});
