import assert from "node:assert/strict";
import test from "node:test";

import {
  areRelationshipLinePointsValid,
  readValidatedSceneRelationshipsForRender,
  resetRelationshipRendererRuntimeForTests,
  resolveRelationshipLineVisualReaction,
  resolveRelationshipObjectFocused,
  validateRelationshipForRender,
} from "./relationshipRendererRuntime.ts";

test("validates relationship contract before render", () => {
  resetRelationshipRendererRuntimeForTests();
  const valid = validateRelationshipForRender({
    id: "rel_a_b",
    sourceId: "obj_a",
    targetId: "obj_b",
    type: "influences",
    direction: "uni",
    createdAt: "2026-06-20T00:00:00.000Z",
    metadata: { confidence: 0.82 },
  });
  assert.equal(valid.valid, true);

  const invalid = validateRelationshipForRender({
    id: "rel_bad",
    sourceId: "",
    targetId: "obj_b",
    type: "influences",
    direction: "uni",
    createdAt: "2026-06-20T00:00:00.000Z",
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.includes("missing_source_object_id"));
});

test("filters invalid scene relationships and keeps valid ones", () => {
  resetRelationshipRendererRuntimeForTests();
  const sceneJson = {
    scene: {
      objects: [{ id: "obj_a" }, { id: "obj_b" }],
      relationships: [
        {
          id: "rel_ok",
          sourceId: "obj_a",
          targetId: "obj_b",
          type: "flow",
          direction: "uni",
          createdAt: "2026-06-20T00:00:00.000Z",
        },
        {
          id: "rel_bad",
          sourceId: "obj_a",
          targetId: "missing",
          type: "flow",
          direction: "uni",
          createdAt: "2026-06-20T00:00:00.000Z",
        },
      ],
    },
  };

  const relationships = readValidatedSceneRelationshipsForRender(sceneJson, sceneJson.scene.objects);
  assert.equal(relationships.length, 1);
  assert.equal(relationships[0]?.id, "rel_ok");
});

test("object focus emphasizes connected relationships when object selected", () => {
  const connected = resolveRelationshipLineVisualReaction({
    relationshipId: "rel_dep",
    selectedObjectId: "obj_a",
    renderPlan: { focusRole: "direct_dependency", emphasis: "PRIMARY" },
  });
  assert.equal(connected.objectFocused, true);
  assert.equal(connected.selected, true);
  assert.equal(connected.emphasized, true);

  const unrelated = resolveRelationshipLineVisualReaction({
    relationshipId: "rel_other",
    selectedObjectId: "obj_a",
    renderPlan: { focusRole: "unrelated", emphasis: "BACKGROUND" },
  });
  assert.equal(unrelated.objectFocused, false);
  assert.equal(unrelated.selected, false);
  assert.equal(unrelated.emphasized, false);
});

test("direct relationship selection remains selected without object focus", () => {
  const reaction = resolveRelationshipLineVisualReaction({
    relationshipId: "rel_dep",
    selectedRelationshipId: "rel_dep",
    renderPlan: { focusRole: "connected_context", emphasis: "SECONDARY" },
  });
  assert.equal(reaction.objectFocused, false);
  assert.equal(reaction.selected, true);
  assert.equal(reaction.emphasized, true);
});

test("no object selection keeps normal visual reaction behavior", () => {
  assert.equal(
    resolveRelationshipObjectFocused({
      selectedObjectId: null,
      renderPlan: { focusRole: "direct_dependency", emphasis: "PRIMARY" },
    }),
    false
  );

  const reaction = resolveRelationshipLineVisualReaction({
    relationshipId: "rel_a",
    renderPlan: { focusRole: "connected_context", emphasis: "BACKGROUND" },
  });
  assert.equal(reaction.selected, false);
  assert.equal(reaction.emphasized, false);
});

test("guards invalid line point payloads", () => {
  assert.equal(
    areRelationshipLinePointsValid([
      [0, 0, 0],
      [1, 1, 1],
    ]),
    true
  );
  assert.equal(
    areRelationshipLinePointsValid([
      [Number.NaN, 0, 0],
      [1, 1, 1],
    ]),
    false
  );
  assert.equal(areRelationshipLinePointsValid([[0, 0, 0]]), false);
});
