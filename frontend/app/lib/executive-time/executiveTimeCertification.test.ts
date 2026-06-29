import assert from "node:assert/strict";
import test from "node:test";

import {
  EXECUTIVE_TIME_CONTEXT_KEYS,
  EXECUTIVE_TIME_DEFAULT_CONTEXT,
  EXECUTIVE_TIME_DEFAULT_PRIORITY,
  EXECUTIVE_TIME_DEFAULT_STATE,
  EXECUTIVE_TIME_EVENT_CATEGORIES,
  EXECUTIVE_TIME_FOUNDATION_TAGS,
  EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  EXECUTIVE_TIME_MUST_NOT_OWN,
  EXECUTIVE_TIME_PRIORITY_KEYS,
  EXECUTIVE_TIME_SELF_MANIFEST,
  EXECUTIVE_TIME_STATE_KEYS,
  resolveExecutiveTimeEventExample,
  validateExecutiveTimeTransition,
} from "./executiveTimeContract.ts";
import { runExecutiveTimeFoundationCertification } from "./executiveTimeCertification.ts";
import {
  getExecutiveTimeRegistrySnapshot,
  hasExecutiveTimeContext,
  hasExecutiveTimeEventCategory,
  hasExecutiveTimePriority,
  hasExecutiveTimeState,
  registerExecutiveTimeContext,
  registerExecutiveTimeEventCategory,
  registerExecutiveTimePriority,
  registerExecutiveTimeState,
  registerExecutiveTimeTransitionRule,
  resetExecutiveTimeRegistryForTests,
} from "./executiveTimeRegistry.ts";
import {
  normalizeExecutiveTimeEvent,
  resolveDefaultExecutiveTimeContext,
  resolveDefaultExecutiveTimePriority,
  resolveDefaultExecutiveTimeState,
  resolveSafeExecutiveTimeContext,
  resolveSafeExecutiveTimePriority,
  resolveSafeExecutiveTimeState,
  validateExecutiveTimeEvent,
} from "./executiveTimeResolver.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import type { ExecutiveTimeContextDefinition } from "./executiveTimeTypes.ts";

test.beforeEach(() => {
  resetExecutiveTimeRegistryForTests();
});

test("exports foundation vocabulary and required tags", () => {
  assert.equal(EXECUTIVE_TIME_CONTEXT_KEYS.length, 19);
  assert.equal(EXECUTIVE_TIME_STATE_KEYS.length, 8);
  assert.equal(EXECUTIVE_TIME_PRIORITY_KEYS.length, 6);
  assert.equal(EXECUTIVE_TIME_EVENT_CATEGORIES.length, 10);
  for (const tag of [
    "[APP1_1_EXECUTIVE_TIME_FOUNDATION]",
    "[EXECUTIVE_TIME_CONTRACT_READY]",
    "[EXECUTIVE_TIME_REGISTRY_READY]",
    "[EXECUTIVE_TIME_RESOLVER_READY]",
    "[NO_UI_MUTATION]",
    "[NO_SCENARIO_MUTATION]",
    "[NO_DASHBOARD_MUTATION]",
    "[NO_ASSISTANT_MUTATION]",
  ]) {
    assert.ok(EXECUTIVE_TIME_FOUNDATION_TAGS.includes(tag as (typeof EXECUTIVE_TIME_FOUNDATION_TAGS)[number]), tag);
  }
});

test("resolves default time context, state, and priority", () => {
  assert.equal(resolveDefaultExecutiveTimeContext(), EXECUTIVE_TIME_DEFAULT_CONTEXT);
  assert.equal(resolveDefaultExecutiveTimeState(), EXECUTIVE_TIME_DEFAULT_STATE);
  assert.equal(resolveDefaultExecutiveTimePriority(), EXECUTIVE_TIME_DEFAULT_PRIORITY);
  assert.equal(EXECUTIVE_TIME_DEFAULT_CONTEXT, "now");
  assert.equal(EXECUTIVE_TIME_DEFAULT_STATE, "draft");
  assert.equal(EXECUTIVE_TIME_DEFAULT_PRIORITY, "normal");
});

test("validates and normalizes executive time events", () => {
  const example = resolveExecutiveTimeEventExample();
  assert.equal(validateExecutiveTimeEvent(example).valid, true);

  const normalized = normalizeExecutiveTimeEvent({
    id: "evt-001",
    workspaceId: "ws-001",
    category: "kpi",
    state: "active",
    priority: "urgent",
  });
  assert.equal(normalized.category, "kpi");
  assert.equal(normalized.state, "active");
  assert.equal(normalized.priority, "urgent");
  assert.equal(normalized.title, "Untitled executive time event");
  assert.equal(validateExecutiveTimeEvent(normalized).valid, true);
});

test("registry registers definitions and rejects duplicates", () => {
  const snapshot = getExecutiveTimeRegistrySnapshot();
  assert.equal(snapshot.contexts.length, 19);
  assert.equal(snapshot.states.length, 8);
  assert.equal(snapshot.priorities.length, 6);
  assert.equal(snapshot.eventCategories.length, 10);
  assert.ok(snapshot.transitionRules.length >= 6);

  assert.equal(
    registerExecutiveTimeContext({ key: "now", label: "Now", description: "Duplicate." }).success,
    false
  );
  assert.equal(
    registerExecutiveTimeState({ key: "draft", label: "Draft", description: "Duplicate." }).success,
    false
  );
  assert.equal(
    registerExecutiveTimePriority({
      key: "normal",
      label: "Normal",
      description: "Duplicate.",
      rank: 99,
    }).success,
    false
  );
  assert.equal(
    registerExecutiveTimeEventCategory({ key: "manual", label: "Manual", description: "Duplicate." }).success,
    false
  );
  assert.equal(
    registerExecutiveTimeTransitionRule({
      ruleId: "draft-to-planned",
      fromState: "draft",
      toState: "planned",
      label: "Duplicate",
      metadata: Object.freeze({}),
    }).success,
    false
  );
});

test("rejects unknown registry keys and validates existence", () => {
  assert.equal(hasExecutiveTimeContext("today"), true);
  assert.equal(hasExecutiveTimeContext("invalid_context"), false);
  assert.equal(hasExecutiveTimeState("blocked"), true);
  assert.equal(hasExecutiveTimeState("unknown_state"), false);
  assert.equal(hasExecutiveTimePriority("critical"), true);
  assert.equal(hasExecutiveTimePriority("unknown_priority"), false);
  assert.equal(hasExecutiveTimeEventCategory("risk"), true);
  assert.equal(hasExecutiveTimeEventCategory("unknown_category"), false);
});

test("returns immutable registry snapshots", () => {
  const first = getExecutiveTimeRegistrySnapshot();
  const second = getExecutiveTimeRegistrySnapshot();
  assert.notEqual(first.contexts, second.contexts);
  assert.throws(() => {
    (first.contexts as ExecutiveTimeContextDefinition[]).push({
      key: "now",
      label: "Mutated",
      description: "Should fail.",
    });
  });
});

test("applies safe fallback behavior for unknown values", () => {
  assert.equal(resolveSafeExecutiveTimeContext("this_quarter"), "this_quarter");
  assert.equal(resolveSafeExecutiveTimeContext("invalid"), "now");
  assert.equal(resolveSafeExecutiveTimeState("waiting"), "waiting");
  assert.equal(resolveSafeExecutiveTimeState("invalid"), "draft");
  assert.equal(resolveSafeExecutiveTimePriority("soon"), "soon");
  assert.equal(resolveSafeExecutiveTimePriority("invalid"), "normal");

  const normalized = normalizeExecutiveTimeEvent({
    id: "evt-fallback",
    workspaceId: "ws-fallback",
    category: "unknown_category",
    state: "unknown_state",
    priority: "unknown_priority",
  });
  assert.equal(normalized.category, "manual");
  assert.equal(normalized.state, "draft");
  assert.equal(normalized.priority, "normal");
});

test("validates transition metadata without workflow execution", () => {
  const result = validateExecutiveTimeTransition({
    fromState: "planned",
    toState: "active",
    reason: "Scheduled activation",
    timestamp: new Date().toISOString(),
    actor: "executive",
    metadata: Object.freeze({ source: "test" }),
  });
  assert.equal(result.valid, true);
});

test("manifest blocks dashboard, assistant, scenario, and UI paths", () => {
  const validation = validateStageManifest(EXECUTIVE_TIME_SELF_MANIFEST);
  assert.equal(validation.valid, true);

  for (const filePath of [
    "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
    "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
    "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_TIME_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("documents architecture mutation exclusions", () => {
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("time_panel_ui"));
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("timeline_ui"));
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("scenario_engine"));
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("prediction_engine"));
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("time_camera"));
});

test("certification runner passes all gates with required tags", () => {
  const result = runExecutiveTimeFoundationCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks.length, 0);
  assert.ok(result.passedChecks.length > 0);
  for (const tag of EXECUTIVE_TIME_FOUNDATION_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
});
