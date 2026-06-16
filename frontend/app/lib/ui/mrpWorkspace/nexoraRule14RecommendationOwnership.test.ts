import test from "node:test";
import assert from "node:assert/strict";

import {
  ADVISORY_ALLOWED_RECOMMENDATION_ACTIONS,
  GOVERNANCE_ALLOWED_APPROVAL_ACTIONS,
  NEXORA_RULE_14_ACTIVE_TAG,
  NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
  NEXORA_RULE_14_VERSION,
  RECOMMENDATION_OWNERSHIP_QUESTIONS,
  RULE_14_BLOCKED_VIOLATIONS_BY_ACTOR,
  WAR_ROOM_ALLOWED_RULE_14_COMMITMENT_ACTIONS,
} from "./governance/nexoraRule14RecommendationOwnershipContract.ts";
import {
  guardAdvisoryRecommendationAction,
  guardGovernanceApprovalAction,
  guardNexoraRule14RecommendationOwnership,
  guardWarRoomRecommendationOwnershipAction,
  guardWorkspaceRecommendationOwnershipViolation,
  resetNexoraRule14RecommendationOwnershipRuntimeForTests,
  traceNexoraRule14ActiveOnce,
  verifyAllRecommendationOwnershipActorsRule14Compliance,
  verifyNexoraRule14CertificationCompliance,
  verifyPrimaryRecommendationOwnershipRule14Compliance,
} from "./governance/nexoraRule14RecommendationOwnershipRuntime.ts";

test.beforeEach(() => {
  resetNexoraRule14RecommendationOwnershipRuntimeForTests();
});

test("exports Rule #14 recommendation ownership and active tags", () => {
  assert.equal(
    NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG,
    "[NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP]"
  );
  assert.equal(NEXORA_RULE_14_ACTIVE_TAG, "[NEXORA_RULE_14_ACTIVE]");
  assert.equal(NEXORA_RULE_14_VERSION, "1.0");
});

test("recommendation ownership questions encode scenario war room advisory and governance", () => {
  assert.equal(RECOMMENDATION_OWNERSHIP_QUESTIONS.scenario, "What could happen?");
  assert.equal(RECOMMENDATION_OWNERSHIP_QUESTIONS.war_room, "What are we going to do?");
  assert.equal(RECOMMENDATION_OWNERSHIP_QUESTIONS.advisory, "What do I recommend?");
  assert.equal(RECOMMENDATION_OWNERSHIP_QUESTIONS.governance, "Is this approved?");
});

test("allows Advisory recommendation actions", () => {
  for (const action of ADVISORY_ALLOWED_RECOMMENDATION_ACTIONS) {
    const result = guardAdvisoryRecommendationAction({ action });
    assert.equal(result.allowed, true, action);
  }
});

test("allows Governance approval actions", () => {
  for (const action of GOVERNANCE_ALLOWED_APPROVAL_ACTIONS) {
    const result = guardGovernanceApprovalAction({ action });
    assert.equal(result.allowed, true, action);
  }
});

test("allows War Room commitment actions under Rule #14", () => {
  for (const action of WAR_ROOM_ALLOWED_RULE_14_COMMITMENT_ACTIONS) {
    const result = guardWarRoomRecommendationOwnershipAction({ action });
    assert.equal(result.allowed, true, action);
  }
});

test("blocks War Room from issuing recommendations and approving decisions", () => {
  assert.equal(
    guardWarRoomRecommendationOwnershipAction({ action: "issue_recommendation" }).allowed,
    false
  );
  assert.equal(
    guardWarRoomRecommendationOwnershipAction({ action: "approve_decision" }).allowed,
    false
  );
});

test("blocks Advisory from approving and committing", () => {
  assert.equal(
    guardNexoraRule14RecommendationOwnership({
      sourceActor: "advisory",
      violationKind: "approve_decisions",
    }).allowed,
    false
  );
  assert.equal(
    guardNexoraRule14RecommendationOwnership({
      sourceActor: "advisory",
      violationKind: "commit_decisions",
    }).allowed,
    false
  );
});

test("blocks Governance from recommending and committing", () => {
  assert.equal(
    guardNexoraRule14RecommendationOwnership({
      sourceActor: "governance",
      violationKind: "issue_recommendations",
    }).allowed,
    false
  );
  assert.equal(
    guardNexoraRule14RecommendationOwnership({
      sourceActor: "governance",
      violationKind: "commit_decisions",
    }).allowed,
    false
  );
});

test("blocks Scenario and certified workspaces from recommendation approval and commitment", () => {
  for (const actor of ["scenario", "timeline", "operational", "risk", "executive_summary"] as const) {
    for (const violationKind of RULE_14_BLOCKED_VIOLATIONS_BY_ACTOR[actor]) {
      const result = guardWorkspaceRecommendationOwnershipViolation({
        actor,
        violationKind,
      });
      assert.equal(result.allowed, false, `${actor}:${violationKind}`);
    }
  }
});

test("certification compliance passes for all recommendation ownership actors", () => {
  const results = verifyAllRecommendationOwnershipActorsRule14Compliance();
  assert.equal(results.length, 8);
  for (const result of results) {
    assert.equal(result.compliant, true, result.actorId);
    assert.equal(result.violations.length, 0, result.actorId);
  }
});

test("verifyPrimaryRecommendationOwnershipRule14Compliance passes for primary actors", () => {
  const results = verifyPrimaryRecommendationOwnershipRule14Compliance();
  assert.equal(results.length, 4);
  for (const result of results) {
    assert.equal(result.compliant, true, result.actorId);
  }
});

test("verifyNexoraRule14CertificationCompliance passes per actor", () => {
  for (const actorId of ["scenario", "war_room", "advisory", "governance"] as const) {
    const result = verifyNexoraRule14CertificationCompliance(actorId);
    assert.equal(result.compliant, true);
    assert.equal(result.tag, NEXORA_RULE_14_RECOMMENDATION_OWNERSHIP_TAG);
  }
});

test("traceNexoraRule14ActiveOnce is safe to call repeatedly", () => {
  traceNexoraRule14ActiveOnce("test");
  traceNexoraRule14ActiveOnce("test");
});
