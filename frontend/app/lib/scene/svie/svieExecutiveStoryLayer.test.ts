import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_EXECUTIVE_STORY_COMPUTED_LOG,
  SVIE_EXECUTIVE_STORY_LAYER_TAG,
} from "./svieExecutiveStoryLayerContract.ts";
import { buildExecutiveStory, buildExecutiveStories } from "./svieExecutiveStoryBuilder.ts";
import { resolveExecutiveStoryScene } from "./svieExecutiveStorySceneResolver.ts";
import {
  applyExecutiveStoryVisualization,
  guardSvieExecutiveStoryRouteWrite,
  guardSvieExecutiveStoryWorkspaceWrite,
  resetSvieExecutiveStoryLayerRuntimeForTests,
  syncSvieExecutiveStoryLayer,
} from "./svieExecutiveStoryLayerRuntime.ts";
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
      Object.freeze({ id: "inventory", name: "Inventory", risk: 0.58, impact: 0.82 }),
      Object.freeze({ id: "production", name: "Production", risk: 0.81, impact: 0.77 }),
      Object.freeze({ id: "revenue", name: "Revenue", risk: 0.9, impact: 0.88 }),
    ]),
  }),
  svie: Object.freeze({
    advisoryFindings: Object.freeze([
      Object.freeze({
        recommendationId: "recommendation:inventory-story",
        title: "Increase Safety Stock",
        linkedLabels: Object.freeze(["Supplier", "Inventory", "Production", "Revenue"]),
        targetObjectIds: Object.freeze(["inventory"]),
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
  resetSvieExecutiveStoryLayerRuntimeForTests();
});

test("exports SVIE executive story layer tag", () => {
  assert.equal(SVIE_EXECUTIVE_STORY_LAYER_TAG, "[SVIE:3:5_EXECUTIVE_STORY_LAYER]");
});

test("A — story generation assigns executive narrative roles", () => {
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({
    findings: [...SAMPLE_SCENE.svie.advisoryFindings],
    sceneJson: SAMPLE_SCENE,
  });
  const link = linkSnapshot.linkByRecommendationId["recommendation:inventory-story"];
  assert.ok(link);

  const story = buildExecutiveStory({
    link: link!,
    finding: SAMPLE_SCENE.svie.advisoryFindings[0],
    sceneJson: SAMPLE_SCENE,
  });

  assert.ok(story);
  assert.equal(story?.nodes.length, 4);
  assert.equal(story?.nodes[0]?.role, "start");
  assert.equal(story?.nodes.find((node) => node.objectId === "inventory")?.role, "recommendation");
  assert.equal(story?.nodes.find((node) => node.objectId === "revenue")?.role, "impact");
  assert.equal(story?.connections.length, 3);
});

test("B — story sync is stable for identical input", () => {
  resetSvieExecutiveStoryLayerRuntimeForTests();
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncSvieExecutiveStoryLayer({ sceneJson: SAMPLE_SCENE });
    const second = syncSvieExecutiveStoryLayer({ sceneJson: SAMPLE_SCENE });
    assert.equal(first, second);
    assert.equal(logs.filter((entry) => entry === SVIE_EXECUTIVE_STORY_COMPUTED_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("C — advisory alignment preserves cause-chain ordering", () => {
  const stories = buildExecutiveStories({
    links: syncSvieAdvisoryLinkSnapshot({
      findings: [...SAMPLE_SCENE.svie.advisoryFindings],
      sceneJson: SAMPLE_SCENE,
    }).links,
    findings: SAMPLE_SCENE.svie.advisoryFindings,
    sceneJson: SAMPLE_SCENE,
  });
  assert.deepEqual(
    stories[0]?.nodes.map((node) => node.objectId),
    ["supplier", "inventory", "production", "revenue"]
  );
});

test("D — topology engine positions remain unchanged", () => {
  applyExecutiveStoryVisualization({ sceneJson: SAMPLE_SCENE });
  const result = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});

test("E — executive readability via role-scaled visuals", () => {
  const snapshot = applyExecutiveStoryVisualization({ sceneJson: SAMPLE_SCENE });
  const scene = resolveExecutiveStoryScene(snapshot.stories[0]!);
  assert.ok(scene.nodeVisualByObjectId.inventory?.glowIntensity);
  assert.ok(
    scene.nodeVisualByObjectId.inventory!.glowIntensity >
      scene.nodeVisualByObjectId.supplier!.glowIntensity
  );
  assert.equal(guardSvieExecutiveStoryRouteWrite({ action: "route", source: "test" }).allowed, false);
  assert.equal(guardSvieExecutiveStoryWorkspaceWrite({ action: "workspace", source: "test" }).allowed, false);
});
