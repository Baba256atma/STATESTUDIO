import test from "node:test";
import assert from "node:assert/strict";

import {
  formatTopologyDisplayLabel,
  resolveLastUpdateLabel,
  resolveSceneRuntimeSummary,
  resetSceneRuntimeSummaryForTests,
} from "./sceneRuntimeSummary.ts";

test.beforeEach(() => {
  resetSceneRuntimeSummaryForTests();
});

test("formatTopologyDisplayLabel maps topology types for executives", () => {
  assert.equal(formatTopologyDisplayLabel("hub"), "Hub");
  assert.equal(formatTopologyDisplayLabel("flow"), "Flow");
  assert.equal(formatTopologyDisplayLabel("off"), "Off");
});

test("resolveSceneRuntimeSummary aggregates scene-level metrics", () => {
  const summary = resolveSceneRuntimeSummary({
    sceneJson: {
      scene: {
        objects: [{ id: "a" }, { id: "b" }],
        relationships: [
          {
            id: "r1",
            sourceId: "a",
            targetId: "b",
            type: "depends_on",
            direction: "uni",
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      },
    },
    sceneTitle: "Executive Workspace",
    activeScenarioTitle: "Baseline",
    runtimeStatus: "ready",
    warningCount: 2,
    recommendationCount: 4,
    lastUpdateAt: "09:42",
  });

  assert.equal(summary.sceneTitle, "Executive Workspace");
  assert.equal(summary.objectCount, 2);
  assert.equal(summary.connectionCount, 1);
  assert.equal(summary.scenarioLabel, "Baseline");
  assert.equal(summary.warningCount, 2);
  assert.equal(summary.recommendationCount, 4);
  assert.equal(summary.lastUpdateLabel, "09:42");
  assert.ok(["Hub", "Flow", "Auto", "Off"].includes(summary.topologyLabel));
});

test("resolveLastUpdateLabel returns pending while loading", () => {
  assert.equal(resolveLastUpdateLabel(null, "loading"), "Pending");
});
