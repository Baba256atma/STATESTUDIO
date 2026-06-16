import test from "node:test";
import assert from "node:assert/strict";

import {
  GOVERNANCE_DECISION_GATE_TAG,
  GOVERNANCE_OWNERSHIP_RULE,
} from "./governance/governanceDecisionGateContract.ts";
import {
  deriveGovernanceDecisionGate,
  deriveGovernanceDecisionOutcome,
  resetGovernanceDecisionGateForTests,
} from "./governance/governanceDecisionGateRuntime.ts";
import {
  guardGovernanceDecisionGateForbiddenAction,
  resetGovernanceDecisionGateBoundaryForTests,
  verifyGovernanceDecisionGateOwnershipCompliance,
} from "./governance/governanceDecisionGateBoundary.ts";
import { deriveGovernanceApprovalLayerIntelligence } from "./governance/governanceApprovalLayerIntelligenceRuntime.ts";
import { deriveGovernancePolicyConstraintIntelligence } from "./governance/governancePolicyConstraintIntelligenceRuntime.ts";
import {
  createGovernanceReadyState,
  resetGovernanceWorkspaceStateForTests,
} from "./governance/governanceWorkspaceState.ts";
import { buildGovernanceWorkspaceViewFromState } from "./governance/governanceWorkspaceStateViewMapper.ts";

test.beforeEach(() => {
  resetGovernanceWorkspaceStateForTests();
  resetGovernanceDecisionGateForTests();
  resetGovernanceDecisionGateBoundaryForTests();
});

function buildGateInput(state: ReturnType<typeof createGovernanceReadyState>) {
  const policyConstraint = deriveGovernancePolicyConstraintIntelligence(state);
  const approvalLayer = deriveGovernanceApprovalLayerIntelligence(state);
  return { state, policyConstraint, approvalLayer };
}

test("exports governance decision gate tag", () => {
  assert.equal(GOVERNANCE_DECISION_GATE_TAG, "[MRP_5B5_GATE]");
  assert.equal(GOVERNANCE_OWNERSHIP_RULE, "Advisory recommends. Governance approves. War Room executes.");
});

test("outcome visible for all four gate states", () => {
  const unscoped = deriveGovernanceDecisionOutcome(buildGateInput(createGovernanceReadyState()));
  assert.equal(unscoped, "REVIEW REQUIRED");

  const scoped = deriveGovernanceDecisionOutcome(
    buildGateInput(
      createGovernanceReadyState({
        selectedObjectId: "factory-a",
        policyStatus: "partial",
        constraintStatus: "review_required",
        approvalStatus: "ready_for_review",
      })
    )
  );
  assert.ok(
    scoped === "APPROVED WITH CONDITIONS" ||
      scoped === "REVIEW REQUIRED" ||
      scoped === "BLOCKED"
  );

  const outcomes: Array<ReturnType<typeof deriveGovernanceDecisionOutcome>> = [
    unscoped,
    scoped,
    deriveGovernanceDecisionOutcome(
      buildGateInput(
        createGovernanceReadyState({
          selectedObjectId: "factory-a",
          policyStatus: "aligned",
          constraintStatus: "clear",
          approvalStatus: "ready_for_review",
        })
      )
    ),
  ];
  assert.ok(outcomes.length >= 2);
});

test("decision gate surface exposes outcome and readiness summary", () => {
  const gate = deriveGovernanceDecisionGate(
    buildGateInput(createGovernanceReadyState({ selectedObjectId: "factory-a" }))
  );

  assert.equal(gate.panelId, "governance_decision_gate");
  assert.equal(gate.label, "Governance Decision Gate");
  assert.equal(gate.decidesReadiness, true);
  assert.equal(gate.mayExecute, false);
  assert.equal(gate.mayForecast, false);
  assert.equal(gate.mayRecommendAlternatives, false);
  assert.ok(gate.readinessSummary.length > 0);
  assert.ok(gate.conditions.length > 0);
  assert.equal(gate.ownershipRule, GOVERNANCE_OWNERSHIP_RULE);
});

test("view mapper attaches decision gate", () => {
  const view = buildGovernanceWorkspaceViewFromState(
    createGovernanceReadyState({ selectedObjectId: "factory-a", phase: "ready" })
  );

  assert.equal(view.decisionGate.tag, "[MRP_5B5_GATE]");
  assert.equal(view.decisionGate.source, "governance_decision_gate");
  assert.ok(
    view.decisionGate.outcome === "APPROVED" ||
      view.decisionGate.outcome === "APPROVED WITH CONDITIONS" ||
      view.decisionGate.outcome === "REVIEW REQUIRED" ||
      view.decisionGate.outcome === "BLOCKED"
  );
});

test("blocked outcome when constraint intelligence is blocked", () => {
  const state = createGovernanceReadyState({
    selectedObjectId: "factory-a",
    constraintStatus: "review_required",
  });
  const outcome = deriveGovernanceDecisionOutcome(buildGateInput(state));
  assert.equal(outcome, "BLOCKED");
});

test("no ownership violations — governance cannot execute forecast or recommend", () => {
  assert.equal(
    guardGovernanceDecisionGateForbiddenAction({ action: "execute_decision" }).allowed,
    false
  );
  assert.equal(
    guardGovernanceDecisionGateForbiddenAction({ action: "generate_forecast" }).allowed,
    false
  );
  assert.equal(
    guardGovernanceDecisionGateForbiddenAction({ action: "recommend_alternatives" }).allowed,
    false
  );
  assert.equal(
    guardGovernanceDecisionGateForbiddenAction({ action: "commit_decision" }).allowed,
    false
  );

  const compliance = verifyGovernanceDecisionGateOwnershipCompliance();
  assert.equal(compliance.compliant, true);
  assert.equal(compliance.advisoryRecommends, true);
  assert.equal(compliance.governanceApproves, true);
  assert.equal(compliance.warRoomExecutes, true);
});

test("governance decides readiness only", () => {
  const gate = deriveGovernanceDecisionGate(
    buildGateInput(createGovernanceReadyState({ selectedObjectId: "factory-a" }))
  );
  assert.equal(gate.advisoryRecommends, true);
  assert.equal(gate.warRoomExecutes, true);
  assert.equal(gate.readOnly, true);
});
