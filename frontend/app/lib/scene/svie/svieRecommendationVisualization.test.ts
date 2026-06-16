import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_RECOMMENDATION_COMPUTED_LOG,
  SVIE_RECOMMENDATION_VISUALIZATION_TAG,
} from "./svieRecommendationVisualizationContract.ts";
import { deriveRecommendationHierarchy } from "./svieRecommendationHierarchyDerivation.ts";
import { resolveRecommendationVisualization } from "./svieRecommendationVisualizationResolver.ts";
import {
  applyRecommendationVisualization,
  guardSvieRecommendationRouteWrite,
  guardSvieRecommendationWorkspaceWrite,
  resetSvieRecommendationVisualizationRuntimeForTests,
  syncSvieRecommendationVisualization,
} from "./svieRecommendationVisualizationRuntime.ts";
import { resetSvieAdvisoryLinkRuntimeForTests } from "./svieAdvisoryLinkRuntime.ts";
import { resetSvieRiskLayerCertificationForTests, runSvieRiskLayerCertification } from "./svieRiskLayerCertification.ts";
import { resetSvieRiskRuntimeForTests } from "./svieRiskRuntime.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";
import { syncSvieAdvisoryLinkSnapshot } from "./svieAdvisoryLinkRuntime.ts";
import { generateTopology } from "../topology/topologyEngine.ts";
import { FLOW_NODE_SPACING } from "../topology/flowTopologyGenerator.ts";

const SAMPLE_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "inventory", name: "Inventory", impact: 0.82 }),
      Object.freeze({ id: "supplier", name: "Supplier", impact: 0.64 }),
      Object.freeze({ id: "production", name: "Production", impact: 0.58 }),
    ]),
  }),
  svie: Object.freeze({
    advisoryFindings: Object.freeze([
      Object.freeze({
        recommendationId: "recommendation:increase-inventory-safety-stock",
        title: "Increase Safety Stock",
        linkedLabels: Object.freeze(["Inventory", "Supplier", "Production"]),
        confidence: 0.82,
        impact: 0.74,
      }),
    ]),
  }),
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieRiskRuntimeForTests();
  resetSvieAdvisoryLinkRuntimeForTests();
  resetSvieRecommendationVisualizationRuntimeForTests();
  resetSvieRiskLayerCertificationForTests();
});

test("exports SVIE recommendation visualization tag", () => {
  assert.equal(SVIE_RECOMMENDATION_VISUALIZATION_TAG, "[SVIE:3:3_RECOMMENDATION_VISUALIZATION]");
});

test("A — recommendation ranking assigns tier hierarchy from advisory link", () => {
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({
    findings: [...SAMPLE_SCENE.svie.advisoryFindings],
    sceneJson: SAMPLE_SCENE,
  });
  const link = linkSnapshot.linkByRecommendationId["recommendation:increase-inventory-safety-stock"];
  assert.ok(link);

  const hierarchy = deriveRecommendationHierarchy({
    link: link!,
    finding: SAMPLE_SCENE.svie.advisoryFindings[0],
    sceneJson: SAMPLE_SCENE,
  });

  assert.ok(hierarchy);
  assert.equal(hierarchy?.rankedObjects.length, 3);
  assert.equal(hierarchy?.rankedObjects[0]?.objectId, "inventory");
  assert.equal(hierarchy?.rankedObjects[0]?.tier, 1);
  assert.equal(hierarchy?.rankedObjects[1]?.objectId, "supplier");
  assert.equal(hierarchy?.rankedObjects[1]?.tier, 2);
  assert.equal(hierarchy?.rankedObjects[2]?.objectId, "production");
  assert.equal(hierarchy?.rankedObjects[2]?.tier, 3);
  assert.ok(hierarchy!.rankedObjects[0]!.rankScore > hierarchy!.rankedObjects[1]!.rankScore);
  assert.ok(hierarchy!.rankedObjects[1]!.rankScore > hierarchy!.rankedObjects[2]!.rankScore);
});

test("B — stable hierarchy and tier visual emphasis", () => {
  const snapshot = applyRecommendationVisualization({ sceneJson: SAMPLE_SCENE });
  const visual = resolveRecommendationVisualization(snapshot.hierarchies[0]!);

  assert.equal(visual.nodeVisualByObjectId.inventory?.tier, 1);
  assert.equal(visual.nodeVisualByObjectId.supplier?.tier, 2);
  assert.equal(visual.nodeVisualByObjectId.production?.tier, 3);
  assert.ok(
    visual.nodeVisualByObjectId.inventory!.glowIntensity >
      visual.nodeVisualByObjectId.supplier!.glowIntensity
  );
  assert.ok(
    visual.nodeVisualByObjectId.supplier!.glowIntensity >
      visual.nodeVisualByObjectId.production!.glowIntensity
  );

  resetSvieRecommendationVisualizationRuntimeForTests();
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncSvieRecommendationVisualization({ sceneJson: SAMPLE_SCENE });
    const second = syncSvieRecommendationVisualization({ sceneJson: SAMPLE_SCENE });
    assert.equal(first, second);
    assert.equal(JSON.stringify(first.hierarchies), JSON.stringify(second.hierarchies));
    assert.equal(logs.filter((entry) => entry === SVIE_RECOMMENDATION_COMPUTED_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("C — material-only rendering styles exclude transforms and text", () => {
  const snapshot = applyRecommendationVisualization({ sceneJson: SAMPLE_SCENE });
  for (const visual of Object.values(snapshot.nodeVisualByObjectId)) {
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "position"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "scale"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "rotation"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "label"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "title"));
    assert.equal(visual.showHighlight, true);
  }
});

test("D — topology engine positions remain unchanged", () => {
  applyRecommendationVisualization({ sceneJson: SAMPLE_SCENE });
  const result = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});

test("E — routing and workspace writes remain blocked with no lifecycle regressions", () => {
  const route = guardSvieRecommendationRouteWrite({
    action: "requestWorkspaceLaunch",
    source: "svie-recommendation-test",
  });
  const workspace = guardSvieRecommendationWorkspaceWrite({
    action: "commitExecutiveWorkspaceTransition",
    source: "svie-recommendation-test",
  });
  assert.equal(route.allowed, false);
  assert.equal(workspace.allowed, false);

  const result = runSvieRiskLayerCertification({ force: true });
  assert.equal(result.certified, true);
  for (const gate of result.gates) {
    assert.notEqual(gate.status, "FAIL", `${gate.id}: ${gate.detail}`);
  }
});
