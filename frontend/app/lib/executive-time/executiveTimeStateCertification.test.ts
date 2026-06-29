import assert from "node:assert/strict";
import test from "node:test";

import { moveToContext, resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { runExecutiveTimeCameraCertification } from "./executiveTimeCameraCertification.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import {
  EXECUTIVE_TIME_STATE_ENGINE_MANIFEST,
  EXECUTIVE_TIME_STATE_ENGINE_TAGS,
  runExecutiveTimeStateCertification,
} from "./executiveTimeStateCertification.ts";
import {
  resolveExecutiveTimeStateTemporalSnapshot,
  resolveStateWithTemporalContext,
} from "./executiveTimeStateEngine.ts";
import {
  getExecutiveTimeStateRegistrySnapshot,
  listEntityStates,
  registerEntityStateSet,
  registerState,
  resetExecutiveTimeStateRegistryForTests,
  validateState,
} from "./executiveTimeStateRegistry.ts";
import {
  canTransition,
  EXECUTIVE_TIME_STATE_FUTURE_INTEGRATIONS,
  isEditable,
  isKnownEntity,
  isKnownState,
  isTerminal,
  normalizeState,
  resolveDefaultState,
  resolveEditableState,
  resolveLifecycleOrder,
  resolveTerminalStates,
  validateExecutiveTimeStateTransition,
} from "./executiveTimeStateResolver.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

test.beforeEach(() => {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
});

test("registers default entity state sets", () => {
  assert.equal(listEntityStates("scenario").length, 7);
  assert.equal(listEntityStates("decision").length, 6);
  assert.equal(listEntityStates("risk").length, 6);
  assert.equal(listEntityStates("kpi").length, 6);
  assert.equal(listEntityStates("object").length, 5);
  assert.equal(isKnownEntity("scenario"), true);
  assert.equal(isKnownEntity("unknown_entity"), false);
});

test("rejects duplicate state registration", () => {
  const duplicate = registerState({
    id: "draft",
    name: "Draft",
    entityType: "scenario",
    description: "Duplicate.",
    lifecycleOrder: 99,
    isTerminal: false,
    isEditable: true,
    isVisible: true,
    supportsTransition: true,
    metadata: Object.freeze({}),
  });
  assert.equal(duplicate.success, false);
});

test("rejects invalid lifecycle ordering in entity set", () => {
  const invalid = registerEntityStateSet({
    entityType: "custom",
    defaultStateId: "alpha",
    states: Object.freeze([
      {
        id: "alpha",
        name: "Alpha",
        entityType: "custom",
        description: "Alpha.",
        lifecycleOrder: 2,
        isTerminal: false,
        isEditable: true,
        isVisible: true,
        supportsTransition: true,
        metadata: Object.freeze({}),
      },
      {
        id: "beta",
        name: "Beta",
        entityType: "custom",
        description: "Beta.",
        lifecycleOrder: 1,
        isTerminal: true,
        isEditable: false,
        isVisible: true,
        supportsTransition: false,
        metadata: Object.freeze({}),
      },
    ]),
  });
  assert.equal(invalid.success, false);
});

test("resolves, normalizes, and validates states", () => {
  const scenarioDefault = resolveDefaultState("scenario");
  assert.equal(scenarioDefault?.id, "draft");

  const normalized = normalizeState("decision", "invalid");
  assert.equal(normalized?.id, "draft");

  assert.equal(isKnownState("risk", "monitoring"), true);
  assert.equal(validateState("kpi", "warning").valid, true);
  assert.equal(resolveLifecycleOrder("object", "deprecated"), 3);
});

test("detects terminal and editable states", () => {
  assert.equal(isTerminal("decision", "executed"), true);
  assert.equal(isTerminal("scenario", "draft"), false);
  assert.equal(isEditable("scenario", "draft"), true);
  assert.equal(isEditable("scenario", "archived"), false);
  assert.ok(resolveTerminalStates("kpi").some((entry) => entry.id === "completed"));
  assert.equal(resolveEditableState("risk", "closed"), null);
});

test("validates transition contract metadata without execution", () => {
  assert.equal(
    canTransition({ entityType: "scenario", fromState: "draft", toState: "planned" }),
    true
  );
  assert.equal(
    canTransition({ entityType: "scenario", fromState: "archived", toState: "active" }),
    false
  );

  const valid = validateExecutiveTimeStateTransition({
    entityType: "decision",
    fromState: "draft",
    toState: "review",
    transitionReason: "Submitted for review",
    actor: "executive",
    timestamp: new Date().toISOString(),
    requiresApproval: true,
    metadata: Object.freeze({ contractOnly: true }),
  });
  assert.equal(valid.valid, true);

  const invalid = validateExecutiveTimeStateTransition({
    entityType: "decision",
    fromState: "executed",
    toState: "review",
    transitionReason: "Invalid rollback",
    actor: "executive",
    timestamp: new Date().toISOString(),
    requiresApproval: false,
    metadata: Object.freeze({}),
  });
  assert.equal(invalid.valid, false);
});

test("returns immutable registry snapshot", () => {
  const first = getExecutiveTimeStateRegistrySnapshot();
  const second = getExecutiveTimeStateRegistrySnapshot();
  assert.notEqual(first.statesByEntity, second.statesByEntity);
  assert.equal(first.entityTypes.length, 11);
});

test("consumes camera and context read-only", () => {
  const workspaceId = "ws-state-temporal";
  moveToContext({ workspaceId, contextId: "this_month", source: "user" });
  const snapshot = resolveExecutiveTimeStateTemporalSnapshot({ workspaceId });
  assert.equal(snapshot.readOnly, true);
  assert.equal(snapshot.currentContextId, "this_month");

  const withState = resolveStateWithTemporalContext({
    workspaceId,
    entityType: "scenario",
    stateId: "active",
  });
  assert.equal(withState.state?.id, "active");
  assert.equal(withState.temporal.currentContextId, "this_month");
});

test("defines future integration contracts as interface-only", () => {
  assert.equal(EXECUTIVE_TIME_STATE_FUTURE_INTEGRATIONS.scenarioEngine.integrationImplemented, false);
  assert.equal(EXECUTIVE_TIME_STATE_FUTURE_INTEGRATIONS.dashboard.readOnly, true);
  assert.equal(EXECUTIVE_TIME_STATE_FUTURE_INTEGRATIONS.recommendation.readOnly, true);
});

test("manifest blocks external runtime paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_TIME_STATE_ENGINE_MANIFEST).valid, true);
  for (const filePath of [
    "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
    "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
    "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
    "frontend/app/components/panels/TimelinePanel.tsx",
  ]) {
    const decision = evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_TIME_STATE_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    });
    assert.equal(decision.allowed, false, filePath);
  }
});

test("APP-1:3 camera certification still passes", () => {
  assert.equal(runExecutiveTimeCameraCertification().certified, true);
});

test("state engine certification passes all gates", () => {
  const result = runExecutiveTimeStateCertification();
  assert.equal(result.certified, true);
  assert.equal(result.status, "PASS");
  assert.equal(result.failedChecks.length, 0);
  for (const tag of EXECUTIVE_TIME_STATE_ENGINE_TAGS) {
    assert.ok(result.tags.includes(tag), tag);
  }
});
