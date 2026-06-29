/**
 * APP-6:9 — Decision Dashboard Integration engine.
 * Pure adapter layer over APP-6:6 Query, APP-6:7 Comparison, and APP-6:8 Replay.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import { DECISION_REPLAY_ENGINE_SELF_MANIFEST } from "./decisionReplayEngine.ts";
import {
  getDecisionDashboardRegistry,
  getRegisteredDecisionDashboardModel,
  registerDecisionDashboardModel,
  resetDecisionDashboardRegistryForTests,
} from "./decisionDashboardRegistry.ts";
import {
  buildDecisionDashboardModelForInput,
  buildDecisionDashboardSummaryFromModel,
  resetDecisionDashboardModelSequenceForTests,
} from "./decisionDashboardViewModel.ts";
import {
  DECISION_DASHBOARD_BINDINGS,
  DECISION_DASHBOARD_FUTURE_CONSUMERS,
  DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
  DECISION_DASHBOARD_INTEGRATION_ENGINE_FORBIDDEN_PATTERNS,
  DECISION_DASHBOARD_INTEGRATION_FORBIDDEN_PATTERNS,
  DECISION_DASHBOARD_INTEGRATION_TAGS,
  DECISION_DASHBOARD_MANDATORY_MODEL_FIELDS,
  dashboardFailure,
  dashboardSuccess,
  type DecisionDashboardContractSurface,
  type DecisionDashboardIntegrationInput,
  type DecisionDashboardIntegrationResponse,
  type DecisionDashboardIntegrationState,
  type DecisionDashboardModel,
} from "./decisionDashboardTypes.ts";
import {
  validateDecisionDashboard,
  validateDecisionDashboardInput,
  validateDecisionDashboardModel,
  validateEngineCompatibilityForDashboard,
} from "./decisionDashboardValidation.ts";

export const DECISION_DASHBOARD_INTEGRATION_FORBIDDEN_PATTERNS_FULL = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  ...DECISION_DASHBOARD_INTEGRATION_FORBIDDEN_PATTERNS,
  ...DECISION_DASHBOARD_INTEGRATION_ENGINE_FORBIDDEN_PATTERNS,
] as const);

export const DECISION_DASHBOARD_INTEGRATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-6/9",
  title: "Decision Dashboard Integration",
  goal: "Canonical dashboard adapter layer over APP-6:6 Query, APP-6:7 Comparison, and APP-6:8 Replay engines.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...DECISION_REPLAY_ENGINE_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/decision-timeline/decisionDashboardTypes.ts",
    "frontend/app/lib/decision-timeline/decisionDashboardAdapter.ts",
    "frontend/app/lib/decision-timeline/decisionDashboardViewModel.ts",
    "frontend/app/lib/decision-timeline/decisionDashboardValidation.ts",
    "frontend/app/lib/decision-timeline/decisionDashboardRegistry.ts",
    "frontend/app/lib/decision-timeline/decisionDashboardEngine.ts",
    "frontend/app/lib/decision-timeline/decisionDashboardRunner.ts",
    "frontend/app/lib/decision-timeline/decisionDashboardEngine.test.ts",
    "docs/app-6-9-decision-dashboard-integration-report.md",
  ]),
  forbiddenPatterns: DECISION_DASHBOARD_INTEGRATION_FORBIDDEN_PATTERNS_FULL,
  prerequisites: Object.freeze(["APP-6/1", "APP-6/2", "APP-6/3", "APP-6/4", "APP-6/5", "APP-6/6", "APP-6/7", "APP-6/8"]),
  runtimePath: "library-only" as const,
  tags: DECISION_DASHBOARD_INTEGRATION_TAGS,
} satisfies StageManifest);

export const DECISION_DASHBOARD_INTEGRATION_PUBLIC_API_RULES = Object.freeze({
  interfaceOnly: true,
  adapterOnly: true,
  noBusinessLogic: true,
  noUiRendering: true,
  queryComparisonReplayOnly: true,
  noLifecycleDerivation: true,
  noHistoryRebuild: true,
  noPersistence: true,
  noAnalytics: true,
  noReact: true,
} as const);

let integrationInitialized = false;
let integrationTimestamp = "2026-01-01T00:00:00.000Z";

export function initializeDecisionDashboardIntegration(
  timestamp: string = integrationTimestamp
): DecisionDashboardIntegrationState {
  integrationInitialized = true;
  integrationTimestamp = timestamp;
  return getDecisionDashboardIntegrationState(timestamp);
}

export function isDecisionDashboardIntegrationInitialized(): boolean {
  return integrationInitialized;
}

export function getDecisionDashboardIntegrationState(
  timestamp: string = integrationTimestamp
): DecisionDashboardIntegrationState {
  const registry = getDecisionDashboardRegistry();
  return Object.freeze({
    integrationId: "decision-dashboard-integration",
    contractVersion: DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
    initialized: integrationInitialized,
    registeredModelCount: registry.registeredModelCount,
    timestamp,
    readOnly: true as const,
  });
}

export function resetDecisionDashboardIntegrationForTests(): void {
  integrationInitialized = false;
  integrationTimestamp = "2026-01-01T00:00:00.000Z";
  resetDecisionDashboardRegistryForTests();
  resetDecisionDashboardModelSequenceForTests();
}

export function buildDecisionDashboardModel(
  input: DecisionDashboardIntegrationInput
): DecisionDashboardIntegrationResponse {
  if (!isDecisionDashboardIntegrationInitialized()) {
    return dashboardFailure("Decision Dashboard Integration is not initialized.");
  }

  const engineValidation = validateEngineCompatibilityForDashboard();
  if (!engineValidation.valid) {
    return dashboardFailure(engineValidation.issues[0]?.message ?? "Dashboard engine compatibility failed.");
  }

  const inputValidation = validateDecisionDashboardInput(input);
  if (!inputValidation.valid) {
    return dashboardFailure(inputValidation.issues[0]?.message ?? "Dashboard input validation failed.");
  }

  const model = buildDecisionDashboardModelForInput(input, integrationTimestamp);
  if (!model) {
    return dashboardFailure("Unable to build decision dashboard model from certified engine outputs.");
  }

  const modelValidation = validateDecisionDashboardModel(model);
  if (!modelValidation.valid) {
    return dashboardFailure(modelValidation.issues[0]?.message ?? "Dashboard model validation failed.");
  }

  return registerDecisionDashboardModel(model);
}

export function buildDecisionDashboardSummary(
  input: DecisionDashboardIntegrationInput
): DecisionDashboardIntegrationResponse {
  const modelResult = buildDecisionDashboardModel(input);
  if (!modelResult.success || !modelResult.data) {
    return modelResult;
  }

  return dashboardSuccess(
    "Decision dashboard summary built.",
    Object.freeze({
      ...modelResult.data,
      decisionSummary: buildDecisionDashboardSummaryFromModel(modelResult.data),
      readOnly: true as const,
    })
  );
}

export function getDecisionDashboardModel(modelId: string): DecisionDashboardModel | null {
  return getRegisteredDecisionDashboardModel(modelId);
}

export function getDecisionDashboardContract(): DecisionDashboardContractSurface {
  return Object.freeze({
    contractVersion: DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
    mandatoryFields: DECISION_DASHBOARD_MANDATORY_MODEL_FIELDS,
    supportedBindings: DECISION_DASHBOARD_BINDINGS,
    futureConsumers: DECISION_DASHBOARD_FUTURE_CONSUMERS,
    readOnly: true as const,
  });
}

export { validateDecisionDashboard };
export { runDecisionDashboardIntegration } from "./decisionDashboardRunner.ts";

export const DECISION_DASHBOARD_INTEGRATION_VERSION = DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION;
export const DECISION_DASHBOARD_INTEGRATION_OWNER = "decision-dashboard-integration";

export const DecisionDashboardIntegration = Object.freeze({
  initializeDecisionDashboardIntegration,
  isDecisionDashboardIntegrationInitialized,
  getDecisionDashboardIntegrationState,
  buildDecisionDashboardModel,
  buildDecisionDashboardSummary,
  validateDecisionDashboard,
  getDecisionDashboardModel,
  getDecisionDashboardContract,
  version: DECISION_DASHBOARD_INTEGRATION_CONTRACT_VERSION,
  tags: DECISION_DASHBOARD_INTEGRATION_TAGS,
});

export { DECISION_DASHBOARD_INTEGRATION_TAGS, DECISION_DASHBOARD_FUTURE_CONSUMERS };
