import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_FUTURE_STATE_COMPUTED_LOG,
  SVIE_FUTURE_STATE_VISUALIZATION_TAG,
} from "./svieFutureStateVisualizationContract.ts";
import {
  classifyFutureStateLevel,
  resolveFutureStateVisualization,
} from "./svieFutureStateVisualizationResolver.ts";
import {
  guardSvieFutureStateRouteWrite,
  guardSvieFutureStateWorkspaceWrite,
  resetSvieFutureStateVisualizationRuntimeForTests,
  syncFutureStateOverlay,
} from "./svieFutureStateVisualizationRuntime.ts";
import { resetSvieScenarioLinkRuntimeForTests } from "./svieScenarioLinkRuntime.ts";
import {
  resetSvieAdvisoryVisualIntelligenceCertificationForTests,
  runSvieAdvisoryVisualIntelligenceCertification,
} from "./svieAdvisoryVisualIntelligenceCertification.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";
import { generateTopology } from "../topology/topologyEngine.ts";
import { FLOW_NODE_SPACING } from "../topology/flowTopologyGenerator.ts";

const SAMPLE_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "inventory", name: "Inventory" }),
      Object.freeze({ id: "supplier", name: "Supplier" }),
      Object.freeze({ id: "production", name: "Production" }),
    ]),
  }),
  svie: Object.freeze({
    scenarios: Object.freeze([
      Object.freeze({
        scenarioId: "scenario:supplier-delay",
        label: "Supplier Delay",
        linkedLabels: Object.freeze(["Inventory", "Supplier", "Production"]),
        objectImpacts: Object.freeze([
          Object.freeze({ objectId: "inventory", beforeRisk: 0.24, afterRisk: 0.72 }),
          Object.freeze({ objectId: "supplier", beforeRisk: 0.42, afterRisk: 0.88 }),
          Object.freeze({ objectId: "production", beforeActivity: 0.8, afterActivity: 0.5 }),
        ]),
        confidence: 0.84,
      }),
    ]),
  }),
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieScenarioLinkRuntimeForTests();
  resetSvieFutureStateVisualizationRuntimeForTests();
  resetSvieAdvisoryVisualIntelligenceCertificationForTests();
});

test("exports SVIE future state visualization tag", () => {
  assert.equal(SVIE_FUTURE_STATE_VISUALIZATION_TAG, "[SVIE:4:2_FUTURE_STATE_VISUALIZATION]");
});

test("A — future state mapping classifies predicted object states", () => {
  assert.equal(classifyFutureStateLevel(0.2), "stable");
  assert.equal(classifyFutureStateLevel(0.5), "moderate");
  assert.equal(classifyFutureStateLevel(0.72), "high");
  assert.equal(classifyFutureStateLevel(0.91), "critical");

  const snapshot = syncFutureStateOverlay({ sceneJson: SAMPLE_SCENE });
  assert.equal(snapshot.futureStates.length, 3);
  assert.equal(snapshot.nodeVisualByObjectId.inventory?.futureLevel, "high");
  assert.equal(snapshot.nodeVisualByObjectId.supplier?.futureLevel, "critical");
  assert.equal(snapshot.nodeVisualByObjectId.production?.futureLevel, "stable");
});

test("B — visualization stability keeps material-only visual fields", () => {
  const snapshot = syncFutureStateOverlay({ sceneJson: SAMPLE_SCENE });
  const inventory = snapshot.nodeVisualByObjectId.inventory;
  assert.ok(inventory);
  assert.equal(inventory?.glowColor, "#f97316");
  assert.ok((inventory?.glowIntensity ?? 0) > 0);

  for (const visual of Object.values(snapshot.nodeVisualByObjectId)) {
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "position"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "scale"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "rotation"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "transform"));
  }
});

test("C — deterministic rendering via sync cache", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncFutureStateOverlay({ sceneJson: SAMPLE_SCENE });
    const second = syncFutureStateOverlay({ sceneJson: SAMPLE_SCENE });
    assert.equal(first, second);
    assert.equal(JSON.stringify(first.futureStates), JSON.stringify(second.futureStates));
    assert.equal(logs.filter((entry) => entry === SVIE_FUTURE_STATE_COMPUTED_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("resolveFutureStateVisualization ignores objects without future risk states", () => {
  const futureStates = resolveFutureStateVisualization([
    {
      scenarioId: "scenario:activity-only",
      objectIds: ["production"],
      predictedChanges: [
        { objectId: "production", metric: "activity", before: 0.8, after: 0.5, delta: -0.3 },
      ],
      confidence: 0.7,
    },
  ]);

  assert.equal(futureStates.length, 1);
  assert.equal(futureStates[0]?.futureLevel, "stable");
  assert.equal(futureStates[0]?.changeCount, 1);
});

test("D — topology engine positions remain unchanged", () => {
  syncFutureStateOverlay({ sceneJson: SAMPLE_SCENE });
  const result = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});

test("E — routing, workspace, and lifecycle safety remain intact", () => {
  assert.equal(
    guardSvieFutureStateRouteWrite({ action: "requestWorkspaceLaunch", source: "svie-future-state-test" })
      .allowed,
    false
  );
  assert.equal(
    guardSvieFutureStateWorkspaceWrite({
      action: "commitExecutiveWorkspaceTransition",
      source: "svie-future-state-test",
    }).allowed,
    false
  );

  const phase3 = runSvieAdvisoryVisualIntelligenceCertification({ force: true });
  assert.equal(phase3.certified, true);
  for (const gate of phase3.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
});
