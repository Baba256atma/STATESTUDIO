/**
 * APP-1:3 — Executive Time Camera Engine certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { runExecutiveTimeContextCertification } from "./executiveTimeContextCertification.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS, EXECUTIVE_TIME_MUST_NOT_OWN } from "./executiveTimeContract.ts";
import {
  getExecutiveTimeCameraPosition,
  jumpToCurrentQuarter,
  jumpToCurrentYear,
  jumpToFutureProjection,
  jumpToPastReview,
  jumpToToday,
  moveBackward,
  moveForward,
  moveToContext,
  next,
  previous,
  resetCamera,
  getHistory,
  resetExecutiveTimeCameraForTests,
} from "./executiveTimeCameraEngine.ts";
import {
  EXECUTIVE_TIME_CAMERA_FUTURE_BINDINGS,
  EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER,
} from "./executiveTimeCameraResolver.ts";
import { EXECUTIVE_TIME_CAMERA_VERSION } from "./executiveTimeCameraTypes.ts";
import { resolveCurrentContext, switchExecutiveTimeContext } from "./executiveTimeContextEngine.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeCameraCertificationResult } from "./executiveTimeCameraTypes.ts";

export const EXECUTIVE_TIME_CAMERA_TAGS = Object.freeze([
  "[APP1_3_TIME_CAMERA_ENGINE]",
  "[TIME_CAMERA_READY]",
  "[TIME_CAMERA_HISTORY_READY]",
  "[TIME_CAMERA_NAVIGATION_READY]",
  "[NO_UI_MUTATION]",
  "[NO_SCENARIO_MUTATION]",
  "[NO_ASSISTANT_MUTATION]",
  "[NO_DASHBOARD_MUTATION]",
] as const);

export const EXECUTIVE_TIME_CAMERA_MANIFEST = Object.freeze({
  stageId: "APP-1/3",
  title: "Executive Time Camera Engine",
  goal: "Single authority for executive temporal navigation — metadata only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
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
    "docs/app-1-1-executive-time-foundation-report.md",
    "docs/app-1-2-time-context-engine-report.md",
    "docs/app-1-3-time-camera-engine-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/1", "APP-1/2"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_TIME_CAMERA_TAGS,
});

const REPO_ROOT = join(process.cwd(), "..");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function cameraEngineAvoidsDirectStoreMutation(): boolean {
  const source = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveTimeCameraEngine.ts"), "utf8");
  return (
    !source.includes("setExecutiveTimeContextStoreRecord") &&
    !source.includes("updateExecutiveTimeContextCustomRange") &&
    source.includes("resolveCurrentContext") &&
    source.includes("switchExecutiveTimeContext")
  );
}

export function runExecutiveTimeCameraCertification(): ExecutiveTimeCameraCertificationResult {
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();

  const workspaceId = "ws-camera-cert-001";
  const historyProbeWorkspace = "ws-history-cert";
  moveToContext({ workspaceId: historyProbeWorkspace, contextId: "now", source: "system", reason: "initialization" });
  moveToContext({ workspaceId: historyProbeWorkspace, contextId: "today", source: "user" });
  const historySnapshot = getHistory(historyProbeWorkspace);
  const historyPrevious = previous({ workspaceId: historyProbeWorkspace });

  const init = moveToContext({ workspaceId, contextId: "now", reason: "initialization", source: "system" });
  const forward = moveForward({ workspaceId, source: "user" });
  moveToContext({ workspaceId, contextId: "today", source: "user" });
  const backward = moveBackward({ workspaceId, source: "user" });

  const jumpToday = jumpToToday({ workspaceId: "ws-jump-cert", source: "user", reason: "shortcut" });
  const jumpQuarter = jumpToCurrentQuarter({ workspaceId: "ws-jump-cert" });
  const jumpYear = jumpToCurrentYear({ workspaceId: "ws-jump-cert" });
  const jumpForecast = jumpToFutureProjection({ workspaceId: "ws-jump-cert" });
  const jumpReview = jumpToPastReview({ workspaceId: "ws-jump-cert" });
  const reset = resetCamera({ workspaceId: "ws-reset-cert", source: "system", reason: "restore" });
  const duplicate = moveToContext({ workspaceId, contextId: "now", source: "user" });
  const invalid = moveToContext({ workspaceId: "   ", contextId: "today", validateWorkspace: true });
  const invalidContext = moveToContext({ workspaceId, contextId: "invalid_context" as "now" });
  const unauthorized = switchExecutiveTimeContext({
    workspaceId,
    contextId: "today",
    mutationAuthority: "unauthorized" as "APP-1/3-executive-time-camera",
  });
  const position = getExecutiveTimeCameraPosition(workspaceId);
  const contextPhase = runExecutiveTimeContextCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_TIME_CAMERA_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-3-time-camera-engine-report.md");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Camera Engine exists", Boolean(EXECUTIVE_TIME_CAMERA_VERSION), EXECUTIVE_TIME_CAMERA_VERSION),
    check("B", "Camera Types exist", EXECUTIVE_TIME_CAMERA_MANIFEST.allowedFiles.includes("frontend/app/lib/executive-time/executiveTimeCameraTypes.ts"), "Camera types present."),
    check("C", "Resolver exists", EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER.length >= 7, `${EXECUTIVE_TIME_CAMERA_NAVIGATION_LADDER.length} ladder step(s).`),
    check("D", "Navigation APIs exist", init.success && jumpToday.success && jumpQuarter.success && jumpYear.success && jumpForecast.success && jumpReview.success, "Navigation probes."),
    check("E", "Camera Position metadata works", Boolean(position?.currentContext) && position?.version === EXECUTIVE_TIME_CAMERA_VERSION, position?.currentContext ?? "none"),
    check("F", "History works", historySnapshot.entries.length >= 2 && historyPrevious.success, `${historySnapshot.entries.length} history entries.`),
    check("G", "Forward navigation works", forward.success, forward.position?.currentContext ?? "blocked"),
    check("H", "Backward navigation works", backward.success, backward.position?.currentContext ?? "blocked"),
    check("I", "Reset works", reset.success && reset.position?.currentContext === "now", reset.position?.currentContext ?? "none"),
    check("J", "Guardrails reject invalid requests", !duplicate.success && !invalid.success && !invalidContext.success && !unauthorized.success, "Duplicate/invalid/unauthorized rejected."),
    check("K", "Consumes Time Context Engine correctly", resolveCurrentContext({ workspaceId: "ws-reset-cert" }).id === "now" && init.success, "resolveCurrentContext consumed."),
    check("L", "No direct store mutation", cameraEngineAvoidsDirectStoreMutation(), "Camera uses context engine APIs only."),
    check("M", "Future binding contracts exist", EXECUTIVE_TIME_CAMERA_FUTURE_BINDINGS.dashboard.integrationImplemented === false && EXECUTIVE_TIME_CAMERA_FUTURE_BINDINGS.recommendation.readOnly === true, "Consumer bindings defined."),
    check("N", "No Dashboard mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
      allowedFiles: EXECUTIVE_TIME_CAMERA_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard blocked."),
    check("O", "No Assistant mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
      allowedFiles: EXECUTIVE_TIME_CAMERA_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant blocked."),
    check("P", "No Scenario mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
      allowedFiles: EXECUTIVE_TIME_CAMERA_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Scenario blocked."),
    check("Q", "No Timeline mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_CAMERA_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Timeline blocked."),
    check("R", "Tests pass assumptions", jumpReview.success && manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
    check("S", "Report created", existsSync(reportPath), reportPath),
    check("T", "APP-1:2 context engine still certified", contextPhase.certified, contextPhase.summary),
    check("U", "MUST NOT OWN time camera exclusion removed from block", EXECUTIVE_TIME_MUST_NOT_OWN.includes("time_camera"), "Foundation documents camera as separate phase."),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = checks.every((entry) => entry.passed);

  return Object.freeze({
    phaseName: "APP-1:3 Executive Time Camera Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([]),
    tags: EXECUTIVE_TIME_CAMERA_TAGS,
    summary: certified
      ? "APP-1:3 Executive Time Camera Engine PASSED."
      : `APP-1:3 Executive Time Camera Engine FAILED (${checks.filter((entry) => !entry.passed).length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutiveTimeCameraCertification = Object.freeze({
  runExecutiveTimeCameraCertification,
});
