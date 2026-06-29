/**
 * APP-1:9 — Executive Time Integration certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { resetExecutiveConflictEngineForTests } from "./executiveConflictEngine.ts";
import { resetExecutiveEventRegistryForTests } from "./executiveEventRegistry.ts";
import { resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import {
  EXECUTIVE_TIME_INTEGRATION_VERSION,
  getConsumer,
  listConsumerIds,
  listConsumers,
  resetExecutiveTimeConsumerRegistryForTests,
} from "./executiveTimeConsumerRegistry.ts";
import {
  EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS,
  getConsumerCapabilities,
  getPlatformCapabilities,
} from "./executiveTimeIntegration.ts";
import {
  EXECUTIVE_TIME_PLATFORM_PUBLIC_OPERATIONS,
  rejectDirectEngineAccess,
  resolveCompatibility,
  resolveConsumerRequest,
  resolvePlatformService,
  resolveSupportedFeatures,
  validateApiAccess,
  validateConsumer,
  validateConsumerCapabilities,
  validatePlatformCompatibility,
} from "./executiveTimeIntegrationResolver.ts";
import { ExecutiveTimePlatformGateway } from "./executiveTimePlatformGateway.ts";
import { runExecutiveTimePlatformCertification } from "./executiveTimePlatformCertification.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_INTEGRATION_TAGS = Object.freeze([
  "[APP1_9_EXECUTIVE_TIME_INTEGRATION]",
  "[EXECUTIVE_TIME_PLATFORM_INTEGRATED]",
  "[SINGLE_PUBLIC_PLATFORM]",
  "[ENGINE_ENCAPSULATION_VERIFIED]",
  "[CONSUMER_REGISTRY_READY]",
  "[PLATFORM_GATEWAY_READY]",
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
  "frontend/app/lib/executive-time/executiveTimePlatformApiTypes.ts",
  "frontend/app/lib/executive-time/executiveTimePlatformResolver.ts",
  "frontend/app/lib/executive-time/executiveTimePlatformFacade.ts",
  "frontend/app/lib/executive-time/executiveTimePlatformApi.ts",
  "frontend/app/lib/executive-time/executiveTimePlatformCertification.ts",
  "frontend/app/lib/executive-time/executiveTimePlatformCertification.test.ts",
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
  "docs/app-1-8-5-executive-time-platform-api-report.md",
] as const);

export const EXECUTIVE_TIME_INTEGRATION_MANIFEST = Object.freeze({
  stageId: "APP-1/9",
  title: "Executive Time Integration",
  goal: "Integrate Executive Time platform through a single public gateway for all consumers.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PRIOR_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executiveTimeConsumerRegistry.ts",
    "frontend/app/lib/executive-time/executiveTimeIntegrationResolver.ts",
    "frontend/app/lib/executive-time/executiveTimePlatformGateway.ts",
    "frontend/app/lib/executive-time/executiveTimeIntegration.ts",
    "frontend/app/lib/executive-time/executiveTimeIntegrationCertification.ts",
    "frontend/app/lib/executive-time/executiveTimeIntegrationCertification.test.ts",
    "docs/app-1-9-executive-time-integration-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/8.5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_TIME_INTEGRATION_TAGS,
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
  resetExecutiveTimeConsumerRegistryForTests();
}

function validateConsumerContract(consumerId: Parameters<typeof getConsumer>[0]): boolean {
  const consumer = getConsumer(consumerId);
  const binding = EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS[
    consumerId === "executive_memory"
      ? "executiveMemory"
      : (consumerId as keyof typeof EXECUTIVE_TIME_INTEGRATION_FUTURE_BINDINGS)
  ];
  return Boolean(consumer && binding?.mustUsePlatformGateway === true && binding.runtimeBehaviorChanged === false);
}

function gatewayDoesNotImportEngines(): boolean {
  const source = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveTimePlatformGateway.ts"), "utf8");
  return (
    !source.includes("executiveTimeContextEngine") &&
    !source.includes("executiveTimeCameraEngine") &&
    !source.includes("executiveTimeStateEngine") &&
    !source.includes("executiveTimeTransitionEngine") &&
    !source.includes("executiveTimePriorityEngine") &&
    !source.includes("executiveEventEngine") &&
    !source.includes("executivePredictionEngine") &&
    source.includes("ExecutiveTimePlatform")
  );
}

export function runExecutiveTimeIntegrationCertification() {
  resetCertEnvironment();
  const workspaceId = "ws-integration-cert";
  const gatewayContext = Object.freeze({ consumerId: "app" as const });

  ExecutiveTimePlatformGateway.switchContext(gatewayContext, { workspaceId, contextId: "this_week" });
  const context = ExecutiveTimePlatformGateway.getCurrentContext(gatewayContext, { workspaceId });
  const camera = ExecutiveTimePlatformGateway.getCamera(gatewayContext, workspaceId);
  const state = ExecutiveTimePlatformGateway.getState(gatewayContext, {
    workspaceId,
    entityType: "decision",
    entityId: "decision-integration-cert",
    fallbackState: "draft",
  });
  const transition = ExecutiveTimePlatformGateway.evaluateTransition(gatewayContext, {
    workspaceId,
    entityId: "decision-integration-cert",
    entityType: "decision",
    currentState: state.data?.currentState ?? "draft",
    targetState: "active",
    actor: "executive",
    transitionReason: "Integration certification probe",
  });
  const priority = ExecutiveTimePlatformGateway.evaluatePriority(gatewayContext, {
    workspaceId,
    entityId: "decision-integration-cert",
    entityType: "decision",
    currentState: state.data?.currentState ?? "draft",
    actor: "executive",
    reason: "Integration certification probe",
  });
  const event = ExecutiveTimePlatformGateway.createExecutiveEvent(
    gatewayContext,
    Object.freeze({
      eventType: "manual",
      category: "temporal",
      sourceModule: "executive-time-integration",
      sourceComponent: "runExecutiveTimeIntegrationCertification",
      entityType: "decision",
      entityId: "decision-integration-cert",
      workspaceId,
      timestamp: nowIso(),
      actor: "executive",
      reason: "Integration event probe",
    })
  );
  const prediction = ExecutiveTimePlatformGateway.generatePrediction(
    gatewayContext,
    Object.freeze({
      id: "pred-integration-cert-001",
      predictionType: "conflict_detection",
      entityType: "decision",
      entityId: "decision-integration-cert",
      workspaceId,
      requestedBy: "executive",
      predictionContext: "Integration prediction probe",
      predictionScope: "entity",
      currentTimeContext: "this_week",
      currentCameraContext: camera.data?.currentContext ?? "this_week",
      metadata: Object.freeze({}),
    })
  );

  const consumerValidation = validateConsumer({ consumerId: "dashboard" });
  const capabilityValidation = validateConsumerCapabilities({
    consumerId: "dashboard",
    requiredCapabilities: Object.freeze(["context"]),
  });
  const compatibility = validatePlatformCompatibility({
    consumerId: "dashboard",
    consumerVersion: getConsumer("dashboard")!.version,
  });
  const compatibilityResolved = resolveCompatibility("dashboard");
  const unsupportedAccess = validateApiAccess({
    consumerId: "dashboard",
    operation: "generatePrediction",
  });
  const directEngine = rejectDirectEngineAccess(
    "frontend/app/lib/executive-time/executiveTimeContextEngine.ts"
  );
  const requestResolution = resolveConsumerRequest({
    consumerId: "timeline",
    operation: "resolveEvent",
  });
  const platformService = resolvePlatformService("assistant");
  const features = resolveSupportedFeatures("scenario");
  const platformCapabilities = getPlatformCapabilities();
  const consumerCapabilities = getConsumerCapabilities("recommendation");
  const priorPlatform = runExecutiveTimePlatformCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_TIME_INTEGRATION_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-9-executive-time-integration-report.md");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Platform Gateway exists", typeof ExecutiveTimePlatformGateway.getCurrentContext === "function", "Gateway ready."),
    check("B", "Consumer Registry exists", listConsumers().length >= 11, String(listConsumers().length)),
    check("C", "Integration Resolver exists", typeof resolveConsumerRequest === "function", "Resolver ready."),
    check("D", "Dashboard contract validated", validateConsumerContract("dashboard"), "dashboard"),
    check("E", "Assistant contract validated", validateConsumerContract("assistant"), "assistant"),
    check("F", "Timeline contract validated", validateConsumerContract("timeline"), "timeline"),
    check("G", "Executive Memory contract validated", validateConsumerContract("executive_memory"), "executive_memory"),
    check("H", "Recommendation contract validated", validateConsumerContract("recommendation"), "recommendation"),
    check("I", "Scenario contract validated", validateConsumerContract("scenario"), "scenario"),
    check("J", "DS contract validated", validateConsumerContract("ds"), "ds"),
    check("K", "INT contract validated", validateConsumerContract("int"), "int"),
    check("L", "APP contract validated", validateConsumerContract("app"), "app"),
    check("M", "LAY contract validated", validateConsumerContract("lay"), "lay"),
    check("N", "Audit contract validated", validateConsumerContract("audit"), "audit"),
    check("O", "Consumer validation works", consumerValidation.valid && capabilityValidation.valid, consumerValidation.reason),
    check("P", "Capability discovery works", platformCapabilities.length === 7 && consumerCapabilities.includes("prediction"), String(features.length)),
    check("Q", "Version compatibility works", compatibility.compatible && compatibilityResolved.compatibilityStatus === "compatible", compatibilityResolved.platformVersion),
    check("R", "Engine encapsulation enforced", gatewayDoesNotImportEngines(), "Gateway uses platform only."),
    check("S", "Direct engine access rejected", directEngine.directEngineAccessRejected && !unsupportedAccess.permitted, directEngine.reason),
    check("T", "Public API verified", EXECUTIVE_TIME_PLATFORM_PUBLIC_OPERATIONS.length === 12 && context.success, context.data?.id ?? ""),
    check("U", "No UI mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_INTEGRATION_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "UI blocked."),
    check("V", "Tests pass assumptions", prediction.success && event.success && transition.success && platformService.available, priorPlatform.summary),
    check("W", "Report created", existsSync(reportPath), reportPath),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:9 Executive Time Integration",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze(
      listConsumerIds().includes("custom") ? [] : ["Custom consumer is registered on demand only."]
    ),
    tags: EXECUTIVE_TIME_INTEGRATION_TAGS,
    summary: certified
      ? "APP-1:9 Executive Time Integration PASSED."
      : `APP-1:9 Executive Time Integration FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
    integrationVersion: EXECUTIVE_TIME_INTEGRATION_VERSION,
  });
}

export const ExecutiveTimeIntegrationCertification = Object.freeze({
  runExecutiveTimeIntegrationCertification,
});
