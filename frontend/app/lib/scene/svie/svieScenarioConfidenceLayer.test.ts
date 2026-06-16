import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_SCENARIO_CONFIDENCE_COMPUTED_LOG,
  SVIE_SCENARIO_CONFIDENCE_LAYER_TAG,
} from "./svieScenarioConfidenceLayerContract.ts";
import {
  mapScenarioConfidence,
  mapScenarioConfidences,
  resolveScenarioConfidenceVisualization,
} from "./svieScenarioConfidenceLayerResolver.ts";
import {
  guardSvieScenarioConfidenceRouteWrite,
  guardSvieScenarioConfidenceWorkspaceWrite,
  resetSvieScenarioConfidenceLayerRuntimeForTests,
  syncScenarioConfidenceLayer,
} from "./svieScenarioConfidenceLayerRuntime.ts";
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
        scenarioId: "scenario:executive-high",
        linkedLabels: Object.freeze(["Inventory"]),
        confidence: 0.94,
      }),
      Object.freeze({
        scenarioId: "scenario:high",
        linkedLabels: Object.freeze(["Supplier"]),
        confidence: 0.82,
      }),
      Object.freeze({
        scenarioId: "scenario:moderate",
        linkedLabels: Object.freeze(["Production"]),
        confidence: 0.58,
      }),
      Object.freeze({
        scenarioId: "scenario:low",
        linkedLabels: Object.freeze(["Warehouse"]),
        confidence: 0.32,
      }),
    ]),
  }),
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieScenarioLinkRuntimeForTests();
  resetSvieScenarioConfidenceLayerRuntimeForTests();
});

test("exports SVIE scenario confidence layer tag", () => {
  assert.equal(SVIE_SCENARIO_CONFIDENCE_LAYER_TAG, "[SVIE:4:6_SCENARIO_CONFIDENCE_LAYER]");
});

test("A — confidence mapping assigns scenario confidence tiers", () => {
  assert.equal(mapScenarioConfidence(0.95), "executive_high");
  assert.equal(mapScenarioConfidence(0.82), "high");
  assert.equal(mapScenarioConfidence(0.61), "moderate");
  assert.equal(mapScenarioConfidence(0.41), "low");

  const entries = mapScenarioConfidences([
    { scenarioId: "a", objectIds: ["inventory"], predictedChanges: [], confidence: 0.94 },
    { scenarioId: "b", objectIds: ["supplier"], predictedChanges: [], confidence: 0.58 },
  ]);
  assert.equal(entries[0]?.tier, "executive_high");
  assert.equal(entries[1]?.tier, "moderate");
});

test("B — stable rendering maps tiers to pulse modes", () => {
  const snapshot = syncScenarioConfidenceLayer({ sceneJson: SAMPLE_SCENE });
  assert.equal(snapshot.nodeVisualByObjectId.inventory?.pulseMode, "stable");
  assert.equal(snapshot.nodeVisualByObjectId.supplier?.pulseMode, "stable");
  assert.equal(snapshot.nodeVisualByObjectId.production?.pulseMode, "soft");
  assert.equal(snapshot.nodeVisualByObjectId.warehouse?.pulseMode, "unstable");

  const visuals = resolveScenarioConfidenceVisualization(snapshot.entries);
  for (const visual of Object.values(visuals)) {
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "confidence"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "percentage"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "label"));
  }
});

test("C — repeatability via sync cache", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncScenarioConfidenceLayer({ sceneJson: SAMPLE_SCENE });
    const second = syncScenarioConfidenceLayer({ sceneJson: SAMPLE_SCENE });
    assert.equal(first, second);
    assert.equal(JSON.stringify(first.entries), JSON.stringify(second.entries));
    assert.equal(logs.filter((entry) => entry === SVIE_SCENARIO_CONFIDENCE_COMPUTED_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("D — routing and workspace writes remain blocked", () => {
  assert.equal(
    guardSvieScenarioConfidenceRouteWrite({
      action: "requestWorkspaceLaunch",
      source: "svie-scenario-confidence-test",
    }).allowed,
    false
  );
  assert.equal(
    guardSvieScenarioConfidenceWorkspaceWrite({
      action: "commitExecutiveWorkspaceTransition",
      source: "svie-scenario-confidence-test",
    }).allowed,
    false
  );
});

test("E — no topology mutation and responsive sync", () => {
  const startedAt = performance.now();
  syncScenarioConfidenceLayer({ sceneJson: SAMPLE_SCENE });
  const elapsedMs = performance.now() - startedAt;
  assert.ok(elapsedMs < 250, `Scenario confidence sync exceeded budget: ${elapsedMs.toFixed(2)}ms`);

  const result = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});
