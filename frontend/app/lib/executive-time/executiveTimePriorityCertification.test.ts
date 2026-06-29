import assert from "node:assert/strict";
import test from "node:test";

import { moveToContext, resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import { runExecutiveTimePriorityAuthorityCertification } from "./executiveTimePriorityAuthorityCertification.ts";
import {
  EXECUTIVE_TIME_PRIORITY_ENGINE_MANIFEST,
  EXECUTIVE_TIME_PRIORITY_ENGINE_TAGS,
  runExecutiveTimePriorityCertification,
} from "./executiveTimePriorityCertification.ts";
import {
  evaluateMultiple,
  evaluatePriority,
  explainPriorityResult,
  resolveEscalationLevel,
  resolveHighestPriority,
  resolvePriorityDistribution,
  resolvePriorityGroup,
  resolvePriorityStatistics,
  ExecutiveTimePriorityEngine,
} from "./executiveTimePriorityEngine.ts";
import { EXECUTIVE_TIME_PRIORITY_ESCALATION_DEFINITIONS } from "./executiveTimePriorityEscalation.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import { runExecutiveTimeTransitionCertification } from "./executiveTimeTransitionCertification.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const workspaceId = "ws-priority-engine-test";

test.beforeEach(() => {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();
  moveToContext({ workspaceId, contextId: "this_week", source: "user", reason: "manual_selection" });
});

const baseRequest = Object.freeze({
  workspaceId,
  entityId: "kpi-001",
  entityType: "kpi" as const,
  currentState: "inactive",
  actor: "executive",
  reason: "Priority test",
});

test("evaluates single entity priority", () => {
  const result = evaluatePriority(baseRequest);
  assert.ok(["critical", "urgent", "soon", "normal", "later", "expired"].includes(result.priority));
  assert.ok(result.confidence > 0);
  assert.equal(result.matchedPolicies.length, 1);
  assert.ok(result.contributingFactors.length > 0);
  assert.ok(result.escalationLevel.length > 0);
});

test("evaluates batch priorities without mutation", () => {
  const results = evaluateMultiple([
    baseRequest,
    Object.freeze({
      ...baseRequest,
      entityId: "risk-001",
      entityType: "risk" as const,
      currentState: "detected",
      targetDeadline: new Date(Date.now() - 1000).toISOString(),
    }),
  ]);
  assert.equal(results.length, 2);
  assert.equal(results[1]?.priority, "expired");
});

test("resolves highest priority and groups", () => {
  const results = evaluateMultiple([
    baseRequest,
    Object.freeze({ ...baseRequest, entityId: "a", targetDeadline: new Date(Date.now() + 3_600_000).toISOString() }),
    Object.freeze({ ...baseRequest, entityId: "b", targetDeadline: new Date(Date.now() - 1000).toISOString() }),
  ]);
  const highest = resolveHighestPriority(results);
  assert.ok(highest !== null);
  const group = resolvePriorityGroup(results, highest!.priority);
  assert.ok(group.count >= 1);
});

test("calculates distribution and statistics", () => {
  const results = evaluateMultiple([baseRequest, Object.freeze({ ...baseRequest, entityId: "kpi-002" })]);
  const distribution = resolvePriorityDistribution(results);
  assert.equal(distribution.total, 2);
  assert.equal(typeof distribution.percentages.normal, "number");
  const statistics = resolvePriorityStatistics(results);
  assert.equal(statistics.total, 2);
  assert.ok(statistics.averageConfidence > 0);
});

test("exposes escalation metadata", () => {
  assert.equal(EXECUTIVE_TIME_PRIORITY_ESCALATION_DEFINITIONS.length, 6);
  assert.equal(resolveEscalationLevel("critical"), "Immediate");
  assert.equal(resolveEscalationLevel("expired"), "Immediate Review");
});

test("returns immutable results with explanation", () => {
  const result = evaluatePriority(baseRequest);
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.contributingFactors), true);
  const explanation = explainPriorityResult(result);
  assert.ok(explanation.includes("Escalation:"));
});

test("elevates priority for blocked transitions", () => {
  const result = evaluatePriority({
    ...baseRequest,
    entityType: "decision",
    currentState: "draft",
    targetState: "review",
  });
  assert.ok(["urgent", "soon", "critical"].includes(result.priority));
  assert.ok(result.contributingFactors.some((factor) => factor.factorId === "approval_pending"));
});

test("defers lower priority in future context", () => {
  moveToContext({ workspaceId, contextId: "future_projection", source: "user", reason: "manual_selection" });
  const result = evaluatePriority(baseRequest);
  assert.ok(["later", "normal", "expired"].includes(result.priority));
});

test("engine contract exposes evaluation APIs", () => {
  assert.equal(typeof ExecutiveTimePriorityEngine.evaluatePriority, "function");
  assert.equal(typeof ExecutiveTimePriorityEngine.resolvePriorityDistribution, "function");
});

test("manifest and isolation boundaries hold", () => {
  assert.equal(validateStageManifest(EXECUTIVE_TIME_PRIORITY_ENGINE_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PRIORITY_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
    false
  );
});

test("prior phases still certify", () => {
  assert.equal(runExecutiveTimePriorityAuthorityCertification().certified, true);
  assert.equal(runExecutiveTimeTransitionCertification().certified, true);
});

test("priority engine certification passes all gates", () => {
  const result = runExecutiveTimePriorityCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  for (const tag of EXECUTIVE_TIME_PRIORITY_ENGINE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
});
