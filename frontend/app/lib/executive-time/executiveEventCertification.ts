/**
 * APP-1:7 — Executive Event Engine certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { moveToContext, resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import { classifyExecutiveEvent, listExecutiveEventClassifications } from "./executiveEventClassification.ts";
import {
  createExecutiveEvent,
  EXECUTIVE_EVENT_ENGINE_FUTURE_INTEGRATIONS,
  EXECUTIVE_EVENT_ENGINE_VERSION,
} from "./executiveEventEngine.ts";
import { EXECUTIVE_EVENT_ENGINE_OWNER } from "./executiveEventEngineTypes.ts";
import { EXECUTIVE_EVENT_LIFECYCLE_STEPS } from "./executiveEventLifecycle.ts";
import {
  getEvent,
  listEventsByWorkspace,
  resetExecutiveEventRegistryForTests,
} from "./executiveEventRegistry.ts";
import {
  resolveEntityHistory,
  resolveLatestEvent,
  resolveWorkspaceHistory,
} from "./executiveEventResolver.ts";
import { runExecutiveEventAuthorityCertification } from "./executiveEventAuthorityCertification.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_EVENT_ENGINE_TAGS = Object.freeze([
  "[APP1_7_EXECUTIVE_EVENT_ENGINE]",
  "[EXECUTIVE_EVENT_ENGINE_READY]",
  "[CANONICAL_EVENT_REGISTRY_READY]",
  "[IMMUTABLE_EVENT_READY]",
  "[EVENT_CLASSIFICATION_READY]",
  "[EVENT_LIFECYCLE_READY]",
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
  "docs/app-1-1-executive-time-foundation-report.md",
  "docs/app-1-2-time-context-engine-report.md",
  "docs/app-1-3-time-camera-engine-report.md",
  "docs/app-1-4-time-state-engine-report.md",
  "docs/app-1-4-5-transition-authority-contract-report.md",
  "docs/app-1-5-time-transition-engine-report.md",
  "docs/app-1-5-5-priority-authority-contract-report.md",
  "docs/app-1-6-time-priority-engine-report.md",
  "docs/app-1-6-5-executive-event-authority-report.md",
] as const);

export const EXECUTIVE_EVENT_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-1/7",
  title: "Executive Time Event Engine",
  goal: "Single canonical temporal event creation pipeline for Nexora.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PRIOR_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executiveEventEngineTypes.ts",
    "frontend/app/lib/executive-time/executiveEventLifecycle.ts",
    "frontend/app/lib/executive-time/executiveEventClassification.ts",
    "frontend/app/lib/executive-time/executiveEventRegistry.ts",
    "frontend/app/lib/executive-time/executiveEventResolver.ts",
    "frontend/app/lib/executive-time/executiveEventEngine.ts",
    "frontend/app/lib/executive-time/executiveEventCertification.ts",
    "frontend/app/lib/executive-time/executiveEventCertification.test.ts",
    "docs/app-1-7-executive-event-engine-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/6.5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_EVENT_ENGINE_TAGS,
});

const REPO_ROOT = join(process.cwd(), "..");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function engineHasNoForbiddenRuntime(): boolean {
  const modules = [
    "app/lib/executive-time/executiveEventEngine.ts",
    "app/lib/executive-time/executiveEventRegistry.ts",
    "app/lib/executive-time/executiveEventResolver.ts",
  ].map((path) => readFileSync(join(process.cwd(), path), "utf8"));
  return modules.every(
    (source) =>
      !source.includes("subscribe(") &&
      !source.includes("replayEvent") &&
      !source.includes("messageQueue") &&
      !source.includes("localStorage")
  );
}

export function runExecutiveEventEngineCertification() {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();
  resetExecutiveEventRegistryForTests();

  const workspaceId = "ws-event-engine-cert";
  moveToContext({ workspaceId, contextId: "this_quarter", source: "user", reason: "manual_selection" });

  const request = Object.freeze({
    eventType: "transition" as const,
    category: "scenario" as const,
    sourceModule: "executive-time-transition-engine",
    sourceComponent: "orchestrateTransition",
    entityType: "scenario" as const,
    entityId: "scenario-cert-001",
    workspaceId,
    timestamp: nowIso(),
    actor: "executive",
    reason: "Certification event probe",
  });

  const created = createExecutiveEvent(request);
  const second = createExecutiveEvent({
    ...request,
    entityId: "scenario-cert-002",
    eventType: "state_change",
    timestamp: new Date(Date.now() + 1000).toISOString(),
  });
  const latest = resolveLatestEvent({ workspaceId });
  const entityHistory = resolveEntityHistory({
    workspaceId,
    entityType: "scenario",
    entityId: "scenario-cert-001",
  });
  const workspaceHistory = resolveWorkspaceHistory(workspaceId);
  const classification = classifyExecutiveEvent({
    entityType: "scenario",
    category: "scenario",
    eventType: "transition",
  });
  const priorAuthority = runExecutiveEventAuthorityCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_EVENT_ENGINE_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-7-executive-event-engine-report.md");
  const evaluationSource = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveEventEngine.ts"), "utf8");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Engine exists", Boolean(EXECUTIVE_EVENT_ENGINE_VERSION), EXECUTIVE_EVENT_ENGINE_VERSION),
    check("B", "Registry exists", created.success && getEvent(created.event!.id) !== null, created.event?.id ?? ""),
    check("C", "Resolver exists", latest !== null && workspaceHistory.length >= 2, String(workspaceHistory.length)),
    check("D", "Classification exists", listExecutiveEventClassifications().length === 13, classification.key),
    check("E", "Lifecycle exists", EXECUTIVE_EVENT_LIFECYCLE_STEPS.length === 5, "5 lifecycle states."),
    check("F", "Event creation pipeline works", created.success && created.lifecycleState === "published", created.reason),
    check("G", "Registry registration works", getEvent(created.event!.id)?.lifecycleState === "published", created.event?.lifecycleState ?? ""),
    check("H", "Entity history works", entityHistory.length === 1 && entityHistory[0]?.entityId === "scenario-cert-001", String(entityHistory.length)),
    check("I", "Workspace history works", listEventsByWorkspace(workspaceId).length >= 2, String(workspaceHistory.length)),
    check("J", "Latest event resolution works", latest?.id === second.event?.id, latest?.id ?? ""),
    check("K", "Immutable event verified", Object.isFrozen(created.event) && Object.isFrozen(created.event!.contextSnapshot), "Frozen event."),
    check("L", "Context snapshot captured", created.event?.contextSnapshot.readOnly === true, created.event?.contextSnapshot.contextId ?? ""),
    check("M", "Camera snapshot captured", created.event?.cameraSnapshot.readOnly === true, created.event?.cameraSnapshot.currentContext ?? ""),
    check("N", "State snapshot captured", created.event?.stateSnapshot.readOnly === true, created.event?.stateSnapshot.currentState ?? ""),
    check("O", "Priority snapshot captured", created.event?.prioritySnapshot.readOnly === true, created.event?.prioritySnapshot.priority ?? ""),
    check("P", "Read-only dependency validation", evaluationSource.includes("validateExecutiveEventRequest") && engineHasNoForbiddenRuntime(), EXECUTIVE_EVENT_ENGINE_OWNER),
    check("Q", "Future contracts exist", EXECUTIVE_EVENT_ENGINE_FUTURE_INTEGRATIONS.timeline.integrationImplemented === false, "Future contracts."),
    check("R", "No Dashboard mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_EVENT_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard blocked."),
    check("S", "No Assistant mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
      allowedFiles: EXECUTIVE_EVENT_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant blocked."),
    check("T", "No Timeline mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/main-right-panel/timeline/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_EVENT_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Timeline blocked."),
    check("U", "No Runtime mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
      allowedFiles: EXECUTIVE_EVENT_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Scenario runtime blocked."),
    check("V", "Tests pass assumptions", created.event?.metadata.engineOwner === EXECUTIVE_EVENT_ENGINE_OWNER, created.event?.metadata.engineVersion as string),
    check("W", "Report created", existsSync(reportPath), reportPath),
    check("X", "APP-1:6.5 authority still certified", priorAuthority.certified, priorAuthority.summary),
    check("Y", "Manifest validates", manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:7 Executive Time Event Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([]),
    tags: EXECUTIVE_EVENT_ENGINE_TAGS,
    summary: certified
      ? "APP-1:7 Executive Time Event Engine PASSED."
      : `APP-1:7 Executive Time Event Engine FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutiveEventCertification = Object.freeze({
  runExecutiveEventEngineCertification,
});
