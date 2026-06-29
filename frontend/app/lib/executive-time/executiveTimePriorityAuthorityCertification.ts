/**
 * APP-1:5.5 — Executive Time Priority Authority certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import {
  buildPriorityResultContract,
  evaluateMultiple,
  evaluatePriority,
  EXECUTIVE_TIME_PRIORITY_FUTURE_INTEGRATIONS,
  EXECUTIVE_TIME_PRIORITY_LEVELS,
  EXECUTIVE_TIME_PRIORITY_OWNERSHIP_RULES,
  EXECUTIVE_TIME_PRIORITY_POLICIES,
  EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES,
  explainPriority,
  ExecutiveTimePriorityEngineContract,
  resolvePolicy,
  validatePolicy,
} from "./executiveTimePriorityAuthority.ts";
import {
  EXECUTIVE_TIME_PRIORITY_AUTHORITY_VERSION,
  EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER,
  EXECUTIVE_TIME_PRIORITY_POLICY_OWNER,
  EXECUTIVE_TIME_PRIORITY_RESULT_OWNER,
  ExecutiveTimePriorityEvaluationDeferredError,
} from "./executiveTimePriorityAuthorityTypes.ts";
import type { ExecutiveTimePriorityAuthorityCertificationResult } from "./executiveTimePriorityAuthorityTypes.ts";
import { runExecutiveTimeTransitionCertification } from "./executiveTimeTransitionCertification.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_PRIORITY_AUTHORITY_TAGS = Object.freeze([
  "[APP1_5_5_PRIORITY_AUTHORITY]",
  "[PRIORITY_POLICY_READY]",
  "[PRIORITY_ENGINE_CONTRACT_READY]",
  "[PRIORITY_RESULT_READY]",
  "[NO_PRIORITY_EVALUATION]",
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
  "docs/app-1-1-executive-time-foundation-report.md",
  "docs/app-1-2-time-context-engine-report.md",
  "docs/app-1-3-time-camera-engine-report.md",
  "docs/app-1-4-time-state-engine-report.md",
  "docs/app-1-4-5-transition-authority-contract-report.md",
  "docs/app-1-5-time-transition-engine-report.md",
] as const);

export const EXECUTIVE_TIME_PRIORITY_AUTHORITY_MANIFEST = Object.freeze({
  stageId: "APP-1/5.5",
  title: "Executive Time Priority Authority Contract",
  goal: "Permanent separation between priority policy, engine, and result before evaluation.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...PRIOR_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executiveTimePriorityAuthorityTypes.ts",
    "frontend/app/lib/executive-time/executiveTimePriorityAuthority.ts",
    "frontend/app/lib/executive-time/executiveTimePriorityAuthorityCertification.ts",
    "frontend/app/lib/executive-time/executiveTimePriorityAuthorityCertification.test.ts",
    "docs/app-1-5-5-priority-authority-contract-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/5"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_TIME_PRIORITY_AUTHORITY_TAGS,
});

const REPO_ROOT = join(process.cwd(), "..");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function priorityAuthorityHasNoEvaluation(): boolean {
  const source = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveTimePriorityAuthority.ts"), "utf8");
  return (
    source.includes("ExecutiveTimePriorityEvaluationDeferredError") &&
    source.includes("throw new ExecutiveTimePriorityEvaluationDeferredError") &&
    !source.includes("severityWeight *") &&
    !source.includes("calculatePriority") &&
    !source.includes("scorePriority") &&
    !source.includes("applyApprovedTransition") &&
    !source.includes("entityStateStore")
  );
}

export function runExecutiveTimePriorityAuthorityCertification(): ExecutiveTimePriorityAuthorityCertificationResult {
  const criticalPolicy = resolvePolicy({ priority: "critical" });
  const policyValidation = validatePolicy("priority-normal");
  const invalidPolicy = validatePolicy("priority-unknown");
  const resultTemplate = buildPriorityResultContract({
    priority: "normal",
    confidence: 0,
    explanation: "Contract probe.",
    matchedPolicyIds: ["priority-normal"],
  });
  const explanation = explainPriority(resultTemplate);

  let evaluationDeferred = false;
  try {
    evaluatePriority({
      workspaceId: "ws-priority-cert",
      entityId: "entity-001",
      entityType: "scenario",
      currentState: "draft",
      actor: "executive",
      reason: "Probe",
    });
  } catch (error) {
    evaluationDeferred = error instanceof ExecutiveTimePriorityEvaluationDeferredError;
  }

  let multipleDeferred = false;
  try {
    evaluateMultiple([]);
  } catch (error) {
    multipleDeferred = error instanceof ExecutiveTimePriorityEvaluationDeferredError;
  }

  const priorTransition = runExecutiveTimeTransitionCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_TIME_PRIORITY_AUTHORITY_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-5-5-priority-authority-contract-report.md");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Policy contract exists", EXECUTIVE_TIME_PRIORITY_POLICIES.length === 6 && criticalPolicy?.priority === "critical", criticalPolicy?.id ?? ""),
    check("B", "Engine contract exists", ExecutiveTimePriorityEngineContract.evaluationOwner === EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER, EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER),
    check("C", "Result contract exists", resultTemplate.priority === "normal" && resultTemplate.metadata.contractOnly === true, resultTemplate.explanation),
    check("D", "Immutable result verified", Object.isFrozen(resultTemplate) && Object.isFrozen(resultTemplate.matchedPolicies), "Frozen result template."),
    check("E", "Ownership rules verified", EXECUTIVE_TIME_PRIORITY_OWNERSHIP_RULES.policyOwns.includes("priority_definitions"), "Ownership separation documented."),
    check("F", "Read-only dependencies verified", EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES.context.mutationPermitted === false, EXECUTIVE_TIME_PRIORITY_READONLY_DEPENDENCIES.transitionEngine.moduleId),
    check("G", "Future integration contracts exist", EXECUTIVE_TIME_PRIORITY_FUTURE_INTEGRATIONS.dashboard.integrationImplemented === false, "Future contracts defined."),
    check("H", "No priority evaluation implemented", evaluationDeferred && multipleDeferred && priorityAuthorityHasNoEvaluation(), "Evaluation deferred to APP-1:6."),
    check("I", "No Dashboard mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PRIORITY_AUTHORITY_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard blocked."),
    check("J", "No Assistant mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/assistant/ExecutiveAssistantPanel.tsx",
      allowedFiles: EXECUTIVE_TIME_PRIORITY_AUTHORITY_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant blocked."),
    check("K", "Tests pass assumptions", policyValidation.valid && !invalidPolicy.valid && explanation.ownership.engineOwner === EXECUTIVE_TIME_PRIORITY_EVALUATION_OWNER, explanation.summary),
    check("L", "Report created", existsSync(reportPath), reportPath),
    check("M", "Priority levels complete", EXECUTIVE_TIME_PRIORITY_LEVELS.length === 6, EXECUTIVE_TIME_PRIORITY_LEVELS.join(",")),
    check("N", "Policy owner documented", EXECUTIVE_TIME_PRIORITY_POLICY_OWNER === "executive-time-priority-policy", EXECUTIVE_TIME_PRIORITY_POLICY_OWNER),
    check("O", "Result owner documented", EXECUTIVE_TIME_PRIORITY_RESULT_OWNER === "executive-time-priority-result", EXECUTIVE_TIME_PRIORITY_RESULT_OWNER),
    check("P", "APP-1:5 transition engine still certified", priorTransition.certified, priorTransition.summary),
    check("Q", "Manifest validates", manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
    check("R", "Authority version present", EXECUTIVE_TIME_PRIORITY_AUTHORITY_VERSION === "APP-1/5.5", EXECUTIVE_TIME_PRIORITY_AUTHORITY_VERSION),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:5.5 Executive Time Priority Authority Contract",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([]),
    tags: EXECUTIVE_TIME_PRIORITY_AUTHORITY_TAGS,
    summary: certified
      ? "APP-1:5.5 Executive Time Priority Authority Contract PASSED."
      : `APP-1:5.5 Executive Time Priority Authority Contract FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutiveTimePriorityAuthorityCertification = Object.freeze({
  runExecutiveTimePriorityAuthorityCertification,
});
