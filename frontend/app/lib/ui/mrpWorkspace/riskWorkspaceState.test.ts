import test from "node:test";
import assert from "node:assert/strict";

import { MRP_RISK_STATE_TAG } from "./risk/riskWorkspaceMetricsContract.ts";
import {
  buildRiskWorkspaceMetricsSignature,
  deriveRiskWorkspaceMetrics,
} from "./risk/riskWorkspaceMetricsResolver.ts";
import {
  resetRiskWorkspaceDataRuntimeForTests,
  syncRiskWorkspaceData,
} from "./risk/riskWorkspaceDataRuntime.ts";
import {
  getRiskWorkspaceState,
  getRiskWorkspaceStatePublishCountForTests,
  hydrateRiskWorkspaceStateOnMount,
  publishRiskWorkspaceState,
  resetRiskWorkspaceStateRuntimeForTests,
} from "./risk/riskWorkspaceStateRuntime.ts";
import { buildRiskWorkspaceViewFromState } from "./risk/riskWorkspaceStateViewMapper.ts";
import type { SceneJson } from "../../sceneTypes.ts";

test.beforeEach(() => {
  resetRiskWorkspaceDataRuntimeForTests();
  resetRiskWorkspaceStateRuntimeForTests();
});

const sceneWithRisks: SceneJson = {
  scene: {
    objects: [
      { id: "a", type: "Supply", severity: "critical", status: "active" },
      { id: "b", type: "Supply", severity: "warning", status: "delayed" },
      { id: "c", type: "Finance", state: "stable", status: "ok" },
    ],
  },
} as SceneJson;

test("deriveRiskWorkspaceMetrics counts critical and elevated scene markers", () => {
  const metrics = deriveRiskWorkspaceMetrics({
    selectedObjectId: "a",
    sceneJson: sceneWithRisks,
  });

  assert.equal(metrics.selectedObjectId, "a");
  assert.equal(metrics.riskCount, 2);
  assert.equal(metrics.criticalRiskCount, 1);
  assert.equal(metrics.elevatedRiskCount, 1);
  assert.equal(metrics.dominantRiskCategory, "Supply");
});

test("syncRiskWorkspaceData publishes canonical metrics once", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  const before = getRiskWorkspaceStatePublishCountForTests();

  syncRiskWorkspaceData({
    selectedObjectId: "a",
    sceneJson: sceneWithRisks,
  });

  const state = getRiskWorkspaceState();
  assert.equal(state.riskCount, 2);
  assert.equal(state.selectedObjectId, "a");
  assert.ok(state.lastUpdatedAt > 0);
  assert.equal(getRiskWorkspaceStatePublishCountForTests(), before + 1);
});

test("syncRiskWorkspaceData dedupes identical metrics signatures", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  syncRiskWorkspaceData({ selectedObjectId: "a", sceneJson: sceneWithRisks });
  const revisionAfterFirst = getRiskWorkspaceState().revision;
  const publishAfterFirst = getRiskWorkspaceStatePublishCountForTests();

  syncRiskWorkspaceData({ selectedObjectId: "a", sceneJson: sceneWithRisks });
  syncRiskWorkspaceData({ selectedObjectId: "a", sceneJson: sceneWithRisks });

  assert.equal(getRiskWorkspaceState().revision, revisionAfterFirst);
  assert.equal(getRiskWorkspaceStatePublishCountForTests(), publishAfterFirst);
});

test("selection changes update selectedObjectId without duplicate metric writes", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  syncRiskWorkspaceData({ selectedObjectId: "a", sceneJson: sceneWithRisks });
  const publishAfterFirst = getRiskWorkspaceStatePublishCountForTests();

  syncRiskWorkspaceData({ selectedObjectId: "b", sceneJson: sceneWithRisks });

  const state = getRiskWorkspaceState();
  assert.equal(state.selectedObjectId, "b");
  assert.equal(state.riskCount, 2);
  assert.equal(getRiskWorkspaceStatePublishCountForTests(), publishAfterFirst + 1);
});

test("publishRiskWorkspaceState guards render loops", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  let guarded = 0;

  for (let index = 0; index < 40; index += 1) {
    const result = publishRiskWorkspaceState({
      riskCount: index,
      selectedObjectId: `obj-${index}`,
      lastUpdatedAt: Date.now(),
    });
    if (result.guarded) guarded += 1;
  }

  assert.ok(guarded > 0);
});

test("view mapper surfaces derived metrics in ready phase", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  syncRiskWorkspaceData({ selectedObjectId: "a", sceneJson: sceneWithRisks });
  const view = buildRiskWorkspaceViewFromState(getRiskWorkspaceState());
  const summary = view.cards.find((card) => card.id === "risk_summary");

  assert.match(summary?.headline ?? "", /2 tracked risk signals/);
  assert.match(summary?.detail ?? "", /1 critical/);
});

test("exports MRP risk state tag", () => {
  assert.equal(MRP_RISK_STATE_TAG, "[MRP_RISK_STATE]");
});

test("metrics signature excludes lastUpdatedAt for dedupe stability", () => {
  const sigA = buildRiskWorkspaceMetricsSignature({
    selectedObjectId: "a",
    riskCount: 2,
    elevatedRiskCount: 1,
    criticalRiskCount: 1,
    dominantRiskCategory: "Supply",
    lastUpdatedAt: 100,
  });
  const sigB = buildRiskWorkspaceMetricsSignature({
    selectedObjectId: "a",
    riskCount: 2,
    elevatedRiskCount: 1,
    criticalRiskCount: 1,
    dominantRiskCategory: "Supply",
    lastUpdatedAt: 999,
  });
  assert.equal(sigA, sigB);
});
