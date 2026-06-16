import test from "node:test";
import assert from "node:assert/strict";

import { DEFAULT_MRP_SELECTED_OBJECT } from "../mrpContext/mrpContextStoreContract.ts";
import {
  DEFAULT_OPERATIONAL_OBJECT_CONTEXT,
} from "./operational/operationalObjectContextContract.ts";
import {
  OPERATIONAL_SCENE_AWARE_TAG,
  DEFAULT_OPERATIONAL_SCENE_AWARENESS,
  OPERATIONAL_SCENE_FORBIDDEN_CAPABILITIES,
  OPERATIONAL_SCENE_FUTURE_ENGINE_SOURCES,
  OPERATIONAL_SCENE_READ_FIELDS,
} from "./operational/operationalSceneAwarenessContract.ts";
import {
  mapOperationalObjectContextToSceneAwareness,
  resolveOperationalSceneAwareness,
} from "./operational/operationalSceneAwarenessResolver.ts";
import {
  assertOperationalSceneReadOnly,
  getOperationalSceneAwarenessSnapshot,
  guardOperationalSceneWrite,
  resetOperationalSceneAwarenessRuntimeForTests,
  syncOperationalSceneAwareness,
  syncOperationalSceneAwarenessFromObjectContext,
} from "./operational/operationalSceneAwarenessRuntime.ts";
import {
  getOperationalWorkspaceState,
  hydrateOperationalWorkspaceStateOnMount,
  resetOperationalWorkspaceStateRuntimeForTests,
} from "./operational/operationalWorkspaceStateRuntime.ts";
import { syncOperationalObjectContext } from "./operational/operationalObjectContextRuntime.ts";
import { resetOperationalObjectContextRuntimeForTests } from "./operational/operationalObjectContextRuntime.ts";

test.beforeEach(() => {
  resetOperationalSceneAwarenessRuntimeForTests();
  resetOperationalObjectContextRuntimeForTests();
  resetOperationalWorkspaceStateRuntimeForTests();
});

test("exports scene awareness tag", () => {
  assert.equal(OPERATIONAL_SCENE_AWARE_TAG, "[OPERATIONAL_SCENE_AWARE]");
});

test("defines read-only scene fields and forbidden capabilities", () => {
  assert.deepEqual(OPERATIONAL_SCENE_READ_FIELDS, [
    "selectedObject",
    "objectStatus",
    "objectPriority",
    "objectActivity",
  ]);
  assert.deepEqual(OPERATIONAL_SCENE_FORBIDDEN_CAPABILITIES, [
    "move_objects",
    "modify_topology",
    "change_camera",
    "control_scene",
  ]);
});

test("defines future engine integration hooks", () => {
  assert.deepEqual(OPERATIONAL_SCENE_FUTURE_ENGINE_SOURCES, [
    "visual_intelligence_engine",
    "operational_engine",
  ]);
});

test("resolveOperationalSceneAwareness returns safe defaults when deselected", () => {
  const snapshot = resolveOperationalSceneAwareness({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  assert.equal(snapshot.hasSelection, false);
  assert.equal(snapshot.readOnly, true);
  assert.equal(snapshot.selectedObject, DEFAULT_MRP_SELECTED_OBJECT);
  assert.equal(snapshot.objectStatus, "Awaiting selection");
});

test("mapOperationalObjectContextToSceneAwareness maps operational fields to scene reads", () => {
  const snapshot = mapOperationalObjectContextToSceneAwareness(
    syncOperationalObjectContext({
      selectedObjectId: "factory-a",
      selectedObjectLabel: "Factory A",
    })
  );
  assert.equal(snapshot.selectedObject, "Factory A");
  assert.equal(snapshot.objectStatus, "Running");
  assert.equal(snapshot.objectPriority, "Elevated");
  assert.equal(snapshot.objectActivity, "High");
  assert.equal(snapshot.readOnly, true);
});

test("syncOperationalSceneAwarenessFromObjectContext updates read-only snapshot", () => {
  syncOperationalSceneAwarenessFromObjectContext(
    syncOperationalObjectContext({
      selectedObjectId: "production-line",
      selectedObjectLabel: "Production Line",
    })
  );
  const snapshot = getOperationalSceneAwarenessSnapshot();
  assert.equal(snapshot.selectedObject, "Production Line");
  assert.equal(snapshot.objectStatus, "Active");
  assert.equal(assertOperationalSceneReadOnly(snapshot), true);
});

test("guardOperationalSceneWrite blocks all forbidden scene capabilities", () => {
  for (const capability of OPERATIONAL_SCENE_FORBIDDEN_CAPABILITIES) {
    const result = guardOperationalSceneWrite({ capability, source: "test" });
    assert.equal(result.allowed, false);
    assert.equal(result.capability, capability);
    assert.equal(result.tag, OPERATIONAL_SCENE_AWARE_TAG);
    assert.match(result.reason, /read-only/i);
  }
});

test("deselection restores scene defaults without clearing operational workspace state", () => {
  hydrateOperationalWorkspaceStateOnMount("test");
  syncOperationalObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncOperationalSceneAwarenessFromObjectContext(getOperationalWorkspaceState().objectContext);
  syncOperationalObjectContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  syncOperationalSceneAwarenessFromObjectContext(getOperationalWorkspaceState().objectContext);

  const sceneSnapshot = getOperationalSceneAwarenessSnapshot();
  const workspaceState = getOperationalWorkspaceState();

  assert.deepEqual(sceneSnapshot.selectedObject, DEFAULT_OPERATIONAL_SCENE_AWARENESS.selectedObject);
  assert.equal(sceneSnapshot.hasSelection, false);
  assert.equal(workspaceState.phase, "ready");
  assert.ok(workspaceState.operationalFocus.headline.trim());
});

test("syncOperationalSceneAwareness skips duplicate signatures", () => {
  const first = syncOperationalSceneAwareness({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
    selectedObjectStatus: "Running",
    objectPriority: "Elevated",
    objectActivity: "High",
  });
  const second = syncOperationalSceneAwareness({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
    selectedObjectStatus: "Running",
    objectPriority: "Elevated",
    objectActivity: "High",
  });
  assert.equal(first.signature, second.signature);
  assert.equal(first, second);
});
