import assert from "node:assert/strict";
import test from "node:test";
import {
  applyTypeCConnectionSuggestionsToScene,
  buildTypeCConnectionSuggestions,
} from "./typeCConnectionSuggestions.ts";
import type { SceneJson } from "../sceneTypes.ts";

function scene(objects: Array<{ id: string; label?: string }>, loops: SceneJson["scene"]["loops"] = []): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects,
      loops,
    },
  };
}

test("buildTypeCConnectionSuggestions generates suggestions for valid object", () => {
  const suggestions = buildTypeCConnectionSuggestions({
    newObject: { label: "Supplier" },
    sceneJson: scene([
      { id: "nexora_core", label: "Nexora Core" },
      { id: "typec_inventory", label: "Inventory" },
    ]),
  });

  assert.ok(suggestions.some((suggestion) => suggestion.targetObjectId === "typec_inventory"));
});

test("buildTypeCConnectionSuggestions returns none for empty scene", () => {
  assert.deepEqual(
    buildTypeCConnectionSuggestions({
      newObject: { label: "Supplier" },
      sceneJson: scene([]),
    }),
    []
  );
});

test("buildTypeCConnectionSuggestions keeps confidence within bounds", () => {
  const suggestions = buildTypeCConnectionSuggestions({
    newObject: { label: "Inventory" },
    sceneJson: scene([{ id: "typec_supplier", label: "Supplier" }]),
  });

  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.every((suggestion) => suggestion.confidence >= 0 && suggestion.confidence <= 1));
});

test("buildTypeCConnectionSuggestions always includes reasons", () => {
  const suggestions = buildTypeCConnectionSuggestions({
    newObject: { label: "Payment" },
    sceneJson: scene([{ id: "typec_order", label: "Order" }]),
  });

  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.every((suggestion) => suggestion.reason.trim().length > 0));
});

test("buildTypeCConnectionSuggestions caps suggestions at five", () => {
  const suggestions = buildTypeCConnectionSuggestions({
    newObject: { label: "Risk Signal" },
    sceneJson: scene([
      { id: "nexora_core", label: "Nexora Core" },
      { id: "a", label: "Risk A" },
      { id: "b", label: "Risk B" },
      { id: "c", label: "Risk C" },
      { id: "d", label: "Risk D" },
      { id: "e", label: "Risk E" },
      { id: "f", label: "Risk F" },
    ]),
  });

  assert.ok(suggestions.length <= 5);
});

test("buildTypeCConnectionSuggestions does not mutate scene before apply", () => {
  const input = scene([{ id: "typec_inventory", label: "Inventory" }]);
  const before = structuredClone(input);

  buildTypeCConnectionSuggestions({
    newObject: { label: "Supplier" },
    sceneJson: input,
  });

  assert.deepEqual(input, before);
});

test("applyTypeCConnectionSuggestionsToScene only applies selected suggestions", () => {
  const input = scene([
    { id: "typec_supplier", label: "Supplier" },
    { id: "typec_inventory", label: "Inventory" },
    { id: "typec_delivery", label: "Delivery" },
  ]);

  const next = applyTypeCConnectionSuggestionsToScene(input, [
    {
      id: "selected",
      sourceObjectId: "typec_supplier",
      targetObjectId: "typec_inventory",
      type: "dependency",
      reason: "Typical supply chain flow",
      confidence: 0.9,
      selected: true,
    },
    {
      id: "unselected",
      sourceObjectId: "typec_inventory",
      targetObjectId: "typec_delivery",
      type: "risk_flow",
      reason: "Typical supply chain flow",
      confidence: 0.8,
      selected: false,
    },
  ]);

  const edges = next.scene.loops?.flatMap((loop) => loop.edges) ?? [];
  assert.ok(edges.some((edge) => edge.from === "typec_supplier" && edge.to === "typec_inventory"));
  assert.ok(!edges.some((edge) => edge.from === "typec_inventory" && edge.to === "typec_delivery"));
});
