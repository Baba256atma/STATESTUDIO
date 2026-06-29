/**
 * APP-1:7.5 — Executive Prediction Authority certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { runExecutiveEventEngineCertification } from "./executiveEventCertification.ts";
import {
  buildExecutivePredictionResultContract,
  EXECUTIVE_PREDICTION_FUTURE_INTEGRATIONS,
  EXECUTIVE_PREDICTION_OWNERSHIP_RULES,
  EXECUTIVE_PREDICTION_PUBLISHER_RULES,
  EXECUTIVE_PREDICTION_READONLY_DEPENDENCIES,
  requestPrediction,
  validateExecutivePredictionRequest,
} from "./executivePredictionAuthority.ts";
import {
  EXECUTIVE_PREDICTION_AUTHORITY_OWNER,
  EXECUTIVE_PREDICTION_AUTHORITY_VERSION,
  ExecutivePredictionExecutionDeferredError,
} from "./executivePredictionAuthorityTypes.ts";
import type { ExecutivePredictionAuthorityCertificationResult } from "./executivePredictionAuthorityTypes.ts";
import {
  ExecutivePredictionConsumerContractDeclaration,
  EXECUTIVE_PREDICTION_CONSUMER_RULES,
  receivePredictionResult,
} from "./executivePredictionConsumerContract.ts";
import {
  ExecutivePredictionPublisherContractDeclaration,
  validateExecutivePredictionPublisherRequest,
} from "./executivePredictionRequestContract.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_PREDICTION_AUTHORITY_TAGS = Object.freeze([
  "[APP1_7_5_EXECUTIVE_PREDICTION_AUTHORITY]",
  "[PREDICTION_AUTHORITY_READY]",
  "[PREDICTION_REQUEST_READY]",
  "[PREDICTION_RESULT_READY]",
  "[SINGLE_PREDICTION_ENGINE]",
  "[NO_PREDICTION_EXECUTION]",
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
] as const);

export const EXECUTIVE_PREDICTION_AUTHORITY_MANIFEST = Object.freeze({
  stageId: "APP-1/7.5",
  title: "Executive Prediction Authority Contract",
  goal: "Single canonical prediction system for the Nexora platform.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PRIOR_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executivePredictionAuthorityTypes.ts",
    "frontend/app/lib/executive-time/executivePredictionAuthority.ts",
    "frontend/app/lib/executive-time/executivePredictionRequestContract.ts",
    "frontend/app/lib/executive-time/executivePredictionConsumerContract.ts",
    "frontend/app/lib/executive-time/executivePredictionAuthorityCertification.ts",
    "frontend/app/lib/executive-time/executivePredictionAuthorityCertification.test.ts",
    "docs/app-1-7-5-executive-prediction-authority-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/7"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_PREDICTION_AUTHORITY_TAGS,
});

const REPO_ROOT = join(process.cwd(), "..");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function authorityHasNoPredictionExecution(): boolean {
  const sources = [
    "app/lib/executive-time/executivePredictionAuthority.ts",
    "app/lib/executive-time/executivePredictionRequestContract.ts",
    "app/lib/executive-time/executivePredictionConsumerContract.ts",
  ].map((path) => readFileSync(join(process.cwd(), path), "utf8"));
  return (
    sources[0]!.includes("ExecutivePredictionExecutionDeferredError") &&
    sources.every(
      (source) =>
        !source.includes("forecast(") &&
        !source.includes("runML") &&
        !source.includes("predictConflict") &&
        !source.includes("localStorage") &&
        !source.includes("predictionStore")
    )
  );
}

export function runExecutivePredictionAuthorityCertification(): ExecutivePredictionAuthorityCertificationResult {
  const request = Object.freeze({
    id: "pred-req-cert-001",
    predictionType: "future_state" as const,
    entityType: "scenario" as const,
    entityId: "scenario-001",
    workspaceId: "ws-prediction-cert",
    requestedBy: "executive",
    predictionContext: "Quarter-end scenario review",
    predictionScope: "entity" as const,
    currentTimeContext: "this_quarter" as const,
    currentCameraContext: "this_quarter" as const,
    metadata: Object.freeze({ probe: true }),
  });

  const validation = validateExecutivePredictionRequest(request);
  const invalid = validateExecutivePredictionRequest({ ...request, id: "" });
  const publisherValidation = validateExecutivePredictionPublisherRequest(request);
  const normalized = validation.normalizedRequest!;
  const resultTemplate = buildExecutivePredictionResultContract({
    predictionId: "pred-result-cert-001",
    explanation: "Contract probe.",
  });
  const consumption = receivePredictionResult(resultTemplate);

  let executionDeferred = false;
  try {
    requestPrediction(request);
  } catch (error) {
    executionDeferred = error instanceof ExecutivePredictionExecutionDeferredError;
  }

  const rejected = requestPrediction({ ...request, workspaceId: "" });
  const priorEventEngine = runExecutiveEventEngineCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_PREDICTION_AUTHORITY_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-7-5-executive-prediction-authority-report.md");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Authority exists", Boolean(EXECUTIVE_PREDICTION_AUTHORITY_VERSION), EXECUTIVE_PREDICTION_AUTHORITY_VERSION),
    check("B", "Request contract exists", validation.valid && normalized.id === request.id, normalized.id),
    check("C", "Result contract exists", resultTemplate.metadata.contractOnly === true, resultTemplate.predictionId),
    check("D", "Publisher contract exists", ExecutivePredictionPublisherContractDeclaration.mayGeneratePrediction === false, EXECUTIVE_PREDICTION_PUBLISHER_RULES.mayCreateRequest ? "Publisher rules." : ""),
    check("E", "Consumer contract exists", ExecutivePredictionConsumerContractDeclaration.mayMutateResult === false, EXECUTIVE_PREDICTION_CONSUMER_RULES.readOnly ? "Consumer rules." : ""),
    check("F", "Immutable request verified", Object.isFrozen(normalized) && Object.isFrozen(normalized.metadata), "Frozen request."),
    check("G", "Immutable result verified", Object.isFrozen(resultTemplate) && Object.isFrozen(resultTemplate.assumptions), "Frozen result."),
    check("H", "Ownership rules verified", EXECUTIVE_PREDICTION_OWNERSHIP_RULES.authorityOwns.includes("prediction_identity"), EXECUTIVE_PREDICTION_AUTHORITY_OWNER),
    check("I", "Read-only dependencies verified", EXECUTIVE_PREDICTION_READONLY_DEPENDENCIES.eventEngine.mutationPermitted === false, "Read-only deps."),
    check("J", "Future integration contracts exist", EXECUTIVE_PREDICTION_FUTURE_INTEGRATIONS.recommendation.integrationImplemented === false, "Future contracts."),
    check("K", "Prediction execution deferred", executionDeferred && authorityHasNoPredictionExecution(), "Deferred to APP-1:8."),
    check("L", "No persistence", !readFileSync(join(process.cwd(), "app/lib/executive-time/executivePredictionAuthority.ts"), "utf8").includes("predictionStore"), "No persistence APIs."),
    check("M", "No Dashboard mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_PREDICTION_AUTHORITY_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard blocked."),
    check("N", "No Assistant mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
      allowedFiles: EXECUTIVE_PREDICTION_AUTHORITY_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant blocked."),
    check("O", "Tests pass assumptions", !invalid.valid && consumption.mutated === false && publisherValidation.valid, rejected.reason),
    check("P", "Report created", existsSync(reportPath), reportPath),
    check("Q", "APP-1:7 event engine still certified", priorEventEngine.certified, priorEventEngine.summary),
    check("R", "Manifest validates", manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:7.5 Executive Prediction Authority Contract",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([]),
    tags: EXECUTIVE_PREDICTION_AUTHORITY_TAGS,
    summary: certified
      ? "APP-1:7.5 Executive Prediction Authority Contract PASSED."
      : `APP-1:7.5 Executive Prediction Authority Contract FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutivePredictionAuthorityCertification = Object.freeze({
  runExecutivePredictionAuthorityCertification,
});
