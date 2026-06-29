/**
 * APP-1:2 — Executive Time Context Engine certification.
 * Isolation validation — no Dashboard, Assistant, Scenario, or Timeline coupling.
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { runExecutiveTimeFoundationCertification } from "./executiveTimeCertification.ts";
import {
  EXECUTIVE_TIME_CONTEXT_KEYS,
  EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  EXECUTIVE_TIME_MUST_NOT_OWN,
} from "./executiveTimeContract.ts";
import {
  moveToContext,
  resetExecutiveTimeCameraForTests,
} from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_CAMERA_MUTATION_AUTHORITY } from "./executiveTimeContextMutationAuthority.ts";
import {
  resolveCurrentContext,
  switchExecutiveTimeContext,
} from "./executiveTimeContextEngine.ts";
import {
  EXECUTIVE_TIME_CONTEXT_ENGINE_VERSION,
  getDefaultContext,
  getRequiredContextIds,
  isValidContext,
  listContexts,
  normalizeContext,
  resolveContextComparisonMetadata,
  resolveContextLens,
  resolveContextMetadata,
  resolveContextWindow,
  validateExecutiveTimeContextInput,
} from "./executiveTimeContextResolver.ts";
import {
  EXECUTIVE_TIME_CONTEXT_STORE_VERSION,
  isExecutiveTimeContextStoreIsolated,
  resetExecutiveTimeContextStoreForTests,
} from "./executiveTimeContextStore.ts";
import type {
  ExecutiveTimeCertificationCheck,
  ExecutiveTimeContextEngineCertificationResult,
} from "./executiveTimeTypes.ts";

export const EXECUTIVE_TIME_CONTEXT_ENGINE_TAGS = Object.freeze([
  "[APP1_2_TIME_CONTEXT_ENGINE]",
  "[TIME_CONTEXT_ENGINE_READY]",
  "[TIME_CONTEXT_STORE_READY]",
  "[TIME_CONTEXT_RESOLVER_READY]",
  "[NO_UI_MUTATION]",
  "[NO_SCENARIO_MUTATION]",
  "[NO_ASSISTANT_MUTATION]",
  "[NO_DASHBOARD_MUTATION]",
] as const);

export const EXECUTIVE_TIME_CONTEXT_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-1/2",
  title: "Executive Time Context Engine",
  goal: "Temporal perspective engine — context store, resolver, and metadata switching only.",
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
    "frontend/app/lib/executive-time/executiveTimeContextCertification.ts",
    "frontend/app/lib/executive-time/executiveTimeContextCertification.test.ts",
    "docs/app-1-1-executive-time-foundation-report.md",
    "docs/app-1-2-time-context-engine-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/1"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_TIME_CONTEXT_ENGINE_TAGS,
});

const FRONTEND_ROOT = process.cwd();
const REPO_ROOT = join(FRONTEND_ROOT, "..");

const FORBIDDEN_PROBE_PATHS = Object.freeze([
  "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
  "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
  "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
  "frontend/app/lib/dashboardIntelligence/dashboardIntelligenceContract.ts",
  "frontend/app/components/main-right-panel/timeline/TimelinePanel.tsx",
  "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
] as const);

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function allForbiddenPathsBlocked(): boolean {
  return FORBIDDEN_PROBE_PATHS.every(
    (filePath) =>
      !evaluateStageFileBoundary({
        filePath,
        allowedFiles: EXECUTIVE_TIME_CONTEXT_ENGINE_MANIFEST.allowedFiles,
        forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
      }).allowed
  );
}

export function runExecutiveTimeContextCertification(): ExecutiveTimeContextEngineCertificationResult {
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();

  const foundation = runExecutiveTimeFoundationCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_TIME_CONTEXT_ENGINE_MANIFEST);
  const contexts = listContexts();
  const requiredIds = getRequiredContextIds();
  const normalized = normalizeContext({ contextId: "this_month" });
  const validation = validateExecutiveTimeContextInput({ contextId: "today" });
  const invalidValidation = validateExecutiveTimeContextInput({ contextId: "unknown_context" });

  const workspaceId = "ws-context-cert-001";
  const switchOne = moveToContext({ workspaceId, contextId: "this_week", source: "system", reason: "initialization" });
  const switchTwo = moveToContext({ workspaceId, contextId: "this_month", source: "user" });
  const switchThree = moveToContext({ workspaceId, contextId: "future_projection", source: "user", reason: "forecast" });
  const unauthorizedDirectSwitch = switchExecutiveTimeContext({
    workspaceId,
    contextId: "today",
    mutationAuthority: "unauthorized" as typeof EXECUTIVE_TIME_CAMERA_MUTATION_AUTHORITY,
  });
  const current = resolveCurrentContext({ workspaceId });

  const todayWindow = resolveContextWindow({
    contextId: "today",
    anchorDate: "2026-06-15T12:00:00.000Z",
  });
  const monthWindow = resolveContextWindow({
    contextId: "this_month",
    anchorDate: "2026-06-15T12:00:00.000Z",
  });
  const projectionWindow = resolveContextWindow({
    contextId: "future_projection",
    anchorDate: "2026-06-15T12:00:00.000Z",
  });
  const customWindow = resolveContextWindow({
    contextId: "custom_range",
    customRange: Object.freeze({
      startBoundary: "2026-01-01T00:00:00.000Z",
      endBoundary: "2026-01-31T23:59:59.999Z",
    }),
  });

  const todayLens = resolveContextLens("today");
  const quarterLens = resolveContextLens("this_quarter");
  const yearLens = resolveContextLens("this_year");
  const projectionLens = resolveContextLens("future_projection");
  const reviewLens = resolveContextLens("past_review");

  const comparison = resolveContextComparisonMetadata({
    primaryContextId: "today",
    secondaryContextId: "last_week",
  });

  const metadata = resolveContextMetadata("this_quarter");
  const reportPath = join(REPO_ROOT, "docs/app-1-2-time-context-engine-report.md");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Context Engine exists", Boolean(EXECUTIVE_TIME_CONTEXT_ENGINE_VERSION), EXECUTIVE_TIME_CONTEXT_ENGINE_VERSION),
    check("B", "Store exists", EXECUTIVE_TIME_CONTEXT_STORE_VERSION === "APP-1/2", EXECUTIVE_TIME_CONTEXT_STORE_VERSION),
    check("C", "Resolver exists", contexts.length > 0 && isValidContext("today"), `${contexts.length} context(s).`),
    check("D", "All required contexts registered", requiredIds.every((id) => isValidContext(id)), `${requiredIds.length} required id(s).`),
    check("E", "Context normalization works", normalized.id === "this_month", normalized.name),
    check("F", "Validation works", validation.valid && !invalidValidation.valid, "Valid/invalid probes."),
    check("G", "Switching works", switchOne.success && switchTwo.success && switchThree.success && current.id === "future_projection", current.id),
    check("G2", "Direct context mutation blocked without camera authority", !unauthorizedDirectSwitch.success, unauthorizedDirectSwitch.reason),
    check("H", "Window metadata works", Boolean(todayWindow.startBoundary) && Boolean(monthWindow.endBoundary) && projectionWindow.windowKind === "projection" && customWindow.windowKind === "custom", "Window probes."),
    check("I", "Lens metadata works", todayLens === "operational" && quarterLens === "management" && yearLens === "strategic" && projectionLens === "forecast" && reviewLens === "retrospective", "Lens probes."),
    check("J", "Comparison metadata exists", comparison.supported && comparison.metadata.contractOnly === true, comparison.comparisonLabel),
    check("K", "Store isolation verified", isExecutiveTimeContextStoreIsolated(), "No dashboard/assistant/timeline state in store."),
    check("L", "No Dashboard mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
      allowedFiles: EXECUTIVE_TIME_CONTEXT_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard path blocked."),
    check("M", "No Assistant mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
      allowedFiles: EXECUTIVE_TIME_CONTEXT_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant path blocked."),
    check("N", "No Scenario mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
      allowedFiles: EXECUTIVE_TIME_CONTEXT_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Scenario path blocked."),
    check("O", "No Timeline mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/main-right-panel/timeline/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_CONTEXT_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Timeline path blocked."),
    check("P", "Tests pass assumptions", getDefaultContext() === "now" && EXECUTIVE_TIME_CONTEXT_KEYS.length === requiredIds.length, "Default context locked."),
    check("Q", "Report created", existsSync(reportPath), reportPath),
    check("R", "APP-1:1 foundation still certified", foundation.certified, foundation.summary),
    check("S", "Manifest validates", manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
    check("T", "Forbidden paths blocked", allForbiddenPathsBlocked(), `${FORBIDDEN_PROBE_PATHS.length} probe(s).`),
    check("U", "Metadata resolution works", metadata.lens === "management", String(metadata.engineVersion)),
    check("V", "MUST NOT OWN documented", EXECUTIVE_TIME_MUST_NOT_OWN.includes("time_camera") && EXECUTIVE_TIME_MUST_NOT_OWN.includes("prediction_engine"), `${EXECUTIVE_TIME_MUST_NOT_OWN.length} exclusions.`),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:2 Executive Time Context Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze(certified ? [] : failedChecks.map((entry) => entry.evidence)),
    tags: EXECUTIVE_TIME_CONTEXT_ENGINE_TAGS,
    summary: certified
      ? "APP-1:2 Executive Time Context Engine PASSED."
      : `APP-1:2 Executive Time Context Engine FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutiveTimeContextCertification = Object.freeze({
  runExecutiveTimeContextCertification,
});
