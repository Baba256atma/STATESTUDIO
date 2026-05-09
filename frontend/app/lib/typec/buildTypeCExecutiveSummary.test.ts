import assert from "node:assert/strict";
import test from "node:test";
import { buildTypeCExecutiveSummary } from "./buildTypeCExecutiveSummary.ts";
import type { SceneJson } from "../sceneTypes.ts";

function scene(objects: Array<{ id: string; label?: string; dependencies?: string[] }>, loops: SceneJson["scene"]["loops"] = []): SceneJson {
  return {
    state_vector: {},
    scene: {
      objects,
      loops,
    },
  };
}

test("buildTypeCExecutiveSummary returns fallback for empty scene", () => {
  const summary = buildTypeCExecutiveSummary({ sceneJson: null });

  assert.equal(summary?.headline, "No executive insight available");
  assert.equal(summary?.recommendation, "Add objects or run analysis to generate insights");
  assert.deepEqual(summary?.confidence, { label: "Low", value: 10 });
});

test("buildTypeCExecutiveSummary gives single object low confidence", () => {
  const summary = buildTypeCExecutiveSummary({
    sceneJson: scene([{ id: "supplier", label: "Supplier" }]),
  });

  assert.equal(summary?.confidence.label, "Low");
  assert.ok((summary?.confidence.value ?? 100) < 40);
});

test("buildTypeCExecutiveSummary uses high fragility in headline and recommendation", () => {
  const summary = buildTypeCExecutiveSummary({
    sceneJson: scene([{ id: "supplier", label: "Supplier" }]),
    selectedObjectId: "supplier",
    fragilitySignals: {
      fragilityLevel: "high",
      signalsCount: 4,
    },
  });

  assert.equal(summary?.headline, "System fragility increasing around Supplier");
  assert.equal(summary?.recommendation, "Stabilize Supplier before scaling");
});

test("buildTypeCExecutiveSummary increases confidence when selected object is present", () => {
  const base = buildTypeCExecutiveSummary({
    sceneJson: scene([{ id: "supplier", label: "Supplier" }, { id: "inventory", label: "Inventory" }]),
    fragilitySignals: { fragilityLevel: "medium" },
  });
  const selected = buildTypeCExecutiveSummary({
    sceneJson: scene([{ id: "supplier", label: "Supplier" }, { id: "inventory", label: "Inventory" }]),
    selectedObjectId: "supplier",
    fragilitySignals: { fragilityLevel: "medium" },
  });

  assert.ok((selected?.confidence.value ?? 0) > (base?.confidence.value ?? 0));
});

test("buildTypeCExecutiveSummary caps arrays at two items", () => {
  const summary = buildTypeCExecutiveSummary({
    sceneJson: scene(
      [
        { id: "supplier", label: "Supplier", dependencies: ["inventory", "delivery"] },
        { id: "inventory", label: "Inventory" },
        { id: "delivery", label: "Delivery" },
      ],
      [
        {
          id: "loop",
          type: "delivery_customer",
          edges: [
            { from: "supplier", to: "inventory" },
            { from: "inventory", to: "delivery" },
            { from: "supplier", to: "delivery" },
          ],
        },
      ]
    ),
    selectedObjectId: "supplier",
    fragilitySignals: {
      fragilityLevel: "high",
      signalsCount: 5,
      riskPropagation: {
        impacted_nodes: ["supplier", "inventory", "delivery"],
      },
    },
  });

  assert.ok((summary?.why.length ?? 0) <= 2);
  assert.ok((summary?.nextActions.length ?? 0) <= 2);
  assert.ok((summary?.riskNotes.length ?? 0) <= 2);
});
