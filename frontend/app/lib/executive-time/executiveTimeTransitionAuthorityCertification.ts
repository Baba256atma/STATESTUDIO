/**
 * APP-1:4.5 — Executive Time Transition Authority certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { runExecutiveTimeStateCertification } from "./executiveTimeStateCertification.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import {
  applyApprovedTransition,
  ExecutiveTimeStateMutationContract,
  resetExecutiveTimeEntityStateStoreForTests,
} from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import {
  authorizeTransition,
  EXECUTIVE_TIME_TRANSITION_FUTURE_INTEGRATIONS,
  EXECUTIVE_TIME_TRANSITION_OWNERSHIP_RULES,
  explainDecision,
  rejectTransition,
  requestTransition,
  validateTransition,
} from "./executiveTimeTransitionAuthority.ts";
import {
  EXECUTIVE_TIME_STATE_MUTATION_OWNER,
  EXECUTIVE_TIME_TRANSITION_AUTHORITY_VERSION,
} from "./executiveTimeTransitionAuthorityTypes.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeTransitionAuthorityCertificationResult } from "./executiveTimeTransitionAuthorityTypes.ts";

export const EXECUTIVE_TIME_TRANSITION_AUTHORITY_TAGS = Object.freeze([
  "[APP1_4_5_TRANSITION_AUTHORITY]",
  "[STATE_ENGINE_SINGLE_MUTATION_AUTHORITY]",
  "[TRANSITION_ENGINE_VALIDATION_ONLY]",
  "[NO_DIRECT_STATE_MUTATION]",
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
  "docs/app-1-1-executive-time-foundation-report.md",
  "docs/app-1-2-time-context-engine-report.md",
  "docs/app-1-3-time-camera-engine-report.md",
  "docs/app-1-4-time-state-engine-report.md",
] as const);

export const EXECUTIVE_TIME_TRANSITION_AUTHORITY_MANIFEST = Object.freeze({
  stageId: "APP-1/4.5",
  title: "Executive Time Transition Authority Contract",
  goal: "Strict separation between transition authorization and state mutation.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PRIOR_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executiveTimeTransitionAuthorityTypes.ts",
    "frontend/app/lib/executive-time/executiveTimeTransitionAuthority.ts",
    "frontend/app/lib/executive-time/executiveTimeTransitionAuthorityCertification.ts",
    "frontend/app/lib/executive-time/executiveTimeTransitionAuthorityCertification.test.ts",
    "docs/app-1-4-5-transition-authority-contract-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/4"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_TIME_TRANSITION_AUTHORITY_TAGS,
});

const REPO_ROOT = join(process.cwd(), "..");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function transitionAuthorityHasNoMutation(): boolean {
  const source = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveTimeTransitionAuthority.ts"), "utf8");
  return (
    !source.includes("applyApprovedTransition") &&
    !source.includes("entityStateStore.set") &&
    !source.includes("entityStateStore") &&
    source.includes("validateTransition") &&
    source.includes("authorizeTransition")
  );
}

export function runExecutiveTimeTransitionAuthorityCertification(): ExecutiveTimeTransitionAuthorityCertificationResult {
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();

  const request = Object.freeze({
    workspaceId: "ws-auth-cert",
    entityId: "entity-001",
    entityType: "scenario" as const,
    currentState: "draft",
    requestedState: "planned",
    actor: "executive",
    transitionReason: "Planning",
  });

  const validated = validateTransition(request);
  const authorized = authorizeTransition(request);
  const rejected = rejectTransition(request, "Explicit rejection probe.");
  const requested = requestTransition(request);
  const explanation = explainDecision(authorized);
  const mutation = applyApprovedTransition({
    authorityResult: authorized,
    actor: "executive",
    timestamp: nowIso(),
  });
  const blockedMutation = applyApprovedTransition({
    authorityResult: rejected,
    actor: "executive",
    timestamp: nowIso(),
  });

  const statePhase = runExecutiveTimeStateCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_TIME_TRANSITION_AUTHORITY_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-4-5-transition-authority-contract-report.md");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Authority contract exists", Boolean(EXECUTIVE_TIME_TRANSITION_AUTHORITY_VERSION), EXECUTIVE_TIME_TRANSITION_AUTHORITY_VERSION),
    check("B", "State mutation interface exists", ExecutiveTimeStateMutationContract.mutationOwner === EXECUTIVE_TIME_STATE_MUTATION_OWNER, EXECUTIVE_TIME_STATE_MUTATION_OWNER),
    check("C", "Transition result type exists", authorized.approved === true && rejected.rejected === true, "Approved/rejected results."),
    check("D", "Transition engine cannot mutate state", transitionAuthorityHasNoMutation(), "Authority module is validation-only."),
    check("E", "State engine remains mutation owner", mutation.mutationOwner === EXECUTIVE_TIME_STATE_MUTATION_OWNER && mutation.success, mutation.currentState),
    check("F", "Validation APIs exist", validated.approved && validateTransition({ ...request, currentState: "archived", requestedState: "active" }).rejected, "Validation probes."),
    check("G", "Authorization APIs exist", requested.approved && authorized.approved, "Authorization probes."),
    check("H", "Immutable transition result", Object.isFrozen(authorized) && Object.isFrozen(authorized.validationMessages), "Frozen authority result."),
    check("I", "Future integration contracts exist", EXECUTIVE_TIME_TRANSITION_FUTURE_INTEGRATIONS.scenario.validationOnly === true, "Future contracts defined."),
    check("J", "No UI mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_TRANSITION_AUTHORITY_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "UI blocked."),
    check("K", "Tests pass assumptions", blockedMutation.success === false && explanation.ownership.transitionEngine === "validation-and-authorization-only", "Mutation blocked without approval."),
    check("L", "Report created", existsSync(reportPath), reportPath),
    check("M", "Ownership rules documented", EXECUTIVE_TIME_TRANSITION_OWNERSHIP_RULES.stateEngineOwns.includes("state_mutation"), "Ownership separation documented."),
    check("N", "APP-1:4 state engine still certified", statePhase.certified, statePhase.summary),
    check("O", "Manifest validates", manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:4.5 Executive Time Transition Authority Contract",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([]),
    tags: EXECUTIVE_TIME_TRANSITION_AUTHORITY_TAGS,
    summary: certified
      ? "APP-1:4.5 Executive Time Transition Authority Contract PASSED."
      : `APP-1:4.5 Executive Time Transition Authority Contract FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutiveTimeTransitionAuthorityCertification = Object.freeze({
  runExecutiveTimeTransitionAuthorityCertification,
});
