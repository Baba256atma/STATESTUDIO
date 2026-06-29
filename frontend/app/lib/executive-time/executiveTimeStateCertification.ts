/**
 * APP-1:4 — Executive Time State Engine certification.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import { runExecutiveTimeCameraCertification } from "./executiveTimeCameraCertification.ts";
import { moveToContext, resetExecutiveTimeCameraForTests } from "./executiveTimeCameraEngine.ts";
import { EXECUTIVE_TIME_FORBIDDEN_PATTERNS } from "./executiveTimeContract.ts";
import { resetExecutiveTimeContextStoreForTests } from "./executiveTimeContextStore.ts";
import { resetExecutiveTimeRegistryForTests } from "./executiveTimeRegistry.ts";
import {
  resolveExecutiveTimeStateTemporalSnapshot,
} from "./executiveTimeStateEngine.ts";
import {
  getExecutiveTimeStateRegistrySnapshot,
  listEntityStates,
  registerState,
  resetExecutiveTimeStateRegistryForTests,
  validateState,
} from "./executiveTimeStateRegistry.ts";
import {
  canTransition,
  EXECUTIVE_TIME_STATE_FUTURE_INTEGRATIONS,
  isEditable,
  isTerminal,
  normalizeState,
  resolveDefaultState,
  resolveLifecycleOrder,
  resolveTerminalState,
  validateExecutiveTimeStateTransition,
} from "./executiveTimeStateResolver.ts";
import { EXECUTIVE_TIME_STATE_ENGINE_VERSION } from "./executiveTimeStateTypes.ts";
import type { ExecutiveTimeCertificationCheck } from "./executiveTimeTypes.ts";
import type { ExecutiveTimeStateEngineCertificationResult } from "./executiveTimeStateTypes.ts";

export const EXECUTIVE_TIME_STATE_ENGINE_TAGS = Object.freeze([
  "[APP1_4_TIME_STATE_ENGINE]",
  "[TIME_STATE_ENGINE_READY]",
  "[TIME_STATE_REGISTRY_READY]",
  "[TIME_STATE_RESOLVER_READY]",
  "[STATE_TRANSITION_CONTRACT_READY]",
  "[NO_UI_MUTATION]",
  "[NO_SCENARIO_MUTATION]",
  "[NO_ASSISTANT_MUTATION]",
  "[NO_DASHBOARD_MUTATION]",
] as const);

const EXECUTIVE_TIME_CAMERA_MANIFEST_FILES = Object.freeze([
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
] as const);

export const EXECUTIVE_TIME_STATE_ENGINE_MANIFEST = Object.freeze({
  stageId: "APP-1/4",
  title: "Executive Time State Engine",
  goal: "Entity lifecycle state metadata — registry, resolver, transition contract only.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...EXECUTIVE_TIME_CAMERA_MANIFEST_FILES,
    "frontend/app/lib/executive-time/executiveTimeStateTypes.ts",
    "frontend/app/lib/executive-time/executiveTimeStateRegistry.ts",
    "frontend/app/lib/executive-time/executiveTimeStateResolver.ts",
    "frontend/app/lib/executive-time/executiveTimeStateEngine.ts",
    "frontend/app/lib/executive-time/executiveTimeStateCertification.ts",
    "frontend/app/lib/executive-time/executiveTimeStateCertification.test.ts",
    "docs/app-1-4-time-state-engine-report.md",
  ]),
  forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-1/1", "APP-1/2", "APP-1/3"]),
  runtimePath: "library-only" as const,
  tags: EXECUTIVE_TIME_STATE_ENGINE_TAGS,
});

const REPO_ROOT = join(process.cwd(), "..");

function nowIso(): string {
  return new Date().toISOString();
}

function check(id: string, title: string, passed: boolean, evidence: string): ExecutiveTimeCertificationCheck {
  return Object.freeze({ id, title, passed, evidence });
}

function stateEngineReadOnlyDependencies(): boolean {
  const source = readFileSync(join(process.cwd(), "app/lib/executive-time/executiveTimeStateEngine.ts"), "utf8");
  return (
    source.includes("resolveCurrentContext") &&
    source.includes("getExecutiveTimeCameraPosition") &&
    !source.includes("switchExecutiveTimeContext") &&
    !source.includes("moveToContext") &&
    !source.includes("setExecutiveTimeContextStoreRecord")
  );
}

export function runExecutiveTimeStateCertification(): ExecutiveTimeStateEngineCertificationResult {
  resetExecutiveTimeRegistryForTests();
  resetExecutiveTimeContextStoreForTests();
  resetExecutiveTimeCameraForTests();
  resetExecutiveTimeStateRegistryForTests();

  const workspaceId = "ws-state-cert-001";
  moveToContext({ workspaceId, contextId: "this_quarter", source: "user", reason: "manual_selection" });
  const temporal = resolveExecutiveTimeStateTemporalSnapshot({ workspaceId });

  const scenarioStates = listEntityStates("scenario");
  const decisionDefault = resolveDefaultState("decision");
  const normalized = normalizeState("risk", "invalid");
  const terminal = resolveTerminalState("kpi");
  const duplicate = registerState({
    id: "draft",
    name: "Draft Duplicate",
    entityType: "scenario",
    description: "Duplicate probe.",
    lifecycleOrder: 99,
    isTerminal: false,
    isEditable: true,
    isVisible: true,
    supportsTransition: true,
    metadata: Object.freeze({}),
  });
  const transitionValid = validateExecutiveTimeStateTransition({
    entityType: "scenario",
    fromState: "draft",
    toState: "planned",
    transitionReason: "Planning",
    actor: "executive",
    timestamp: nowIso(),
    requiresApproval: false,
    metadata: Object.freeze({ contractOnly: true }),
  });
  const transitionInvalid = validateExecutiveTimeStateTransition({
    entityType: "scenario",
    fromState: "archived",
    toState: "active",
    transitionReason: "Invalid",
    actor: "executive",
    timestamp: nowIso(),
    requiresApproval: false,
    metadata: Object.freeze({}),
  });

  const snapshot = getExecutiveTimeStateRegistrySnapshot();
  const cameraPhase = runExecutiveTimeCameraCertification();
  const manifestValidation = validateStageManifest(EXECUTIVE_TIME_STATE_ENGINE_MANIFEST);
  const reportPath = join(REPO_ROOT, "docs/app-1-4-time-state-engine-report.md");

  const checks: ExecutiveTimeCertificationCheck[] = [
    check("A", "Types exist", Boolean(EXECUTIVE_TIME_STATE_ENGINE_VERSION), EXECUTIVE_TIME_STATE_ENGINE_VERSION),
    check("B", "Engine exists", stateEngineReadOnlyDependencies(), "State engine module present."),
    check("C", "Registry exists", snapshot.entityTypes.length >= 11, `${snapshot.entityTypes.length} entity type(s).`),
    check("D", "Resolver exists", Boolean(decisionDefault?.id), decisionDefault?.id ?? "none"),
    check("E", "Default state sets exist", scenarioStates.length === 7 && listEntityStates("decision").length === 6, "Scenario and decision sets seeded."),
    check("F", "Registry validation works", validateState("scenario", "active").valid && !validateState("scenario", "unknown").valid, "State validation operational."),
    check("G", "Resolver works", normalized?.id === "detected" && Boolean(normalizeState("scenario", "planned")), "Normalization fallbacks work."),
    check("H", "Terminal state detection works", isTerminal("decision", "executed") && Boolean(terminal?.isTerminal), terminal?.id ?? "none"),
    check("I", "Editable state detection works", isEditable("scenario", "draft") && !isEditable("scenario", "archived"), "Editable metadata enforced."),
    check("J", "Lifecycle ordering works", resolveLifecycleOrder("kpi", "monitoring") === 2, String(resolveLifecycleOrder("kpi", "monitoring"))),
    check("K", "Transition contract validation works", transitionValid.valid && !transitionInvalid.valid, "Transition metadata validated."),
    check("L", "Camera read-only integration verified", temporal.readOnly === true && temporal.cameraContext.length > 0, temporal.cameraContext),
    check("M", "Context read-only integration verified", temporal.currentContextId === "this_quarter", temporal.currentContextId),
    check("N", "Future integration contracts exist", EXECUTIVE_TIME_STATE_FUTURE_INTEGRATIONS.scenarioEngine.integrationImplemented === false, "Future contracts defined."),
    check("O", "No Dashboard mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveDashboard/executiveDashboardContract.ts",
      allowedFiles: EXECUTIVE_TIME_STATE_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Dashboard blocked."),
    check("P", "No Assistant mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveAssistant/executiveAssistantContract.ts",
      allowedFiles: EXECUTIVE_TIME_STATE_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Assistant blocked."),
    check("Q", "No Scenario mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/lib/executiveScenario/executiveScenarioContract.ts",
      allowedFiles: EXECUTIVE_TIME_STATE_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Scenario blocked."),
    check("R", "No Timeline mutation", !evaluateStageFileBoundary({
      filePath: "frontend/app/components/panels/TimelinePanel.tsx",
      allowedFiles: EXECUTIVE_TIME_STATE_ENGINE_MANIFEST.allowedFiles,
      forbiddenPatterns: EXECUTIVE_TIME_FORBIDDEN_PATTERNS,
    }).allowed, "Timeline blocked."),
    check("S", "Tests pass assumptions", canTransition({ entityType: "scenario", fromState: "draft", toState: "planned" }), "Transition metadata probe."),
    check("T", "Report created", existsSync(reportPath), reportPath),
    check("U", "Duplicate registration blocked", !duplicate.success, duplicate.reason),
    check("V", "APP-1:3 camera still certified", cameraPhase.certified, cameraPhase.summary),
    check("W", "Manifest validates", manifestValidation.valid, manifestValidation.issues[0]?.message ?? "Valid."),
  ];

  const passedChecks = checks.filter((entry) => entry.passed);
  const failedChecks = checks.filter((entry) => !entry.passed);
  const certified = failedChecks.length === 0;

  return Object.freeze({
    phaseName: "APP-1:4 Executive Time State Engine",
    status: certified ? "PASS" : "FAIL",
    certified,
    checks: Object.freeze(checks),
    passedChecks: Object.freeze(passedChecks),
    failedChecks: Object.freeze(failedChecks),
    warnings: Object.freeze([]),
    tags: EXECUTIVE_TIME_STATE_ENGINE_TAGS,
    summary: certified
      ? "APP-1:4 Executive Time State Engine PASSED."
      : `APP-1:4 Executive Time State Engine FAILED (${failedChecks.length} gate(s)).`,
    generatedAt: nowIso(),
  });
}

export const ExecutiveTimeStateCertification = Object.freeze({
  runExecutiveTimeStateCertification,
});
