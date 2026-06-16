import test from "node:test";
import assert from "node:assert/strict";

import type { SceneJson } from "../../sceneTypes.ts";
import {
  MRP_RISK_VISUAL_TAG,
  RISK_SUMMARY_METRIC_LABELS,
  RISK_TOP_RISKS_COLUMN_LABELS,
} from "./risk/riskVisualSurfaceContract.ts";
import { buildRiskVisualSurfaceFromState } from "./risk/riskVisualSurfaceMapper.ts";
import { deriveRiskTopRiskRows } from "./risk/riskTopRisksResolver.ts";
import { syncRiskWorkspaceData } from "./risk/riskWorkspaceDataRuntime.ts";
import {
  getRiskWorkspaceState,
  hydrateRiskWorkspaceStateOnMount,
  resetRiskWorkspaceStateRuntimeForTests,
} from "./risk/riskWorkspaceStateRuntime.ts";
import { buildRiskWorkspaceViewFromState } from "./risk/riskWorkspaceStateViewMapper.ts";
import { resetRiskWorkspaceDataRuntimeForTests } from "./risk/riskWorkspaceDataRuntime.ts";

test.beforeEach(() => {
  resetRiskWorkspaceDataRuntimeForTests();
  resetRiskWorkspaceStateRuntimeForTests();
});

const sceneWithRisks: SceneJson = {
  scene: {
    objects: [
      {
        id: "a",
        label: "Supplier Node",
        severity: "critical",
        impact: "Regional supply",
      },
      {
        id: "b",
        label: "Production Line",
        status: "delayed",
        impact: "Throughput",
      },
      { id: "c", label: "Stable Asset", state: "stable", status: "ok" },
    ],
  },
} as SceneJson;

test("exports MRP risk visual tag", () => {
  assert.equal(MRP_RISK_VISUAL_TAG, "[MRP_RISK_VISUAL]");
});

test("deriveRiskTopRiskRows returns sorted risk severity impact rows", () => {
  const rows = deriveRiskTopRiskRows({ sceneJson: sceneWithRisks });
  assert.equal(rows.length, 2);
  assert.equal(rows[0]?.risk, "Supplier Node");
  assert.equal(rows[0]?.severity, "critical");
  assert.equal(rows[0]?.impact, "Regional supply");
  assert.equal(rows[1]?.risk, "Production Line");
});

test("visual surface summary exposes total elevated and critical counts", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  syncRiskWorkspaceData({ sceneJson: sceneWithRisks });
  const surface = buildRiskVisualSurfaceFromState(getRiskWorkspaceState());

  assert.equal(surface.summary.totalRisks, 2);
  assert.equal(surface.summary.elevatedRisks, 1);
  assert.equal(surface.summary.criticalRisks, 1);
  assert.equal(surface.topRisks.length, 2);
  assert.equal(surface.emptyMessage, null);
});

test("workspace view includes executive visual surface", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  syncRiskWorkspaceData({ sceneJson: sceneWithRisks });
  const view = buildRiskWorkspaceViewFromState(getRiskWorkspaceState());

  assert.equal(view.visualSurface.summary.totalRisks, 2);
  assert.equal(view.visualSurface.topRisks[0]?.risk, "Supplier Node");
});

test("visual surface shows empty message when no scene risks", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  syncRiskWorkspaceData({ sceneJson: null });
  const surface = buildRiskVisualSurfaceFromState(getRiskWorkspaceState());

  assert.equal(surface.summary.totalRisks, 0);
  assert.equal(surface.topRisks.length, 0);
  assert.match(surface.emptyMessage ?? "", /No prioritized risks/);
});

test("exports summary and list column labels", () => {
  assert.equal(RISK_SUMMARY_METRIC_LABELS.totalRisks, "Total Risks");
  assert.equal(RISK_SUMMARY_METRIC_LABELS.elevatedRisks, "Elevated Risks");
  assert.equal(RISK_SUMMARY_METRIC_LABELS.criticalRisks, "Critical Risks");
  assert.equal(RISK_TOP_RISKS_COLUMN_LABELS.risk, "Risk");
  assert.equal(RISK_TOP_RISKS_COLUMN_LABELS.severity, "Severity");
  assert.equal(RISK_TOP_RISKS_COLUMN_LABELS.impact, "Impact");
});
