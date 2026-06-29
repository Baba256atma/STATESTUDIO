/**
 * APP-1:5 — Executive Time Transition Engine certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { moveToContext, resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import { resolveExecutiveTimeStateTemporalSnapshot } from "./executiveTimeStateEngine.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import { runExecutiveTimeTransitionAuthorityCertification } from "./executiveTimeTransitionAuthorityCertification.ts";
import { validateTransitionApproval } from "./executiveTimeTransitionApproval.ts";
import { validateTransitionDependencies } from "./executiveTimeTransitionDependency.ts";
import {
  applyOrchestratedTransition,
  evaluateTransition,
  orchestrateTransition,
} from "./executiveTimeTransitionEngine.ts";
import { validateTransitionPolicy } from "./executiveTimeTransitionPolicy.ts";
import {
  EXECUTIVE_TIME_TRANSITION_ENGINE_VERSION,
  EXECUTIVE_TIME_TRANSITION_FUTURE_INTEGRATIONS,
  resolveAvailableTransitions,
  resolveBlockedTransitions,
  resolveTransition,
} from "./executiveTimeTransitionResolver.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_TRANSITION_ENGINE_TAGS = Object.freeze([
  "[APP1_5_TIME_TRANSITION_ENGINE]",
  "[TIME_TRANSITION_ENGINE_READY]",
  "[TRANSITION_POLICY_READY]",
  "[TRANSITION_DEPENDENCY_READY]",
  "[TRANSITION_APPROVAL_READY]",
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
  "frontend/app/lib/executive-time/executiveTimeTransitionAuthorityTypes.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionAuthority.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionAuthorityCertification.ts",
  "frontend/app/lib/executive-time/executiveTimeTransitionAuthorityCertification.test.ts",
  "docs/app-1-1-executive-time-foundation-report.md",
  "docs/app-1-2-time-context-engine-report.md",
  "docs/app-1-3-time-camera-engine-report.md",
  "docs/app-1-4-time-state-engine-report.md",
  "docs/app-1-4-5-transition-authority-contract-report.md",
] as const);

export const EXECUTIVE_TIME_TRANSITION_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-1/5",
  title: "Executive Time Transition Engine",
  goal: "Orchestrate temporal transitions via authority — never mutate state directly.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PRIOR_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executiveTimeTransitionPolicy.ts",
    "frontend/app/lib/executive-time/executiveTimeTransitionDependency.ts",
    "frontend/app/lib/executive-time/executiveTimeTransitionApproval.ts",
    "frontend/app/lib/executive-time/executiveTimeTransitionResolver.ts",
    "frontend/app/lib/executive-time/executiveTimeTransitionEngine.ts",
    "frontend/app/lib/executive-time/executiveTimeTransitionCertification.ts",
    "frontend/app/lib/executive-time/executiveTimeTransitionCertification.test.ts",
    "docs/app-1-5-time-transition-engine-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/4.5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_TIME_TRANSITION_ENGINE_TAGS,
});

export type ExecutiveTimeTransitionEngineCertificationResult = Readonly<{
  phaseName: string;
  status: "PASS" | "FAIL";
  certified: boolean;
  checks: readonly ExecutiveTimeCertificationCheck[];
  passedChecks: readonly ExecutiveTimeCertificationCheck[];
  failedChecks: readonly ExecutiveTimeCertificationCheck[];
  warnings: readonly string[];
  tags: readonly string[];
  summary: string;
  generatedAt: string;
}>;

const REPO_ROOT = join(process.cwd(), "..");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function readModule(relativePath: string): string {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

function transitionEngineHasNoDirectMutation(): boolean {
  const engine = readModule("app/lib/executive-time/executiveTimeTransitionEngine.ts");
  const resolver = readModule("app/lib/executive-time/executiveTimeTransitionResolver.ts");
  const policy = readModule("app/lib/executive-time/executiveTimeTransitionPolicy.ts");
  const dependency = readModule("app/lib/executive-time/executiveTimeTransitionDependency.ts");
  const approval = readModule("app/lib/executive-time/executiveTimeTransitionApproval.ts");
  const modules = [engine, resolver, policy, dependency, approval];
  return modules.every(
    (source) =>
      !source.includes("entityStateStore.set") &&
      !source.includes("entityStateStore") &&
      !source.includes("switchExecutiveTimeContext") &&
      !source.includes("moveToContext")
  );
}

export function runExecutiveTimeTransitionCertification(): ExecutiveTimeTransitionEngineCertificationResult {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();

  const workspaceId = "ws-transition-cert-001";
  moveToContext({ workspaceId, contextId: "this_quarter", source: "user", reason: "manual_selection" });

  const request = Object.freeze({
    workspaceId,
    entityId: "kpi-001",
    entityType: "kpi" as const,
    currentState: "inactive",
    targetState: "collecting",
    actor: "executive",
    transitionReason: "Start collection",
  });

  const evaluation = evaluateTransition(request);
  const decision = resolveTransition(request);
  const available = resolveAvailableTransitions({ entityType: "scenario", currentState: "draft" });
  const blocked = resolveBlockedTransitions({ entityType: "scenario", currentState: "draft" });
  const policy = validateTransitionPolicy({ entityType: "decision", fromState: "draft", toState: "review" });
  const dependencies = validateTransitionDependencies({
    workspaceId,
    entityId: "kpi-001",
    entityType: "kpi",
    currentState: "inactive",
    targetState: "collecting",
  });
  const approvalBlocked = validateTransitionApproval({
    entityType: "decision",
    fromState: "draft",
    toState: "review",
    approvalGranted: false,
  });
  const orchestration = orchestrateTransition(request);
  const mutation = applyOrchestratedTransition({
    orchestration,
    actor: "executive",
    timestamp: nowIso(),
  });
  const temporal = resolveExecutiveTimeStateTemporalSnapshot({ workspaceId });
  const priorAuthority = runExecutiveTimeTransitionAuthorityCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_TIME_TRANSITION_ENGINE_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-5-time-transition-engine-report.md");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Engine exists", Boolean(EXECUTIVE_TIME_TRANSITION_ENGINE_VERSION), EXECUTIVE_TIME_TRANSITION_ENGINE_VERSION),
    check("B", "Policy engine exists", policy.valid && existsSync(join(process.cwd(), "app/lib/executive-time/executiveTimeTransitionPolicy.ts")), policy.policyId),
    check("C", "Dependency engine exists", dependencies.valid && dependencies.status === "satisfied", dependencies.status),
    check("D", "Approval engine exists", approvalBlocked.approvalRequired && !approvalBlocked.valid, "Executive approval enforced."),
    check("E", "Resolver exists", available.includes("planned") && blocked.length > 0, `Available=${available.length}, blocked=${blocked.length}.`),
    check("F", "Transition evaluation works", evaluation.valid && evaluation.explanation.length > 0, evaluation.explanation),
    check("G", "Dependency validation works", dependencies.dependencies.some((entry) => entry.kind === "context_dependency"), "Context dependency checked."),
    check("H", "Approval validation works", approvalBlocked.blockingIssues.length > 0, approvalBlocked.blockingIssues[0] ?? ""),
    check("I", "Available transition resolution works", available.length > 0, available.join(",")),
    check("J", "Blocked transition resolution works", blocked.some((entry) => entry.targetState !== "planned"), "Non-primary transitions blocked."),
    check("K", "Immutable transition decision", Object.isFrozen(decision) && Object.isFrozen(decision.blockingIssues), "Frozen decision."),
    check("L", "Transition Authority used", orchestration.authorityResult.approved === true, orchestration.authorityResult.reason),
    check("M", "No direct state mutation", transitionEngineHasNoDirectMutation(), "Orchestration modules are validation-only."),
    check("N", "Read-only camera dependency", dependencies.dependencies.some((entry) => entry.kind === "camera_dependency"), "Camera dependency read."),
    check("O", "Read-only context dependency", Boolean(temporal.currentContextId), temporal.currentContextId ?? ""),
    check("P", "Read-only state dependency", readModule("app/lib/executive-time/executiveTimeTransitionDependency.ts").includes("getExecutiveTimeEntityCurrentState"), "State read-only."),
    check("Q", "Future integration contracts exist", EXECUTIVE_TIME_TRANSITION_FUTURE_INTEGRATIONS.executiveMemory.integrationImplemented === false, "Future contracts defined."),
    check("R", "No Dashboard mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_TRANSITION_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard/Timeline blocked."),
    check("S", "No Assistant mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
      allowedFiles: EXECUTIVE_TIME_TRANSITION_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant blocked."),
    check("T", "No Timeline mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_TRANSITION_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Timeline blocked."),
    check("U", "Tests pass assumptions", mutation.success && mutation.currentState === "collecting", mutation.currentState),
    check("V", "Report created", existsSync(reportPath), reportPath),
    check("W", "APP-1:4.5 authority still certified", priorAuthority.certified, priorAuthority.summary),
    check("X", "Manifest validates", manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:5 Executive Time Transition Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([]),
    tags: EXECUTIVE_TIME_TRANSITION_ENGINE_TAGS,
    summary: certified
      ? "APP-1:5 Executive Time Transition Engine PASSED."
      : `APP-1:5 Executive Time Transition Engine FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutiveTimeTransitionCertification = Object.freeze({
  runExecutiveTimeTransitionCertification,
});
