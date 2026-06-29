/**
 * APP-1:6 — Executive Time Priority Engine certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { moveToContext, resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import { EXECUTIVE_TIME_PRIORITY_POLICIES } from "./executiveTimePriorityAuthority.ts";
import { runExecutiveTimePriorityAuthorityCertification } from "./executiveTimePriorityAuthorityCertification.ts";
import {
  evaluateMultiple,
  evaluatePriority,
  EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION,
  EXECUTIVE_TIME_PRIORITY_FUTURE_INTEGRATIONS,
  EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES,
  explainPriorityResult,
  resolveEscalationLevel,
  resolveHighestPriority,
  resolvePriorityDistribution,
  resolvePriorityStatistics,
} from "./executiveTimePriorityEngine.ts";
import { EXECUTIVE_TIME_PRIORITY_ESCALATION_DEFINITIONS } from "./executiveTimePriorityEscalation.ts";
import { resolveExecutiveTimeStateTemporalSnapshot } from "./executiveTimeStateEngine.ts";
import { resetExecutiveTimeEntityStateStoreForTests } from "./executiveTimeStateMutation.ts";
import { resetExecutiveTimeStateRegistryForTests } from "./executiveTimeStateRegistry.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";
import { runExecutiveTimeTransitionCertification } from "./executiveTimeTransitionCertification.ts";

export const EXECUTIVE_TIME_PRIORITY_ENGINE_TAGS = Object.freeze([
  "[APP1_6_TIME_PRIORITY_ENGINE]",
  "[TIME_PRIORITY_ENGINE_READY]",
  "[PRIORITY_EVALUATION_READY]",
  "[PRIORITY_ESCALATION_READY]",
  "[IMMUTABLE_PRIORITY_RESULT]",
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
  "docs/app-1-1-executive-time-foundation-report.md",
  "docs/app-1-2-time-context-engine-report.md",
  "docs/app-1-3-time-camera-engine-report.md",
  "docs/app-1-4-time-state-engine-report.md",
  "docs/app-1-4-5-transition-authority-contract-report.md",
  "docs/app-1-5-time-transition-engine-report.md",
  "docs/app-1-5-5-priority-authority-contract-report.md",
] as const);

export const EXECUTIVE_TIME_PRIORITY_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-1/6",
  title: "Executive Time Priority Engine",
  goal: "Sole authority for temporal priority evaluation with immutable results.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PRIOR_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executiveTimePriorityEscalation.ts",
    "frontend/app/lib/executive-time/executiveTimePriorityEvaluation.ts",
    "frontend/app/lib/executive-time/executiveTimePriorityResolver.ts",
    "frontend/app/lib/executive-time/executiveTimePriorityEngine.ts",
    "frontend/app/lib/executive-time/executiveTimePriorityCertification.ts",
    "frontend/app/lib/executive-time/executiveTimePriorityCertification.test.ts",
    "docs/app-1-6-time-priority-engine-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/5.5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_TIME_PRIORITY_ENGINE_TAGS,
});

export type ExecutiveTimePriorityEngineCertificationResult = Readonly<{
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

function priorityEngineHasNoMutation(): boolean {
  const modules = [
    "app/lib/executive-time/executiveTimePriorityEngine.ts",
    "app/lib/executive-time/executiveTimePriorityEvaluation.ts",
    "app/lib/executive-time/executiveTimePriorityResolver.ts",
    "app/lib/executive-time/executiveTimePriorityEscalation.ts",
  ].map((path) => readModule(path));
  return modules.every(
    (source) =>
      !source.includes("entityStateStore.set") &&
      !source.includes("applyApprovedTransition") &&
      !source.includes("switchExecutiveTimeContext") &&
      !source.includes("moveToContext")
  );
}

export function runExecutiveTimePriorityCertification(): ExecutiveTimePriorityEngineCertificationResult {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();
  resetExecutiveTimeEntityStateStoreForTests();

  const workspaceId = "ws-priority-engine-cert";
  moveToContext({ workspaceId, contextId: "this_week", source: "user", reason: "manual_selection" });

  const baseRequest = Object.freeze({
    workspaceId,
    entityId: "scenario-001",
    entityType: "scenario" as const,
    currentState: "draft",
    actor: "executive",
    reason: "Priority evaluation probe",
  });

  const single = evaluatePriority(baseRequest);
  const batch = evaluateMultiple([
    baseRequest,
    Object.freeze({
      ...baseRequest,
      entityId: "decision-001",
      entityType: "decision" as const,
      currentState: "draft",
      targetState: "review",
    }),
    Object.freeze({
      ...baseRequest,
      entityId: "risk-001",
      entityType: "risk" as const,
      currentState: "detected",
      targetDeadline: new Date(Date.now() - 86_400_000).toISOString(),
    }),
  ]);
  const highest = resolveHighestPriority(batch);
  const distribution = resolvePriorityDistribution(batch);
  const statistics = resolvePriorityStatistics(batch);
  const explanation = explainPriorityResult(single);
  const temporal = resolveExecutiveTimeStateTemporalSnapshot({ workspaceId });
  const priorAuthority = runExecutiveTimePriorityAuthorityCertification();
  const priorTransition = runExecutiveTimeTransitionCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_TIME_PRIORITY_ENGINE_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-6-time-priority-engine-report.md");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Engine exists", Boolean(EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION), EXECUTIVE_TIME_PRIORITY_ENGINE_VERSION),
    check("B", "Resolver exists", highest !== null && distribution.total === 3, `Highest=${highest?.priority ?? "none"}.`),
    check("C", "Evaluation exists", single.priority.length > 0 && single.confidence > 0, single.priority),
    check("D", "Escalation metadata exists", EXECUTIVE_TIME_PRIORITY_ESCALATION_DEFINITIONS.length === 6, resolveEscalationLevel("critical")),
    check("E", "Priority Policy consumed", single.matchedPolicies[0]?.id.startsWith("priority-") === true, single.matchedPolicies[0]?.id ?? ""),
    check("F", "Single evaluation works", single.metadata.evaluationOwner === "executive-time-priority-engine", single.explanation),
    check("G", "Batch evaluation works", batch.length === 3, String(batch.length)),
    check("H", "Highest priority resolution works", highest !== null && ["critical", "urgent", "soon", "normal", "later", "expired"].includes(highest.priority), highest?.priority ?? ""),
    check("I", "Distribution calculation works", distribution.total === 3 && distribution.counts.critical >= 0, String(distribution.total)),
    check("J", "Statistics calculation works", statistics.total === 3 && statistics.averageConfidence > 0, String(statistics.averageConfidence)),
    check("K", "Explanation generation works", explanation.includes("Escalation:") && single.contributingFactors.length > 0, explanation),
    check("L", "Immutable result verified", Object.isFrozen(single) && Object.isFrozen(single.contributingFactors), "Frozen result."),
    check("M", "Read-only Context dependency", readModule("app/lib/executive-time/executiveTimePriorityEvaluation.ts").includes("resolveCurrentContext"), temporal.currentContextId ?? ""),
    check("N", "Read-only Camera dependency", readModule("app/lib/executive-time/executiveTimePriorityEvaluation.ts").includes("getExecutiveTimeCameraPosition"), "Camera read."),
    check("O", "Read-only State dependency", readModule("app/lib/executive-time/executiveTimePriorityEvaluation.ts").includes("resolveExecutiveTimeStateTemporalSnapshot"), "State read."),
    check("P", "Read-only Transition dependency", readModule("app/lib/executive-time/executiveTimePriorityEvaluation.ts").includes("evaluateTransition"), "Transition read."),
    check("Q", "Future contracts exist", EXECUTIVE_TIME_PRIORITY_FUTURE_INTEGRATIONS.recommendation.integrationImplemented === false, "Future contracts defined."),
    check("R", "No Dashboard mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PRIORITY_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard blocked."),
    check("S", "No Assistant mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PRIORITY_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant blocked."),
    check("T", "No Timeline mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/main-right-panel/timeline/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PRIORITY_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Timeline blocked."),
    check("U", "Tests pass assumptions", priorityEngineHasNoMutation() && EXECUTIVE_TIME_PRIORITY_POLICIES.length === 6, "No mutation in engine modules."),
    check("V", "Report created", existsSync(reportPath), reportPath),
    check("W", "APP-1:5.5 authority still certified", priorAuthority.certified, priorAuthority.summary),
    check("X", "APP-1:5 transition still certified", priorTransition.certified, priorTransition.summary),
    check("Y", "Read-only dependency contract", EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES.transitionEngine.mutationPermitted === false, "Dependency contract."),
    check("Z", "Manifest validates", manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:6 Executive Time Priority Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([]),
    tags: EXECUTIVE_TIME_PRIORITY_ENGINE_TAGS,
    summary: certified
      ? "APP-1:6 Executive Time Priority Engine PASSED."
      : `APP-1:6 Executive Time Priority Engine FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutiveTimePriorityCertification = Object.freeze({
  runExecutiveTimePriorityCertification,
});
