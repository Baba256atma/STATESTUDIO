/**
 * APP-1:6.5 — Executive Event Authority certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import {
  buildExecutiveEventContract,
  EXECUTIVE_EVENT_FUTURE_MODULE_CONTRACTS,
  EXECUTIVE_EVENT_OWNERSHIP_RULES,
  EXECUTIVE_EVENT_PUBLISHER_RULES,
  EXECUTIVE_EVENT_READONLY_DEPENDENCIES,
  publishExecutiveEvent,
  validateExecutiveEventRequest,
} from "./executiveEventAuthority.ts";
import {
  EXECUTIVE_EVENT_AUTHORITY_OWNER,
  EXECUTIVE_EVENT_AUTHORITY_VERSION,
  ExecutiveEventProcessingDeferredError,
} from "./executiveEventAuthorityTypes.ts";
import type { ExecutiveEventAuthorityCertificationResult } from "./executiveEventAuthorityTypes.ts";
import {
  ExecutiveEventConsumerContractDeclaration,
  EXECUTIVE_EVENT_CONSUMER_RULES,
  receiveExecutiveEvent,
} from "./executiveEventConsumerContract.ts";
import {
  ExecutiveEventPublisherContractDeclaration,
  validateExecutiveEventPublisherRequest,
} from "./executiveEventPublisherContract.ts";
import { runExecutiveTimePriorityCertification } from "./executiveTimePriorityCertification.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_EVENT_AUTHORITY_TAGS = Object.freeze([
  "[APP1_6_5_EXECUTIVE_EVENT_AUTHORITY]",
  "[CANONICAL_EVENT_MODEL_READY]",
  "[SINGLE_EVENT_AUTHORITY]",
  "[PUBLISHER_CONTRACT_READY]",
  "[CONSUMER_CONTRACT_READY]",
  "[NO_RUNTIME_EVENT_PROCESSING]",
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
  "docs/app-1-1-executive-time-foundation-report.md",
  "docs/app-1-2-time-context-engine-report.md",
  "docs/app-1-3-time-camera-engine-report.md",
  "docs/app-1-4-time-state-engine-report.md",
  "docs/app-1-4-5-transition-authority-contract-report.md",
  "docs/app-1-5-time-transition-engine-report.md",
  "docs/app-1-5-5-priority-authority-contract-report.md",
  "docs/app-1-6-time-priority-engine-report.md",
] as const);

export const EXECUTIVE_EVENT_AUTHORITY_MANIFEST = Object.freeze({
  stageId: "APP-1/6.5",
  title: "Executive Event Authority Contract",
  goal: "Single canonical temporal event system for the Nexora platform.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PRIOR_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executiveEventAuthorityTypes.ts",
    "frontend/app/lib/executive-time/executiveEventAuthority.ts",
    "frontend/app/lib/executive-time/executiveEventPublisherContract.ts",
    "frontend/app/lib/executive-time/executiveEventConsumerContract.ts",
    "frontend/app/lib/executive-time/executiveEventAuthorityCertification.ts",
    "frontend/app/lib/executive-time/executiveEventAuthorityCertification.test.ts",
    "docs/app-1-6-5-executive-event-authority-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/6"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_EVENT_AUTHORITY_TAGS,
});

const REPO_ROOT = join(process.cwd(), "..");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function authorityHasNoRuntimeProcessing(): boolean {
  const authoritySource = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveEventAuthority.ts"), "utf8");
  const publisherSource = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveEventPublisherContract.ts"), "utf8");
  const consumerSource = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveEventConsumerContract.ts"), "utf8");
  const sources = [authoritySource, publisherSource, consumerSource];
  return (
    authoritySource.includes("ExecutiveEventProcessingDeferredError") &&
    sources.every(
      (source) =>
        !source.includes("eventStore") &&
        !source.includes("localStorage") &&
        !source.includes("subscribe(") &&
        !source.includes("replayEvent") &&
        !source.includes("messageQueue")
    )
  );
}

export function runExecutiveEventAuthorityCertification(): ExecutiveEventAuthorityCertificationResult {
  const request = Object.freeze({
    eventType: "transition" as const,
    category: "scenario" as const,
    sourceModule: "executive-time-transition-engine",
    sourceComponent: "orchestrateTransition",
    entityType: "scenario" as const,
    entityId: "scenario-001",
    workspaceId: "ws-event-auth-cert",
    timestamp: nowIso(),
    actor: "executive",
    reason: "Certification probe",
  });

  const validation = validateExecutiveEventRequest(request);
  const invalid = validateExecutiveEventRequest({ ...request, workspaceId: "" });
  const publisherValidation = validateExecutiveEventPublisherRequest(request);
  const event = buildExecutiveEventContract({
    id: "evt-contract-001",
    eventType: "transition",
    category: "scenario",
    sourceModule: "executive-time-transition-engine",
    sourceComponent: "orchestrateTransition",
    entityType: "scenario",
    entityId: "scenario-001",
    workspaceId: "ws-event-auth-cert",
    timestamp: nowIso(),
    timeContext: "this_quarter",
    cameraContext: "this_quarter",
    stateSnapshot: Object.freeze({
      entityType: "scenario",
      entityId: "scenario-001",
      currentState: "draft",
      readOnly: true,
    }),
    prioritySnapshot: Object.freeze({
      priority: "normal",
      confidence: 0.75,
      escalationLevel: "Standard Queue",
      readOnly: true,
    }),
  });
  const consumption = receiveExecutiveEvent(event);

  let processingDeferred = false;
  try {
    publishExecutiveEvent(request);
  } catch (error) {
    processingDeferred = error instanceof ExecutiveEventProcessingDeferredError;
  }

  const rejected = publishExecutiveEvent({ ...request, entityId: "" });
  const priorPriority = runExecutiveTimePriorityCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_EVENT_AUTHORITY_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-6-5-executive-event-authority-report.md");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Canonical event exists", event.id === "evt-contract-001" && event.metadata.contractOnly === true, event.id),
    check("B", "Publisher contract exists", ExecutiveEventPublisherContractDeclaration.mayStoreEvent === false, EXECUTIVE_EVENT_PUBLISHER_RULES.mayCreateRequest ? "Publisher rules." : ""),
    check("C", "Consumer contract exists", ExecutiveEventConsumerContractDeclaration.mayMutateEvent === false, EXECUTIVE_EVENT_CONSUMER_RULES.readOnly ? "Consumer rules." : ""),
    check("D", "Immutable event verified", Object.isFrozen(event) && Object.isFrozen(event.stateSnapshot), "Frozen event."),
    check("E", "Ownership rules verified", EXECUTIVE_EVENT_OWNERSHIP_RULES.authorityOwns.includes("event_identity"), EXECUTIVE_EVENT_AUTHORITY_OWNER),
    check("F", "Read-only dependencies verified", EXECUTIVE_EVENT_READONLY_DEPENDENCIES.priority.mutationPermitted === false, "Read-only deps."),
    check("G", "Future module contracts exist", EXECUTIVE_EVENT_FUTURE_MODULE_CONTRACTS.timeline.integrationImplemented === false, "Future contracts."),
    check("H", "No runtime processing", processingDeferred && authorityHasNoRuntimeProcessing(), "Deferred to APP-1:7."),
    check("I", "No persistence", !readFileSync(join(process.cwd(), "app/lib/executive-time/executiveEventAuthority.ts"), "utf8").includes("eventStore") && !readFileSync(join(process.cwd(), "app/lib/executive-time/executiveEventAuthority.ts"), "utf8").includes("localStorage"), "No persistence APIs."),
    check("J", "No UI mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_EVENT_AUTHORITY_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "UI blocked."),
    check("K", "Tests pass assumptions", validation.valid && !invalid.valid && consumption.mutated === false, publisherValidation.valid ? "Valid publisher request." : ""),
    check("L", "Report created", existsSync(reportPath), reportPath),
    check("M", "Authority version present", EXECUTIVE_EVENT_AUTHORITY_VERSION === "APP-1/6.5", EXECUTIVE_EVENT_AUTHORITY_VERSION),
    check("N", "Rejected publish returns no event", rejected.rejected && rejected.event === null, rejected.reason),
    check("O", "APP-1:6 priority still certified", priorPriority.certified, priorPriority.summary),
    check("P", "Manifest validates", manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:6.5 Executive Event Authority Contract",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([]),
    tags: EXECUTIVE_EVENT_AUTHORITY_TAGS,
    summary: certified
      ? "APP-1:6.5 Executive Event Authority Contract PASSED."
      : `APP-1:6.5 Executive Event Authority Contract FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutiveEventAuthorityCertification = Object.freeze({
  runExecutiveEventAuthorityCertification,
});
