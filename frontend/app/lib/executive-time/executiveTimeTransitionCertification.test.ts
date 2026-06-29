import assert from "node:assert/strict";
import test from "node:test";

import { moveToContext, resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import {
  getExecutiveTimeEntityCurrentState,
  resetExecutiveTimeEntityStateStoreForTests,
} from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import { validateTransitionApproval } from "./executiveTimeTransitionApproval.ts";
import {
  EXECUTIVE_TIME_TRANSITION_ENGINE_MANIFEST,
  EXECUTIVE_TIME_TRANSITION_ENGINE_TAGS,
  runExecutiveTimeTransitionCertification,
} from "./executiveTimeTransitionCertification.ts";
import { validateTransitionDependencies } from "./executiveTimeTransitionDependency.ts";
import {
  applyOrchestratedTransition,
  evaluateTransition,
  orchestrateTransition,
} from "./executiveTimeTransitionEngine.ts";
import { validateTransitionPolicy } from "./executiveTimeTransitionPolicy.ts";
import {
  resolveAvailableTransitions,
  resolveBlockedTransitions,
  resolveTransition,
  resolveTransitionExplanation,
} from "./executiveTimeTransitionResolver.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const workspaceId = "ws-transition-test";

test.beforeEach(() => {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();
  moveToContext({ workspaceId, contextId: "this_quarter", source: "user", reason: "manual_selection" });
});

test("validates transition policy metadata", () => {
  const valid = validateTransitionPolicy({ entityType: "scenario", fromState: "draft", toState: "planned" });
  const invalid = validateTransitionPolicy({ entityType: "scenario", fromState: "draft", toState: "completed" });
  assert.equal(valid.valid, true);
  assert.equal(invalid.valid, false);
});

test("validates transition dependencies", () => {
  const result = validateTransitionDependencies({
    workspaceId,
    entityId: "entity-1",
    entityType: "scenario",
    currentState: "draft",
    targetState: "planned",
  });
  assert.equal(result.valid, true);
  assert.ok(result.dependencies.some((entry) => entry.kind === "camera_dependency"));
});

test("validates transition approval metadata", () => {
  const required = validateTransitionApproval({
    entityType: "decision",
    fromState: "draft",
    toState: "review",
    approvalGranted: false,
  });
  const granted = validateTransitionApproval({
    entityType: "decision",
    fromState: "draft",
    toState: "review",
    approvalGranted: true,
  });
  assert.equal(required.approvalRequired, true);
  assert.equal(required.valid, false);
  assert.equal(granted.valid, true);
});

test("resolves available and blocked transitions", () => {
  const available = resolveAvailableTransitions({ entityType: "risk", currentState: "detected" });
  const blocked = resolveBlockedTransitions({ entityType: "risk", currentState: "detected" });
  assert.ok(available.includes("monitoring"));
  assert.ok(blocked.some((entry) => entry.targetState === "closed"));
});

test("returns immutable transition decision", () => {
  const decision = resolveTransition({
    workspaceId,
    entityId: "kpi-1",
    entityType: "kpi",
    currentState: "inactive",
    targetState: "collecting",
    actor: "executive",
    transitionReason: "Start",
  });
  assert.equal(Object.isFrozen(decision), true);
  assert.equal(Object.isFrozen(decision.blockingIssues), true);
  assert.equal(decision.approved, true);
});

test("evaluates transition with explanation", () => {
  const evaluation = evaluateTransition({
    workspaceId,
    entityId: "kpi-1",
    entityType: "kpi",
    currentState: "inactive",
    targetState: "collecting",
    actor: "executive",
    transitionReason: "Start",
  });
  assert.equal(evaluation.valid, true);
  assert.ok(evaluation.explanation.includes("approved"));
});

test("uses transition authority and applies via state engine only", () => {
  const orchestration = orchestrateTransition({
    workspaceId,
    entityId: "kpi-1",
    entityType: "kpi",
    currentState: "inactive",
    targetState: "collecting",
    actor: "executive",
    transitionReason: "Start",
  });
  assert.equal(orchestration.authorityResult.approved, true);
  const mutation = applyOrchestratedTransition({
    orchestration,
    actor: "executive",
    timestamp: new Date().toISOString(),
  });
  assert.equal(mutation.success, true);
  assert.equal(
    getExecutiveTimeEntityCurrentState({ workspaceId, entityType: "kpi", entityId: "kpi-1" }),
    "collecting"
  );
});

test("blocks transition without required approval", () => {
  const orchestration = orchestrateTransition({
    workspaceId,
    entityId: "decision-1",
    entityType: "decision",
    currentState: "draft",
    targetState: "review",
    actor: "executive",
    transitionReason: "Review",
  });
  assert.equal(orchestration.decision.approved, false);
  assert.ok(orchestration.decision.blockingIssues.some((issue) => issue.includes("executive approval")));
});

test("does not mutate when orchestration rejects transition", () => {
  const orchestration = orchestrateTransition({
    workspaceId,
    entityId: "scenario-1",
    entityType: "scenario",
    currentState: "draft",
    targetState: "completed",
    actor: "executive",
    transitionReason: "Skip lifecycle",
  });
  const mutation = applyOrchestratedTransition({
    orchestration,
    actor: "executive",
    timestamp: new Date().toISOString(),
  });
  assert.equal(mutation.success, false);
  assert.equal(
    getExecutiveTimeEntityCurrentState({ workspaceId, entityType: "scenario", entityId: "scenario-1", fallbackState: "draft" }),
    "draft"
  );
});

test("resolves transition explanation for rejected moves", () => {
  const decision = resolveTransition({
    workspaceId,
    entityId: "scenario-1",
    entityType: "scenario",
    currentState: "draft",
    targetState: "completed",
    actor: "executive",
    transitionReason: "Invalid skip",
    approvalGranted: true,
  });
  const explanation = resolveTransitionExplanation(decision);
  assert.ok(explanation.includes("rejected"));
});

test("manifest and isolation boundaries hold", () => {
  const manifest = validateStageManifest(EXECUTIVE_TIME_TRANSITION_ENGINE_MANIFEST);
  assert.equal(manifest.valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_TRANSITION_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
    false
  );
});

test("certification passes with required tags", () => {
  const result = runExecutiveTimeTransitionCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  for (const tag of EXECUTIVE_TIME_TRANSITION_ENGINE_TAGS) {
    assert.ok(result.tags.includes(tag));
  }
});
