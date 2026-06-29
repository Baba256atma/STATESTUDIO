import assert from "node:assert/strict";
import test from "node:test";

import { moveToContext, resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import {
  classifyConflict,
  detectConflicts,
  resetExecutiveConflictEngineForTests,
} from "./executiveConflictEngine.ts";
import { resolveConflictCountBySeverity, resolveHighestSeverityConflict } from "./executiveConflictResolver.ts";
import { requestPrediction, validateExecutivePredictionRequest } from "./executivePredictionAuthority.ts";
import { runExecutivePredictionAuthorityCertification } from "./executivePredictionAuthorityCertification.ts";
import { ExecutivePredictionExecutionDeferredError } from "./executivePredictionAuthorityTypes.ts";
import {
  EXECUTIVE_PREDICTION_ENGINE_MANIFEST,
  EXECUTIVE_PREDICTION_ENGINE_TAGS,
  runExecutivePredictionCertification,
} from "./executivePredictionCertification.ts";
import {
  generatePrediction,
  generatePredictions,
  ExecutivePredictionEngine,
} from "./executivePredictionEngine.ts";
import {
  buildExecutivePredictionExplanation,
  formatExecutivePredictionExplanation,
} from "./executivePredictionExplanation.ts";
import {
  resolveAllConflicts,
  resolveHighestConfidencePrediction,
  resolvePredictionsByHorizon,
} from "./executivePredictionResolver.ts";
import { resetExecutiveEventRegistryForTests } from "./executiveEventRegistry.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";

const workspaceId = "ws-prediction-engine-test";

function resetEnvironment(): void {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();
  resetExecutiveEventRegistryForTests();
  resetExecutiveConflictEngineForTests();
  moveToContext({ workspaceId, contextId: "this_week", source: "user", reason: "manual_selection" });
}

test.beforeEach(resetEnvironment);

const baseRequest = Object.freeze({
  id: "pred-req-test-001",
  predictionType: "conflict_detection" as const,
  entityType: "decision" as const,
  entityId: "decision-test-001",
  workspaceId,
  requestedBy: "executive",
  predictionContext: "Conflict detection probe",
  predictionScope: "entity" as const,
  currentTimeContext: "this_month" as const,
  currentCameraContext: "this_week" as const,
  metadata: Object.freeze({ source: "test" }),
});

test("generates deterministic single prediction", () => {
  const validation = validateExecutivePredictionRequest(baseRequest);
  const first = generatePrediction(validation.normalizedRequest!);
  resetExecutiveConflictEngineForTests();
  const second = generatePrediction(validation.normalizedRequest!);

  assert.equal(first.success, true);
  assert.equal(first.prediction?.predictionHorizon, "immediate");
  assert.equal(first.prediction?.confidence, second.prediction?.confidence);
  assert.equal(first.prediction?.explanation, second.prediction?.explanation);
  assert.equal(Object.isFrozen(first.prediction), true);
  assert.equal(Object.isFrozen(first.prediction!.contributingFactors), true);
});

test("generates batch predictions and detects duplicate ids", () => {
  const validation = validateExecutivePredictionRequest(baseRequest);
  const normalized = validation.normalizedRequest!;
  const batch = generatePredictions([
    normalized,
    Object.freeze({ ...normalized, id: "pred-req-test-002", entityId: "decision-test-002" }),
    Object.freeze({ ...normalized, id: "pred-req-test-001" }),
  ]);

  assert.equal(batch.length, 3);
  const duplicate = batch[2]?.prediction?.conflicts.find(
    (conflict) => conflict.conflictType === "duplicate_prediction_request"
  );
  assert.ok(duplicate);
  assert.equal(duplicate?.severity, "low");
});

test("supports prediction horizon metadata override", () => {
  const validation = validateExecutivePredictionRequest({
    ...baseRequest,
    metadata: Object.freeze({ predictionHorizon: "long_term" }),
  });
  const result = generatePrediction(validation.normalizedRequest!);
  assert.equal(result.prediction?.predictionHorizon, "long_term");
  const byHorizon = resolvePredictionsByHorizon(
    result.prediction ? [result.prediction] : [],
    "long_term"
  );
  assert.equal(byHorizon.length, 1);
});

test("detects conflicts with severity classification", () => {
  const validation = validateExecutivePredictionRequest({
    ...baseRequest,
    predictionType: "dependency_forecast",
    metadata: Object.freeze({ resourceReservation: "exec-boardroom", predictionHorizon: "medium_term" }),
  });
  const result = generatePrediction(validation.normalizedRequest!);
  const conflicts = result.prediction?.conflicts ?? [];
  assert.ok(conflicts.some((conflict) => conflict.conflictType === "temporal_overlap"));
  assert.ok(conflicts.some((conflict) => conflict.conflictType === "dependency_conflict"));
  assert.ok(conflicts.some((conflict) => conflict.conflictType === "resource_reservation_metadata"));

  const counts = resolveConflictCountBySeverity(conflicts);
  assert.ok(counts.medium >= 1);
  const highest = resolveHighestSeverityConflict(conflicts);
  assert.ok(highest !== null);
  assert.equal(classifyConflict(highest!), highest!.conflictType);
});

test("builds metadata explanation without LLM", () => {
  const validation = validateExecutivePredictionRequest(baseRequest);
  const result = generatePrediction(validation.normalizedRequest!);
  const explanation = buildExecutivePredictionExplanation({
    predictionType: baseRequest.predictionType,
    entityType: baseRequest.entityType,
    entityId: baseRequest.entityId,
    horizon: "immediate",
    signals: result.prediction!.metadata.signals as never,
    factors: result.prediction!.contributingFactors,
    assumptions: result.prediction!.assumptions,
    warnings: result.prediction!.warnings,
    conflicts: result.prediction!.conflicts,
  });
  const formatted = formatExecutivePredictionExplanation(explanation);
  assert.ok(explanation.whyPredictionExists.includes(baseRequest.entityId));
  assert.ok(formatted.includes("Signals:"));
  assert.equal(Object.isFrozen(explanation), true);
});

test("freezes conflict results", () => {
  const validation = validateExecutivePredictionRequest(baseRequest);
  const result = generatePrediction(validation.normalizedRequest!);
  for (const conflict of result.prediction?.conflicts ?? []) {
    assert.equal(Object.isFrozen(conflict), true);
    assert.equal(Object.isFrozen(conflict.affectedEntities), true);
    assert.throws(() => {
      (conflict as { severity: string }).severity = "low";
    });
  }
});

test("resolves predictions and aggregates conflicts", () => {
  const validation = validateExecutivePredictionRequest(baseRequest);
  const batch = generatePredictions([
    validation.normalizedRequest!,
    Object.freeze({
      ...validation.normalizedRequest!,
      id: "pred-req-test-003",
      entityId: "decision-test-003",
    }),
  ]);
  const predictions = batch.filter((entry) => entry.success).map((entry) => entry.prediction!);
  const highest = resolveHighestConfidencePrediction(predictions);
  assert.ok(highest !== null);
  const allConflicts = resolveAllConflicts(predictions);
  assert.ok(allConflicts.length >= 1);
});

test("documents read-only dependency usage in engine", () => {
  assert.equal(typeof ExecutivePredictionEngine.generatePrediction, "function");
  assert.equal(typeof ExecutivePredictionEngine.generatePredictions, "function");
});

test("authority still defers requestPrediction to engine phase", () => {
  assert.throws(() => requestPrediction(baseRequest), ExecutivePredictionExecutionDeferredError);
});

test("manifest blocks UI and runtime paths", () => {
  assert.equal(validateStageManifest(EXECUTIVE_PREDICTION_ENGINE_MANIFEST).valid, true);
  assert.equal(
    evaluateStageFileBoundary({
      filePath: "frontend/app/components/main-right-panel/timeline/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_PREDICTION_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed,
    false
  );
});

test("APP-1:7.5 authority still certifies", () => {
  assert.equal(runExecutivePredictionAuthorityCertification().certified, true);
});

test("APP-1:8 certification passes all gates", () => {
  const result = runExecutivePredictionCertification();
  assert.equal(result.certified, true);
  assert.deepEqual([...result.tags], [...EXECUTIVE_PREDICTION_ENGINE_TAGS]);
  assert.equal(result.failedChecks.length, 0);
});
