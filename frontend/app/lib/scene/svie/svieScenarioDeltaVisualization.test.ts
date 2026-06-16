import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_SCENARIO_DELTA_COMPUTED_LOG,
  SVIE_SCENARIO_DELTA_VISUALIZATION_TAG,
} from "./svieScenarioDeltaVisualizationContract.ts";
import {
  deriveScenarioDelta,
  resolveScenarioDeltaVisualization,
} from "./svieScenarioDeltaVisualizationResolver.ts";
import {
  guardSvieScenarioDeltaRouteWrite,
  guardSvieScenarioDeltaWorkspaceWrite,
  resetSvieScenarioDeltaVisualizationRuntimeForTests,
  syncScenarioDeltaOverlay,
} from "./svieScenarioDeltaVisualizationRuntime.ts";
import { resetSvieScenarioLinkRuntimeForTests } from "./svieScenarioLinkRuntime.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";
import { generateTopology } from "../topology/topologyEngine.ts";
import { FLOW_NODE_SPACING } from "../topology/flowTopologyGenerator.ts";

const SAMPLE_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "inventory", name: "Inventory" }),
      Object.freeze({ id: "supplier", name: "Supplier" }),
      Object.freeze({ id: "production", name: "Production" }),
      Object.freeze({ id: "warehouse", name: "Warehouse" }),
    ]),
  }),
  svie: Object.freeze({
    scenarios: Object.freeze([
      Object.freeze({
        scenarioId: "scenario:supplier-delay",
        label: "Supplier Delay",
        objectIds: Object.freeze(["warehouse"]),
        linkedLabels: Object.freeze(["Inventory", "Supplier", "Production"]),
        objectImpacts: Object.freeze([
          Object.freeze({ objectId: "inventory", beforeRisk: 0.3, afterRisk: 0.7 }),
          Object.freeze({ objectId: "supplier", beforeRisk: 0.7, afterRisk: 0.45 }),
          Object.freeze({ objectId: "production", beforeRisk: 0.5, afterRisk: 0.5 }),
        ]),
        confidence: 0.82,
      }),
    ]),
  }),
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieScenarioLinkRuntimeForTests();
  resetSvieScenarioDeltaVisualizationRuntimeForTests();
});

test("exports SVIE scenario delta visualization tag", () => {
  assert.equal(SVIE_SCENARIO_DELTA_VISUALIZATION_TAG, "[SVIE:4:3_SCENARIO_DELTA_VISUALIZATION]");
});

test("A — delta calculation resolves increase, decrease, stable, and unknown", () => {
  const deltas = deriveScenarioDelta({
    scenarioId: "scenario:delta",
    objectIds: ["inventory", "supplier", "production", "warehouse"],
    predictedChanges: [
      { objectId: "inventory", metric: "risk", before: 0.3, after: 0.7 },
      { objectId: "supplier", metric: "risk", before: 0.7, after: 0.45 },
      { objectId: "production", metric: "risk", before: 0.5, after: 0.5 },
    ],
    confidence: 0.8,
  });

  assert.equal(deltas.find((delta) => delta.objectId === "inventory")?.direction, "increase");
  assert.equal(deltas.find((delta) => delta.objectId === "inventory")?.magnitude, 0.4);
  assert.equal(deltas.find((delta) => delta.objectId === "supplier")?.direction, "decrease");
  assert.equal(deltas.find((delta) => delta.objectId === "production")?.direction, "stable");
  assert.equal(deltas.find((delta) => delta.objectId === "warehouse")?.direction, "unknown");
});

test("B — delta rendering maps directions to visual overlays", () => {
  const snapshot = syncScenarioDeltaOverlay({ sceneJson: SAMPLE_SCENE });
  assert.equal(snapshot.nodeVisualByObjectId.inventory?.direction, "increase");
  assert.equal(snapshot.nodeVisualByObjectId.supplier?.direction, "decrease");
  assert.equal(snapshot.nodeVisualByObjectId.production?.direction, "stable");
  assert.equal(snapshot.nodeVisualByObjectId.warehouse?.direction, "unknown");
  assert.equal(snapshot.nodeVisualByObjectId.inventory?.glowColor, "#ef4444");

  for (const visual of Object.values(snapshot.nodeVisualByObjectId)) {
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "magnitude"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "before"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "after"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "delta"));
  }
});

test("C — stable output via sync cache", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncScenarioDeltaOverlay({ sceneJson: SAMPLE_SCENE });
    const second = syncScenarioDeltaOverlay({ sceneJson: SAMPLE_SCENE });
    assert.equal(first, second);
    assert.equal(JSON.stringify(first.deltas), JSON.stringify(second.deltas));
    assert.equal(logs.filter((entry) => entry === SVIE_SCENARIO_DELTA_COMPUTED_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("resolveScenarioDeltaVisualization is deterministic across link ordering", () => {
  const first = resolveScenarioDeltaVisualization([
    {
      scenarioId: "b",
      objectIds: ["supplier"],
      predictedChanges: [{ objectId: "supplier", metric: "risk", before: 0.7, after: 0.4 }],
      confidence: 0.7,
    },
    {
      scenarioId: "a",
      objectIds: ["inventory"],
      predictedChanges: [{ objectId: "inventory", metric: "risk", before: 0.2, after: 0.6 }],
      confidence: 0.7,
    },
  ]);
  const second = resolveScenarioDeltaVisualization([
    {
      scenarioId: "a",
      objectIds: ["inventory"],
      predictedChanges: [{ objectId: "inventory", metric: "risk", before: 0.2, after: 0.6 }],
      confidence: 0.7,
    },
    {
      scenarioId: "b",
      objectIds: ["supplier"],
      predictedChanges: [{ objectId: "supplier", metric: "risk", before: 0.7, after: 0.4 }],
      confidence: 0.7,
    },
  ]);

  assert.equal(JSON.stringify(first), JSON.stringify(second));
});

test("D — no scene or topology mutation", () => {
  const before = JSON.stringify(SAMPLE_SCENE);
  syncScenarioDeltaOverlay({ sceneJson: SAMPLE_SCENE });
  assert.equal(JSON.stringify(SAMPLE_SCENE), before);

  const result = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});

test("E — routing and workspace writes remain blocked", () => {
  assert.equal(
    guardSvieScenarioDeltaRouteWrite({ action: "requestWorkspaceLaunch", source: "svie-delta-test" })
      .allowed,
    false
  );
  assert.equal(
    guardSvieScenarioDeltaWorkspaceWrite({
      action: "commitExecutiveWorkspaceTransition",
      source: "svie-delta-test",
    }).allowed,
    false
  );
});
