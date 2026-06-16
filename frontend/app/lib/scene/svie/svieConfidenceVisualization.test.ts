import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_CONFIDENCE_COMPUTED_LOG,
  SVIE_CONFIDENCE_VISUALIZATION_TAG,
} from "./svieConfidenceVisualizationContract.ts";
import { mapRecommendationConfidence, mapRecommendationConfidences } from "./svieConfidenceMapping.ts";
import {
  applyConfidenceVisualization,
  guardSvieConfidenceRouteWrite,
  guardSvieConfidenceWorkspaceWrite,
  resetSvieConfidenceVisualizationRuntimeForTests,
  syncSvieConfidenceVisualization,
} from "./svieConfidenceVisualizationRuntime.ts";
import { resetSvieAdvisoryLinkRuntimeForTests } from "./svieAdvisoryLinkRuntime.ts";
import { resetSvieRiskRuntimeForTests } from "./svieRiskRuntime.ts";
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
    advisoryFindings: Object.freeze([
      Object.freeze({
        recommendationId: "recommendation:high-confidence",
        title: "Increase Safety Stock",
        linkedLabels: Object.freeze(["Inventory"]),
        confidence: 0.92,
        impact: 0.74,
      }),
      Object.freeze({
        recommendationId: "recommendation:moderate-confidence",
        linkedLabels: Object.freeze(["Supplier"]),
        confidence: 0.58,
        impact: 0.5,
      }),
      Object.freeze({
        recommendationId: "recommendation:low-confidence",
        linkedLabels: Object.freeze(["Production"]),
        confidence: 0.32,
        impact: 0.4,
      }),
    ]),
  }),
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieRiskRuntimeForTests();
  resetSvieAdvisoryLinkRuntimeForTests();
  resetSvieConfidenceVisualizationRuntimeForTests();
});

test("exports SVIE confidence visualization tag", () => {
  assert.equal(SVIE_CONFIDENCE_VISUALIZATION_TAG, "[SVIE:3:4_CONFIDENCE_VISUALIZATION]");
});

test("A — confidence mapping assigns executive tiers", () => {
  assert.equal(mapRecommendationConfidence(0.95), "executive_high");
  assert.equal(mapRecommendationConfidence(0.82), "high");
  assert.equal(mapRecommendationConfidence(0.61), "moderate");
  assert.equal(mapRecommendationConfidence(0.41), "low");

  const mapped = mapRecommendationConfidences({
    links: [
      { recommendationId: "a", objectIds: ["inventory"], confidence: 0.92, impact: 0.7 },
      { recommendationId: "b", objectIds: ["supplier"], confidence: 0.58, impact: 0.5 },
      { recommendationId: "c", objectIds: ["inventory"], confidence: 0.32, impact: 0.4 },
    ],
    findings: SAMPLE_SCENE.svie.advisoryFindings,
  });
  assert.equal(mapped[0]?.tier, "executive_high");
  assert.equal(mapped[1]?.tier, "moderate");
  assert.equal(mapped[2]?.tier, "low");
});

test("B — stable rendering assigns pulse modes by tier", () => {
  const snapshot = applyConfidenceVisualization({ sceneJson: SAMPLE_SCENE });
  assert.equal(snapshot.nodeVisualByObjectId.inventory?.pulseMode, "stable");
  assert.equal(snapshot.nodeVisualByObjectId.supplier?.pulseMode, "soft");
  assert.equal(snapshot.nodeVisualByObjectId.production?.pulseMode, "unstable");
});

test("C — repeatability via sync cache", () => {
  resetSvieConfidenceVisualizationRuntimeForTests();
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncSvieConfidenceVisualization({ sceneJson: SAMPLE_SCENE });
    const second = syncSvieConfidenceVisualization({ sceneJson: SAMPLE_SCENE });
    assert.equal(first, second);
    assert.equal(logs.filter((entry) => entry === SVIE_CONFIDENCE_COMPUTED_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("visual styles exclude numeric display fields", () => {
  const snapshot = applyConfidenceVisualization({ sceneJson: SAMPLE_SCENE });
  for (const visual of Object.values(snapshot.nodeVisualByObjectId)) {
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "confidence"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "label"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "position"));
  }
});

test("D — routing and workspace writes remain blocked", () => {
  assert.equal(
    guardSvieConfidenceRouteWrite({ action: "requestWorkspaceLaunch", source: "test" }).allowed,
    false
  );
  assert.equal(
    guardSvieConfidenceWorkspaceWrite({ action: "commitExecutiveWorkspaceTransition", source: "test" })
      .allowed,
    false
  );
});

test("E — no topology mutation during confidence sync", () => {
  applyConfidenceVisualization({ sceneJson: SAMPLE_SCENE });
  const result = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});
