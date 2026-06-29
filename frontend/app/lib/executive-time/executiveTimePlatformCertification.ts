/**
 * APP-1:8.5 — Executive Time Platform API certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { resetExecutiveConflictEngineForTests } from "./executiveConflictEngine.ts";
import { resetExecutiveEventRegistryForTests } from "./executiveEventRegistry.ts";
import { authorizeTransition } from "./executiveTimeTransitionAuthority.ts";
import { resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import {
  EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT,
  EXECUTIVE_TIME_PLATFORM_FUTURE_INTEGRATIONS,
  ExecutiveTimePlatform,
  getCapabilities,
  getPlatformVersionMetadata,
  validatePlatformConsumerAccess,
} from "./executiveTimePlatformApi.ts";
import { EXECUTIVE_TIME_PLATFORM_VERSION } from "./executiveTimePlatformApiTypes.ts";
import { ExecutiveTimePlatformResolver } from "./executiveTimePlatformResolver.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import { runExecutivePredictionCertification } from "./executivePredictionCertification.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_PLATFORM_TAGS = Object.freeze([
  "[APP1_8_5_EXECUTIVE_TIME_PLATFORM]",
  "[EXECUTIVE_TIME_PLATFORM_READY]",
  "[SINGLE_PUBLIC_API]",
  "[ENGINE_ISOLATION_ENFORCED]",
  "[PLATFORM_FACADE_READY]",
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
  "frontend/app/lib/executive-time/executivePredictionEngineTypes.ts",
  "frontend/app/lib/executive-time/executivePredictionEngine.ts",
  "frontend/app/lib/executive-time/executivePredictionResolver.ts",
  "frontend/app/lib/executive-time/executiveConflictEngine.ts",
  "frontend/app/lib/executive-time/executiveConflictResolver.ts",
  "frontend/app/lib/executive-time/executivePredictionExplanation.ts",
  "frontend/app/lib/executive-time/executivePredictionCertification.ts",
  "frontend/app/lib/executive-time/executivePredictionCertification.test.ts",
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
  "docs/app-1-8-executive-prediction-conflict-engine-report.md",
] as const);

export const EXECUTIVE_TIME_PLATFORM_MANIFEST = Object.freeze({
  stageId: "APP-1/8.5",
  title: "Executive Time Platform API",
  goal: "Single public API facade for the entire Executive Time platform.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PRIOR_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executiveTimePlatformApiTypes.ts",
    "frontend/app/lib/executive-time/executiveTimePlatformResolver.ts",
    "frontend/app/lib/executive-time/executiveTimePlatformFacade.ts",
    "frontend/app/lib/executive-time/executiveTimePlatformApi.ts",
    "frontend/app/lib/executive-time/executiveTimePlatformCertification.ts",
    "frontend/app/lib/executive-time/executiveTimePlatformCertification.test.ts",
    "docs/app-1-8-5-executive-time-platform-api-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/8"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_TIME_PLATFORM_TAGS,
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

function facadeDoesNotExportEngines(): boolean {
  const source = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveTimePlatformFacade.ts"), "utf8");
  return (
    !source.includes("from \"./executiveTimeContextEngine") &&
    !source.includes("from \"./executiveTimeCameraEngine") &&
    !source.includes("from \"./executiveTimeStateEngine") &&
    !source.includes("from \"./executiveTimeTransitionEngine") &&
    !source.includes("from \"./executiveTimePriorityEngine") &&
    !source.includes("from \"./executiveEventEngine") &&
    !source.includes("from \"./executivePredictionEngine")
  );
}

export function runExecutiveTimePlatformCertification() {
  resetCertEnvironment();
  const workspaceId = "ws-platform-cert";
  const entityId = "decision-platform-cert-001";

  ExecutiveTimePlatform.switchContext({ workspaceId, contextId: "this_week" });
  const context = ExecutiveTimePlatform.getCurrentContext({ workspaceId });
  const cameraMove = ExecutiveTimePlatform.moveCamera({
    workspaceId,
    contextId: "this_month",
    source: "user",
    reason: "manual_selection",
  });
  const camera = ExecutiveTimePlatform.getCamera(workspaceId);
  const state = ExecutiveTimePlatform.getState({
    workspaceId,
    entityType: "decision",
    entityId,
    fallbackState: "draft",
  });
  const transition = ExecutiveTimePlatform.evaluateTransition({
    workspaceId,
    entityId,
    entityType: "decision",
    currentState: state.currentState ?? "draft",
    targetState: "active",
    actor: "executive",
    transitionReason: "Platform certification probe",
  });
  const priority = ExecutiveTimePlatform.evaluatePriority({
    workspaceId,
    entityId,
    entityType: "decision",
    currentState: state.currentState ?? "draft",
    actor: "executive",
    reason: "Platform certification probe",
  });
  const event = ExecutiveTimePlatform.createExecutiveEvent(
    Object.freeze({
      eventType: "manual",
      category: "temporal",
      sourceModule: "executive-time-platform",
      sourceComponent: "runExecutiveTimePlatformCertification",
      entityType: "decision",
      entityId,
      workspaceId,
      timestamp: nowIso(),
      actor: "executive",
      reason: "Platform event probe",
    })
  );
  const resolvedEvent = event.event ? ExecutiveTimePlatform.resolveEvent(event.event.id) : null;
  const prediction = ExecutiveTimePlatform.generatePrediction(
    Object.freeze({
      id: "pred-platform-cert-001",
      predictionType: "conflict_detection",
      entityType: "decision",
      entityId,
      workspaceId,
      requestedBy: "executive",
      predictionContext: "Platform prediction probe",
      predictionScope: "entity",
      currentTimeContext: "this_month",
      currentCameraContext: camera?.currentContext ?? "this_month",
      metadata: Object.freeze({ source: "platform-cert" }),
    })
  );
  const conflict = ExecutiveTimePlatform.detectConflict(
    Object.freeze({
      id: "pred-platform-cert-002",
      predictionType: "conflict_detection",
      entityType: "decision",
      entityId,
      workspaceId,
      requestedBy: "executive",
      predictionContext: "Platform conflict probe",
      predictionScope: "entity",
      currentTimeContext: "this_month",
      currentCameraContext: camera?.currentContext ?? "this_month",
      metadata: Object.freeze({}),
    })
  );
  const capabilities = getCapabilities();
  const versionMetadata = getPlatformVersionMetadata();
  const bypassCheck = validatePlatformConsumerAccess({
    importPath: "frontend/app/lib/executive-time/executiveTimeContextEngine.ts",
  });
  const allowedCheck = validatePlatformConsumerAccess({
    importPath: "frontend/app/lib/executive-time/executiveTimePlatformApi.ts",
  });

  const authority = authorizeTransition({
    workspaceId,
    entityId: "scenario-platform-cert-001",
    entityType: "scenario",
    currentState: "draft",
    requestedState: "active",
    actor: "executive",
    transitionReason: "Platform mutation probe",
    requiresApproval: false,
    approvalGranted: true,
    metadata: Object.freeze({}),
  });
  const mutation = ExecutiveTimePlatform.applyApprovedTransition({
    authorityResult: authority,
    actor: "executive",
    timestamp: nowIso(),
  });

  const priorPrediction = runExecutivePredictionCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_TIME_PLATFORM_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-8-5-executive-time-platform-api-report.md");
  const apiSource = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveTimePlatformApi.ts"), "utf8");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Platform API exists", Boolean(EXECUTIVE_TIME_PLATFORM_VERSION), EXECUTIVE_TIME_PLATFORM_VERSION),
    check("B", "Facade exists", typeof ExecutiveTimePlatform.getCurrentContext === "function", "ExecutiveTimePlatform"),
    check("C", "Resolver exists", typeof ExecutiveTimePlatformResolver.routeGetCurrentContext === "function", "Resolver routes."),
    check("D", "Platform routes Context", context.id === "this_week", context.id),
    check("E", "Platform routes Camera", cameraMove.success && Boolean(camera?.currentContext), camera?.currentContext ?? ""),
    check("F", "Platform routes State", state.readOnly === true && mutation.success, mutation.currentState ?? state.currentState ?? ""),
    check("G", "Platform routes Transition", typeof transition.valid === "boolean", transition.explanation.slice(0, 40)),
    check("H", "Platform routes Priority", priority.priority.length > 0, priority.priority),
    check("I", "Platform routes Events", event.success && resolvedEvent?.id === event.event?.id, event.event?.id ?? ""),
    check("J", "Platform routes Prediction", prediction.success && Boolean(prediction.prediction), prediction.reason),
    check("K", "Capability discovery works", capabilities.length === 7, String(capabilities.length)),
    check("L", "Version metadata exists", versionMetadata.platformVersion === "APP-1/8.5", versionMetadata.compatibilityVersion),
    check("M", "Engine isolation verified", facadeDoesNotExportEngines(), "Facade uses resolver only."),
    check("N", "Consumers cannot bypass platform contract", bypassCheck.bypassDetected && allowedCheck.valid, bypassCheck.reason),
    check("O", "Future contracts exist", EXECUTIVE_TIME_PLATFORM_FUTURE_INTEGRATIONS.dashboard.mustUsePlatformApi === true, "Future contracts."),
    check("P", "No Dashboard mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PLATFORM_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard blocked."),
    check("Q", "No Assistant mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PLATFORM_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant blocked."),
    check("R", "No Timeline mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/main-right-panel/timeline/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PLATFORM_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Timeline blocked."),
    check("S", "Tests pass assumptions", EXECUTIVE_TIME_PLATFORM_CONSUMER_CONTRACT.directEngineAccessPermitted === false && apiSource.includes("ExecutiveTimePlatform"), "Consumer contract."),
    check("T", "Report created", existsSync(reportPath), reportPath),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:8.5 Executive Time Platform API",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze(conflict ? [] : ["No conflict detected during certification probe."]),
    tags: EXECUTIVE_TIME_PLATFORM_TAGS,
    summary: certified
      ? "APP-1:8.5 Executive Time Platform API PASSED."
      : `APP-1:8.5 Executive Time Platform API FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutiveTimePlatformCertification = Object.freeze({
  runExecutiveTimePlatformCertification,
});
