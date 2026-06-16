import test from "node:test";
import assert from "node:assert/strict";

import {
  GOVERNANCE_APPROVAL_LAYER_QUESTIONS,
  GOVERNANCE_APPROVAL_LAYER_TAG,
} from "./governance/governanceApprovalLayerIntelligenceContract.ts";
import {
  deriveApprovalChainIntelligence,
  deriveAuthorityReviewIntelligence,
  deriveGovernanceApprovalLayerIntelligence,
  deriveStakeholderImpactIntelligence,
  resetGovernanceApprovalLayerIntelligenceForTests,
} from "./governance/governanceApprovalLayerIntelligenceRuntime.ts";
import {
  guardGovernanceApprovalLayerForbiddenAction,
  resetGovernanceApprovalLayerBoundaryForTests,
  verifyGovernanceApprovalLayerWarRoomCompliance,
} from "./governance/governanceApprovalLayerBoundary.ts";
import {
  createGovernanceReadyState,
  resetGovernanceWorkspaceStateForTests,
} from "./governance/governanceWorkspaceState.ts";
import { buildGovernanceWorkspaceViewFromState } from "./governance/governanceWorkspaceStateViewMapper.ts";

test.beforeEach(() => {
  resetGovernanceWorkspaceStateForTests();
  resetGovernanceApprovalLayerIntelligenceForTests();
  resetGovernanceApprovalLayerBoundaryForTests();
});

test("exports governance approval layer tag", () => {
  assert.equal(GOVERNANCE_APPROVAL_LAYER_TAG, "[MRP_5B4_APPROVAL]");
});

test("approval chain panel answers who must approve", () => {
  const chain = deriveApprovalChainIntelligence(
    createGovernanceReadyState({ selectedObjectId: "factory-a", approvalStatus: "ready_for_review" })
  );

  assert.equal(chain.panelId, "approval_chain");
  assert.equal(chain.question, GOVERNANCE_APPROVAL_LAYER_QUESTIONS.approval_chain);
  assert.equal(chain.readOnly, true);
  assert.equal(chain.mayExecute, false);
  assert.ok(chain.rows.length >= 3);
  assert.ok(chain.rows.some((row) => row.status === "Pending"));
  assert.ok(chain.rows.some((row) => row.status === "Approved"));
});

test("stakeholder impact panel answers who is affected", () => {
  const stakeholder = deriveStakeholderImpactIntelligence(
    createGovernanceReadyState({ selectedObjectId: "factory-a" })
  );

  assert.equal(stakeholder.panelId, "stakeholder_impact");
  assert.equal(stakeholder.question, GOVERNANCE_APPROVAL_LAYER_QUESTIONS.stakeholder_impact);
  assert.equal(stakeholder.mayEvaluate, true);
  assert.ok(stakeholder.rows.length >= 3);
});

test("authority review panel answers who owns the decision", () => {
  const authority = deriveAuthorityReviewIntelligence(
    createGovernanceReadyState({ selectedObjectId: "factory-a" })
  );

  assert.equal(authority.panelId, "authority_review");
  assert.equal(authority.question, GOVERNANCE_APPROVAL_LAYER_QUESTIONS.authority_review);
  assert.equal(authority.warRoomOwnsCommitment, true);
  assert.ok(
    authority.rows.some((row) => row.id === "commitment_owner" && row.label.includes("War Room"))
  );
});

test("statuses visible as Approved Pending Rejected Unknown", () => {
  const layer = deriveGovernanceApprovalLayerIntelligence(
    createGovernanceReadyState({ selectedObjectId: "factory-a", approvalStatus: "ready_for_review" })
  );
  const statuses = [
    ...layer.approvalChain.rows.map((row) => row.status),
    ...layer.stakeholderImpact.rows.map((row) => row.status),
    ...layer.authorityReview.rows.map((row) => row.status),
  ];

  assert.ok(statuses.includes("Approved"));
  assert.ok(statuses.includes("Pending"));
  assert.ok(statuses.includes("Unknown"));
});

test("view mapper attaches approval layer intelligence surfaces", () => {
  const view = buildGovernanceWorkspaceViewFromState(
    createGovernanceReadyState({ selectedObjectId: "factory-a", phase: "ready" })
  );

  assert.equal(view.approvalLayerIntelligence.tag, "[MRP_5B4_APPROVAL]");
  assert.equal(view.approvalLayerIntelligence.approvalChain.panelId, "approval_chain");
  assert.equal(view.approvalLayerIntelligence.stakeholderImpact.panelId, "stakeholder_impact");
  assert.equal(view.approvalLayerIntelligence.authorityReview.panelId, "authority_review");
  assert.equal(view.panels.length, 6);
});

test("no war room ownership violation — governance cannot commit", () => {
  assert.equal(
    guardGovernanceApprovalLayerForbiddenAction({ action: "commit_decision" }).allowed,
    false
  );
  assert.equal(
    guardGovernanceApprovalLayerForbiddenAction({ action: "select_strategy" }).allowed,
    false
  );
  assert.equal(
    guardGovernanceApprovalLayerForbiddenAction({ action: "claim_war_room_ownership" }).allowed,
    false
  );

  const compliance = verifyGovernanceApprovalLayerWarRoomCompliance();
  assert.equal(compliance.compliant, true);
  assert.equal(compliance.warRoomOwnsCommitment, true);
  assert.equal(compliance.governanceEvaluatesOnly, true);
});

test("governance may evaluate but not execute", () => {
  const layer = deriveGovernanceApprovalLayerIntelligence(createGovernanceReadyState());
  assert.equal(layer.approvalChain.mayEvaluate, true);
  assert.equal(layer.approvalChain.mayExecute, false);
  assert.equal(layer.stakeholderImpact.mayExecute, false);
  assert.equal(layer.authorityReview.mayExecute, false);
});
