import assert from "node:assert/strict";
import test from "node:test";

import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import {
  buildPriorityResultContract,
  evaluateMultiple,
  evaluatePriority,
  EXECUTIVE_TIME_PRIORITY_LEVELS,
  EXECUTIVE_TIME_PRIORITY_OWNERSHIP_RULES,
  EXECUTIVE_TIME_PRIORITY_POLICIES,
  EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES,
  explainPriority,
  ExecutiveTimePriorityEngineContract,
  resolvePolicy,
  validatePolicy,
} from "./executiveTimePriorityAuthority.ts";
import {
  EXECUTIVE_TIME_PRIORITY_AUTHORITY_TAGS,
  EXECUTIVE_TIME_PRIORITY_AUTHORITY_MANIFEST,
  runExecutiveTimePriorityAuthorityCertification,
} from "./executiveTimePriorityAuthorityCertification.ts";
import {
  EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER,
  EXECUTIVE_TIME_PRIORITY_POLICY_OWNER,
  EXECUTIVE_TIME_PRIORITY_RESULT_OWNER,
  ExecutiveTimePriorityEvaluationDeferredError,
  type ExecutiveTimePriorityPolicyDefinition,
} from "./executiveTimePriorityAuthorityTypes.ts";
import { runExecutiveTimeTransitionCertification } from "./executiveTimeTransitionCertification.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const baseRequest = Object.freeze({
  workspaceId: "ws-priority-auth",
  entityId: "scenario-001",
  entityType: "scenario" as const,
  currentState: "draft",
  actor: "executive",
  reason: "Priority probe",
});

test("exposes immutable priority policy metadata", () => {
  assert.equal(EXECUTIVE_TIME_PRIORITY_POLICIES.length, 6);
  assert.throws(() => {
    (EXECUTIVE_TIME_PRIORITY_POLICIES as ExecutiveTimePriorityPolicyDefinition[]).push({
      id: "x",
      priority: "normal",
      description: "x",
      evaluationOrder: 99,
      severityWeight: 1,
      metadata: Object.freeze({}),
    });
  });

  const policy = resolvePolicy({ priority: "urgent" });
  assert.equal(policy?.id, "priority-urgent");
  assert.equal(policy?.evaluationOrder, 1);
  assert.throws(() => {
    if (policy) (policy as { description: string }).description = "changed";
  });
});

test("validates policy ids without evaluation", () => {
  assert.equal(validatePolicy("priority-critical").valid, true);
  assert.equal(validatePolicy("priority-missing").valid, false);
});

test("defers priority evaluation to APP-1:6", () => {
  assert.throws(() => evaluatePriority(baseRequest), ExecutiveTimePriorityEvaluationDeferredError);
  assert.throws(() => evaluateMultiple([baseRequest]), ExecutiveTimePriorityEvaluationDeferredError);
});

test("builds immutable priority result contract templates", () => {
  const result = buildPriorityResultContract({
    priority: "soon",
    confidence: 0,
    matchedPolicyIds: ["priority-soon"],
    explanation: "Template only.",
  });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.matchedPolicies), true);
  assert.equal(result.metadata.contractOnly, true);
  assert.equal(result.metadata.resultOwner, EXECUTIVE_TIME_PRIORITY_RESULT_OWNER);
});

test("explains priority results without calculating priority", () => {
  const result = buildPriorityResultContract({
    priority: "critical",
    confidence: 0,
    matchedPolicyIds: ["priority-critical"],
  });
  const explanation = explainPriority(result);
  assert.equal(explanation.priority, "critical");
  assert.equal(explanation.ownership.policyOwner, EXECUTIVE_TIME_PRIORITY_POLICY_OWNER);
  assert.equal(explanation.ownership.engineOwner, EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER);
});

test("documents ownership separation", () => {
  assert.ok(EXECUTIVE_TIME_PRIORITY_OWNERSHIP_RULES.policyOwns.includes("priority_definitions"));
  assert.ok(EXECUTIVE_TIME_PRIORITY_OWNERSHIP_RULES.engineOwns.includes("evaluation"));
  assert.ok(EXECUTIVE_TIME_PRIORITY_OWNERSHIP_RULES.resultOwns.includes("final_immutable_assessment"));
  assert.notDeepEqual(
    EXECUTIVE_TIME_PRIORITY_OWNERSHIP_RULES.policyOwns,
    EXECUTIVE_TIME_PRIORITY_OWNERSHIP_RULES.engineOwns
  );
});

test("documents read-only upstream dependencies", () => {
  assert.equal(EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES.context.mutationPermitted, false);
  assert.equal(EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES.camera.mutationPermitted, false);
  assert.equal(EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES.state.mutationPermitted, false);
  assert.equal(EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES.transitionEngine.mutationPermitted, false);
  assert.ok(EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES.transitionEngine.operations.includes("evaluateTransition"));
});

test("exposes engine contract interface", () => {
  assert.equal(ExecutiveTimePriorityEngineContract.evaluationOwner, EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER);
  assert.equal(typeof ExecutiveTimePriorityEngineContract.validatePolicy, "function");
  assert.equal(typeof ExecutiveTimePriorityEngineContract.resolvePolicy, "function");
  assert.equal(EXECUTIVE_TIME_PRIORITY_LEVELS.includes("expired"), true);
});

test("manifest blocks UI paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_TIME_PRIORITY_AUTHORITY_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PRIORITY_AUTHORITY_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
    false
  );
});

test("APP-1:5 transition certification still passes", () => {
  assert.equal(runExecutiveTimeTransitionCertification().certified, true);
});

test("priority authority certification passes all gates", () => {
  const result = runExecutiveTimePriorityAuthorityCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  for (const tag of EXECUTIVE_TIME_PRIORITY_AUTHORITY_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
});
