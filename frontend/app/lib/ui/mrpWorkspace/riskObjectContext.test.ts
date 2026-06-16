import test from "node:test";
import assert from "node:assert/strict";

import type { SceneJson } from "../../sceneTypes.ts";
import {
  DEFAULT_RISK_OBJECT_CONTEXT,
  MRP_RISK_OBJECT_CONTEXT_TAG,
  RISK_NO_OBJECT_SELECTED_LABEL,
} from "./risk/riskObjectContextContract.ts";
import { resolveRiskObjectContext } from "./risk/riskObjectContextResolver.ts";
import {
  resetRiskObjectContextRuntimeForTests,
  syncRiskObjectContext,
} from "./risk/riskObjectContextRuntime.ts";
import {
  getRiskWorkspaceState,
  hydrateRiskWorkspaceStateOnMount,
  resetRiskWorkspaceStateRuntimeForTests,
} from "./risk/riskWorkspaceStateRuntime.ts";
import { buildRiskWorkspaceViewFromState } from "./risk/riskWorkspaceStateViewMapper.ts";

test.beforeEach(() => {
  resetRiskObjectContextRuntimeForTests();
  resetRiskWorkspaceStateRuntimeForTests();
});

test("exports risk object context tag", () => {
  assert.equal(MRP_RISK_OBJECT_CONTEXT_TAG, "[MRP_RISK_OBJECT_CONTEXT]");
});

test("resolveRiskObjectContext returns no-object label when deselected", () => {
  const context = resolveRiskObjectContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  assert.equal(context.hasSelection, false);
  assert.equal(context.selectedObject, RISK_NO_OBJECT_SELECTED_LABEL);
  assert.equal(context.riskStatus, "None");
  assert.equal(context.impact, "None");
  assert.equal(context.confidence, "None");
});

test("resolveRiskObjectContext reflects Factory A fixture", () => {
  const context = resolveRiskObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  assert.equal(context.hasSelection, true);
  assert.equal(context.selectedObject, "Factory A");
  assert.equal(context.riskStatus, "Elevated");
  assert.equal(context.impact, "Production throughput");
  assert.equal(context.confidence, "Medium");
});

test("resolveRiskObjectContext reads scene object risk fields", () => {
  const sceneJson = {
    scene: {
      objects: [
        {
          id: "node-1",
          severity: "critical",
          impact: "Regional supply",
          confidence: 0.82,
        },
      ],
    },
  } as SceneJson;

  const context = resolveRiskObjectContext({
    selectedObjectId: "node-1",
    selectedObjectLabel: "Node 1",
    sceneJson,
  });

  assert.equal(context.riskStatus, "critical");
  assert.equal(context.impact, "Regional supply");
  assert.equal(context.confidence, "82%");
});

test("syncRiskObjectContext updates workspace state read-only", () => {
  syncRiskObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const state = getRiskWorkspaceState();
  assert.equal(state.objectContext.selectedObject, "Factory A");
  assert.equal(state.objectContext.hasSelection, true);
});

test("deselection restores defaults without clearing risk metrics fields", () => {
  hydrateRiskWorkspaceStateOnMount("test");
  syncRiskObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  syncRiskObjectContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const state = getRiskWorkspaceState();
  assert.deepEqual(state.objectContext, DEFAULT_RISK_OBJECT_CONTEXT);
  assert.equal(state.phase, "ready");
  assert.ok(state.riskSummary.headline.trim());
});

test("workspace view includes object context panel data", () => {
  syncRiskObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const view = buildRiskWorkspaceViewFromState(getRiskWorkspaceState());
  assert.equal(view.objectContext.selectedObject, "Factory A");
  assert.equal(view.objectContext.riskStatus, "Elevated");
});

test("custom object status overrides fixture when provided", () => {
  const context = resolveRiskObjectContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
    selectedObjectStatus: "Under Review",
  });
  assert.equal(context.riskStatus, "Under Review");
  assert.equal(context.impact, "Production throughput");
  assert.equal(context.confidence, "Medium");
});

test("object context survives hydrate remount with prior sync state", () => {
  syncRiskObjectContext({
    selectedObjectId: "supplier-network",
    selectedObjectLabel: "Supplier Network",
  });
  const before = getRiskWorkspaceState().objectContext;
  hydrateRiskWorkspaceStateOnMount("remount");
  syncRiskObjectContext({
    selectedObjectId: "supplier-network",
    selectedObjectLabel: "Supplier Network",
  });
  assert.deepEqual(getRiskWorkspaceState().objectContext, before);
});
