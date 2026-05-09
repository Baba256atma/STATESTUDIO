import assert from "node:assert/strict";
import test from "node:test";
import { buildTypeCScenarioDrafts } from "./typeCScenarioDrafts.ts";
import type { TypeCConnectionSuggestion } from "./typeCConnectionSuggestions.ts";
import type { SceneJson } from "../sceneTypes.ts";

function scene(edges: Array<{ from: string; to: string; kind?: string }> = []): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects: [
        { id: "typec_supplier", label: "Supplier" },
        { id: "typec_inventory", label: "Inventory" },
        { id: "typec_delivery", label: "Delivery" },
        { id: "typec_customer", label: "Customer" },
      ],
      loops: [
        {
          id: "loop",
          type: "stability_balance",
          edges,
        },
      ],
    },
  };
}

function connection(from: string, to: string, type: TypeCConnectionSuggestion["type"] = "dependency"): TypeCConnectionSuggestion {
  return {
    id: `conn_${from}_${to}`,
    sourceObjectId: from,
    targetObjectId: to,
    type,
    reason: "Test connection",
    confidence: 0.8,
    selected: true,
  };
}

test("buildTypeCScenarioDrafts detects chain scenario", () => {
  const drafts = buildTypeCScenarioDrafts({
    sceneJson: scene([
      { from: "typec_supplier", to: "typec_inventory", kind: "type_c_dependency" },
      { from: "typec_inventory", to: "typec_delivery", kind: "type_c_risk_flow" },
    ]),
  });

  assert.ok(drafts.some((draft) => draft.title === "Supplier delay cascade risk"));
});

test("buildTypeCScenarioDrafts avoids duplicate scenarios", () => {
  const drafts = buildTypeCScenarioDrafts({
    sceneJson: scene([
      { from: "typec_supplier", to: "typec_inventory", kind: "type_c_dependency" },
      { from: "typec_supplier", to: "typec_inventory", kind: "type_c_dependency" },
      { from: "typec_inventory", to: "typec_delivery", kind: "type_c_risk_flow" },
    ]),
  });

  assert.equal(new Set(drafts.map((draft) => draft.id)).size, drafts.length);
});

test("buildTypeCScenarioDrafts caps scenarios at three", () => {
  const drafts = buildTypeCScenarioDrafts({
    sceneJson: scene([
      { from: "typec_supplier", to: "typec_inventory", kind: "type_c_dependency" },
      { from: "typec_inventory", to: "typec_delivery", kind: "type_c_risk_flow" },
      { from: "typec_delivery", to: "typec_customer", kind: "type_c_risk_flow" },
      { from: "typec_supplier", to: "typec_customer", kind: "type_c_risk_flow" },
    ]),
  });

  assert.ok(drafts.length <= 3);
});

test("buildTypeCScenarioDrafts returns valid confidence", () => {
  const drafts = buildTypeCScenarioDrafts({
    sceneJson: scene([{ from: "typec_inventory", to: "typec_delivery", kind: "type_c_risk_flow" }]),
    newConnections: [connection("typec_inventory", "typec_delivery", "risk_flow")],
  });

  assert.ok(drafts.length > 0);
  assert.ok(drafts.every((draft) => draft.confidence >= 0 && draft.confidence <= 1));
});

test("buildTypeCScenarioDrafts does not mutate scene", () => {
  const input = scene([
    { from: "typec_supplier", to: "typec_inventory", kind: "type_c_dependency" },
    { from: "typec_inventory", to: "typec_delivery", kind: "type_c_risk_flow" },
  ]);
  const before = structuredClone(input);

  buildTypeCScenarioDrafts({ sceneJson: input });

  assert.deepEqual(input, before);
});

test("buildTypeCScenarioDrafts returns no scenarios for empty scene", () => {
  const empty: SceneJson = { state_vector: {}, scene: { objects: [], loops: [] } };

  assert.deepEqual(buildTypeCScenarioDrafts({ sceneJson: empty }), []);
});
