import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_CAUSE_CHAIN_COMPUTED_LOG,
  SVIE_CAUSE_CHAIN_VISUALIZATION_TAG,
} from "./svieCauseChainVisualizationContract.ts";
import { deriveCauseChain, deriveCauseChains } from "./svieCauseChainDerivation.ts";
import { resolveVisualCauseChain } from "./svieCauseChainVisualizationResolver.ts";
import {
  applyCauseChainVisualization,
  guardSvieCauseChainRouteWrite,
  guardSvieCauseChainWorkspaceWrite,
  resetSvieCauseChainVisualizationRuntimeForTests,
  syncSvieCauseChainVisualization,
} from "./svieCauseChainVisualizationRuntime.ts";
import { syncSvieAdvisoryLinkSnapshot } from "./svieAdvisoryLinkRuntime.ts";
import { resetSvieAdvisoryLinkRuntimeForTests } from "./svieAdvisoryLinkRuntime.ts";
import { resetSvieRiskRuntimeForTests } from "./svieRiskRuntime.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";
import { generateTopology } from "../topology/topologyEngine.ts";
import { FLOW_NODE_SPACING } from "../topology/flowTopologyGenerator.ts";

const SAMPLE_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "supplier", name: "Supplier", risk: 0.72, impact: 0.68 }),
      Object.freeze({ id: "inventory", name: "Inventory", risk: 0.58, impact: 0.62 }),
      Object.freeze({ id: "production", name: "Production", risk: 0.81, impact: 0.77 }),
      Object.freeze({ id: "revenue", name: "Revenue Impact", risk: 0.9, impact: 0.88 }),
    ]),
  }),
  svie: Object.freeze({
    advisoryFindings: Object.freeze([
      Object.freeze({
        recommendationId: "recommendation:supplier-delay-chain",
        title: "Supplier Delay Impact",
        linkedLabels: Object.freeze(["Supplier", "Inventory", "Production", "Revenue Impact"]),
        confidence: 0.86,
        impact: 0.79,
      }),
    ]),
  }),
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieRiskRuntimeForTests();
  resetSvieAdvisoryLinkRuntimeForTests();
  resetSvieCauseChainVisualizationRuntimeForTests();
});

test("exports SVIE cause chain visualization tag", () => {
  assert.equal(SVIE_CAUSE_CHAIN_VISUALIZATION_TAG, "[SVIE:3:2_CAUSE_CHAIN_VISUALIZATION]");
});

test("A — deriveCauseChain maps advisory link into ordered causal steps", () => {
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({
    findings: [...SAMPLE_SCENE.svie.advisoryFindings],
    sceneJson: SAMPLE_SCENE,
  });
  const link = linkSnapshot.linkByRecommendationId["recommendation:supplier-delay-chain"];
  assert.ok(link);

  const chain = deriveCauseChain({
    link: link!,
    finding: SAMPLE_SCENE.svie.advisoryFindings[0],
    sceneJson: SAMPLE_SCENE,
  });

  assert.ok(chain);
  assert.equal(chain?.steps.length, 4);
  assert.deepEqual(
    chain?.steps.map((step) => step.objectId),
    ["supplier", "inventory", "production", "revenue"]
  );
  assert.equal(chain?.connections.length, 3);
});

test("B — multi-step chains produce sequential connection visuals", () => {
  const snapshot = applyCauseChainVisualization({ sceneJson: SAMPLE_SCENE });
  assert.equal(snapshot.chains.length, 1);
  assert.equal(snapshot.connectionVisuals.length, 3);
  assert.equal(Object.keys(snapshot.nodeVisualByObjectId).length, 4);

  const visual = resolveVisualCauseChain(snapshot.chains[0]!);
  assert.equal(visual.connectionVisuals[0]?.fromObjectId, "supplier");
  assert.equal(visual.connectionVisuals[2]?.toObjectId, "revenue");
});

test("C — visualization sync is stable for identical input", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncSvieCauseChainVisualization({ sceneJson: SAMPLE_SCENE });
    const second = syncSvieCauseChainVisualization({ sceneJson: SAMPLE_SCENE });
    assert.equal(first, second);
    assert.equal(JSON.stringify(first.chains), JSON.stringify(second.chains));
    assert.equal(logs.filter((entry) => entry === SVIE_CAUSE_CHAIN_COMPUTED_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("visual styles do not encode transform writes", () => {
  const snapshot = applyCauseChainVisualization({ sceneJson: SAMPLE_SCENE });
  for (const visual of Object.values(snapshot.nodeVisualByObjectId)) {
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "position"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "scale"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "rotation"));
  }
});

test("D — topology engine positions remain unchanged", () => {
  applyCauseChainVisualization({ sceneJson: SAMPLE_SCENE });
  const result = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});

test("E — routing and workspace writes remain blocked", () => {
  const route = guardSvieCauseChainRouteWrite({
    action: "requestWorkspaceLaunch",
    source: "svie-cause-chain-test",
  });
  const workspace = guardSvieCauseChainWorkspaceWrite({
    action: "commitExecutiveWorkspaceTransition",
    source: "svie-cause-chain-test",
  });
  assert.equal(route.allowed, false);
  assert.equal(workspace.allowed, false);
});

test("deriveCauseChains supports multiple advisory recommendations", () => {
  const sceneJson = {
    scene: {
      objects: [
        { id: "supplier", name: "Supplier" },
        { id: "inventory", name: "Inventory" },
        { id: "line-a", name: "Line A" },
        { id: "line-b", name: "Line B" },
      ],
    },
    svie: {
      advisoryFindings: [
        {
          recommendationId: "rec-a",
          linkedLabels: ["Supplier", "Inventory"],
          confidence: 0.7,
          impact: 0.6,
        },
        {
          recommendationId: "rec-b",
          linkedLabels: ["Line A", "Line B"],
          confidence: 0.65,
          impact: 0.55,
        },
      ],
    },
  };

  const snapshot = applyCauseChainVisualization({ sceneJson });
  assert.equal(snapshot.chains.length, 2);
  assert.equal(
    deriveCauseChains({
      links: snapshot.chains.map((chain) => ({
        recommendationId: chain.recommendationId,
        objectIds: chain.steps.map((step) => step.objectId),
        confidence: 0.7,
        impact: 0.6,
      })),
      findings: sceneJson.svie.advisoryFindings,
      sceneJson,
    }).length,
    2
  );
});
