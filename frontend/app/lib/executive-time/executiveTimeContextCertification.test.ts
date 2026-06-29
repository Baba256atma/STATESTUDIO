import assert from "node:assert/strict";
import test from "node:test";

import { runExecutiveTimeFoundationCertification } from "./executiveTimeCertification.ts";
import {
  EXECUTIVE_TIME_CONTEXT_KEYS,
  EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  EXECUTIVE_TIME_MUST_NOT_OWN,
} from "./executiveTimeContract.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import {
  EXECUTIVE_TIME_CONTEXT_ENGINE_TAGS,
  EXECUTIVE_TIME_CONTEXT_ENGINE_MANIFEST,
  runExecutiveTimeContextCertification,
} from "./executiveTimeContextCertification.ts";
import {
  moveToContext,
  resetExecutiveTimeCameraForTests,
} from "./executiveTimeCameraEngine.ts";
import {
  resolveCurrentContext,
} from "./executiveTimeContextEngine.ts";
import {
  getDefaultContext,
  isValidContext,
  listContexts,
  normalizeContext,
  resolveContextComparisonMetadata,
  resolveContextLens,
  resolveContextMetadata,
  resolveContextWindow,
  validateExecutiveTimeContextInput,
} from "./executiveTimeContextResolver.ts";
import {
  getExecutiveTimeContextStoreRecord,
  isExecutiveTimeContextStoreIsolated,
  listExecutiveTimeContextStoreRecords,
  resetExecutiveTimeContextStoreForTests,
} from "./executiveTimeContextStore.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
});

test("exports required context engine tags", () => {
  for (const tag of [
    "[APP1_2_TIME_CONTEXT_ENGINE]",
    "[TIME_CONTEXT_ENGINE_READY]",
    "[TIME_CONTEXT_STORE_READY]",
    "[TIME_CONTEXT_RESOLVER_READY]",
    "[NO_UI_MUTATION]",
    "[NO_SCENARIO_MUTATION]",
    "[NO_ASSISTANT_MUTATION]",
    "[NO_DASHBOARD_MUTATION]",
  ]) {
    assert.ok(
      EXECUTIVE_TIME_CONTEXT_ENGINE_TAGS.includes(tag as (typeof EXECUTIVE_TIME_CONTEXT_ENGINE_TAGS)[number]),
      tag
    );
  }
});

test("resolves default context and lists all required contexts", () => {
  assert.equal(getDefaultContext(), "now");
  assert.equal(EXECUTIVE_TIME_CONTEXT_KEYS.length, 19);
  const contexts = listContexts();
  assert.equal(contexts.length, 19);
  for (const id of EXECUTIVE_TIME_CONTEXT_KEYS) {
    assert.equal(isValidContext(id), true, id);
  }
});

test("switches context metadata without downstream refresh hooks", () => {
  const workspaceId = "ws-switch-001";
  const first = moveToContext({ workspaceId, contextId: "now", source: "system", reason: "initialization" });
  assert.equal(first.success, true);
  assert.equal(first.position?.currentContext, "now");

  const second = moveToContext({ workspaceId, contextId: "this_week", source: "user" });
  assert.equal(second.success, true);
  assert.equal(second.position?.previousContext, "now");
  assert.equal(second.position?.currentContext, "this_week");

  const third = moveToContext({ workspaceId, contextId: "this_month", source: "user" });
  assert.equal(third.success, true);
  assert.equal(third.position?.currentContext, "this_month");

  const fourth = moveToContext({ workspaceId, contextId: "future_projection", source: "user", reason: "forecast" });
  assert.equal(fourth.success, true);
  assert.equal(fourth.position?.currentContext, "future_projection");

  const current = resolveCurrentContext({ workspaceId });
  assert.equal(current.id, "future_projection");
  assert.equal(current.lens, "forecast");
});

test("validates and normalizes context input", () => {
  assert.equal(validateExecutiveTimeContextInput({ contextId: "today" }).valid, true);
  assert.equal(validateExecutiveTimeContextInput({ contextId: "invalid" }).valid, false);

  const normalized = normalizeContext({ contextId: "invalid_context" });
  assert.equal(normalized.id, "now");

  const month = normalizeContext({ contextId: "this_month", anchorDate: "2026-06-15T12:00:00.000Z" });
  assert.equal(month.category, "current");
  assert.equal(month.lens, "management");
});

test("resolves context metadata, windows, lenses, and comparison contract", () => {
  const metadata = resolveContextMetadata("this_quarter");
  assert.equal(metadata.category, "current");
  assert.equal(metadata.lens, "management");

  const todayWindow = resolveContextWindow({
    contextId: "today",
    anchorDate: "2026-06-15T12:00:00.000Z",
  });
  assert.ok(Date.parse(todayWindow.startBoundary) <= Date.parse(todayWindow.endBoundary));

  const monthWindow = resolveContextWindow({
    contextId: "this_month",
    anchorDate: "2026-06-15T12:00:00.000Z",
  });
  assert.ok(monthWindow.startBoundary.startsWith("2026-06"));

  const projectionWindow = resolveContextWindow({
    contextId: "future_projection",
    anchorDate: "2026-06-15T12:00:00.000Z",
  });
  assert.equal(projectionWindow.windowKind, "projection");
  assert.ok(projectionWindow.projectionHorizon);

  assert.equal(resolveContextLens("today"), "operational");
  assert.equal(resolveContextLens("this_year"), "strategic");
  assert.equal(resolveContextLens("future_projection"), "forecast");
  assert.equal(resolveContextLens("past_review"), "retrospective");

  const comparison = resolveContextComparisonMetadata({
    primaryContextId: "today",
    secondaryContextId: "last_week",
  });
  assert.equal(comparison.supported, true);
  assert.equal(comparison.metadata.contractOnly, true);
  assert.ok(comparison.comparisonLabel.includes("Today"));
});

test("keeps context store isolated per workspace", () => {
  const wsA = "ws-store-a";
  const wsB = "ws-store-b";
  moveToContext({ workspaceId: wsA, contextId: "this_week", source: "user" });
  moveToContext({ workspaceId: wsB, contextId: "this_year", source: "user" });

  assert.equal(getExecutiveTimeContextStoreRecord(wsA).currentContextId, "this_week");
  assert.equal(getExecutiveTimeContextStoreRecord(wsB).currentContextId, "this_year");
  assert.equal(listExecutiveTimeContextStoreRecords().length, 2);
  assert.equal(isExecutiveTimeContextStoreIsolated(), true);
});

test("manifest blocks dashboard, assistant, scenario, timeline, and UI paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_TIME_CONTEXT_ENGINE_MANIFEST).valid, true);
  for (const filePath of [
    "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
    "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
    "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
    "frontend/app/components/main-right-panel/timeline/TimelinePanel.tsx",
    "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_TIME_CONTEXT_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("documents no runtime mutation exclusions", () => {
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("time_camera"));
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("timeline_ui"));
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("dashboard_ui"));
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("assistant_ui"));
  assert.ok(EXECUTIVE_TIME_MUST_NOT_OWN.includes("prediction_engine"));
});

test("APP-1:1 foundation certification still passes after context extension", () => {
  const foundation = runExecutiveTimeFoundationCertification();
  assert.equal(foundation.certified, true);
});

test("context engine certification passes all gates", () => {
  const result = runExecutiveTimeContextCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks.length, 0);
  for (const tag of EXECUTIVE_TIME_CONTEXT_ENGINE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
});
