import test from "node:test";
import assert from "node:assert/strict";

import {
  SVIE_EXECUTIVE_FUTURE_STORY_COMPUTED_LOG,
  SVIE_EXECUTIVE_FUTURE_STORY_LAYER_TAG,
} from "./svieExecutiveFutureStoryLayerContract.ts";
import { buildExecutiveFutureStory } from "./svieExecutiveFutureStoryBuilder.ts";
import { resolveExecutiveFutureStoryScene } from "./svieExecutiveFutureStorySceneResolver.ts";
import {
  guardSvieExecutiveFutureStoryRouteWrite,
  guardSvieExecutiveFutureStoryWorkspaceWrite,
  resetSvieExecutiveFutureStoryLayerRuntimeForTests,
  syncExecutiveFutureStoryLayer,
} from "./svieExecutiveFutureStoryLayerRuntime.ts";
import { syncSvieScenarioLinks, resetSvieScenarioLinkRuntimeForTests } from "./svieScenarioLinkRuntime.ts";
import { resetSvieRuntimeFoundationForTests } from "./svieRuntimeFoundation.ts";
import { generateTopology } from "../topology/topologyEngine.ts";
import { FLOW_NODE_SPACING } from "../topology/flowTopologyGenerator.ts";

const SAMPLE_SCENE = Object.freeze({
  scene: Object.freeze({
    objects: Object.freeze([
      Object.freeze({ id: "supplier", name: "Supplier" }),
      Object.freeze({ id: "inventory", name: "Inventory" }),
      Object.freeze({ id: "production", name: "Production" }),
      Object.freeze({ id: "revenue", name: "Revenue" }),
      Object.freeze({ id: "market", name: "Market Impact" }),
    ]),
  }),
  svie: Object.freeze({
    scenarios: Object.freeze([
      Object.freeze({
        scenarioId: "scenario:supplier-failure",
        label: "Supplier Failure",
        scenarioImpactSteps: Object.freeze([
          "Supplier",
          "Inventory",
          "Production",
          "Revenue",
          "Market Impact",
        ]),
        objectImpacts: Object.freeze([
          Object.freeze({ objectId: "supplier", beforeRisk: 0.24, afterRisk: 0.9 }),
          Object.freeze({ objectId: "inventory", beforeRisk: 0.28, afterRisk: 0.76 }),
          Object.freeze({ objectId: "production", beforeActivity: 0.82, afterActivity: 0.52 }),
          Object.freeze({ objectId: "revenue", beforeRisk: 0.35, afterRisk: 0.7 }),
          Object.freeze({ objectId: "market", beforeRisk: 0.22, afterRisk: 0.62 }),
        ]),
        confidence: 0.84,
      }),
    ]),
  }),
});

test.beforeEach(() => {
  resetSvieRuntimeFoundationForTests();
  resetSvieScenarioLinkRuntimeForTests();
  resetSvieExecutiveFutureStoryLayerRuntimeForTests();
});

test("exports SVIE executive future story layer tag", () => {
  assert.equal(SVIE_EXECUTIVE_FUTURE_STORY_LAYER_TAG, "[SVIE:4:7_EXECUTIVE_FUTURE_STORY_LAYER]");
});

test("A — story generation converts scenario impact chain into executive future story", () => {
  const scenarioSnapshot = syncSvieScenarioLinks({ sceneJson: SAMPLE_SCENE });
  const link = scenarioSnapshot.linkByScenarioId["scenario:supplier-failure"];
  assert.ok(link);

  const story = buildExecutiveFutureStory({
    link: link!,
    scenario: SAMPLE_SCENE.svie.scenarios[0],
    sceneJson: SAMPLE_SCENE,
  });

  assert.ok(story);
  assert.deepEqual(
    story?.nodes.map((node) => node.objectId),
    ["supplier", "inventory", "production", "revenue", "market"]
  );
  assert.equal(story?.connections.length, 4);
});

test("B — story stability is cached and repeatable", () => {
  const logs: string[] = [];
  const originalDebug = console.debug;
  console.debug = (...args: unknown[]) => {
    logs.push(String(args[0] ?? ""));
  };

  try {
    const first = syncExecutiveFutureStoryLayer({ sceneJson: SAMPLE_SCENE });
    const second = syncExecutiveFutureStoryLayer({ sceneJson: SAMPLE_SCENE });
    assert.equal(first, second);
    assert.equal(JSON.stringify(first.stories), JSON.stringify(second.stories));
    assert.equal(logs.filter((entry) => entry === SVIE_EXECUTIVE_FUTURE_STORY_COMPUTED_LOG).length, 1);
  } finally {
    console.debug = originalDebug;
  }
});

test("C — scenario alignment preserves future roles and scenario id", () => {
  const snapshot = syncExecutiveFutureStoryLayer({ sceneJson: SAMPLE_SCENE });
  assert.equal(snapshot.stories.length, 1);
  assert.equal(snapshot.stories[0]?.scenarioId, "scenario:supplier-failure");

  const story = snapshot.stories[0]!;
  assert.equal(story.nodes[0]?.role, "future_cause");
  assert.equal(story.nodes[2]?.role, "future_impact");
  assert.equal(story.nodes[3]?.role, "future_recommendation");
  assert.equal(story.nodes[4]?.role, "future_outcome");

  const scene = resolveExecutiveFutureStoryScene(story);
  assert.equal(scene.nodeVisualByObjectId.market?.role, "future_outcome");
  assert.equal(scene.connectionVisuals[3]?.toObjectId, "market");
});

test("D — no topology changes or transform writes", () => {
  const snapshot = syncExecutiveFutureStoryLayer({ sceneJson: SAMPLE_SCENE });
  for (const visual of Object.values(snapshot.nodeVisualByObjectId)) {
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "position"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "scale"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "rotation"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "transform"));
  }

  const result = generateTopology("flow", [
    { id: "node-1", name: "Node 1", position: { x: 0, y: 0, z: 0 } },
    { id: "node-2", name: "Node 2", position: { x: 2, y: 0, z: 1 } },
  ]);
  assert.equal(result.nodes[1]?.position?.x, FLOW_NODE_SPACING);
});

test("E — executive readability stays material-only with lifecycle guards", () => {
  const snapshot = syncExecutiveFutureStoryLayer({ sceneJson: SAMPLE_SCENE });
  assert.equal(snapshot.connectionVisuals.length, 4);
  assert.equal(Object.keys(snapshot.nodeVisualByObjectId).length, 5);

  for (const visual of Object.values(snapshot.nodeVisualByObjectId)) {
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "label"));
    assert.ok(!Object.prototype.hasOwnProperty.call(visual, "title"));
    assert.ok(visual.glowOpacity <= 0.4);
  }

  assert.equal(
    guardSvieExecutiveFutureStoryRouteWrite({
      action: "requestWorkspaceLaunch",
      source: "svie-executive-future-story-test",
    }).allowed,
    false
  );
  assert.equal(
    guardSvieExecutiveFutureStoryWorkspaceWrite({
      action: "commitExecutiveWorkspaceTransition",
      source: "svie-executive-future-story-test",
    }).allowed,
    false
  );
});
