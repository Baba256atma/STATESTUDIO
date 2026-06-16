import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_MULTI_SCENARIO_COMPARISON_TAG,
  SVIE_SCENARIO_COMPARISON_COMPUTED_LOG,
} from "./svieScenarioComparisonLayerContract.ts";
import {
  buildScenarioComparisonModel,
  resolveScenarioComparisonVisualization,
} from "./svieScenarioComparisonLayerResolver.ts";
import {
  guardSvieScenarioComparisonRouteWrite,
  guardSvieScenarioComparisonWorkspaceWrite,
  resetSvieScenarioComparisonLayerRuntimeForTests,
  syncScenarioComparisonLayer,
} from "./svieScenarioComparisonLayerRuntime.ts";
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
      Object.freeze({ id: "supplier", name: "Supplier" }),
      Object.freeze({ id: "inventory", name: "Inventory" }),
      Object.freeze({ id: "production", name: "Production" }),
    ]),
  }),
  svie: Object.freeze({
    scenarios: Object.freeze([
      Object.freeze({
        scenarioId: "scenario:a",
        label: "Scenario A",
        linkedLabels: Object.freeze(["Supplier", "Inventory"]),
        objectImpacts: Object.freeze([
          Object.freeze({ objectId: "supplier", beforeRisk: 0.3, afterRisk: 0.7 }),
          Object.freeze({ objectId: "inventory", beforeRisk: 0.2, afterRisk: 0.5 }),
        ]),
        confidence: 0.9,
      }),
      Object.freeze({
        scenarioId: "scenario:b",
        label: "Scenario B",
        linkedLabels: Object.freeze(["Inventory", "Production"]),
        objectImpacts: Object.freeze([
          Object.freeze({ objectId: "inventory", beforeRisk: 0.4, afterRisk: 0.65 }),
          Object.freeze({ objectId: "production", beforeRisk: 0.35, afterRisk: 0.58 }),
        ]),
        confidence: 0.76,
      }),
      Object.freeze({
        scenarioId: "scenario:c",
        label: "Scenario C",
        linkedLabels: Object.freeze(["Production"]),
        objectImpacts: Object.freeze([
          Object.freeze({ objectId: "production", beforeRisk: 0.5, afterRisk: 0.5 }),
        ]),
        confidence: 0.62,
      }),
    ]),
  }),
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieScenarioLinkRuntimeForTests();
  resetSvieScenarioComparisonLayerRuntimeForTests();
  resetSvieAdvisoryVisualIntelligenceCertificationForTests();
});

test("exports SVIE multi-scenario comparison tag", () => {
  assert.equal(SVIE_MULTI_SCENARIO_COMPARISON_TAG, "[SVIE:4:5_MULTI_SCENARIO_COMPARISON]");
});

test("A — multi-scenario support assigns primary, secondary, and alternative roles", () => {
  const snapshot = syncScenarioComparisonLayer({ sceneJson: SAMPLE_SCENE });
  assert.equal(snapshot.model.entries.length, 3);
  assert.equal(snapshot.model.roleByScenarioId["scenario:a"], "primary");
  assert.equal(snapshot.model.roleByScenarioId["scenario:b"], "secondary");
  assert.equal(snapshot.model.roleByScenarioId["scenario:c"], "alternative");

  const visuals = resolveScenarioComparisonVisualization(snapshot.model);
  assert.equal(visuals.supplier?.role, "primary");
  assert.equal(visuals.inventory?.role, "primary");
  assert.equal(visuals.production?.role, "secondary");
});

test("B — scenario switching updates comparison roles deterministically", () => {
  const snapshot = syncScenarioComparisonLayer({
    sceneJson: SAMPLE_SCENE,
    primaryScenarioId: "scenario:b",
    secondaryScenarioId: "scenario:c",
    alternativeScenarioId: "scenario:a",
  });

  assert.equal(snapshot.model.roleByScenarioId["scenario:b"], "primary");
  assert.equal(snapshot.model.roleByScenarioId["scenario:c"], "secondary");
  assert.equal(snapshot.model.roleByScenarioId["scenario:a"], "alternative");
  assert.equal(snapshot.nodeVisualByObjectId.inventory?.role, "primary");
  assert.equal(snapshot.nodeVisualByObjectId.supplier?.role, "alternative");
});

test("C — stable comparison output via sync cache", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncScenarioComparisonLayer({ sceneJson: SAMPLE_SCENE });
    const second = syncScenarioComparisonLayer({ sceneJson: SAMPLE_SCENE });
    assert.equal(first, second);
    assert.equal(JSON.stringify(first.model), JSON.stringify(second.model));
    assert.equal(logs.filter((entry) => entry === SVIE_SCENARIO_COMPARISON_COMPUTED_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("buildScenarioComparisonModel supports explicit links without scene mutation", () => {
  const model = buildScenarioComparisonModel({
    links: [
      {
        scenarioId: "scenario:z",
        objectIds: ["production"],
        predictedChanges: [],
        confidence: 0.5,
      },
      {
        scenarioId: "scenario:y",
        objectIds: ["supplier"],
        predictedChanges: [],
        confidence: 0.6,
      },
    ],
    primaryScenarioId: "scenario:y",
  });

  assert.equal(model.roleByScenarioId["scenario:y"], "primary");
  assert.equal(model.roleByScenarioId["scenario:z"], "secondary");
});

test("D — topology engine positions remain unchanged", () => {
  const before = JSON.stringify(SAMPLE_SCENE);
  syncScenarioComparisonLayer({ sceneJson: SAMPLE_SCENE });
  assert.equal(JSON.stringify(SAMPLE_SCENE), before);

  const result = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});

test("E — routing, workspace, and lifecycle safety remain intact", () => {
  assert.equal(
    guardSvieScenarioComparisonRouteWrite({
      action: "requestWorkspaceLaunch",
      source: "svie-comparison-test",
    }).allowed,
    false
  );
  assert.equal(
    guardSvieScenarioComparisonWorkspaceWrite({
      action: "commitExecutiveWorkspaceTransition",
      source: "svie-comparison-test",
    }).allowed,
    false
  );

  const phase3 = runSvieAdvisoryVisualIntelligenceCertification({ force: true });
  assert.equal(phase3.certified, true);
  for (const gate of phase3.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
});
