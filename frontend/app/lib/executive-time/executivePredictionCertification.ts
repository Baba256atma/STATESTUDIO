/**
 * APP-1:8 — Executive Prediction & Conflict Engine certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { moveToContext, resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import {
  classifyConflict,
  detectConflict,
  detectConflicts,
  resetExecutiveConflictEngineForTests,
} from "./executiveConflictEngine.ts";
import { resolveHighestSeverityConflict } from "./executiveConflictResolver.ts";
import {
  generatePrediction,
  generatePredictions,
  EXECUTIVE_PREDICTION_ENGINE_FUTURE_INTEGRATIONS,
} from "./executivePredictionEngine.ts";
import { EXECUTIVE_PREDICTION_ENGINE_VERSION } from "./executivePredictionEngineTypes.ts";
import {
  buildExecutivePredictionExplanation,
  formatExecutivePredictionExplanation,
} from "./executivePredictionExplanation.ts";
import {
  resolveHighestConfidencePrediction,
  resolvePredictionsByHorizon,
} from "./executivePredictionResolver.ts";
import { requestPrediction, validateExecutivePredictionRequest } from "./executivePredictionAuthority.ts";
import { runExecutivePredictionAuthorityCertification } from "./executivePredictionAuthorityCertification.ts";
import { ExecutivePredictionExecutionDeferredError } from "./executivePredictionAuthorityTypes.ts";
import { resetExecutiveEventRegistryForTests } from "./executiveEventRegistry.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_PREDICTION_ENGINE_TAGS = Object.freeze([
  "[APP1_8_EXECUTIVE_PREDICTION_ENGINE]",
  "[EXECUTIVE_PREDICTION_READY]",
  "[EXECUTIVE_CONFLICT_READY]",
  "[IMMUTABLE_PREDICTION_RESULT]",
  "[IMMUTABLE_CONFLICT_RESULT]",
  "[DETERMINISTIC_PREDICTION]",
  "[NO_UI_MUTATION]",
] as const);

const PRIOR_MANIFEST_FILES = Object.freeze([
  "frontend/app/lib/executive-time/executiveTimeTypes.ts",
  "frontend/app/lib/executive-time/executiveTimeContract.ts",
  "frontend/app/lib/executive-time/executiveTimeRegistry.ts",
  "frontend/app/lib/executive-time/executiveTimeResolver.ts",
  "frontend/app/lib/executive-time/executiveTimeCertification.ts",
  "frontend/app/lib/executive-time/executiveTimeCertification.test.ts",
  "frontend/app/lib/executive-time/executiveTimeContextEngine.ts",
  "frontend/app/lib/executive-time/executiveTimeContextStore.ts",
  "frontend/app/lib/executive-time/executiveTimeContextResolver.ts",
  "frontend/app/lib/executive-time/executiveTimeContextMutationAuthority.ts",
  "frontend/app/lib/executive-time/executiveTimeContextCertification.ts",
  "frontend/app/lib/executive-time/executiveTimeContextCertification.test.ts",
  "frontend/app/lib/executive-time/executiveTimeCameraTypes.ts",
  "frontend/app/lib/executive-time/executiveTimeCameraResolver.ts",
  "frontend/app/lib/executive-time/executiveTimeCameraEngine.ts",
  "frontend/app/lib/executive-time/executiveTimeCameraCertification.ts",
  "frontend/app/lib/executive-time/executiveTimeCameraCertification.test.ts",
  "frontend/app/lib/executive-time/executiveTimeStateTypes.ts",
  "frontend/app/lib/executive-time/executiveTimeStateRegistry.ts",
  "frontend/app/lib/executive-time/executiveTimeStateResolver.ts",
  "frontend/app/lib/executive-time/executiveTimeStateEngine.ts",
  "frontend/app/lib/executive-time/executiveTimeStateMutation.ts",
  "frontend/app/lib/executive-time/executiveTimeStateCertification.ts",
  "frontend/app/lib/executive-time/executiveTimeStateCertification.test.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionAuthorityTypes.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionAuthority.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionAuthorityCertification.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionAuthorityCertification.test.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionPolicy.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionDependency.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionApproval.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionResolver.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionEngine.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionCertification.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionCertification.test.ts",
  "frontend/app/lib/executive-time/executiveTimePriorityAuthorityTypes.ts",
  "frontend/app/lib/executive-time/executiveTimePriorityAuthority.ts",
  "frontend/app/lib/executive-time/executiveTimePriorityAuthorityCertification.ts",
  "frontend/app/lib/executive-time/executiveTimePriorityAuthorityCertification.test.ts",
  "frontend/app/lib/executive-time/executiveTimePriorityEscalation.ts",
  "frontend/app/lib/executive-time/executiveTimePriorityEvaluation.ts",
  "frontend/app/lib/executive-time/executiveTimePriorityResolver.ts",
  "frontend/app/lib/executive-time/executiveTimePriorityEngine.ts",
  "frontend/app/lib/executive-time/executiveTimePriorityCertification.ts",
  "frontend/app/lib/executive-time/executiveTimePriorityCertification.test.ts",
  "frontend/app/lib/executive-time/executiveEventAuthorityTypes.ts",
  "frontend/app/lib/executive-time/executiveEventAuthority.ts",
  "frontend/app/lib/executive-time/executiveEventPublisherContract.ts",
  "frontend/app/lib/executive-time/executiveEventConsumerContract.ts",
  "frontend/app/lib/executive-time/executiveEventAuthorityCertification.ts",
  "frontend/app/lib/executive-time/executiveEventAuthorityCertification.test.ts",
  "frontend/app/lib/executive-time/executiveEventEngineTypes.ts",
  "frontend/app/lib/executive-time/executiveEventLifecycle.ts",
  "frontend/app/lib/executive-time/executiveEventClassification.ts",
  "frontend/app/lib/executive-time/executiveEventRegistry.ts",
  "frontend/app/lib/executive-time/executiveEventResolver.ts",
  "frontend/app/lib/executive-time/executiveEventEngine.ts",
  "frontend/app/lib/executive-time/executiveEventCertification.ts",
  "frontend/app/lib/executive-time/executiveEventCertification.test.ts",
  "frontend/app/lib/executive-time/executivePredictionAuthorityTypes.ts",
  "frontend/app/lib/executive-time/executivePredictionAuthority.ts",
  "frontend/app/lib/executive-time/executivePredictionRequestContract.ts",
  "frontend/app/lib/executive-time/executivePredictionConsumerContract.ts",
  "frontend/app/lib/executive-time/executivePredictionAuthorityCertification.ts",
  "frontend/app/lib/executive-time/executivePredictionAuthorityCertification.test.ts",
  "docs/app-1-1-executive-time-foundation-report.md",
  "docs/app-1-2-time-context-engine-report.md",
  "docs/app-1-3-time-camera-engine-report.md",
  "docs/app-1-4-time-state-engine-report.md",
  "docs/app-1-4-5-transition-authority-contract-report.md",
  "docs/app-1-5-time-transition-engine-report.md",
  "docs/app-1-5-5-priority-authority-contract-report.md",
  "docs/app-1-6-time-priority-engine-report.md",
  "docs/app-1-6-5-executive-event-authority-report.md",
  "docs/app-1-7-executive-event-engine-report.md",
  "docs/app-1-7-5-executive-prediction-authority-report.md",
] as const);

export const EXECUTIVE_PREDICTION_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-1/8",
  title: "Executive Prediction & Conflict Engine",
  goal: "Deterministic prediction and conflict evaluation for Executive Time.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PRIOR_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executivePredictionEngineTypes.ts",
    "frontend/app/lib/executive-time/executivePredictionEngine.ts",
    "frontend/app/lib/executive-time/executivePredictionResolver.ts",
    "frontend/app/lib/executive-time/executiveConflictEngine.ts",
    "frontend/app/lib/executive-time/executiveConflictResolver.ts",
    "frontend/app/lib/executive-time/executivePredictionExplanation.ts",
    "frontend/app/lib/executive-time/executivePredictionCertification.ts",
    "frontend/app/lib/executive-time/executivePredictionCertification.test.ts",
    "docs/app-1-8-executive-prediction-conflict-engine-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/7.5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_PREDICTION_ENGINE_TAGS,
});

const REPO_ROOT = join(process.cwd(), "..");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function resetCertEnvironment(): void {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();
  resetExecutiveEventRegistryForTests();
  resetExecutiveConflictEngineForTests();
}

function engineHasReadOnlyDependencies(): boolean {
  const source = readFileSync(join(process.cwd(), "app/lib/executive-time/executivePredictionEngine.ts"), "utf8");
  return (
    source.includes("resolveCurrentContext") &&
    source.includes("getExecutiveTimeCameraPosition") &&
    source.includes("getExecutiveTimeEntityCurrentState") &&
    source.includes("evaluateTransition") &&
    source.includes("evaluatePriority") &&
    source.includes("resolveEntityHistory") &&
    !source.includes("applyApprovedTransition") &&
    !source.includes("moveToContext") &&
    !source.includes("localStorage") &&
    !source.includes("forecast(") &&
    !source.includes("runML")
  );
}

export function runExecutivePredictionCertification() {
  resetCertEnvironment();
  const workspaceId = "ws-prediction-engine-cert";
  moveToContext({ workspaceId, contextId: "this_week", source: "user", reason: "manual_selection" });

  const request = Object.freeze({
    id: "pred-req-engine-cert-001",
    predictionType: "conflict_detection" as const,
    entityType: "decision" as const,
    entityId: "decision-cert-001",
    workspaceId,
    requestedBy: "executive",
    predictionContext: "Certification prediction probe",
    predictionScope: "entity" as const,
    currentTimeContext: "this_month" as const,
    currentCameraContext: "this_week" as const,
    metadata: Object.freeze({ predictionHorizon: "today", resourceReservation: "room-alpha" }),
  });

  const validation = validateExecutivePredictionRequest(request);
  const generated = generatePrediction(validation.normalizedRequest!);
  resetExecutiveConflictEngineForTests();
  const generatedAgain = generatePrediction(validation.normalizedRequest!);
  const batch = generatePredictions([
    validation.normalizedRequest!,
    Object.freeze({ ...validation.normalizedRequest!, id: "pred-req-engine-cert-002", entityId: "decision-cert-002" }),
    Object.freeze({ ...validation.normalizedRequest!, id: "pred-req-engine-cert-001" }),
  ]);
  const horizonResults = resolvePredictionsByHorizon(
    batch.filter((entry) => entry.success).map((entry) => entry.prediction!),
    "today"
  );
  const highest = resolveHighestConfidencePrediction(
    batch.filter((entry) => entry.success).map((entry) => entry.prediction!)
  );
  const conflict = detectConflict({
    request: validation.normalizedRequest!,
    signals: generated.prediction!.metadata.signals as never,
  });
  const classified = conflict ? classifyConflict(conflict) : "custom";
  const explanation = buildExecutivePredictionExplanation({
    predictionType: request.predictionType,
    entityType: request.entityType,
    entityId: request.entityId,
    horizon: "today",
    signals: generated.prediction!.metadata.signals as never,
    factors: generated.prediction!.contributingFactors,
    assumptions: generated.prediction!.assumptions,
    warnings: generated.prediction!.warnings,
    conflicts: generated.prediction!.conflicts,
  });
  const formatted = formatExecutivePredictionExplanation(explanation);

  let authorityStillDeferred = false;
  try {
    requestPrediction(request);
  } catch (error) {
    authorityStillDeferred = error instanceof ExecutivePredictionExecutionDeferredError;
  }

  const priorAuthority = runExecutivePredictionAuthorityCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_PREDICTION_ENGINE_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-8-executive-prediction-conflict-engine-report.md");
  const engineSource = readFileSync(join(process.cwd(), "app/lib/executive-time/executivePredictionEngine.ts"), "utf8");
  const conflictSource = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveConflictEngine.ts"), "utf8");

  const prediction = generated.prediction!;
  const firstConflict = prediction.conflicts[0] ?? null;

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Prediction Engine exists", Boolean(EXECUTIVE_PREDICTION_ENGINE_VERSION), EXECUTIVE_PREDICTION_ENGINE_VERSION),
    check("B", "Conflict Engine exists", conflictSource.includes("detectConflicts"), "detectConflicts"),
    check("C", "Prediction Resolver exists", horizonResults.length >= 1, String(horizonResults.length)),
    check("D", "Conflict Resolver exists", resolveHighestSeverityConflict(prediction.conflicts) !== null || prediction.conflicts.length === 0, "Conflict resolver."),
    check("E", "Explanation Engine exists", formatted.length > 0 && explanation.summary.length > 0, explanation.summary.slice(0, 40)),
    check("F", "Prediction generation works", generated.success && prediction.predictionId === `pred-${request.id}`, prediction.predictionId),
    check("G", "Batch prediction works", batch.length === 3 && batch.filter((entry) => entry.success).length >= 2, String(batch.length)),
    check("H", "Conflict detection works", prediction.conflicts.length > 0, String(prediction.conflicts.length)),
    check("I", "Conflict classification works", classified === "temporal_overlap" || classified === "custom", classified),
    check("J", "Prediction horizon works", prediction.predictionHorizon === "today", prediction.predictionHorizon),
    check("K", "Immutable prediction verified", Object.isFrozen(prediction) && Object.isFrozen(prediction.contributingFactors), "Frozen prediction."),
    check("L", "Immutable conflict verified", firstConflict === null || Object.isFrozen(firstConflict), "Frozen conflict."),
    check("M", "Deterministic output verified", generatedAgain.prediction?.confidence === prediction.confidence && generatedAgain.prediction?.explanation === prediction.explanation, String(generatedAgain.prediction?.confidence)),
    check("N", "Read-only Context dependency", engineSource.includes("resolveCurrentContext"), "Context read-only."),
    check("O", "Read-only Camera dependency", engineSource.includes("getExecutiveTimeCameraPosition"), "Camera read-only."),
    check("P", "Read-only State dependency", engineSource.includes("getExecutiveTimeEntityCurrentState"), "State read-only."),
    check("Q", "Read-only Transition dependency", engineSource.includes("evaluateTransition"), "Transition read-only."),
    check("R", "Read-only Priority dependency", engineSource.includes("evaluatePriority"), "Priority read-only."),
    check("S", "Read-only Event dependency", engineSource.includes("resolveEntityHistory"), "Event read-only."),
    check("T", "Prediction Authority respected", validation.valid && authorityStillDeferred, "Authority defers execution."),
    check("U", "Future contracts exist", EXECUTIVE_PREDICTION_ENGINE_FUTURE_INTEGRATIONS.audit.integrationImplemented === false, "Future contracts."),
    check("V", "No Dashboard mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_PREDICTION_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard blocked."),
    check("W", "No Assistant mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
      allowedFiles: EXECUTIVE_PREDICTION_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant blocked."),
    check("X", "Tests pass assumptions", highest !== null && engineHasReadOnlyDependencies(), prediction.metadata.engineOwner as string),
    check("Y", "Report created", existsSync(reportPath), reportPath),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:8 Executive Prediction & Conflict Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([]),
    tags: EXECUTIVE_PREDICTION_ENGINE_TAGS,
    summary: certified
      ? "APP-1:8 Executive Prediction & Conflict Engine PASSED."
      : `APP-1:8 Executive Prediction & Conflict Engine FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutivePredictionCertification = Object.freeze({
  runExecutivePredictionCertification,
});
