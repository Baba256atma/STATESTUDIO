import test from "node:test";
import assert from "node:assert/strict";

import {
  EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX,
  NEXORA_RULE_11_ACTIVE_TAG,
  NEXORA_RULE_11_BOUNDARY_TAG,
  NEXORA_RULE_11_VERSION,
  SCENARIO_WORKSPACE_MANDATE,
  TIMELINE_WORKSPACE_MANDATE,
  WAR_ROOM_WORKSPACE_MANDATE,
} from "./governance/nexoraRule11BoundaryContract.ts";
import {
  guardExecutiveWorkspaceCapability,
  guardExecutiveWorkspacePanelRender,
  guardNexoraRule11Boundary,
  resetNexoraRule11BoundaryRuntimeForTests,
  traceNexoraRule11ActiveOnce,
  verifyNexoraRule11CertificationCompliance,
} from "./governance/nexoraRule11BoundaryRuntime.ts";

test.beforeEach(() => {
  resetNexoraRule11BoundaryRuntimeForTests();
});

test("exports Rule #11 boundary and active tags", () => {
  assert.equal(NEXORA_RULE_11_BOUNDARY_TAG, "[NEXORA_RULE_11_BOUNDARY]");
  assert.equal(NEXORA_RULE_11_ACTIVE_TAG, "[NEXORA_RULE_11_ACTIVE]");
  assert.equal(NEXORA_RULE_11_VERSION, "1.0");
});

test("workspace mandates encode past / futures / action questions", () => {
  assert.equal(TIMELINE_WORKSPACE_MANDATE.question, "What happened?");
  assert.equal(SCENARIO_WORKSPACE_MANDATE.question, "What could happen?");
  assert.equal(WAR_ROOM_WORKSPACE_MANDATE.question, "What should we do now?");
});

test("ownership matrix matches executive decision boundary contract", () => {
  assert.equal(EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX.historical_analysis.timeline, "owner");
  assert.equal(EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX.historical_analysis.scenario, "forbidden");
  assert.equal(EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX.future_simulation.scenario, "owner");
  assert.equal(EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX.future_simulation.war_room, "consumer");
  assert.equal(EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX.decision_execution.war_room, "owner");
  assert.equal(EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX.historical_trend_analysis.scenario, "read_only");
  assert.equal(EXECUTIVE_BOUNDARY_OWNERSHIP_MATRIX.active_strategy_tracking.war_room, "owner");
});

test("blocks Timeline rendering Scenario panels", () => {
  const blocked = guardExecutiveWorkspacePanelRender({
    hostWorkspace: "timeline",
    panelWorkspace: "scenario",
    source: "test",
  });
  assert.equal(blocked.allowed, false);
  if (!blocked.allowed) {
    assert.equal(blocked.violationKind, "render_foreign_panel");
    assert.equal(blocked.tag, NEXORA_RULE_11_BOUNDARY_TAG);
  }
});

test("blocks Timeline rendering War Room panels", () => {
  const blocked = guardExecutiveWorkspacePanelRender({
    hostWorkspace: "timeline",
    panelWorkspace: "war_room",
  });
  assert.equal(blocked.allowed, false);
});

test("allows Scenario host to render its own panels", () => {
  const allowed = guardExecutiveWorkspacePanelRender({
    hostWorkspace: "scenario",
    panelWorkspace: "scenario",
  });
  assert.equal(allowed.allowed, true);
});

test("blocks Timeline future prediction and decision commitment", () => {
  for (const violationKind of [
    "predict_future_outcomes",
    "generate_alternative_futures",
    "recommend_actions",
    "commit_decisions",
  ] as const) {
    const blocked = guardNexoraRule11Boundary({
      sourceWorkspace: "timeline",
      violationKind,
    });
    assert.equal(blocked.allowed, false, violationKind);
  }
});

test("blocks Scenario decision execution and historical rewrite", () => {
  for (const violationKind of [
    "execute_decisions",
    "commit_actions",
    "modify_timeline_history",
    "rewrite_historical_records",
  ] as const) {
    const blocked = guardNexoraRule11Boundary({
      sourceWorkspace: "scenario",
      violationKind,
    });
    assert.equal(blocked.allowed, false, violationKind);
  }
});

test("blocks War Room timeline mutation and simulation ownership", () => {
  for (const violationKind of [
    "modify_timeline_history",
    "rewrite_timeline_events",
    "alter_historical_records",
    "own_simulation_generation",
  ] as const) {
    const blocked = guardNexoraRule11Boundary({
      sourceWorkspace: "war_room",
      violationKind,
    });
    assert.equal(blocked.allowed, false, violationKind);
  }
});

test("allows Scenario to own future simulation capability", () => {
  const allowed = guardExecutiveWorkspaceCapability({
    workspace: "scenario",
    capability: "future_simulation",
    intent: "own",
  });
  assert.equal(allowed.allowed, true);
});

test("allows War Room to consume but not own future simulation", () => {
  assert.equal(
    guardExecutiveWorkspaceCapability({
      workspace: "war_room",
      capability: "future_simulation",
      intent: "consume",
    }).allowed,
    true
  );
  assert.equal(
    guardExecutiveWorkspaceCapability({
      workspace: "war_room",
      capability: "future_simulation",
      intent: "own",
    }).allowed,
    false
  );
});

test("blocks Timeline from owning historical analysis via forbidden intent paths", () => {
  assert.equal(
    guardExecutiveWorkspaceCapability({
      workspace: "timeline",
      capability: "future_simulation",
      intent: "own",
    }).allowed,
    false
  );
});

test("certification compliance passes for all three executive workspaces", () => {
  for (const workspaceId of ["timeline", "scenario", "war_room"] as const) {
    const result = verifyNexoraRule11CertificationCompliance(workspaceId);
    assert.equal(result.compliant, true, workspaceId);
    assert.equal(result.violations.length, 0, workspaceId);
  }
});

test("traceNexoraRule11ActiveOnce is safe to call repeatedly", () => {
  traceNexoraRule11ActiveOnce("test");
  traceNexoraRule11ActiveOnce("test");
});
