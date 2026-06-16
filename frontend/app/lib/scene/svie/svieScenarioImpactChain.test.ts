import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_SCENARIO_IMPACT_CHAIN_COMPUTED_LOG,
  SVIE_SCENARIO_IMPACT_CHAIN_TAG,
} from "./svieScenarioImpactChainContract.ts";
import { buildScenarioImpactChain } from "./svieScenarioImpactChainBuilder.ts";
import { resolveScenarioImpactPropagation } from "./svieScenarioImpactPropagationResolver.ts";
import {
  guardSvieScenarioImpactRouteWrite,
  guardSvieScenarioImpactWorkspaceWrite,
  resetSvieScenarioImpactVisualizationRuntimeForTests,
  syncScenarioImpactVisualization,
} from "./svieScenarioImpactVisualizationRuntime.ts";
import { syncSvieScenarioLinks, resetSvieScenarioLinkRuntimeForTests } from "./svieScenarioLinkRuntime.ts";
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
      Object.freeze({ id: "supplier", name: "Supplier Failure" }),
      Object.freeze({ id: "inventory", name: "Inventory Shortage" }),
      Object.freeze({ id: "production", name: "Production Delay" }),
      Object.freeze({ id: "revenue", name: "Revenue Loss" }),
    ]),
  }),
  svie: Object.freeze({
    scenarios: Object.freeze([
      Object.freeze({
        scenarioId: "scenario:supplier-failure",
        label: "Supplier Failure",
        linkedLabels: Object.freeze([
          "Supplier Failure",
          "Inventory Shortage",
          "Production Delay",
          "Revenue Loss",
        ]),
        scenarioImpactSteps: Object.freeze([
          "Supplier Failure",
          "Inventory Shortage",
          "Production Delay",
          "Revenue Loss",
        ]),
        objectImpacts: Object.freeze([
          Object.freeze({ objectId: "supplier", beforeRisk: 0.3, afterRisk: 0.85 }),
          Object.freeze({ objectId: "inventory", beforeRisk: 0.24, afterRisk: 0.72 }),
          Object.freeze({ objectId: "production", beforeActivity: 0.8, afterActivity: 0.5 }),
          Object.freeze({ objectId: "revenue", beforeRisk: 0.4, afterRisk: 0.66 }),
        ]),
        confidence: 0.82,
      }),
    ]),
  }),
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieScenarioLinkRuntimeForTests();
  resetSvieScenarioImpactVisualizationRuntimeForTests();
  resetSvieAdvisoryVisualIntelligenceCertificationForTests();
});

test("exports SVIE scenario impact chain tag", () => {
  assert.equal(SVIE_SCENARIO_IMPACT_CHAIN_TAG, "[SVIE:4:4_SCENARIO_IMPACT_CHAIN]");
});

test("A — chain generation follows explicit scenario impact steps", () => {
  const scenarioSnapshot = syncSvieScenarioLinks({ sceneJson: SAMPLE_SCENE });
  const link = scenarioSnapshot.linkByScenarioId["scenario:supplier-failure"];
  assert.ok(link);

  const chain = buildScenarioImpactChain({
    link: link!,
    scenario: SAMPLE_SCENE.svie.scenarios[0],
    sceneJson: SAMPLE_SCENE,
  });

  assert.ok(chain);
  assert.deepEqual(
    chain?.steps.map((step) => step.objectId),
    ["supplier", "inventory", "production", "revenue"]
  );
  assert.equal(chain?.connections.length, 3);
});

test("B — multi-step propagation produces node and connection visuals", () => {
  const snapshot = syncScenarioImpactVisualization({ sceneJson: SAMPLE_SCENE });
  assert.equal(snapshot.chains.length, 1);
  assert.equal(snapshot.connectionVisuals.length, 3);
  assert.equal(Object.keys(snapshot.nodeVisualByObjectId).length, 4);

  const visual = resolveScenarioImpactPropagation(snapshot.chains[0]!);
  assert.equal(visual.connectionVisuals[0]?.fromObjectId, "supplier");
  assert.equal(visual.connectionVisuals[2]?.toObjectId, "revenue");
  assert.ok(visual.nodeVisualByObjectId.revenue!.glowIntensity > visual.nodeVisualByObjectId.supplier!.glowIntensity);
});

test("C — stable rendering via sync cache", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncScenarioImpactVisualization({ sceneJson: SAMPLE_SCENE });
    const second = syncScenarioImpactVisualization({ sceneJson: SAMPLE_SCENE });
    assert.equal(first, second);
    assert.equal(JSON.stringify(first.chains), JSON.stringify(second.chains));
    assert.equal(logs.filter((entry) => entry === SVIE_SCENARIO_IMPACT_CHAIN_COMPUTED_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("visual styles do not encode transform writes", () => {
  const snapshot = syncScenarioImpactVisualization({ sceneJson: SAMPLE_SCENE });
  for (const visual of Object.values(snapshot.nodeVisualByObjectId)) {
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "position"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "scale"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "rotation"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "transform"));
  }
});

test("D — topology engine positions remain unchanged", () => {
  syncScenarioImpactVisualization({ sceneJson: SAMPLE_SCENE });
  const result = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});

test("E — routing, workspace, and lifecycle safety remain intact", () => {
  assert.equal(
    guardSvieScenarioImpactRouteWrite({ action: "requestWorkspaceLaunch", source: "svie-impact-test" })
      .allowed,
    false
  );
  assert.equal(
    guardSvieScenarioImpactWorkspaceWrite({
      action: "commitExecutiveWorkspaceTransition",
      source: "svie-impact-test",
    }).allowed,
    false
  );

  const phase3 = runSvieAdvisoryVisualIntelligenceCertification({ force: true });
  assert.equal(phase3.certified, true);
  for (const gate of phase3.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
});
