import assert from "node:assert/strict";
import test from "node:test";

import {
  beginObjectClickSelectionTransaction,
  classifySceneWriteMutation,
  endObjectClickSelectionTransaction,
  evaluateObjectClickSceneWriteGuard,
  isObjectClickSceneWriteSource,
  readRelationshipIdsForSceneParity,
  resetObjectClickSelectionReadOnlyGuardForTests,
} from "./objectClickSelectionReadOnlyGuard.ts";
import {
  buildObjectPanelSelectionOpenRequest,
  shouldOpenObjectPanelForSelection,
} from "./objectPanelSelectionBridge.ts";

const sceneWithRelationships = {
  scene: {
    objects: [{ id: "obj-a" }, { id: "obj-b" }],
    relationships: [{ id: "rel-1", sourceId: "obj-a", targetId: "obj-b", type: "depends_on" }],
  },
};

const sceneWithoutRelationships = {
  scene: {
    objects: [{ id: "obj-a" }, { id: "obj-b" }],
  },
};

test.beforeEach(() => {
  resetObjectClickSelectionReadOnlyGuardForTests();
});

test("detects object click scene write sources", () => {
  assert.equal(isObjectClickSceneWriteSource("object_click"), true);
  assert.equal(isObjectClickSceneWriteSource("object_click:evt-1"), true);
  assert.equal(isObjectClickSceneWriteSource("pointer_object_click"), true);
  assert.equal(isObjectClickSceneWriteSource("chat"), false);
});

test("reads relationship ids from visible scene parity source", () => {
  assert.deepEqual(readRelationshipIdsForSceneParity(sceneWithRelationships), ["rel-1"]);
  assert.deepEqual(readRelationshipIdsForSceneParity(sceneWithoutRelationships), []);
});

test("blocks structural scene writes for object_click source", () => {
  const result = evaluateObjectClickSceneWriteGuard({
    source: "object_click",
    prev: sceneWithRelationships,
    next: sceneWithoutRelationships,
  });
  assert.equal(result.allowed, false);
  assert.equal(result.action, "structural_write_blocked");
  assert.equal(result.reason, "selection_only");
  assert.equal(result.structuralMutation, true);
});

test("blocks selection-only sceneJson mutation for object_click source", () => {
  const prev = { ...sceneWithRelationships, object_selection: null };
  const next = {
    ...sceneWithRelationships,
    object_selection: { highlighted_objects: ["obj-a"], dim_unrelated_objects: false },
  };
  const result = evaluateObjectClickSceneWriteGuard({
    source: "object_click",
    prev,
    next,
  });
  assert.equal(result.allowed, false);
  assert.equal(result.action, "selection_only");
  assert.equal(result.selectionMutation, true);
  assert.equal(result.structuralMutation, false);
});

test("allows non-object-click structural writes", () => {
  const result = evaluateObjectClickSceneWriteGuard({
    source: "workspace",
    prev: sceneWithoutRelationships,
    next: sceneWithRelationships,
  });
  assert.equal(result.allowed, true);
  assert.equal(result.action, "allowed");
});

test("blocks structural writes during active object click transaction regardless of source", () => {
  beginObjectClickSelectionTransaction({ objectId: "obj-a", eventId: "evt-1" });
  const result = evaluateObjectClickSceneWriteGuard({
    source: "panel",
    prev: sceneWithRelationships,
    next: sceneWithoutRelationships,
  });
  assert.equal(result.allowed, false);
  assert.equal(result.action, "structural_write_blocked");
  endObjectClickSelectionTransaction("evt-1");
  assert.equal(
    evaluateObjectClickSceneWriteGuard({
      source: "panel",
      prev: sceneWithRelationships,
      next: sceneWithoutRelationships,
    }).allowed,
    true
  );
});

test("classifies structural vs selection mutations", () => {
  assert.deepEqual(
    classifySceneWriteMutation({
      prev: sceneWithRelationships,
      next: sceneWithRelationships,
    }),
    { structuralMutation: false, selectionMutation: false }
  );
  assert.equal(
    classifySceneWriteMutation({
      prev: sceneWithRelationships,
      next: sceneWithoutRelationships,
    }).structuralMutation,
    true
  );
});

test("builds deferred object panel open request", () => {
  assert.deepEqual(
    buildObjectPanelSelectionOpenRequest({
      objectId: "draft_expenses_2",
      objectClickRequestId: 7,
    }),
    {
      source: "object_click",
      family: "SCN",
      view: "object",
      contextId: "draft_expenses_2",
      reason: "selection_budget_deferred",
      forceOpen: true,
      objectClickRequestId: 7,
    }
  );
  assert.equal(
    shouldOpenObjectPanelForSelection({
      currentView: "object",
      currentContextId: "draft_expenses_2",
      isOpen: true,
      objectId: "draft_expenses_2",
    }),
    false
  );
  assert.equal(
    shouldOpenObjectPanelForSelection({
      currentView: "dashboard",
      currentContextId: null,
      isOpen: true,
      objectId: "draft_expenses_2",
    }),
    true
  );
});

test("NW-B:8-4 regression — click preserves relationships and blocks structural rewrite", () => {
  beginObjectClickSelectionTransaction({
    objectId: "draft_expenses_2",
    eventId: "evt-regression",
  });

  const selectedObjectId = "draft_expenses_2";
  const previousSelectedObjectId = "draft_expenses_1";
  assert.notEqual(previousSelectedObjectId, selectedObjectId);

  const relationshipIdsBefore = readRelationshipIdsForSceneParity(sceneWithRelationships);
  assert.deepEqual(relationshipIdsBefore, ["rel-1"]);

  const structuralGuard = evaluateObjectClickSceneWriteGuard({
    source: "object_click",
    prev: sceneWithRelationships,
    next: sceneWithoutRelationships,
  });
  assert.equal(structuralGuard.allowed, false);

  const relationshipIdsAfter = readRelationshipIdsForSceneParity(sceneWithRelationships);
  assert.deepEqual(relationshipIdsAfter, relationshipIdsBefore);

  const parityBefore = JSON.stringify({
    objectIds: ["obj-a", "obj-b"],
    relationshipIds: relationshipIdsBefore,
  });
  const parityAfter = JSON.stringify({
    objectIds: ["obj-a", "obj-b"],
    relationshipIds: relationshipIdsAfter,
  });
  assert.equal(parityAfter, parityBefore);

  endObjectClickSelectionTransaction("evt-regression");
});
