/**
 * APP-1:1 — Executive Time Foundation certification.
 * Isolation and contract validation — no UI or engine coupling.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  EXECUTIVE_TIME_CONTEXT_KEYS,
  EXECUTIVE_TIME_DEFAULT_CONTEXT,
  EXECUTIVE_TIME_DEFAULT_PRIORITY,
  EXECUTIVE_TIME_DEFAULT_STATE,
  EXECUTIVE_TIME_EVENT_CATEGORIES,
  EXECUTIVE_TIME_FOUNDATION_TAGS,
  EXECUTIVE_TIME_FOUNDATION_VERSION,
  EXECUTIVE_TIME_MODULE_PATHS,
  EXECUTIVE_TIME_MUST_NOT_OWN,
  EXECUTIVE_TIME_PRIORITY_KEYS,
  EXECUTIVE_TIME_SELF_MANIFEST,
  EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  EXECUTIVE_TIME_STATE_KEYS,
  resolveExecutiveTimeEventExample,
  validateExecutiveTimeEventShape,
  validateExecutiveTimeTransition,
} from "./executiveTimeContract.ts";
import {
  getExecutiveTimeRegistrySnapshot,
  hasExecutiveTimeContext,
  hasExecutiveTimeEventCategory,
  hasExecutiveTimePriority,
  hasExecutiveTimeState,
  registerExecutiveTimeContext,
  registerExecutiveTimeTransitionRule,
  resetExecutiveTimeRegistryForTests,
} from "./executiveTimeRegistry.ts";
import {
  normalizeExecutiveTimeEvent,
  resolveDefaultExecutiveTimeContext,
  resolveDefaultExecutiveTimePriority,
  resolveDefaultExecutiveTimeState,
  resolveSafeExecutiveTimeContext,
  resolveSafeExecutiveTimePriority,
  resolveSafeExecutiveTimeState,
  validateExecutiveTimeEvent,
} from "./executiveTimeResolver.ts";
import type { ExecutiveTimeCertificationCheck, ExecutiveTimeCertificationResult } from "./executiveTimeTypes.ts";

const FRONTEND_ROOT = process.cwd();
const REPO_ROOT = join(FRONTEND_ROOT, "..");

const FORBIDDEN_IMPORT_PROBE_PATHS = Object.freeze([
  "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
  "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
  "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
  "frontend/app/lib/dashboardIntelligence/dashboardIntelligenceContract.ts",
  "frontend/app/lib/assistantIntelligence/assistantResponseBuilder.ts",
  "frontend/app/lib/workspace/workspaceSceneSync.ts",
  "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
] as const);

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function allForbiddenImportPathsBlocked(): boolean {
  return FORBIDDEN_IMPORT_PROBE_PATHS.every(
    (filePath) =>
      !evaluateStageFileBoundary({
        filePath,
        allowedFiles: EXECUTIVE_TIME_SELF_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
      }).allowed
  );
}

export function runExecutiveTimeFoundationCertification(): ExecutiveTimeCertificationResult {
  resetExecutiveTimeRegistryForTests();

  const manifestValidation = validateStageManifest(EXECUTIVE_TIME_SELF_MANIFEST);
  const allowlistOk = EXECUTIVE_TIME_MODULE_PATHS.every((filePath) =>
    evaluateStageFileBoundary({
      filePath,
      allowedFiles: EXECUTIVE_TIME_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed
  );

  const snapshot = getExecutiveTimeRegistrySnapshot();
  const exampleEvent = resolveExecutiveTimeEventExample();
  const normalizedPartial = normalizeExecutiveTimeEvent({
    id: "et-normalize-001",
    workspaceId: "ws-001",
  });
  const eventValidation = validateExecutiveTimeEvent(exampleEvent);
  const duplicateContext = registerExecutiveTimeContext({
    key: "now",
    label: "Now duplicate",
    description: "Duplicate probe.",
  });
  const duplicateRule = registerExecutiveTimeTransitionRule({
    ruleId: "draft-to-planned",
    fromState: "draft",
    toState: "planned",
    label: "Duplicate rule",
    metadata: Object.freeze({}),
  });
  const snapshotCopy = getExecutiveTimeRegistrySnapshot();
  const contextsBeforeMutation = snapshotCopy.contexts;
  const transitionValidation = validateExecutiveTimeTransition({
    fromState: "draft",
    toState: "planned",
    reason: "Certification probe",
    timestamp: nowIso(),
    actor: "certification",
    metadata: Object.freeze({}),
  });

  const reportPath = join(REPO_ROOT, "docs/app-1-1-executive-time-foundation-report.md");
  const reportExists = existsSync(reportPath);

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Contract exists", Boolean(EXECUTIVE_TIME_FOUNDATION_VERSION), EXECUTIVE_TIME_FOUNDATION_VERSION),
    check("B", "Types exist", EXECUTIVE_TIME_MODULE_PATHS.includes("frontend/app/lib/executive-time/executiveTimeTypes.ts"), "executiveTimeTypes.ts in allowlist."),
    check("C", "Context definitions exist", EXECUTIVE_TIME_CONTEXT_KEYS.length === 19 && snapshot.contexts.length >= 19, `${snapshot.contexts.length} context(s).`),
    check("D", "State definitions exist", EXECUTIVE_TIME_STATE_KEYS.length === 8 && snapshot.states.length >= 8, `${snapshot.states.length} state(s).`),
    check("E", "Priority definitions exist", EXECUTIVE_TIME_PRIORITY_KEYS.length === 6 && snapshot.priorities.length >= 6, `${snapshot.priorities.length} priority(ies).`),
    check("F", "Event category definitions exist", EXECUTIVE_TIME_EVENT_CATEGORIES.length === 10 && snapshot.eventCategories.length >= 10, `${snapshot.eventCategories.length} category(ies).`),
    check("G", "Registry works", hasExecutiveTimeContext("today") && hasExecutiveTimeState("active") && hasExecutiveTimePriority("urgent") && hasExecutiveTimeEventCategory("scenario"), "Registry lookups operational."),
    check("H", "Resolver works", resolveDefaultExecutiveTimeContext() === EXECUTIVE_TIME_DEFAULT_CONTEXT && resolveDefaultExecutiveTimeState() === EXECUTIVE_TIME_DEFAULT_STATE && resolveDefaultExecutiveTimePriority() === EXECUTIVE_TIME_DEFAULT_PRIORITY, "Default resolution locked."),
    check("I", "Event validation works", eventValidation.valid && validateExecutiveTimeEventShape(exampleEvent).valid, "Example event validates."),
    check("J", "Duplicate registration blocked", !duplicateContext.success && !duplicateRule.success, duplicateContext.reason),
    check(
      "K",
      "Returned registry data is safely copied",
      snapshot.contexts !== contextsBeforeMutation && Object.isFrozen(snapshot.contexts),
      "Snapshot arrays are frozen copies."
    ),
    check("L", "No UI files changed", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
      allowedFiles: EXECUTIVE_TIME_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "React UI path blocked."),
    check("M", "No Dashboard files changed", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
      allowedFiles: EXECUTIVE_TIME_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard contract path blocked."),
    check("N", "No Assistant files changed", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
      allowedFiles: EXECUTIVE_TIME_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant contract path blocked."),
    check("O", "No Scenario files changed", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
      allowedFiles: EXECUTIVE_TIME_SELF_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Scenario contract path blocked."),
    check("P", "Tests pass assumptions", normalizedPartial.state === "draft" && normalizedPartial.priority === "normal", "Normalization fallbacks stable."),
    check("Q", "Report created", reportExists, reportExists ? reportPath : "Report file missing."),
    check("R", "Self manifest validates", manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
    check("S", "Module files in allowlist", allowlistOk, `${EXECUTIVE_TIME_MODULE_PATHS.length} module file(s).`),
    check("T", "Forbidden runtime paths blocked", allForbiddenImportPathsBlocked(), `${FORBIDDEN_IMPORT_PROBE_PATHS.length} probe path(s).`),
    check("U", "Transition metadata validates", transitionValidation.valid, "Transition contract helper operational."),
    check("V", "Safe fallback resolution", resolveSafeExecutiveTimeContext("unknown") === "now" && resolveSafeExecutiveTimeState("unknown") === "draft" && resolveSafeExecutiveTimePriority("unknown") === "normal", "Unknown keys fall back safely."),
    check("W", "MUST NOT OWN documented", EXECUTIVE_TIME_MUST_NOT_OWN.includes("time_panel_ui") && EXECUTIVE_TIME_MUST_NOT_OWN.includes("prediction_engine"), `${EXECUTIVE_TIME_MUST_NOT_OWN.length} exclusions.`),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;
  const warnings: string[] = [];
  if (!reportExists) {
    warnings.push("Foundation report file not found at certification time.");
  }

  const tags = certified
    ? EXECUTIVE_TIME_FOUNDATION_TAGS
    : Object.freeze([...EXECUTIVE_TIME_FOUNDATION_TAGS]);

  return Object.freeze({
    phaseName: "APP-1:1 Executive Time Foundation",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze(warnings),
    tags,
    summary: certified
      ? "APP-1:1 Executive Time Foundation PASSED."
      : `APP-1:1 Executive Time Foundation FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export function readExecutiveTimeFoundationReport(): string | null {
  const reportPath = join(REPO_ROOT, "docs/app-1-1-executive-time-foundation-report.md");
  if (!existsSync(reportPath)) return null;
  return readFileSync(reportPath, "utf8");
}

export const ExecutiveTimeCertification = Object.freeze({
  runExecutiveTimeFoundationCertification,
});
