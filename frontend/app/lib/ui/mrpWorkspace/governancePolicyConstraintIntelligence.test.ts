import test from "node:test";
import assert from "node:assert/strict";

import {
  GOVERNANCE_CONSTRAINT_QUESTIONS,
  GOVERNANCE_POLICY_INTELLIGENCE_TAG,
  GOVERNANCE_POLICY_QUESTIONS,
} from "./governance/governancePolicyConstraintIntelligenceContract.ts";
import {
  deriveConstraintReviewIntelligence,
  deriveGovernancePolicyConstraintIntelligence,
  derivePolicyAlignmentIntelligence,
  resetGovernancePolicyConstraintIntelligenceForTests,
} from "./governance/governancePolicyConstraintIntelligenceRuntime.ts";
import {
  guardGovernancePolicyConstraintForbiddenAction,
  resetGovernancePolicyConstraintBoundaryForTests,
} from "./governance/governancePolicyConstraintBoundary.ts";
import {
  createGovernanceReadyState,
  hydrateGovernanceWorkspaceStateOnMount,
  resetGovernanceWorkspaceStateForTests,
  syncGovernanceWorkspaceContext,
} from "./governance/governanceWorkspaceState.ts";
import { buildGovernanceWorkspaceViewFromState } from "./governance/governanceWorkspaceStateViewMapper.ts";
import type { MrpContextStoreSnapshot } from "../mrpContext/mrpContextStoreContract.ts";

test.beforeEach(() => {
  resetGovernanceWorkspaceStateForTests();
  resetGovernancePolicyConstraintIntelligenceForTests();
  resetGovernancePolicyConstraintBoundaryForTests();
});

const baseSnapshot = Object.freeze({
  revision: 1,
  selectedObjectId: "factory-a",
  activeTab: "dashboard",
  dashboardMode: "governance",
  dashboardContext: "governance",
  signature: "test-signature",
  header: Object.freeze({
    panelName: "Governance",
    activeMode: "Approval • Policy • Authority",
    selectedObject: "Factory A",
    backLabel: "← Back",
    showBackNavigation: false,
    revision: 1,
    source: "mrp_context_store" as const,
  }),
}) as MrpContextStoreSnapshot;

test("exports governance policy intelligence tag", () => {
  assert.equal(GOVERNANCE_POLICY_INTELLIGENCE_TAG, "[MRP_5B3_POLICY]");
});

test("policy panel renders three policy questions", () => {
  const state = createGovernanceReadyState({ selectedObjectId: "factory-a" });
  const policy = derivePolicyAlignmentIntelligence(state);

  assert.equal(policy.panelId, "policy_alignment");
  assert.equal(policy.readOnly, true);
  assert.equal(policy.ownsExecutionAuthority, false);
  assert.equal(policy.rows.length, 3);
  assert.equal(policy.rows[0]?.question, GOVERNANCE_POLICY_QUESTIONS.policies_affected);
  assert.equal(policy.rows[1]?.question, GOVERNANCE_POLICY_QUESTIONS.rules_apply);
  assert.equal(policy.rows[2]?.question, GOVERNANCE_POLICY_QUESTIONS.standards_involved);
});

test("constraint panel renders four constraint questions", () => {
  const state = createGovernanceReadyState({
    selectedObjectId: "factory-a",
    constraintStatus: "review_required",
  });
  const constraint = deriveConstraintReviewIntelligence(state);

  assert.equal(constraint.panelId, "constraint_review");
  assert.equal(constraint.readOnly, true);
  assert.equal(constraint.rows.length, 4);
  assert.equal(constraint.rows[0]?.question, GOVERNANCE_CONSTRAINT_QUESTIONS.budget);
  assert.equal(constraint.rows[1]?.question, GOVERNANCE_CONSTRAINT_QUESTIONS.resource);
  assert.equal(constraint.rows[2]?.question, GOVERNANCE_CONSTRAINT_QUESTIONS.timeline);
  assert.equal(constraint.rows[3]?.question, GOVERNANCE_CONSTRAINT_QUESTIONS.authority);
});

test("statuses visible as PASS WARNING BLOCKED", () => {
  const state = createGovernanceReadyState({
    selectedObjectId: "factory-a",
    constraintStatus: "review_required",
  });
  const intelligence = deriveGovernancePolicyConstraintIntelligence(state);
  const verdicts = [
    ...intelligence.policy.rows.map((row) => row.verdict),
    ...intelligence.constraint.rows.map((row) => row.verdict),
  ];

  assert.ok(verdicts.includes("PASS"));
  assert.ok(verdicts.includes("WARNING"));
  assert.ok(verdicts.includes("BLOCKED"));
  assert.equal(intelligence.constraint.overallVerdict, "BLOCKED");
});

test("view mapper attaches policy and constraint intelligence surfaces", () => {
  hydrateGovernanceWorkspaceStateOnMount("test");
  syncGovernanceWorkspaceContext(baseSnapshot, { routeObjectId: "factory-a" });
  const view = buildGovernanceWorkspaceViewFromState(
    createGovernanceReadyState({
      selectedObjectId: "factory-a",
      constraintStatus: "review_required",
      phase: "ready",
    })
  );

  assert.equal(view.policyIntelligence.rows.length, 3);
  assert.equal(view.constraintIntelligence.rows.length, 4);
  assert.equal(view.policyIntelligence.readOnly, true);
  assert.equal(view.constraintIntelligence.ownsExecutionAuthority, false);
});

test("boundary blocks timeline and scenario writes", () => {
  assert.equal(
    guardGovernancePolicyConstraintForbiddenAction({ action: "write_timeline" }).allowed,
    false
  );
  assert.equal(
    guardGovernancePolicyConstraintForbiddenAction({ action: "write_scenario" }).allowed,
    false
  );
  assert.match(
    guardGovernancePolicyConstraintForbiddenAction({ action: "write_timeline" }).reason,
    /Timeline/
  );
  assert.match(
    guardGovernancePolicyConstraintForbiddenAction({ action: "write_scenario" }).reason,
    /Scenario/
  );
});

test("intelligence remains read-only with no execution authority", () => {
  const intelligence = deriveGovernancePolicyConstraintIntelligence(
    createGovernanceReadyState({ selectedObjectId: "factory-a" })
  );
  assert.equal(intelligence.tag, "[MRP_5B3_POLICY]");
  assert.equal(intelligence.policy.readOnly, true);
  assert.equal(intelligence.constraint.readOnly, true);
  assert.equal(intelligence.policy.ownsExecutionAuthority, false);
  assert.equal(intelligence.constraint.ownsExecutionAuthority, false);
});
