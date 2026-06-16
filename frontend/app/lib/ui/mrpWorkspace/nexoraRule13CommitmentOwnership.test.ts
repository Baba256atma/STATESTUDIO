import test from "node:test";
import assert from "node:assert/strict";

import {
  COMMITMENT_WORKSPACE_QUESTIONS,
  NEXORA_RULE_13_ACTIVE_TAG,
  NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG,
  NEXORA_RULE_13_VERSION,
  RULE_13_BLOCKED_VIOLATIONS_BY_WORKSPACE,
  WAR_ROOM_ALLOWED_COMMITMENT_ACTIONS,
} from "./governance/nexoraRule13CommitmentOwnershipContract.ts";
import {
  guardNexoraRule13CommitmentOwnership,
  guardScenarioCommitmentAction,
  guardTimelineCommitmentAction,
  guardWarRoomCommitmentAction,
  resetNexoraRule13CommitmentOwnershipRuntimeForTests,
  traceNexoraRule13ActiveOnce,
  verifyAllCommitmentWorkspacesRule13Compliance,
  verifyNexoraRule13CertificationCompliance,
} from "./governance/nexoraRule13CommitmentOwnershipRuntime.ts";

test.beforeEach(() => {
  resetNexoraRule13CommitmentOwnershipRuntimeForTests();
});

test("exports Rule #13 commitment ownership and active tags", () => {
  assert.equal(
    NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG,
    "[NEXORA_RULE_13_COMMITMENT_OWNERSHIP]"
  );
  assert.equal(NEXORA_RULE_13_ACTIVE_TAG, "[NEXORA_RULE_13_ACTIVE]");
  assert.equal(NEXORA_RULE_13_VERSION, "1.0");
});

test("commitment workspace questions encode history possibility and commitment", () => {
  assert.equal(COMMITMENT_WORKSPACE_QUESTIONS.timeline, "What happened?");
  assert.equal(COMMITMENT_WORKSPACE_QUESTIONS.scenario, "What could happen?");
  assert.equal(COMMITMENT_WORKSPACE_QUESTIONS.war_room, "What are we going to do?");
});

test("blocks Timeline from executing actions and committing decisions", () => {
  assert.equal(
    guardTimelineCommitmentAction({ action: "execute_action" }).allowed,
    false
  );
  assert.equal(
    guardTimelineCommitmentAction({ action: "commit_decision" }).allowed,
    false
  );
});

test("blocks Scenario from executing actions and committing decisions", () => {
  assert.equal(
    guardScenarioCommitmentAction({ action: "execute_action" }).allowed,
    false
  );
  assert.equal(
    guardScenarioCommitmentAction({ action: "commit_decision" }).allowed,
    false
  );
});

test("allows War Room commitment actions", () => {
  for (const action of WAR_ROOM_ALLOWED_COMMITMENT_ACTIONS) {
    const result = guardWarRoomCommitmentAction({ action });
    assert.equal(result.allowed, true, action);
  }
});

test("blocks War Room from rewriting history generating simulations and owning forecasting", () => {
  assert.equal(
    guardWarRoomCommitmentAction({ action: "rewrite_history" }).allowed,
    false
  );
  assert.equal(
    guardWarRoomCommitmentAction({ action: "generate_simulation" }).allowed,
    false
  );
  assert.equal(
    guardWarRoomCommitmentAction({ action: "own_forecasting" }).allowed,
    false
  );
});

test("blocks Timeline and Scenario from War Room commitment actions", () => {
  for (const workspace of ["timeline", "scenario"] as const) {
    const blocked = guardNexoraRule13CommitmentOwnership({
      sourceWorkspace: workspace,
      commitmentAction: "select_strategy",
    });
    assert.equal(blocked.allowed, false, workspace);
  }
});

test("certification compliance passes for all commitment workspaces", () => {
  const results = verifyAllCommitmentWorkspacesRule13Compliance();
  assert.equal(results.length, 3);
  for (const result of results) {
    assert.equal(result.compliant, true, result.workspaceId);
    assert.equal(result.violations.length, 0, result.workspaceId);
  }
});

test("verifyNexoraRule13CertificationCompliance passes per workspace", () => {
  for (const workspaceId of ["timeline", "scenario", "war_room"] as const) {
    const result = verifyNexoraRule13CertificationCompliance(workspaceId);
    assert.equal(result.compliant, true);
    assert.equal(result.tag, NEXORA_RULE_13_COMMITMENT_OWNERSHIP_TAG);
  }
});

test("blocked violations are enumerated per workspace", () => {
  assert.deepEqual(RULE_13_BLOCKED_VIOLATIONS_BY_WORKSPACE.timeline, [
    "execute_actions",
    "commit_decisions",
  ]);
  assert.deepEqual(RULE_13_BLOCKED_VIOLATIONS_BY_WORKSPACE.scenario, [
    "execute_actions",
    "commit_decisions",
  ]);
  assert.deepEqual(RULE_13_BLOCKED_VIOLATIONS_BY_WORKSPACE.war_room, [
    "rewrite_history",
    "generate_simulations",
    "own_forecasting_logic",
  ]);
});

test("traceNexoraRule13ActiveOnce is safe to call repeatedly", () => {
  traceNexoraRule13ActiveOnce("test");
  traceNexoraRule13ActiveOnce("test");
});
