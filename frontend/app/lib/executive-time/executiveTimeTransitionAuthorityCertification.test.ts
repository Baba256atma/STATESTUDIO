import assert from "node:assert/strict";
import test from "node:test";

import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import {
  applyApprovedTransition,
  ExecutiveTimeStateMutationContract,
  getExecutiveTimeEntityCurrentState,
  resetExecutiveTimeEntityStateStoreForTests,
} from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import { runExecutiveTimeStateCertification } from "./executiveTimeStateCertification.ts";
import {
  authorizeTransition,
  explainDecision,
  rejectTransition,
  requestTransition,
  validateTransition,
} from "./executiveTimeTransitionAuthority.ts";
import {
  EXECUTIVE_TIME_TRANSITION_AUTHORITY_TAGS,
  EXECUTIVE_TIME_TRANSITION_AUTHORITY_MANIFEST,
  runExecutiveTimeTransitionAuthorityCertification,
} from "./executiveTimeTransitionAuthorityCertification.ts";
import { EXECUTIVE_TIME_STATE_MUTATION_OWNER } from "./executiveTimeTransitionAuthorityTypes.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();
});

const baseRequest = Object.freeze({
  workspaceId: "ws-transition-auth",
  entityId: "scenario-001",
  entityType: "scenario" as const,
  currentState: "draft",
  requestedState: "planned",
  actor: "executive",
  transitionReason: "Move to planning",
});

test("authorizes valid transitions without mutating state in authority layer", () => {
  const authorized = authorizeTransition(baseRequest);
  assert.equal(authorized.approved, true);
  assert.equal(authorized.rejected, false);
  assert.equal(getExecutiveTimeEntityCurrentState({
    workspaceId: baseRequest.workspaceId,
    entityType: baseRequest.entityType,
    entityId: baseRequest.entityId,
    fallbackState: baseRequest.currentState,
  }), baseRequest.currentState);
});

test("rejects invalid and duplicate transitions", () => {
  const duplicate = validateTransition({ ...baseRequest, requestedState: "draft" });
  assert.equal(duplicate.rejected, true);

  const invalid = rejectTransition(baseRequest, "Policy rejection.");
  assert.equal(invalid.approved, false);
  assert.equal(invalid.rejected, true);
});

test("requires approval metadata before authorization", () => {
  const pending = authorizeTransition({ ...baseRequest, requiresApproval: true, approvalGranted: false });
  assert.equal(pending.approved, false);
  assert.ok(pending.requiredApprovals.includes("executive_approval"));

  const approved = authorizeTransition({ ...baseRequest, requiresApproval: true, approvalGranted: true });
  assert.equal(approved.approved, true);
});

test("applies state changes only through state engine mutation contract", () => {
  const authorized = requestTransition(baseRequest);
  const applied = applyApprovedTransition({
    authorityResult: authorized,
    actor: "executive",
    timestamp: new Date().toISOString(),
  });
  assert.equal(applied.success, true);
  assert.equal(applied.mutationOwner, EXECUTIVE_TIME_STATE_MUTATION_OWNER);
  assert.equal(
    getExecutiveTimeEntityCurrentState({
      workspaceId: baseRequest.workspaceId,
      entityType: baseRequest.entityType,
      entityId: baseRequest.entityId,
    }),
    "planned"
  );

  const rejected = rejectTransition(baseRequest, "Blocked.");
  const blocked = applyApprovedTransition({
    authorityResult: rejected,
    actor: "executive",
    timestamp: new Date().toISOString(),
  });
  assert.equal(blocked.success, false);
});

test("returns immutable transition results and explanations", () => {
  const result = authorizeTransition(baseRequest);
  assert.throws(() => {
    (result as { approved: boolean }).approved = false;
  });
  const explanation = explainDecision(result);
  assert.equal(explanation.ownership.stateEngine, EXECUTIVE_TIME_STATE_MUTATION_OWNER);
  assert.ok(explanation.summary.includes("State Engine"));
});

test("enforces mutation contract ownership", () => {
  assert.equal(ExecutiveTimeStateMutationContract.mutationOwner, EXECUTIVE_TIME_STATE_MUTATION_OWNER);
  assert.equal(typeof ExecutiveTimeStateMutationContract.applyApprovedTransition, "function");
});

test("manifest blocks UI and external runtime paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_TIME_TRANSITION_AUTHORITY_MANIFEST).valid, true);
  const decision = evaluateStageFileBoundary({
    filePath: "frontend/app/components/panels/TimelinePanel.tsx",
    allowedFiles: EXECUTIVE_TIME_TRANSITION_AUTHORITY_MANIFEST.allowedFiles,
    forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  });
  assert.equal(decision.allowed, false);
});

test("APP-1:4 state certification still passes", () => {
  assert.equal(runExecutiveTimeStateCertification().certified, true);
});

test("transition authority certification passes all gates", () => {
  const result = runExecutiveTimeTransitionAuthorityCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  for (const tag of EXECUTIVE_TIME_TRANSITION_AUTHORITY_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
});
